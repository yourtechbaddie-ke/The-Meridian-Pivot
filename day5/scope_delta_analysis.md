# Scope Delta Analysis — The Meridian Pivot (Day 5)

## 1. Scope Delta Table

| DROPPED                                   | MODIFIED                                      | ADDED                                           |
|-------------------------------------------|-----------------------------------------------|------------------------------------------------|
| - Polling system functionality             | - Stock endpoints were modified to suit the webhook model; however, the basic structure remains the same. | - Webhook endpoint for inventory updates (`POST /webhook/inventory-update`) |
| - Polling interval and caching mechanism    | - Enhanced validation of data for stock updates | - Endpoint to fetch the webhook event log (`GET /webhook/log`) |
| - All REST endpoints for `/stock/:item_id` and `/stock/all` removed |                                               | - HMAC-SHA256 signature validation mechanism for security |

## 2. Architectural Trade-Off Analysis

### Polling vs. Webhook

| Criteria         | Polling                                     | Webhook                                     |
|------------------|---------------------------------------------|---------------------------------------------|
| **Reliability**   | Dependent on periodic fetch intervals. Potential for missed updates if warehouse API is down during polling. | Real-time updates ensure no data is missed. Webhooks triggered by the source. |
| **Latency**       | Introduces inherent delay (5 minutes by default); can lead to outdated data. | Immediate updates; reduces stale data significantly. |
| **Server Load**   | Higher server load due to frequent polling, unnecessary requests for unchanged data. | Lower server load; only responds to changes, minimizing resource use. |
| **Complexity**    | Simpler implementation but requires timing and management of intervals. | More complex setup with signature validation and handling of webhook events. |
| **Scalability**   | More challenging to scale as it places constant load regardless of demand. | More scalable, only invoking changes reduces backend strain. |

### Gains and Losses from the Switch

- **Gains**: Improved real-time responsiveness and reduced server load. Enhanced security through HMAC validation. The architecture is more aligned with best practices for modern APIs.
- **Losses**: Increased initial complexity and the complete removal of the polling method may lead to challenges if webhook relationships with third parties become unstable.

### Suitability for Northstar Retail Co.

The webhook model is better suited for Northstar Retail Co.'s use case due to the real-time requirements of inventory management. It allows the company to keep accurate stock levels while minimizing server load, a critical aspect in retail environments where dynamic inventory is key to customer satisfaction and operational efficiency.

## 3. Regression Check

### Confirmed Functionalities

- The endpoint `GET /stock/:item_id` is no longer functional due to the removal of the polling system. It has been replaced by the webhook system which relies on incoming stock updates.
- The endpoint `GET /stock/all` has similarly been removed; users will now rely on the new hooks to stay updated on stock levels.
  
### Data Integrity

- No old functionalities are broken because they have all been removed as part of the refactor. All new functionalities are working correctly as expected based on testing.

### Features that Required Adjustment

- The removal of all stock-related endpoints required comprehensive documentation updates and communication with any front-end clients relying on these endpoints.

## 4. Backlog Reprioritization Notes

### Items to Prioritize in Next Sprint

1. **Enhancements to Webhook Handling**: Implementation of retry logic for failed deliveries and better error logging.
2. **Client-side Handling**: Update the front-end applications to integrate with the new webhook system instead of the old REST endpoints.
3. **Webhook Documentation**: Create comprehensive documentation on how to properly utilize and monitor the new webhook features.
4. **Testing Strategy**: Develop automated tests for the new webhook endpoints to ensure future functionality does not break.

### Technical Debt Introduced

- There may be technical debt regarding the suboptimal implementation of the webhook logging feature, as only the last 10 webhook events are stored. Consider expanding this in future iterations.

### Recommended Next Steps

- Conduct a review of the webhook responses to ensure they correctly reflect inventory updates and are robust against malicious attempts.
- Plan for a potential future enhancement of offering the ability to reconcile webhook events with historical data to maintain a complete inventory history.
- Evaluate the logging feature for webhook events, ensuring administrators can view logs in a comprehensive manner for auditing and debugging.

--- 
*End of Document*