# Solstice Events Co. — Luxury Event Operations MVP

Solstice is the event-operations product for the Meridian Pivot scenario. The MVP combines a luxury operations command centre with an asynchronous badge check-in workflow.

## Product direction

**Solstice Nocturne** — Midnight Plum `#21121D`, Deep Burgundy `#5A1E2A`, Champagne `#E7D1B0`, Warm Ivory `#F8F3EC`, Soft Taupe `#B9AAA0`, and Ink `#171316`.

The interface is intentionally positioned as a premium event-operations workspace rather than a generic student dashboard.

## What this solves

- Synchronous printer API removal → asynchronous print-job workflow.
- Duplicate QR scans → idempotent `PRINT_PENDING` state and one active print job per attendee.
- Untrusted callbacks → HMAC-SHA256 signature verification.
- Webhook replay → processed event IDs.
- Out-of-order confirmations → webhook `jobId` must match the attendee's current print job.
- UI accuracy → `CHECKED_IN` is only reached after a valid `completed` webhook.
- Operational visibility → dashboard metrics, event readiness, activity history and guest records.

## Stack

- Node.js + Express
- SQLite via better-sqlite3
- Vanilla HTML/CSS/JavaScript
- Node `crypto` HMAC-SHA256
- Node test runner

## Synthetic MVP data

The database seeds **30 entirely fictional demo attendees** for the Golden Hour Gala. Names and email addresses are synthetic and use the reserved `.invalid` domain; they are not intended to represent real people or contact details.

The UI also presents a fictional portfolio of four events:

- The Golden Hour Gala — LIVE — 92% ready
- Velvet & Vows — PLANNING — 84% ready
- Arc & Afterglow — PLANNING — 71% ready
- The Monochrome Dinner — PLANNING — 63% ready

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

## Demo check-in

Use any seeded code such as `SOL-001` through `SOL-030`.

1. Enter a guest code.
2. The guest moves to `PRINT_PENDING` and receives a unique print job.
3. Use **Simulate verified printer callback** in demo mode.
4. The signed callback passes HMAC, replay and job-matching checks.
5. The guest becomes `CHECKED_IN` only after verified completion.

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
Guest QR Scan
      ↓
Check-In API
      ↓
Atomic / Idempotent State Transition
      ↓
Print Queue Boundary
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

See `docs/` for architecture, API, webhook-security, acceptance tests and deployment notes.

## Production note

The MVP uses a deterministic mock printer adapter. A production integration should replace that adapter with the selected badge-printer vendor's queue/API while preserving webhook verification, idempotency, replay protection and job matching.
