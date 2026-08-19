# Learning & Blocker Journal — Days 1-2 (GraphQL Solo Recon)

## Day 1 (2026-08-19)

### Time Log
- **10:00 AM - 11:30 AM:** Introduction to GraphQL
- **11:30 AM - 12:30 PM:** Setting up the project
- **1:00 PM - 3:00 PM:** Reviewing schema and resolver implementation
- **3:30 PM - 5:00 PM:** Query testing and troubleshooting
- **Total Time Spent:** 6 hours

### Activities and Resources

1. **Resource: GraphQL Official Documentation**  
   Read through the [GraphQL official documentation](https://graphql.org/learn/) to get a fundamental understanding of GraphQL concepts. 

   **Aha Moment:** Realized the distinction between query and mutation as well as how GraphQL allows for fetching exactly what a client needs.

2. **Setup Project**  
   Followed instructions to set up a new Node.js project and installed Apollo Server and GraphQL.
   ```bash
   mkdir northstar-graphql  
   cd northstar-graphql  
   npm init -y  
   npm install apollo-server graphql  
   ```

   **Breakthrough:** Successfully set up the project environment by following the instructions without errors.

3. **Schema Review**  
   Examined the given SDL schema to understand object types and queries relevant to the Northstar Retail Co. inventory.

   **Blocker: Confusion with Fields and Types**  
   Didn't initially understand how to correlate the item-specific fields (e.g., `item_id`, `stock`) with their usage in queries.
   
   **Resolution:** Referred back to the official documentation and samples. Focused on how to construct queries based on the defined schema.

4. **Writing Sample Queries**  
   Started writing sample queries based on the schema.

   - **Query to fetch an item by ID:**  
     ```graphql
     query {
       getItem(id: "NSJ001") {
         item_id
         name
         category
       }
     }
     ```

   **Error Encountered:** Received an error related to missing fields in the response when the request was executed.

   **Resolution:** Discovered that my query was incomplete. Adjusted the query to match the fields defined in the schema.

   **Breakthrough:** Successfully fetched data for an item from the inventory, which was exhilarating!

### Blockers and Resolutions

- **Blocker 1: Unable to Get All Items**  
  Attempted to run a query to get all items but received a null response.  
  - **Resolution:** Checked my resolver implementation and found that the resolver for `getAllItems` had not been properly set up. After implementing the resolver logic correctly, I was able to retrieve the item list successfully.

- **Blocker 2: Formatting Issues**  
  Errors occurred during the JSON formatting stage of the query responses.  
  - **Resolution:** Wrote tests to validate the output in a format I expected against the JSON structure in the documentation. This helped ensure that my queries matched their expected outputs.

- **Blocker 3: Low Stock Query**  
  The logic to tally low stock items was unclear initially.  
  - **Resolution:** Returned to the documentation for clarification on implementing filter logics in resolvers. With this understanding, I was able to refine my resolver to return correctly filtered results.

---

## Day 2 (2026-08-20)

### Time Log
- **9:00 AM - 11:00 AM:** Resuming the project with a focus on creating more complex queries
- **11:30 AM - 1:00 PM:** Implementing the resolver for getLowStock and getOutOfStock Queries
- **1:30 PM - 4:00 PM:** Testing all implemented queries and debugging
- **Total Time Spent:** 6 hours

### Activities and Resources

1. **Resource: GraphQL Tutorials**  
   Followed [Apollo GraphQL's comprehensive tutorials](https://www.apollographql.com/docs/tutorial/introduction/) to deepen my understanding of Apollo Server.

   **Aha Moment:** Learned how to take advantage of Apollo's features to manage complex data retrieval.

2. **Building Queries for Different Item Categories**  
   Created a query to fetch items filtered by categories and stock status.
   ```graphql
   query {
     getLowStock {
       item_id
       name
       stock
     }
   }
   ```

   **Breakthrough:** Successful testing of the query allowed me to visualize inventory status for low stock items.

3. **Final Adjustments**  
   Iterated on my GraphQL implementation to fine-tune the responsiveness of the API.
   
   **Blocker: Overwhelmed by Testing**  
   Felt overwhelmed trying to keep track of which queries had been tested successfully and which hadn’t.
   - **Resolution:** Created a simple checklist of queries and their expected outputs to streamline the testing process and track progress effectively.

### Blockers and Resolutions

- **Blocker 1: Failed Queries on Out of Stock Items**  
  Initially, I tried an incorrect filtering method, leading to incorrect results when querying for out of stock items.
  - **Resolution:** Reviewed the implementation logic, discovered my filter function was targeting the wrong criteria, and recalibrated to ensure I was filtering based on stock correctly.

- **Blocker 2: Confusion with Asynchronous Handling**  
  Experienced confusion over whether resolver functions should return raw data or promises.
  - **Resolution:** Delved into the Apollo documentation and some Stack Overflow threads on best practices for returning data. This provided a clearer understanding of how resolving works asynchronously in GraphQL.

- **Blocker 3: JSON Result Format Issues**  
  Many of my test responses were yielding unformatted JSON, which made it hard to read.
  - **Resolution:** Implemented `.pretty()` function in my testing to format the JSON output for better visibility during the testing phase.

### Summary 

- **Key Takeaways:** 
  - Understanding GraphQL operates differently than REST, especially in terms of how data is structured and requested.
  - Utilizing resources like documentation and tutorials greatly improved both my comprehension and troubleshooting skills.

- **Total Time Spent (Days 1-2):** 12 hours

- **Self-Assessment of Readiness for Day 3:**
   I feel equipped to advance to the team build phase, having created a working prototype that connects to the Northstar Retail Co. inventory efficiently using GraphQL. My understanding is strong, and I am prepared to contribute effectively to the next phase of development.