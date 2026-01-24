# TEST Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Add test coverage to **existing code** that lacks tests. For new features or bugfixes, use `/tdd` instead (test-first approach).

**When to use `/test` vs `/tdd`:**

- **`/tdd`** - For new features (write tests FIRST based on spec) or bugfixes (write test that reproduces bug FIRST)
- **`/test`** - For existing code that needs test coverage added retroactively

## Instructions

1. **Discovery:**
   - Ask: "What to test? (file/folder/feature)"
   - Examine code: functionality, dependencies, complexity

2. **Scope:**
   - Ask: test type (`unit`/`integration`/`rest-validation`/`e2e`/`all`), specific cases, update existing or create new

3. **Analyze:**
   - Read target files
   - Understand signatures, behaviors, dependencies
   - Note error handling, edge cases
   - Check existing coverage, related mocks

4. **Write tests:**
   - Unit: `.test.ts` alongside source
   - Integration: module interactions, database mocks
   - E2E: `e2e/` directory

5. **Verify:**
   - Run: `pnpm test` or `pnpm e2e`
   - Fix failures, check lint: `pnpm lint`

6. **Document:**
   - Comments for complex setups
   - Update README if patterns changed
   - Document new mocks

7. **Summary:**
   - Test files created/modified
   - Coverage summary
   - Key scenarios, gaps, limitations
   - Test results, run instructions

## TODO Composition

Create todos at task start:

1. `test-discovery` - "Identify what to test (file/folder/feature)"
2. `test-scope` - "Determine test scope (type, cases, update vs create)"
3. `test-analyze` - "Analyze target code (signatures, behaviors, dependencies, edge cases)"
4. `test-write` - "Write tests (unit/integration/E2E)"
5. `test-verify` - "Verify tests pass and fix failures"
6. `test-document` - "Document test setup and update README if needed"
7. `test-summary` - "Generate summary with coverage and results"

Update status: Mark `in_progress` when starting each, `completed` when done.
