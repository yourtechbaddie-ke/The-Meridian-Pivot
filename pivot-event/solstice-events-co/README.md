# Solstice Events Co. — Async Check-In MVP

This is the runnable implementation for the Meridian **Pivot Event** scenario.

The kiosk starts an asynchronous badge-print job, shows **Printing…**, and only reaches **Checked In** after a verified printer webhook.

## What this solves

- Synchronous printer API removal → asynchronous print-job workflow.
- Duplicate QR scans → idempotent `PRINT_PENDING` state and one active print job per attendee.
- Untrusted callbacks → HMAC-SHA256 signature verification.
- Webhook replay → processed event IDs.
- Out-of-order confirmations → webhook `jobId` must match the attendee's current print job.
- UI accuracy → `CHECKED_IN` is only reached after a valid `completed` webhook.

## Stack

- Node.js + Express
- SQLite via better-sqlite3
- Vanilla HTML/CSS/JavaScript kiosk
- Node `crypto` HMAC-SHA256
- Node test runner

## Run locally

```bash
npm install
cp .env.example .env
# Set WEBHOOK_SECRET in .env
npm start
```

Open `http://localhost:3000`.

Run tests:

```bash
npm test
```

## Demo attendees

- `SOL-001` — Amina Wanjiku
- `SOL-002` — Brian Otieno
- `SOL-003` — Claire Njeri

## Webhook contract

Headers:

```text
X-Webhook-Timestamp: <unix seconds>
X-Webhook-Signature: sha256=<hex digest>
```

Signature input:

```text
timestamp + "." + rawBody
```

Payload:

```json
{
  "eventId": "PRINT-E1",
  "jobId": "JOB-1",
  "attendeeCode": "SOL-001",
  "status": "completed"
}
```

## Architecture

```text
QR Kiosk
   ↓
Check-In API
   ↓
Atomic/idempotent state transition
   ↓
Print Request / Queue Boundary
   ↓
Badge Printer
   ↓
Signed Webhook
   ↓
HMAC + Timestamp Verification
   ↓
Replay + Job Matching Checks
   ↓
CHECKED_IN
```

See the `docs/` folder for architecture, API, webhook-security, and deployment details.

## Production note

The MVP uses a deterministic mock printer adapter. A production integration should replace that adapter with the selected badge-printer vendor's queue/API while preserving webhook verification, idempotency, replay protection, and job matching.