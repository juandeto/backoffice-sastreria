# REVIEW Task

**Persona:** `@qa` (Quinn, Quality Assurance Lead). Load `.rulesync/subagents/qa.md`.

## Objective

QA review of PR/branch. Execute checks, apply checklists, identify issues, produce report. Save to `docs/qa/reports/{yyyy-mm-dd}-{branch-or-pr-slug}.md`.

## Instructions

1. **Initiate:**
   - Greet as Quinn
   - Ask: "What to review? (PR URL, branch name, or describe changes)"
   - If PR URL + GitHub MCP: fetch PR details
   - If branch: `git diff` to see changed files
   - Ask the user to start the dev server if it is not already running.

2. **Automated checks:**
   - `pnpm lint && pnpm typecheck && pnpm test && pnpm e2e` (skip E2E if not feasible, note in report)
   - Record pass/fail and errors

3. **Code quality:**
   - Check: `console.log`/debug statements, `any` types, error handling, sensitive data in logs, JSDoc on exports, import order, naming
   - Search for obviated code to remove
   - Identify opportunities to consolidate similar code

4. **Quality gate checklist:**
   - Primary: Code Quality, Testing, Documentation, Performance
   - Secondary (only if explicitly prioritized by project rules): Security, Accessibility

5. **Additional context:**
   1. Review related briefs/decisions/specs in `docs/` and ensure the functionality is fully-implemented, unfinished work should be categorized as P0
   2. Manual testing? Describe scenarios
   3. UI changes?
   4. Screenshots/videos?
   5. Known issues/limitations?

6. **Categorize issues:**
   - **P0 - Critical:** Blocks merge (failing tests, security vulns, broken functionality)
   - **P1 - High:** Fix before merge (missing error handling, a11y gaps)
   - **P2 - Medium:** Address soon (minor code quality, missing docs)
   - **P3 - Low:** Nice to have (code style, optimizations)

7. **Decision:**
   - **PASS:** All critical checks pass, no blockers
   - **PASS WITH RECOMMENDATIONS:** Can merge, non-blocking issues
   - **BLOCK:** Critical issues must fix

8. **Generate report:**
   - Read template: `.rulesync/templates/qa-report-template.md`
   - Follow template structure exactly
   - Fill sections: findings, automated check status, issues with severity/fixes, decision with rationale
   - Save to `docs/qa/reports/{yyyy-mm-dd}-{branch-or-pr-slug}.md`

9. **Summary:**
   - Decision summary
   - Critical findings
   - Required actions if blocked
   - Report link
   - If blocked: "PR blocked. Address critical issues."
   - If passed: "PR passes QA review, ready to merge."

10. **Rule improvement analysis:**
    - Identify gaps: patterns not covered, repeated issues, new best practices, patterns needing explanation
    - Generate suggestions: Target rule domain (e.g., "unit testing", "code quality", "architecture"), section, type (Addition/Update/New Pattern), reasoning, proposed content, examples
    - Ask: "Identified {N} potential rule improvements. Review and apply?"
    - If yes: Show each, ask approve/reject, apply approved updates, track updates
    - If rules updated: Confirm updates applied
    - Summary: Total suggestions, applied, skipped, updated files, impact, next steps

## TODO Composition

Create todos at task start:

1. "Greet Quinn and identify what to review"
2. "Run automated checks (lint, typecheck, tests)"
3. "Review code quality (console.log, any types, error handling, JSDoc, etc.)"
4. "Apply quality gate checklist (code, testing, docs, security, performance, accessibility)"
5. "Gather additional context (manual testing, UI changes, screenshots, known issues)"
6. "Categorize issues by severity (P0/P1/P2/P3)"
7. "Make decision (PASS/PASS WITH RECOMMENDATIONS/BLOCK)"
8. "Generate QA report from template"
9. "Generate review summary"
10 "Analyze and apply rule improvements"

Update status: Mark `in_progress` when starting each, `completed` when done.
