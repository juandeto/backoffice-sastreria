# WORKFLOW Task

**Persona:** Orchestrate `@product-owner`, `@architect`, `@developer`, `@qa` as needed.

## Objective

Execute feature workflow: Brief → Spec → TDD → Code → Review → PR. Preserve context across stages. Optional but streamlines development.

## Stages

```
Brief → docs/briefs/{name}.md
Spec → docs/specs/{name}.md
TDD → Write failing tests based on spec (test-first)
Code → Implementation to make tests pass
Review → docs/qa/reports/{name}.md
Draft PR → GitHub PR
```

## Instructions

1. **Initialize:**
   - Ask: "Feature name?"
   - Ask: "Stages? (full/partial/resume)"
   - If partial: specify stages (brief→spec, spec→tdd→code, etc.)
   - If resume: load state from `docs/workflows/{feature-name}-workflow.json`

2. **Track state:**
   - Create: `docs/workflows/{feature-name}-workflow.json`
   - Structure: `{featureName, startedAt, currentStage, completedStages, artifacts: {brief, spec, tests, qaReport}, context: {key_decisions, requirements, concerns}}`

3. **TODO Management:**
   - At each stage start: Create todos with stage-specific tasks
   - Update workflow state: `artifacts.todos.{stage} = [...]`
   - Mark current task `in_progress`, previous `completed`
   - After stage completes, update workflow state JSON

4. **Stage 1: Brief (`/brief`)**
   - Execute as `@product-owner`
   - Save to `docs/briefs/{feature-name}.md`
   - Extract: target users, requirements/constraints, success metrics
   - Update workflow state

5. **Stage 2: Spec (`/spec`)**
   - Execute as `@architect`
   - Load brief from Stage 1
   - Save to `docs/specs/{feature-name}.md`
   - Extract: architectural choices, data models, API contracts, security, performance
   - Update workflow state

6. **Stage 3: TDD (`/tdd`)**
   - Execute as `@developer`
   - Load spec from Stage 2
   - Write failing tests based on spec requirements (test-first approach)
   - Test types: Unit tests for procedures/logic, Integration tests for database/API, E2E tests for workflows
   - Verify tests fail for expected reasons (red phase)
   - Track: test files created, test scenarios covered, coverage targets
   - Track test artifacts in workflow state: `artifacts.tests = ["path/to/test1.test.ts", "path/to/test2.test.ts", ...]`
   - Update workflow state

7. **Stage 4: Code (`/code`)**
   - Execute as `@developer`
   - Load spec from Stage 2 and tests from Stage 3
   - Ask: "Create feature branch? (recommended: yes)"
   - Implement minimal code to make tests pass (green phase)
   - Refactor while keeping tests green (refactor phase)
   - Track: files changed, test coverage, dependencies, edge cases, limitations
   - Update workflow state

8. **Stage 5: Review (`/review`)**
   - Execute as `@qa`
   - Generate QA report: `docs/qa/reports/{feature-name}.md`
   - Extract: test results, issues (P0/P1/P2/P3), quality metrics, security/performance concerns, rule improvements
   - Track QA report artifact in workflow state: `artifacts.qaReport = "docs/qa/reports/{feature-name}.md"`
   - Update workflow state

9. **Stage 6: Draft PR (`/draft-pr`)**
   - Execute as `@developer`
   - Compile context from all stages
   - Include in PR: artifacts (brief/spec/QA report), implementation summary, test coverage, breaking changes
   - Commit and push

10. **Pause/resume:**

- Ask after each stage: "Continue or pause?"
- If pause: Save complete state
- Resume: `/workflow resume {feature-name}` → Load state, show progress, continue

11. **Context flow:**
    - Brief→Spec: User requirements, constraints, success metrics
    - Spec→TDD: Architecture, data models, APIs → Test requirements and scenarios
    - TDD→Code: Failing tests define expected behavior → Implementation to pass tests
    - Code→Review: Files changed, test coverage, implementation decisions
    - Review→PR: QA findings, test results, rule improvements
    - All→PR: Complete feature context

12. **Summary:**
    - Stages completed, artifacts created, key metrics (files changed, coverage, issues, duration)
    - Next steps: Address P0/P1 issues, request reviews, deploy to staging
