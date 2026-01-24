# TDD Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Practice Test-Driven Development (TDD) for **both new features and bugfixes**: write failing test → verify failure → implement/fix → verify pass. TDD must be used consistently for all code changes.

## Instructions

1. **Determine context:**
   - Ask: "Is this a bugfix or new feature?"
   - **For bugfixes:** Gather bug info (see step 1a)
   - **For new features:** Load spec from `docs/specs/{feature-name}.md` (see step 1b)

1a. **Gather bug info (bugfixes):**

- Ask: "Describe the bug"
- If unclear, request: expected behavior, actual behavior, steps to reproduce, affected component, error messages

1b. **Load spec (new features):**

- Ask: "Path to Technical Specification?" (e.g., `docs/specs/magic-link-login.md`)
- Parse: requirements, API contracts, data models, expected behaviors
- Extract test scenarios from spec requirements

2. **Identify scope:**
   - **For bugfixes:** Search relevant files/functions/components, read code, identify bug location, check existing tests
   - **For features:** Identify files/components to be created/modified based on spec, check existing patterns

3. **Write failing tests:**
   - **Test-first approach:** Write tests BEFORE implementing/fixing code
   - tRPC integration: `app/api/trpc/routers/{domain}.integration.test.ts`
   - REST schema validation: `tests/api-runtime-validation/{domain}.test.ts` (for OpenAPI endpoints)
   - React: `Component.test.tsx` alongside component
   - Utils: `utils.test.ts` alongside function
   - E2E: `e2e/specs/`
   - **For bugfixes:** Test must reproduce bug, assert expected behavior (will fail initially)
   - **For features:** Tests must cover all spec requirements, edge cases, error scenarios (will fail initially)

4. **Verify test fails:**
   - Run: `pnpm test {test-file}` or `pnpm e2e {test-file}`
   - Verify: fails as expected, failure matches bug, not false positive
   - Confirm with user before proceeding

5. **Implement/Fix:**
   - **For bugfixes:** Identify root cause, implement minimal fix following project patterns
   - **For features:** Implement minimal code to make tests pass (green phase), follow project patterns
   - Add comments if non-obvious
   - Keep changes focused and minimal

6. **Verify tests pass:**
   - Run test: `pnpm test {test-file}` or `pnpm e2e {test-file}`
   - Verify: tests pass, no other tests broken, no regressions
   - **For features:** All spec requirements covered by passing tests

7. **Refactor Phase (After Tests Pass):**
   - **Trigger:** All tests pass (green phase complete)
   - **Code Review:**
     - Scan for code smells, duplication, complexity
     - Check naming clarity and consistency
     - Verify single responsibility principle
   - **Simplification:**
     - Remove dead code, unused imports
     - Inline unnecessary abstractions
     - Reduce nesting levels where possible
   - **Performance Review:**
     - Check for N+1 queries, unnecessary re-renders
     - Verify pagination on lists
     - Review bundle size impact
   - **Documentation:**
     - Add/update JSDoc on exports
     - Clarify complex logic with comments
   - **Verify Tests Still Pass:**
     - Re-run full test suite
     - Ensure no regressions from refactoring

8. **Run related tests:**
   - `pnpm test {affected-directory}` or `pnpm test`

9. **Check quality:**
   - `pnpm lint && pnpm typecheck`
   - Fix any errors

10. **Document (if significant):**

- Add JSDoc for complex fixes
- Update docs if needed

11. **Summary:**
    - **For bugfixes:** Bug description, root cause, fix applied
    - **For features:** Feature description, spec requirements covered, implementation approach
    - Test file paths, pass status, regression check
    - Files created/modified
    - Next steps checklist

## Quality Gates

- ✅ Tests written FIRST (before implementation/fix)
- ✅ Tests failing for expected reason (red phase confirmed)
- ✅ Implementation/fix complete (green phase)
- ✅ All tests pass
- ✅ Related tests pass (no regressions)
- ✅ No lint/type errors
- ✅ Follows project patterns
- ✅ TDD process followed consistently

## TDD Principles

**CRITICAL:** TDD must be practiced consistently for:

- ✅ **All new features** - Write tests based on spec before implementation
- ✅ **All bugfixes** - Write test that reproduces bug before fixing
- ✅ **All refactoring** - Ensure tests exist before refactoring

**TDD Cycle:**

1. 🔴 **Red:** Write failing test (reproduce bug or spec requirement)
2. 🟢 **Green:** Implement minimal code to pass test
3. 🔵 **Refactor:** Comprehensive review and simplification while keeping tests green
   - Code review (smells, duplication, complexity)
   - Simplification (dead code removal, reduce nesting)
   - Performance review (N+1 queries, re-renders, pagination)
   - Documentation (JSDoc, comments)
   - Verify tests still pass
4. Repeat for next requirement/bug
