import express from 'express';
import crypto from 'node:crypto';
import { db } from './database.js';
import { signWebhook, verifyWebhook } from './webhook-verification.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'dev-solstice-secret';
const DEMO_MODE = process.env.DEMO_MODE !== 'false';

app.use(express.static('public'));
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); } }));

function newId(prefix) { return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`; }
function attendeeFor(code) { return db.prepare('SELECT * FROM attendees WHERE attendee_code=?').get(code); }

app.get('/api/attendees', (_req, res) => {
  res.json({ attendees: db.prepare(`SELECT a.attendee_code,a.name,a.status,a.print_job_id,a.updated_at,p.status AS print_status FROM attendees a LEFT JOIN print_jobs p ON p.job_id=a.print_job_id ORDER BY a.attendee_code`).all() });
});

app.get('/api/attendee-status', (req, res) => {
  const code = String(req.query.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'code is required' });
  const attendee = attendeeFor(code);
  if (!attendee) return res.status(404).json({ error: 'Attendee not found' });
  const job = attendee.print_job_id ? db.prepare('SELECT job_id,event_id,status,created_at,completed_at FROM print_jobs WHERE job_id=?').get(attendee.print_job_id) : null;
  res.json({ attendee, job });
});

app.post('/api/check-in', (req, res) => {
  const code = String(req.body?.attendeeCode || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'attendeeCode is required' });
  const attendee = attendeeFor(code);
  if (!attendee) return res.status(404).json({ error: 'Attendee not found' });
  if (attendee.status === 'CHECKED_IN') return res.json({ status: 'checked_in', attendee: attendee.name, message: 'Attendee is already checked in.' });
  if (attendee.status === 'PRINT_PENDING') return res.json({ status: 'pending', attendee: attendee.name, jobId: attendee.print_job_id, message: 'Badge is already being printed.' });

  const jobId = newId('JOB');
  const eventId = newId('PRINT');
  const createJob = db.transaction(() => {
    const result = db.prepare("UPDATE attendees SET status='PRINT_PENDING',print_job_id=?,print_event_id=?,updated_at=CURRENT_TIMESTAMP WHERE attendee_code=? AND status IN ('NOT_CHECKED_IN','PRINT_FAILED')").run(jobId, eventId, code);
    if (!result.changes) return false;
    db.prepare('INSERT INTO print_jobs(job_id,event_id,attendee_code,status) VALUES(?,?,?,?)').run(jobId, eventId, code, 'QUEUED');
    return true;
  });
  if (!createJob()) return res.status(409).json({ error: 'Check-in changed concurrently; please retry.' });

  return res.status(202).json({ status: 'pending', attendee: attendee.name, jobId, eventId, message: 'Badge printing queued. Waiting for verified webhook confirmation.', demoWebhookAvailable: DEMO_MODE });
});

function processVerifiedWebhook(payload) {
  const { eventId, jobId, attendeeCode, status } = payload;
  if (!eventId || !jobId || !attendeeCode || !status) return { status: 400, body: { error: 'Incomplete webhook' } };
  const code = String(attendeeCode).toUpperCase();
  if (db.prepare('SELECT event_id FROM processed_webhooks WHERE event_id=?').get(eventId)) return { status: 200, body: { ok: true, duplicate: true } };
  const attendee = attendeeFor(code);
  if (!attendee) return { status: 404, body: { error: 'Attendee not found' } };
  const job = db.prepare('SELECT * FROM print_jobs WHERE job_id=?').get(jobId);
  if (!job || job.attendee_code !== code || attendee.print_job_id !== jobId) return { status: 409, body: { error: 'Webhook job does not match the current print job' } };
  if (status !== 'completed') return { status: 202, body: { ok: true, ignored: true, reason: 'Only completed print jobs can check an attendee in.' } };

  db.transaction(() => {
    db.prepare('INSERT INTO processed_webhooks(event_id,job_id,attendee_code) VALUES(?,?,?)').run(eventId, jobId, code);
    db.prepare("UPDATE print_jobs SET status='COMPLETED',completed_at=CURRENT_TIMESTAMP WHERE job_id=? AND status != 'COMPLETED'").run(jobId);
    db.prepare("UPDATE attendees SET status='CHECKED_IN',updated_at=CURRENT_TIMESTAMP WHERE attendee_code=? AND status='PRINT_PENDING'").run(code);
  })();
  return { status: 200, body: { ok: true, status: 'checked_in', attendee: attendee.name, jobId } };
}

app.post('/api/webhooks/badge-print', (req, res) => {
  const valid = verifyWebhook({ rawBody: req.rawBody || '', signature: req.get('X-Webhook-Signature'), timestamp: req.get('X-Webhook-Timestamp'), secret: WEBHOOK_SECRET });
  if (!valid) return res.status(401).json({ error: 'Invalid or expired webhook signature' });
  const result = processVerifiedWebhook(req.body || {});
  return res.status(result.status).json(result.body);
});

app.post('/api/demo/printer-complete', (req, res) => {
  if (!DEMO_MODE) return res.status(404).json({ error: 'Demo mode disabled' });
  const code = String(req.body?.attendeeCode || '').trim().toUpperCase();
  const attendee = attendeeFor(code);
  if (!attendee) return res.status(404).json({ error: 'Attendee not found' });
  if (!attendee.print_job_id) return res.status(409).json({ error: 'No print job exists for this attendee' });
  const payload = { eventId: attendee.print_event_id, jobId: attendee.print_job_id, attendeeCode: code, status: 'completed' };
  const signed = signWebhook(payload, WEBHOOK_SECRET);
  if (!verifyWebhook({ rawBody: signed.rawBody, signature: signed.signature, timestamp: signed.timestamp, secret: WEBHOOK_SECRET })) return res.status(500).json({ error: 'Demo signing verification failed' });
  const result = processVerifiedWebhook(payload);
  return res.status(result.status).json({ ...result.body, simulatedVendorWebhook: true });
});

app.get('/health', (_req, res) => res.json({ ok: true, service: 'solstice-events-co' }));

if (process.env.NODE_ENV !== 'test') app.listen(PORT, () => console.log(`Solstice Events Co. MVP running on http://localhost:${PORT}`));

export { app, processVerifiedWebhook };
