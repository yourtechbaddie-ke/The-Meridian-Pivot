# Scope Delta Analysis — The Meridian Pivot (Day 5)

## 1. Scope Delta Table

| DROPPED                                   | MODIFIED                                                | ADDED                                                 |
|-------------------------------------------|--------------------------------------------------------|------------------------------------------------------|
| - Polling system implementation            | - Status logging for stock cache updated               | - Webhook endpoint (`POST /webhook/inventory-update`)|
| - `pollWarehouseAPI` function             | - Structure of stock data returned via REST endpoints   | - Webhook event logging (last 10 events)             |
| - Polling timer via `setInterval`       | - Data structure validation on `GET` requests          | - Signature verification for webhook requests         |
|                                           | - Caching logic retains functionality                   | - Retrieving last webhook events (`GET /webhook/log`) |

## 2. Architectural Trade-off Analysis

### Polling vs. Webhook

| Criteria              | Polling                                            | Webhook                                           |
|-----------------------|---------------------------------------------------|--------------------------------------------------|
| **Reliability**       | Calls to the warehouse API depend on timing. May miss updates between polls. | Event-driven, updates occur in real-time.       |
| **Latency**           | Delays due to fixed polling intervals (up to 5 minutes). | Immediate updates as they occur, reducing latency. |
| **Server Load**       | Constantly sends requests to the API, increasing load. | Reduced load on the server; only reacts to events. |
| **Complexity**        | Simpler in structure but requires constant polling logic. | More complex due to signature verification & security handling. |
| **Scalability**       | May struggle with growth, limits on how often to poll. | Highly scalable, as it handles events as they arise. |

### Gains and Losses from the Pivot
- **Gained**: Increased reliability of stock data accuracy, real-time updates, reduced server load, and improved scalability.
- **Gave Up**: Simplicity of implementation; increased complexity due to webhook security management and potential challenge in testing/monitoring the event flow.

### Suitability for Northstar Retail Co.
The webhook model is better suited for Northstar Retail Co. due to its need for real-time inventory updates, essential for maintaining accurate stock levels and improving customer experience. Given the fast-paced nature of retail, immediate data feedback enhances responsiveness and operational efficiency.

## 3. Regression Check

After executing the pivot, the following checks were performed to ensure no old functionality was broken:

- **Confirmed**: 
  - `GET /stock/:item_id` still works as expected. Example: Request for `GET /stock/NSJ001` returns correct data.
  - `GET /stock/all` returns the full cached inventory without issue.
  - Data accuracy has been maintained; stock levels and statuses reflect the most recent updates provided by webhook notifications.

- **Noted Adjustments**: 
  - The codebase was modified to implement caching logic without polling. The error handling for cases where an item is not found remained intact.

## 4. Backlog Reprioritization Notes

### Priorities for Next Sprint
1. Develop an automated testing framework specifically for webhook functionality, ensuring robust signature validation.
2. Create a monitoring tool for webhook events to visualize the incoming updates and identify potential issues in real-time.
3. Address potential technical debt introduced by the webhook complexity, specifically focusing on enhancing documentation and codebase clarity.

### Technical Debt
- Need to improve error-handling strategies for `POST /webhook/inventory-update` to manage failed updates.
- Enhancements in logging mechanisms to facilitate easier debugging and tracking of webhook events.

### Recommended Next Steps
- Enhance user documentation regarding new webhook features and the setup process.
- Assess performance under heavy load to ensure system reliability during peak inventory updates.
- Gather stakeholder feedback on webhook performance and make adjustments based on practical usage.
