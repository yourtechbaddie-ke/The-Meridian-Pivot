# THE MERIDIAN PIVOT

## Northstar Retail Co. → Solstice Events Co.

This repository is the consolidated submission for the **Meridian Pivot** simulation. It preserves the original Northstar Retail Co. work and adds the later **Pivot Event** for Solstice Events Co. as a clearly separated event-driven implementation.

> **Important scenario boundary:** Northstar Retail Co. and Solstice Events Co. are treated as two client scenarios in this repository. The Northstar material documents the original inventory exercise and its polling-to-webhook transition. The Solstice material documents the later Pivot Event handout and its synchronous-printer-to-asynchronous-queue/webhook requirement. They are not presented as the same business system.

## Live Prototype Links

For instructor/reviewer evaluation, the two client scenarios have separate live prototypes:

- **Northstar Inventory Atelier:** https://northstar-retail-co--yourtechbaddie.replit.app
- **Solstice Events Co.:** https://solstice-events-co.hatchable.site/

> **Review note:** These are intentionally separate prototypes. Northstar represents the original inventory scenario and its webhook refactor, while Solstice Events Co. represents the later Pivot Event MVP. The two prototypes should not be merged into one business application.

## What this repository demonstrates

1. **Assignment 1 — Independent Learning & Blocker Log**
   - GraphQL was used as the unfamiliar technology for the individual reconnaissance phase.
   - The working prototype and Learning & Blocker Journal are preserved under `day1-2/`.
2. **Original Build — Northstar Retail Co.**
   - A warehouse polling model was documented for the original inventory-sync specification.
   - The polling implementation is preserved as the Day 3 baseline under `day3/`.
3. **Northstar Pivot Reference — Webhook Inventory Updates**
   - The Northstar inventory model was refactored from scheduled polling to signed webhook updates.
   - The implementation and trade-offs are documented under `day4-5/`.
4. **Pivot Event — Solstice Events Co.**
   - The later Pivot Event introduces a different client scenario: an event check-in kiosk whose badge printer moves from synchronous REST to an asynchronous queue + webhook model.
   - A runnable MVP, verification logic, tests, architecture, API contract, and deployment notes are included under `pivot-event/solstice-events-co/`.
5. **Scope Delta & Review Evidence**
   - The repository records what changed, what was removed, what was added, regression considerations, and the remaining backlog.

## Repository navigation

| Path | Purpose |
|---|---|
| `day1-2/graphql_prototype.md` | GraphQL prototype and SDL exploration |
| `day1-2/learning_blocker_journal.md` | Individual learning, blockers, fixes, breakthroughs, and time log |
| `day3/polling_system.md` | Northstar original polling baseline |
| `day4-5/webhook_refactor.md` | Northstar inventory webhook refactor reference |
| `day5/scope_delta_analysis.md` | Consolidated scope analysis for the sprint and later Pivot Event |
| `pivot-event/PIVOT_EVENT.md` | Requirements and interpretation of the Solstice Pivot Event |
| `pivot-event/solstice-events-co/README.md` | Runnable Solstice MVP overview |
| `pivot-event/solstice-events-co/src/server.js` | Solstice check-in API and verified webhook endpoint |
| `pivot-event/solstice-events-co/src/webhook-verification.js` | HMAC-SHA256 verification and signing helpers |
| `pivot-event/solstice-events-co/src/database.js` | Attendee and processed-webhook persistence |
| `pivot-event/solstice-events-co/tests/webhook.test.js` | Verification tests for valid, tampered, and expired webhooks |
| `pivot-event/solstice-events-co/docs/ARCHITECTURE.md` | Async state flow and out-of-order protection |
| `pivot-event/solstice-events-co/docs/API.md` | API contract and expected status codes |
| `pivot-event/solstice-events-co/docs/WEBHOOK-VERIFICATION.md` | Security and raw-body verification rules |
| `pivot-event/solstice-events-co/docs/DEPLOYMENT.md` | Local and production deployment notes |

## Running the Solstice Pivot Event MVP

```bash
cd pivot-event/solstice-events-co
npm install
cp .env.example .env
# Set WEBHOOK_SECRET in .env
npm start
```

Open `http://localhost:3000`.

Run the automated tests:

```bash
npm test
```

Demo attendees:

- `SOL-001` — Amina Wanjiku
- `SOL-002` — Brian Otieno
- `SOL-003` — Claire Njeri

## Final submission note

The strongest way to evaluate this repository is to follow it in chronological order:

**Independent learning → Northstar original build → pivot/change evidence → Solstice Pivot Event implementation → scope/trade-off documentation.**

The confidential **Adaptability Index** should be submitted through the PLP-provided confidential channel rather than stored in this public repository.

## Technology summary

- GraphQL / SDL / resolvers
- Node.js + Express
- HMAC-SHA256 webhook verification
- SQLite (`better-sqlite3`) for the Solstice MVP
- Vanilla HTML/CSS/JavaScript kiosk UI
- Node.js built-in test runner

## Submission principle

The repository deliberately preserves the work already completed rather than rewriting history. Earlier Northstar artifacts remain available as evidence of the original phase, while the later Solstice implementation is isolated as the Pivot Event deliverable. This makes the requirement change, technical response, and trade-offs easy for a reviewer to inspect.