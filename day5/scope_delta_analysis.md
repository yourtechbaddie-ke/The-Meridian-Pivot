# Scope Delta Analysis — The Meridian Pivot (Day 5)

## SCOPE DELTA TABLE

| DROPPED | MODIFIED | ADDED |
|---------|----------|-------|
| - Polling mechanism for stock updates <br>- Polling interval (5 mins) | - Cache handling logic <br>- Item stock retrieval endpoints (/stock/:item_id and /stock/all) remain the same | - Webhook endpoint for inventory updates (/webhook/inventory-update) <br>- Webhook event log endpoint (/webhook/log) |

## ARCHITECTURAL TRADE-OFF ANALYSIS

### Polling vs. Webhook

| Criteria       | Polling                     | Webhook                    |
|----------------|-----------------------------|----------------------------|
| Reliability     | Depends on polling frequency; can miss updates if server is down. | High reliability; updates are pushed from the source immediately. |
| Latency         | Potential delay due to polling interval (up to 5 minutes). | Near real-time updates upon events. |
| Server Load     | Constant load due to periodic requests even when no updates exist. | Reduces server load; only responds to incoming webhook events. |
| Complexity      | Simple to implement but inefficient for real-time scenarios. | More complex setup with signature validation but efficient. |
| Scalability     | Bottleneck for high traffic; every client querying increases load. | Scales well since it pushes data as needed, reducing redundant requests. |

### Gains and Losses from Switching

- **Gains**: 
   - Real-time updates to stock data via webhooks enhance user experience.
   - Reduced server load due to lack of periodic polling.
   - Cleaner and more maintainable code since polling-related logic was removed.
- **Losses**:
   - Complexity introduced with webhook signature validation.
   - Dependency on the external webhook's reliability — failure of the webhook source means lost updates.

### Suitability for Northstar Retail Co.

The webhook model is better suited for Northstar Retail Co.'s use case as it supports the need for immediate stock availability updates, directly impacting inventory management and customer experience. The reduced latency and server load make it more efficient in handling high traffic scenarios that could arise during peak shopping times.

## REGRESSION CHECK

The following endpoints and functionalities were tested post-pivot to confirm original features still work:

- **GET /stock/:item_id**
  - **Result**: Confirmed to work; returns specified item details accurately.
  - Example: Requesting `GET /stock/NSD001` returns:
    ```json
    {
      "item_id": "NSD001",
      "name": "Opulent Backless Gown",
      "stock": 50,
      "status": "IN STOCK"
    }
    ```
  
- **GET /stock/all**
  - **Result**: Confirmed to work; returns the complete list of current stock.
  - Example: Execution of `GET /stock/all` provides a complete inventory response.
  
- **Data Accuracy**: 
  - Confirmed that all cached stock data is still accurately reflected.
  
- **Adjusted Features**: 
  - The deprecated polling functionality was effectively removed. No functional changes to the endpoints querying stock data, which operate as expected under the new architecture.

## BACKLOG REPRIORITIZATION NOTES

Based on the pivot and integration of the webhook architecture, the following items should now be prioritized in the next sprint:

1. **Implement Comprehensive Unit Tests**: Adding tests for the webhook endpoint handling and signature verification to ensure robustness.
2. **Monitoring and Logging Enhancements**: Develop better monitoring tools for webhook failures to quickly respond to issues.
3. **Feedback Channels**: Set up direct feedback channels from end-users regarding stock availability updates to continually refine the system.
4. **API Documentation Update**: Revise existing API documentation to reflect the changes from polling to webhooks and include examples for the new endpoints.
5. **Technical Debt**: Address any potential technical debt introduced by the webhook implementation, particularly concerning error handling and logging.

### Recommended Next Steps:
- Investigate implementing a retry mechanism for handling webhook failures.
- Explore alternate storage options for webhook logs to ensure that they can be analyzed historically.
- Allocate time for team training on webhooks and secure implementation practices to enhance overall system knowledge.

---

This Scope Delta Analysis captures all critical changes made during the Meridian Pivot for Northstar Retail Co., providing a clear overview of functionality adjustments, expected gains, and next steps for continual improvement.
