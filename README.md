The Meridian Pivot — Northstar Retail Co. 

Description of the Simulation Phases
This project involves the development and deployment of a luxury retail inventory management system using GraphQL. The simulation phases include:
- Days 1-2: Development of GraphQL prototype and exploration of schema.
- Day 3: Initial implementation of polling system for stock updates.
- Days 4-5: Transition from polling to a webhook-based system for real-time inventory management.

Full Folder Structure

| Path                                   | Description                                                  |
|----------------------------------------|--------------------------------------------------------------|
| day1-2/graphql_prototype.md           | Documentation for the GraphQL prototype and SDL schema.     |
| day1-2/learning_blocker_journal.md    | Journal documenting learning experiences and blockers for Days 1-2.
| day3/polling_system.md                | Original code for polling system to fetch stock updates.     |
| day4-5/webhook_refactor.md           | Refactored code implementing webhook for real-time inventory. |
| day5/scope_delta_analysis.md          | Analysis of scope changes during the sprint.                 |
| package.json                          | Node.js project configuration file.                          |
| vercel.json                            | Vercel configuration for deployment.                          |
| index.js                               | Entry point of the Node.js application.                      |
| schema.js                              | GraphQL schema definitions.                                   |
| resolvers.js                           | Resolvers for handling GraphQL queries through GraphQL API.  |
| data/inventory.js                      | Simulated inventory data for the application.                |
| .env.example                           | Example of environment variables for the application.         |
| .gitignore                             | Specifies files and directories to ignore in Git.            |
| public/index.html                      | Frontend HTML page for displaying inventory and UI.          |
| public/styles.css                      | CSS styles for the frontend.                                 |
| public/app.js                          | JavaScript for managing frontend interactions.                |

Deploy to Vercel

View the Prototype
The frontend UI features a luxury design with a responsive layout, showcasing an inventory dashboard, real-time statistics using GraphQL, and interactive filter/search functionality.

Sprint Deliverables Navigation Guide
Navigate through the provided folder structure and documentation for detailed insight into each deliverable and the project's implementation.