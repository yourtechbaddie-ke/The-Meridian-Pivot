# Acceptance Tests — Solstice Pivot Event

## Automated tests

Run:

```bash
npm test
```

The automated suite verifies:

- valid HMAC-SHA256 webhook accepted;
- tampered payload rejected;
- expired timestamp rejected.

## Manual end-to-end acceptance test

Start the service:

```bash
npm start
```

### Test 1 — First scan

Use `SOL-001` in the kiosk.

Expected:

- API returns a pending state.
- A print job ID is created.
- UI displays `Printing…`.
- Attendee remains `PRINT_PENDING`.

### Test 2 — Duplicate scan while pending

Scan `SOL-001` again before the printer callback.

Expected:

- No second print job is created.
- The existing print job ID is returned.
- Attendee remains `PRINT_PENDING`.

### Test 3 — Verified completion callback

Send a correctly signed `completed` webhook using the current attendee `jobId`.

Expected:

- Webhook returns success.
- Attendee becomes `CHECKED_IN`.
- Kiosk changes from `Printing…` to `Checked In ✓`.

### Test 4 — Replay

Send the exact same webhook again.

Expected:

- Event is treated as a duplicate.
- No second state transition occurs.

### Test 5 — Tampered callback

Modify the body without recomputing the signature.

Expected:

- Request is rejected with `401`.
- Attendee state does not change.

### Test 6 — Stale/out-of-order callback

Use a valid signature but a `jobId` that does not match the attendee's current print job.

Expected:

- Request is rejected with `409`.
- The newer print job remains authoritative.

### Test 7 — Three attendees

Repeat the workflow using `SOL-001`, `SOL-002`, and `SOL-003`.

Expected:

- Each attendee is independently tracked.
- One attendee's job or webhook cannot complete another attendee's check-in.
