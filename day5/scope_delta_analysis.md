# Scope Delta Analysis — The Meridian Pivot (Day 5)

## SCOPE DELTA TABLE

| DROPPED                        | MODIFIED                            | ADDED                                              |
|--------------------------------|-------------------------------------|---------------------------------------------------|
| - Polling system for inventory updates (setInterval for cache update every 5 min) | - In-memory stock cache logic with updated stock from webhook | - New endpoint for webhook inventory updates `/webhook/inventory-update` |
| - Automatic cache updates using polling | - REST endpoints for fetching stock remain unchanged | - Webhook event log endpoint `/webhook/log` |
|                                | - Signature validation mechanism for webhooks added | - Event logging for last 10 webhook events         |

## ARCHITECTURAL TRADE-OFF ANALYSIS

### Polling vs. Webhook

| Criteria      | Polling                            | Webhook                             |
|---------------|------------------------------------|-------------------------------------|
| Reliability    | Dependent on poll interval; may miss updates between polls | Immediate updates sent directly from the warehouse |
| Latency       | Introduces delays (up to 5 min)   | Near real-time updates              |
| Server Load   | Increased load due to regular polling even when no data has changed | Reduced server load during idle states since updates are event-driven |
| Complexity    | Simple implementation               | More complex due to signature validation and error handling   |
| Scalability   | May struggle with high-frequency polling as data grows | Highly scalable, as it only transmits changes when needed   |

### Gains and Losses

- **Gains:**
  - Real-time inventory updates improve responsiveness to stock changes.
  - Decreased server load when inventory remains stable.
  - Increased reliability in data accuracy with robust signature validation for webhooks.

- **Losses:**
  - Increased complexity in the codebase with the need for signature validation.
  - Initial setup requires the configuration of a secure secret for webhook verification.

### Suitability for Northstar Retail Co.

The webhook model is better suited for Northstar Retail Co.'s use case because it allows for real-time updates of inventory, which is critical in a retail environment where stock levels can change rapidly. This ensures that customers receive accurate information regarding product availability and avoids potential over-selling or stock discrepancies.

## REGRESSION CHECK

After executing the pivot, the following checks were performed to ensure the integrity of existing functionalities:

- **GET /stock/:item_id**
  - **Status:** Works (returns expected stock data)
- **GET /stock/all**
  - **Status:** Works (returns complete stock data)
- **Data Accuracy:**
  - **Confirmation:** Data accuracy maintained; stock levels reflect the latest updates.
- **Adjusted Features:** No original features required adjustment to remain functional, as the new implementation built upon and enhanced the existing structure.

## BACKLOG REPRIORITIZATION NOTES

### Next Sprint Priorities:
- **Webhook Resilience Improvements:** Implement retry logic for processing failed webhook requests.
- **Webhook Signature Management:** Develop better logging and alerting mechanisms for security monitoring.
- **UI/UX Feedback Mechanism:** Gather user feedback on real-time stock updates to identify further enhancements needed.

### Technical Debt:
- **Documentation of Webhook Implementation:** Ensure code is thoroughly documented, especially new functions for webhook handling.
- **Testing Coverage:** Increase unit tests to cover webhook functionalities, especially for signature validation and error handling.

### Recommended Next Steps:
- **Evaluate Third-Party Services:** Consider using a more robust third-party service for managing webhooks to offload some complexity.
- **Training Sessions:** Schedule sessions for team members on working with AWS Lambda or Google Cloud Functions to facilitate future webhook processing.
- **Integration Pipeline:** Set up a deployment pipeline that includes integration tests to verify that both the webhook and existing infrastructure continue to work harmoniously post-deployment.
