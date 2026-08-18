# Learning & Blocker Journal — Days 1-2 (GraphQL Solo Recon)

## Day 1

### 2026-08-17 — Understanding the Basics of GraphQL

**Time Log: Approx. 6 hours**

#### 09:00 - 10:00 | Introduction to GraphQL
- **Resources Consulted:**
  - [GraphQL Official Documentation](https://graphql.org/learn/)
- I started by reading through the basics of GraphQL, understanding its core principles compared to REST APIs. I focused on queries, mutations, and schemas.

#### 10:00 - 11:30 | GraphQL SDL (Schema Definition Language)
- **Activity:** I imagined how to model the Northstar Retail inventory in GraphQL.
- **Breakthrough:** I realized the power of typing and how clear definitions (like for `Item`) can help in structuring queries. I drafted a simple schema for the inventory focusing on jackets initially.

#### 11:30 - 12:00 | First Confusion: Schema Structure
- **Blocker Encountered:** I wasn't sure how to include optional fields in my schema, like `fabric`.
- **Resolution:** I flipped back to the official documentation and found out that optional fields can simply be defined by omitting the `!`. 

#### 12:00 - 13:00 | Querying Basics
- **Resources Consulted:**
  - [How to GraphQL - Querying](https://graphql.howto/graphql-queries)
- I explored how to use queries to fetch item details and crafted examples based on our jackets.

#### 13:00 - 14:00 | Lunch Break

#### 14:00 - 15:30 | Setting Up Apollo Server
- **Activity:** I setup the Apollo Server in a project folder and wrote the code structure based on the GraphQL schema I defined.
- **Dead End Encountered:** My server wouldn’t start due to missing packages. 
- **Resolution:** I ran `npm install apollo-server graphql` and confirmed installation before re-running the server.

#### 15:30 - 16:30 | First Query Success
- I tested my first query using GraphQL Playground. I crafted a query to retrieve jacket items and was successful in getting responses. 
- **Breakthrough:** Seeing my query work in the GraphQL Playground felt rewarding, especially when I retrieved details on a specific jacket.

#### 16:30 - 17:00 | Learning About Resolvers
- I read about resolvers and how they connect schema to data.
- **Aha Moment:** Realizing that I needed to write functions for each query to fetch from my inventory array. 

#### 17:00 - 18:00 | Writing Resolvers
- **Activity:** I wrote the basic resolver functions to fetch jacket items from the inventory.
- **Blocker Encountered:** I couldn’t get the resolver for fetching all items to return data properly.
- **Resolution:** I realized I was not returning anything from the resolver function. After correcting this, the query worked perfectly.

---

## Day 2

### 2026-08-18 — Building the Mini-Prototype

**Time Log: Approx. 7 hours**

#### 09:00 - 10:30 | Consolidating Knowledge
- I reviewed my notes and existing queries, brushed up on everything from day 1, and confirmed that the resolvers were connected to the GraphQL server. 

#### 10:30 - 12:00 | Implementing All Queries
- I wrote the remaining resolvers for other inventory queries: `getByCategory`, `getOutOfStock`, and `getLowStock`.
- **Blocker Encountered:** When testing the `getOutOfStock` query, it returned an empty array, which was confusing since I knew there were out-of-stock items.
- **Resolution:** After debugging, I discovered I was checking the status incorrectly (spelled incorrectly). A quick fix on the string comparison resolved the issue.

#### 12:00 - 13:00 | Lunch Break

#### 13:00 - 14:30 | More Testing of Queries
- I began testing all queries in the GraphQL Playground.
- **Breakthrough:** Successfully retrieving data for multiple categories, out of stock items, and low stock items. The queries responded quickly, and each detail was clear.

#### 14:30 - 16:00 | Implementing and Testing Error Handling
- I researched error handling in Apollo Server.
- **Blocker Encountered:** I tried to send a query with a non-existent item ID, expecting a clean error message.
- **Resolution:** After reading through the documentation, I added error handling logic to my resolvers. I learned to throw customized error messages for better client feedbacks.

#### 16:00 - 17:00 | Final Touches and Documentation
- I documented all my queries and their expected responses for future reference.
- I prepared a README so that I could easily onboard someone else to the project if needed later.

#### 17:00 - 18:00 | Reflection and Preparation for Team Build
- I reviewed my learning over the past two days. 
- **Self-Assessment:** I feel equipped to collaborate with my team in the next sprint. I documented pitfalls and resolutions clearly, enabling others to avoid the same pitfalls.

---

## Summary

### Key Takeaways:
- **GraphQL Foundation:** Gained a solid understanding of queries, schemas, and resolvers.
- **Error Resolution Skills:** Developed troubleshooting skills through hands-on experimentation with resolvers and error handling.
- **Documentation Importance:** Recognized the value of thorough documentation not just for personal reference but for team communication.

### Total Time Spent:
Approximately 13 hours across Days 1 and 2.

### Self-Assessment of Readiness for Day 3 Team Build:
I feel confident in the foundational knowledge of GraphQL and the specific mini-prototype built for the Northstar Retail inventory. I'm ready to engage with the team in deeper discussions and contribute effectively.
