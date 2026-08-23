# Meridian Pivot — Submission Checklist

## Repository readiness

- [x] README explains the complete Meridian progression.
- [x] Northstar Retail Co. original work is preserved.
- [x] GraphQL prototype is preserved.
- [x] Learning & Blocker Journal is preserved.
- [x] Northstar polling baseline is preserved.
- [x] Northstar webhook refactor is documented.
- [x] Solstice Events Co. Pivot Event is separated and clearly labelled.
- [x] Solstice MVP includes runnable source code.
- [x] Solstice MVP includes a pending UI state.
- [x] Solstice MVP includes webhook verification.
- [x] Solstice MVP includes replay protection.
- [x] Solstice MVP includes duplicate-scan protection.
- [x] Solstice MVP includes out-of-order job matching.
- [x] Solstice MVP includes three seeded attendees.
- [x] Automated webhook tests are included.
- [x] Acceptance tests are documented.
- [x] Local secrets and database files are excluded from Git.
- [x] GitHub Actions CI is included for the Solstice test suite.
- [x] Scope Delta Analysis explains dropped, modified, and added work.


## Recommended reviewer path

`README.md`
→ `day1-2/learning_blocker_journal.md`
→ `day3/polling_system.md`
→ `day4-5/webhook_refactor.md`
→ `day5/scope_delta_analysis.md`
→ `pivot-event/PIVOT_EVENT.md`
→ `pivot-event/solstice-events-co/README.md`
→ `pivot-event/solstice-events-co/docs/ACCEPTANCE-TESTS.md`
