# Architecture

The MVP separates the attendee scan from badge-print completion and makes the asynchronous job boundary explicit in the database.

1. The kiosk sends `POST /api/check-in`.
2. The API validates the attendee and atomically moves them to `PRINT_PENDING`.
3. A persistent `print_jobs` record is created with a unique `jobId` and `eventId`.
4. In production, the queued job is published to the badge-printer vendor.
5. The badge printer completes the job and sends a signed webhook.
6. The webhook endpoint verifies the HMAC signature against the **raw request body** and checks timestamp freshness.
7. The event ID is checked for replay.
8. The webhook job ID must match both the stored print job and the attendee's current `print_job_id`.
9. Only a `completed` event changes the attendee to `CHECKED_IN`, and the print job to `COMPLETED`.

## State machine

`NOT_CHECKED_IN → PRINT_PENDING → CHECKED_IN`

A failed print can be represented by `PRINT_FAILED` and retried. `CHECKED_IN` is terminal for the MVP.

## Duplicate scans

A second scan while an attendee is already `PRINT_PENDING` returns the existing job instead of creating a second badge-print request. The check-in transition and job creation are in one SQLite transaction.

## Out-of-order events

The webhook is tied to both `eventId` and `jobId`. A stale webhook cannot complete a newer print job because its job ID will not match the attendee's current `print_job_id` or the current `print_jobs` record.

## Queue boundary

The MVP persists the queue handoff as `print_jobs`. The actual vendor transport remains an integration boundary: a production adapter would publish queued jobs to the vendor. The kiosk's **Simulate printer completion** control signs a mock vendor event and sends it through the same verification and processing path as the real webhook, making the complete flow demonstrable without claiming a real printer integration.
