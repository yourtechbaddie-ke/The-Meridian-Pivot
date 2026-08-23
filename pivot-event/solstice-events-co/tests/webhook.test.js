import test from 'node:test';
import assert from 'node:assert/strict';
import { signWebhook, verifyWebhook } from '../src/webhook-verification.js';

const secret = 'test-secret';

test('accepts a correctly signed webhook', () => {
  const payload = {
    eventId: 'E1',
    jobId: 'J1',
    attendeeCode: 'SOL-001',
    status: 'completed'
  };
  const signed = signWebhook(payload, secret);

  assert.equal(
    verifyWebhook({
      rawBody: signed.rawBody,
      signature: signed.signature,
      timestamp: signed.timestamp,
      secret
    }),
    true
  );
});

test('rejects a tampered payload', () => {
  const payload = {
    eventId: 'E1',
    jobId: 'J1',
    attendeeCode: 'SOL-001',
    status: 'completed'
  };
  const signed = signWebhook(payload, secret);
  const tamperedBody = JSON.stringify({ ...payload, status: 'failed' });

  assert.equal(
    verifyWebhook({
      rawBody: tamperedBody,
      signature: signed.signature,
      timestamp: signed.timestamp,
      secret
    }),
    false
  );
});

test('rejects an expired timestamp', () => {
  const payload = {
    eventId: 'E1',
    jobId: 'J1',
    attendeeCode: 'SOL-001',
    status: 'completed'
  };
  const oldTimestamp = String(Math.floor(Date.now() / 1000) - 600);
  const signed = signWebhook(payload, secret, oldTimestamp);

  assert.equal(
    verifyWebhook({
      rawBody: signed.rawBody,
      signature: signed.signature,
      timestamp: oldTimestamp,
      secret
    }),
    false
  );
});
