# Architecture

The MVP separates the attendee scan from badge-print completion.

1. The kiosk sends `POST /api/check-in`.
2. The API validates the attendee and atomically moves them to `PRINT_PENDING`.
3. A print job ID is created. In production this ID is sent to the vendor queue.
4. The badge printer completes the job and sends a signed webhook.
5. The webhook endpoint validates the HMAC signature and timestamp.
6. The event ID is checked for replay.
7. The webhook job ID must match the attendee's current print job.
8. Only a `completed` event changes the attendee to `CHECKED_IN`.

## State machine

`NOT_CHECKED_IN → PRINT_PENDING → CHECKED_IN`

A failed print can be represented by `PRINT_FAILED` and retried. `CHECKED_IN` is terminal for the MVP.

## Duplicate scans

A second scan while an attendee is already `PRINT_PENDING` returns the existing job instead of creating a second badge-print request.

## Out-of-order events

The webhook is tied to both `eventId` and `jobId`. A stale webhook cannot complete a newer print job because its job ID will not match the attendee's current `print_job_id`.

## Queue boundary

The MVP does not pretend to have a real vendor queue. The generated print job ID is the explicit integration boundary where a production queue adapter would publish the request. The included mock printer adapter demonstrates how a vendor completion callback would be signed and delivered back to the webhook endpoint.
