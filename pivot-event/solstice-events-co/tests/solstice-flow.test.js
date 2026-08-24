import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dbFile = path.join(os.tmpdir(), `solstice-test-${process.pid}-${Date.now()}.db`);
process.env.NODE_ENV = 'test';
process.env.DB_FILE = dbFile;
process.env.WEBHOOK_SECRET = 'integration-secret';

const { app } = await import('../src/server.js');
const { signWebhook } = await import('../src/webhook-verification.js');
const server = app.listen(0);
const base = await new Promise(resolve => server.once('listening', () => resolve(`http://127.0.0.1:${server.address().port}`)));

async function json(pathname, options = {}) {
  const response = await fetch(`${base}${pathname}`, options);
  return { response, body: await response.json() };
}

test('first scan creates one queued print job', async () => {
  const { response, body } = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-001' })
  });
  assert.equal(response.status, 202);
  assert.equal(body.status, 'pending');
  assert.match(body.jobId, /^JOB-/);
});

test('duplicate scan reuses the same pending job', async () => {
  const first = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-002' })
  });
  const second = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-002' })
  });
  assert.equal(first.body.status, 'pending');
  assert.equal(second.body.status, 'pending');
  assert.equal(first.body.jobId, second.body.jobId);
});

test('verified webhook moves a pending attendee to checked in and replay is idempotent', async () => {
  const created = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-003' })
  });
  const payload = { eventId: created.body.eventId, jobId: created.body.jobId, attendeeCode: 'SOL-003', status: 'completed' };
  const signed = signWebhook(payload, process.env.WEBHOOK_SECRET);

  const completed = await json('/api/webhooks/badge-print', {
    method: 'POST',
    headers: {'content-type':'application/json','x-webhook-timestamp':signed.timestamp,'x-webhook-signature':signed.signature},
    body: signed.rawBody
  });
  assert.equal(completed.response.status, 200);
  assert.equal(completed.body.status, 'checked_in');

  const replay = await json('/api/webhooks/badge-print', {
    method: 'POST',
    headers: {'content-type':'application/json','x-webhook-timestamp':signed.timestamp,'x-webhook-signature':signed.signature},
    body: signed.rawBody
  });
  assert.equal(replay.response.status, 200);
  assert.equal(replay.body.duplicate, true);
});

test('stale webhook cannot complete a newer job', async () => {
  const created = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-001' })
  });
  // Force a new job only for this test, representing a retry/reprint after the first job failed.
  const { db } = await import('../src/database.js');
  db.prepare("UPDATE attendees SET status='NOT_CHECKED_IN', print_job_id=NULL, print_event_id=NULL WHERE attendee_code='SOL-001'").run();
  const newer = await json('/api/check-in', {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ attendeeCode: 'SOL-001' })
  });
  const stalePayload = { eventId: created.body.eventId, jobId: created.body.jobId, attendeeCode: 'SOL-001', status: 'completed' };
  const signed = signWebhook(stalePayload, process.env.WEBHOOK_SECRET);
  const result = await json('/api/webhooks/badge-print', {
    method:'POST', headers:{'content-type':'application/json','x-webhook-timestamp':signed.timestamp,'x-webhook-signature':signed.signature}, body:signed.rawBody
  });
  assert.equal(result.response.status, 409);
  assert.equal(result.body.error, 'Webhook job does not match the current print job');
  assert.notEqual(newer.body.jobId, created.body.jobId);
});

after(async () => {
  server.close();
  for (const suffix of ['', '-wal', '-shm']) {
    try { fs.unlinkSync(dbFile + suffix); } catch {}
  }
});
