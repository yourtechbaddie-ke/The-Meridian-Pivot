# The Meridian Pivot — Northstar Retail Co. Sprint 2

## Description of Simulation Phases
The Meridian Pivot project spans multiple phases of prototyping and development for Northstar Retail Co., focusing on a GraphQL-based inventory management system. The intended outcome is to create a robust backend API integrated seamlessly with a luxurious frontend user experience.

## Folder Structure
The project follows a structured folder organization that ensures clarity and ease of navigation:

| File Path                           | Description                                                             |
|-------------------------------------|-------------------------------------------------------------------------|
| `day1-2/graphql_prototype.md`      | Documentation of the Mini GraphQL Prototype and SDL schema overview.    |
| `day1-2/learning_blocker_journal.md`| Learning objectives and blockers encountered during the first two days. |
| `day3/polling_system.md`           | Code implementation of the original polling system for inventory updates. |
| `day4-5/webhook_refactor.md`      | Documentation of the refactored webhook implementation.                  |
| `day5/scope_delta_analysis.md`     | Analysis comparing the polling and webhook models.                        |
| `package.json`                     | Project metadata, dependencies, and scripts for Node.js application.       |
| `vercel.json`                      | Configuration file for deployment on Vercel.                            |
| `index.js`                        | Main entry point of the Node.js application.                            |
| `schema.js`                       | GraphQL SDL schema definition file.                                    |
| `resolvers.js`                    | Resolver functions implementing GraphQL queries.                       |
| `data/inventory.js`               | Mock data structure representing Northstar inventory.                   |
| `.env.example`                     | Example environment configuration for Node.js applications.             |
| `.gitignore`                      | Files and directories to ignore for Git version control.                |
| `public/index.html`                | HTML entry point for the luxurious frontend user interface.              |
| `public/styles.css`                | Full CSS stylesheet with themes and animations.                         |
| `public/app.js`                    | Frontend JS file for handling GraphQL interactions and dynamic rendering.  |

## Deploy to Vercel
To deploy the project to Vercel, follow these steps:
1. Connect your GitHub repository on [vercel.com](https://vercel.com).
2. Ensure the `NODE_ENV` is set to `production` in Vercel environment settings.
3. Click Deploy - the site will be live at your Vercel URL!

## View the Prototype
The front-end UI features include:
- A luxurious hero section that prominently displays the Northstar branding and a call to action.
- An interactive inventory grid that dynamically renders product cards based on GraphQL queries.
- Responsive design elements that enhance usability across devices.

## Sprint Deliverables Navigation Guide
All relevant documentation and scripts are organized under the `day1-2`, `day3`, `day4-5`, and `public` directories. Navigate through these directories to access specific files related to the project deliverables, implementation details, and insights gained during the sprint.
