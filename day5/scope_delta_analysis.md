# Scope Delta Analysis — The Meridian Pivot

## Purpose

This document records the implementation changes across the Meridian simulation. It preserves the **Northstar Retail Co. inventory transition** and adds the later **Solstice Events Co. Pivot Event** as a distinct client scenario.

---

# Part A — Northstar Retail Co. Inventory Pivot

## 1. Scope Delta Table

| DROPPED | MODIFIED | ADDED |
|---|---|---|
| Scheduled warehouse polling | Inventory cache update mechanism | `POST /webhook/inventory-update` |
| `pollWarehouseAPI` as the update mechanism | Stock data is updated from incoming events | HMAC-SHA256 signature verification |
| `setInterval` polling timer | Existing stock query behavior retained | Webhook event log |
| Fixed five-minute refresh dependency | Error handling and payload validation | `GET /webhook/log` |

## 2. Architectural Trade-off — Polling vs Webhook

| Criteria | Polling | Webhook |
|---|---|---|
| Update model | Periodic requests | Event-driven notification |
| Latency | Up to the polling interval | Near-immediate after an event |
| Server/API load | Repeated requests | Requests only when updates occur |
| Complexity | Simpler initial model | More complex verification and monitoring |
| Security considerations | Primarily API access | Requires signature validation and secret management |

### Northstar gains

- More immediate inventory updates.
- Less dependence on a fixed polling interval.
- Reduced unnecessary polling traffic.
- A security boundary around incoming webhook events.

### Northstar trade-offs

- More implementation complexity.
- Need for webhook signature verification.
- Need for event logging and monitoring.
- Need to handle malformed or unauthorised callbacks.

## 3. Northstar Regression Check

The original stock query behavior remains documented after the polling mechanism is removed. The webhook model updates the cache while the stock endpoints continue to expose the cached inventory state.

---

# Part B — Solstice Events Co. Pivot Event

## 4. Pivot Event Requirement Delta

The later Pivot Event introduces **Solstice Events Co.** and a conference check-in kiosk. The original behavior in that handout is synchronous: after a QR scan, the kiosk calls the badge-printer vendor and waits for a successful print response before showing `Checked In`.

The non-negotiable pivot removes that synchronous model. The solution must instead publish a print request to a vendor queue and wait for the printer's webhook callback. The UI therefore moves through a pending state before confirmation. Duplicate-scan protection must still work when confirmations can arrive out of order.

| DROPPED | MODIFIED | ADDED |
|---|---|---|
| Waiting for a synchronous printer response | Check-in becomes an asynchronous state transition | Print-job identifier |
| Immediate `Checked In` after the print call | UI shows `Printing…` / pending until confirmation | Vendor-style message-queue handoff represented by a print-job boundary |
| Single request/response assumption | Completion is driven by a webhook event | Signed HMAC-SHA256 webhook endpoint |
| Trusting every callback as current | Webhook must match the attendee's active print job | Timestamp validation and replay protection |
| Duplicate scans creating another print request | Duplicate pending scans return the existing job | Processed event-ID store |

## 5. Solstice State Model

```text
NOT_CHECKED_IN
      |
      | QR scan
      v
PRINT_PENDING
      |
      | verified completed webhook + matching jobId
      v
CHECKED_IN
```

A stale or out-of-order webhook cannot complete a newer job because the webhook `jobId` must equal the attendee's current `print_job_id`.

## 6. Solstice Security Delta

The webhook implementation verifies:

1. A signature is present.
2. The timestamp is numeric and within the allowed tolerance.
3. The HMAC-SHA256 signature is calculated over `timestamp + "." + rawBody`.
4. The supplied signature is compared using a timing-safe comparison.
5. The event ID has not already been processed.
6. The attendee exists.
7. The webhook job ID matches the attendee's current print job.
8. Only a `completed` event can move the attendee to `CHECKED_IN`.

## 7. Solstice Regression / Acceptance Check

The Pivot Event handout requires at least three test attendees and a duplicate-scan case. The MVP seeds three attendees and protects the following behaviors:

- First scan creates one pending print job.
- A second scan while printing does not create another job.
- A completed, correctly signed webhook moves the attendee to `CHECKED_IN`.
- A replayed webhook is safely ignored.
- A stale webhook for an old job is rejected.
- Invalid or expired webhook signatures are rejected.
- `Checked In` is not shown as final merely because the scan button was pressed.

## 8. What This Repository Does — and Does Not — Claim

The Northstar and Solstice artifacts are intentionally separated because the later handout names a different client and a different application domain. The repository does **not** falsely present the Solstice check-in service as the same codebase as the Northstar inventory service.

Instead, it demonstrates the technical progression required by the supplied Meridian materials: independent unfamiliar-tool learning, an original implementation, a requirement change, and a new event-driven solution with documented trade-offs.

## 9. Backlog Reprioritization

### Completed for the submission

- Preserve GraphQL reconnaissance and blocker evidence.
- Preserve the Northstar polling baseline.
- Preserve the Northstar webhook refactor reference.
- Implement the Solstice asynchronous check-in MVP.
- Add webhook signature verification.
- Add replay protection.
- Add job-ID matching for out-of-order events.
- Add duplicate-scan protection.
- Add automated webhook verification tests.
- Document architecture, API, and deployment.

### Recommended next sprint

1. Replace the mock printer adapter with the actual vendor queue integration.
2. Add end-to-end tests covering the complete scan → queue → webhook → check-in lifecycle.
3. Add persistent operational monitoring and structured logs.
4. Add stronger rate limiting and abuse controls around the public webhook endpoint.
5. Move from SQLite to a managed relational database for multi-instance production deployment.

## 10. Final Trade-off Summary

The key architectural lesson is that the pivot changes **when truth is established**. In the synchronous model, the printer response is part of the original request. In the asynchronous model, a scan only establishes that a print request is pending; the verified webhook establishes that printing actually completed. The implementation therefore makes pending state, idempotency, authenticity, replay protection, and job ownership explicit.