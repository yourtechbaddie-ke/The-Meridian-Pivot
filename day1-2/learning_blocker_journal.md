# Learning & Blocker Journal — Days 1-2 (GraphQL Solo Recon)

## Day 1 - August 18, 2026

### Time Log
- **Total Time Spent**: 6 hours

**09:00 AM - 09:30 AM**: Introduction to GraphQL
- **Activity**: Watched introductory video on GraphQL.
- **Resource**: [GraphQL Official Website - Learn GraphQL](https://graphql.org/learn/)
- **Outcome**: Gained a high-level understanding of what GraphQL is and its core concepts (queries, mutations, subscriptions).

**09:30 AM - 11:00 AM**: Set Up Development Environment
- **Activity**: Installed Node.js and set up a new project for the GraphQL mini-prototype.
- **Instructions Followed**: 
  1. Installed Node.js.
  2. Created a new project directory and initialized it using `npm init -y`.
  3. Installed Apollo Server and GraphQL using `npm install apollo-server graphql`.
- **Outcome**: Successfully set up the environment without any errors.

**11:00 AM - 12:30 PM**: Understanding SDL and Resolvers
- **Activity**: Read tutorials on GraphQL schema definition language (SDL) and basics of resolvers.
- **Resource**: [How to GraphQL - Schema and Resolvers](https://www.howtographql.com/graphql-js/0-introduction/)
- **Outcome**: Understood how to define types and resolvers; recognized the importance of the `Query` type.

### Blockers Encountered
**Blocker 1**: Confusion with GraphQL vs REST
- **Description**: Struggled to comprehend how GraphQL differs from REST.
- **Resolution**: Created a side-by-side comparison table summarizing differences, such as over-fetching vs. under-fetching data.

**Blocker 2**: Syntax issues with SDL
- **Description**: Faced issues while writing the schema due to syntax errors.
- **Error Messages**: Received syntax errors when defining types.
- **Resolution**: Referenced [GraphQL Specification](https://spec.graphql.org/) for correct SDL syntax. This clarified correct declarations for types and fields.

**Blocker 3**: Understanding resolvers function
- **Description**: Initially unclear on how resolvers interact with the data.
- **Resolution**: Built a sample resolver for a simple array to practice how it pulls data based on queries. This required trial and error, but eventually connected the dots.

### Breakthroughs
- **"Aha" Moment 1**: Realized that the resolver function can be a vital bridge between client queries and server data.
- **"Aha" Moment 2**: Once I successfully constructed a simple `getAllItems` resolver, it became clear how data flows in GraphQL.

---

## Day 2 - August 19, 2026

### Time Log
- **Total Time Spent**: 5 hours

**09:00 AM - 10:30 AM**: Build GraphQL Server
- **Activity**: Developed the GraphQL server implementing resolvers.
- **Outcome**: Completed the initial setup of the server and defined necessary queries based on the Northstar Retail Co. inventory context.

**10:30 AM - 12:00 PM**: Test Queries
- **Activity**: Used GraphQL Playground to write and test queries. 
- **Queries Tested**: 
  - `getAllItems`
  - `getOutOfStock`
  - `getByCategory(category: "Jacket")`
- **Outcome**: Successfully retrieved data from the server. Noticed the response structure was as expected.

### Blockers Encountered
**Blocker 1**: Querying with Incorrect Parameters
- **Description**: An attempt to fetch items with a non-existent category returned an error.
- **Error Messages**: GraphQL validation errors due to missing items.
- **Resolution**: Updated queries and tested them with valid parameters. Verified the existing inventory data.

**Blocker 2**: Understanding Aggregated Queries
- **Description**: Struggled with writing a query that combines multiple item statuses.
- **Resolution**: Reviewed how to construct complex queries and successfully implemented a query that fetches both low and out-of-stock items by creating a combined resolver function.

**Blocker 3**: Handling CORS issues
- **Description**: Encountered CORS errors when trying to access the server from certain platforms.
- **Resolution**: Configured CORS settings in Apollo Server. Modified the server initialization to include CORS handling: 
  ```javascript
  const server = new ApolloServer({ typeDefs, resolvers, cors: true });
  ```

### Breakthroughs
- **"Aha" Moment 1**: Realized the power of GraphQL in simplifying data retrieval — needing less effort compared to crafting multiple REST endpoints for different queries.
- **"Aha" Moment 2**: Successfully executing multiple queries simultaneously demonstrated GraphQL’s efficiency in handling requests.

### Summary
- **Key Takeaways**: 
  1. Strong grasp on defining SDL schemas and writing resolvers.
  2. Improved understanding of how GraphQL servers operate, including query structure and server response formats.
- **Total Time Spent over 2 Days**: 11 hours
- **Self-Assessment**: Gained confidence in handling GraphQL fundamentals. Ready for the Day 3 team building, aiming to enhance the prototype with additional functionality and possibly start on mutations.
