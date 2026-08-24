# Pivot Event — Solstice Events Co.

## Client

**Solstice Events Co.** is running a multi-day tech conference and needs an event check-in kiosk service.

## Required behavior

When staff scan an attendee's QR code:

1. The kiosk starts a badge-print operation.
2. The original synchronous printer behavior is no longer acceptable after the pivot.
3. The print request is represented as an asynchronous job/queue handoff.
4. The kiosk exposes a webhook endpoint for the printer completion callback.
5. The UI remains in a pending/printing state until a valid completion callback arrives.
6. At least three test attendees must be supported.
7. Duplicate scans must not result in a second badge being printed.
8. Confirmations may arrive out of order, so a stale callback must not complete a newer print job.

## Implemented solution

The runnable implementation is under `solstice-events-co/`.

### Core flow

```text
QR Scan
   ↓
POST /api/check-in
   ↓
Atomic/idempotent PRINT_PENDING transition
   ↓
Persistent print_jobs queue boundary
   ↓
Badge Printer
   ↓
Signed Webhook
   ↓
HMAC + timestamp verification
   ↓
Replay check + attendee/job matching
   ↓
CHECKED_IN
```

### Security controls

- HMAC-SHA256 signatures.
- Timestamp freshness validation.
- Timing-safe signature comparison.
- Raw-body verification before JSON re-serialization.
- Event-ID replay protection.
- Current print-job matching.

### Duplicate and ordering controls

A scan for an attendee already in `PRINT_PENDING` returns the existing job instead of creating another one. The attendee state change and `print_jobs` creation occur transactionally. A webhook must carry the attendee's current `jobId`; a stale callback is rejected rather than changing the attendee's state.

### Demonstration path

The kiosk includes **Simulate printer completion**. This is deliberately a mock vendor adapter: it creates a correctly signed webhook and sends the payload through the same verification and processing logic as the public `/api/webhooks/badge-print` endpoint. It demonstrates the full asynchronous flow without claiming that a real printer vendor is connected.

## Acceptance mapping

| Pivot Event requirement | Implementation evidence |
|---|---|
| Async print model | `src/server.js` creates a persistent `print_jobs` record and returns `202` pending |
| Webhook callback | `POST /api/webhooks/badge-print` |
| Pending UI | `public/app.js` displays `Printing…` and polls status until completion |
| Three attendees | `src/database.js` seeds `SOL-001`, `SOL-002`, `SOL-003` |
| Duplicate-scan protection | `PRINT_PENDING` returns the existing job |
| Verified callback | `src/webhook-verification.js` + raw-body middleware |
| Replay protection | `processed_webhooks` table |
| Out-of-order protection | webhook `jobId` must match the current `print_job_id` and `print_jobs` record |
| Automated verification tests | `tests/webhook.test.js` and `tests/solstice-flow.test.js` |
| End-to-end demonstration | `/api/demo/printer-complete` + kiosk Simulate button |

## Scenario boundary

The repository keeps this Solstice scenario separate from the Northstar Retail Co. inventory work because the supplied Pivot Event names Solstice Events Co. as its client and describes a different application domain. The Northstar artifacts remain available as the original Meridian work and evidence of the earlier phase.

## Running it

```bash
cd solstice-events-co
npm install
cp .env.example .env
# Set WEBHOOK_SECRET
npm start
```

Run tests with:

```bash
npm test
```
