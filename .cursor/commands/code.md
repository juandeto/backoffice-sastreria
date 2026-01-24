# CODE Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Implement Technical Specification from `docs/specs` with production code, tests, docs. Mark spec complete, optionally create draft PR.

## Instructions

1. **Read spec:**
   - Ask: "Path to Technical Specification?" (e.g., `docs/specs/magic-link-login.md`)
   - Parse: requirements, architecture, data models, APIs, testing requirements
   - Read referenced Product Brief if any

2. **Clarify:**
   - Proceed with full implementation (tests + docs)?
   - Prioritize specific parts?
   - Create feature branch?

3. **Create branch (if approved):**
   - `feat/<feature-name-slug>`
   - `git checkout -b feat/<feature-name-slug>`

4. **Check for existing tests:**
   - If tests exist from `/tdd` step: Verify they fail as expected, then implement to make them pass
   - If no tests exist: Tests should be written first using `/tdd` command (follow unit testing best practices)

5. **Implement order:**
   - Database Schema: Update Prisma schema, indexes/relationships
   - tRPC Routers: `app/api/trpc/routers/{domain}/`
   - Business Logic: Procedures with Zod validation, error handling
   - Frontend Components: Follow project patterns
   - tRPC Client: Use `api.domain.useQuery`, `api.domain.useMutation`, `api.domain.useSubscription`
   - **Goal:** Implement minimal code to make existing tests pass (green phase)

6. **Verify tests pass:**
   - Run: `pnpm test` or `pnpm e2e`
   - All tests from `/tdd` step should now pass
   - If tests still fail: Fix implementation until all tests pass

7. **Document:**
   - JSDoc on exported functions
   - Inline comments for complex logic
   - Update READMEs
   - Document env vars

8. **Quality gates:**
   - Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm e2e`
   - If P0 issues: STOP, show issues, fix, re-run
   - If P1 issues: Show, ask continue?, document if yes
   - If P2 issues: Note in summary

9. **Update spec:**
   - Status: "Draft" → "Completed"
   - Add Implementation Summary: implementer, date, branch, components, files changed, coverage, docs

10. **Summary:**

- Files created/modified
- Implementation summary
- Key features
- Test coverage, quality results

11. **Next steps:**
    - Create draft PR? (`/draft-pr`)
    - QA review? (`/review`)
    - Explain? (`/explain`)
    - Adjustments?

## TODO Composition

Create todos at task start:

1. `code-read-spec` - "Read and parse Technical Specification"
2. `code-clarify` - "Clarify implementation scope and branch strategy"
3. `code-create-branch` - "Create feature branch if approved"
4. `code-check-tests` - "Check for existing tests from TDD step"
5. `code-implement` - "Implement code (schema, routers, logic, components, client)"
6. `code-verify-tests` - "Verify all tests pass"
7. `code-document` - "Add JSDoc and update documentation"
8. `code-quality-gates` - "Run quality gates (lint, typecheck, tests)"
9. `code-update-spec` - "Update spec status and add implementation summary"
10. `code-summary` - "Generate implementation summary"

Update status: Mark `in_progress` when starting each, `completed` when done.
