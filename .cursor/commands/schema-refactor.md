# SCHEMA-REFACTOR Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Analyze and implement a schema change (Zod validation, Prisma, or OpenAPI) by identifying all impacted files across the codebase: routers, tests, E2E specs, OpenAPI documentation, and related docs.

## Instructions

1. **Gather requirements:**
   - Ask: "What schema change do you need to make?"
   - Clarify: Which schema(s) are affected? (Zod, Prisma, OpenAPI)
   - Understand: What is the business reason for this change?

2. **Identify the source schema:**
   - Locate the primary schema definition (e.g., `lib/validation/schemas.ts`, `prisma/schema.prisma`)
   - Read the current schema structure
   - Understand dependencies (e.g., shared schemas like `parentSchema` used by multiple entities)

3. **Impact analysis - Search all layers:**
   
   **a. Validation Schemas (`lib/validation/`):**
   - Search for schema usage patterns
   - Identify schemas that extend or compose the affected schema
   - Check for type exports derived from schemas
   
   **b. tRPC Routers (`app/api/trpc/routers/`):**
   - Find procedures using the schema in `.input()` or `.output()`
   - Locate business logic handling the changed fields
   - Identify dead code that should be removed
   
   **c. Unit/Integration Tests (`*.test.ts`, `*.integration.test.ts`, `*/state-api-adapters/handlers/*`, `e2e/fixtures/state-api.ts`):**
   - Find tests exercising the changed schema behavior
   - Identify tests that will break or need updating
   - Check for success tests that should become error tests (or vice versa)
   
   **d. API Runtime Validation Tests (`tests/api-runtime-validation/`):**
   - Find schema validation tests for affected endpoints
   - Check REST API compliance tests
   
   **e. E2E Tests (`e2e/specs/*`):**
   - Find E2E specs testing affected endpoints
   - Identify State API tests for the entity
   
   **f. OpenAPI Specification (`docs/reference/openapi.yaml`):**
   - Find schema definitions in OpenAPI
   - Check request/response schemas for affected endpoints
   - Identify if new schema variants are needed (like `PageParent` vs `Parent`)
   
   **g. Documentation (`docs/specs/`, `docs/briefs/`, `CHANGELOG.md`):**
   - Find specs mentioning the changed behavior
   - Check for outdated documentation

4. **Generate impact report:**
   - Create a structured summary of all affected files
   - Categorize by: Schema Changes, Router Changes, Test Updates, OpenAPI Updates, Doc Updates
   - For each file, describe the specific change needed

5. **Propose new schemas (if needed):**
   - If the change requires entity-specific schema variants, propose the new schema
   - Follow existing patterns (e.g., `parentSchema` → `pageParentSchema`, `databaseParentSchema`)
   - Ensure backward compatibility considerations are documented

6. **Implementation (if approved):**
   - Apply schema changes first
   - Update routers (remove dead code, update logic)
   - Update tests (convert success→error tests, add new test cases)
   - Update OpenAPI specification
   - Update documentation
   - Run quality gates: `pnpm lint && pnpm typecheck && pnpm test`

7. **Summary:**
   - Files modified (grouped by category)
   - Schema changes applied
   - Tests updated/added
   - Documentation updated
   - Quality gate results

## Search Patterns

Use these grep patterns to find impacted code:

```bash
# Find schema usage in routers
grep -r "schemaName" app/api/trpc/routers/

# Find field usage across codebase
grep -r "field_name" --include="*.ts" --include="*.tsx"

# Find in tests
grep -r "field_name" --include="*.test.ts" --include="*.spec.ts"

# Find in OpenAPI
grep "field_name" docs/reference/openapi.yaml

# Find in documentation
grep -r "field_name" docs/
```

## TODO Composition

Create todos at task start:

1. `schema-gather` - "Gather schema change requirements"
2. `schema-locate` - "Locate primary schema definition and dependencies"
3. `schema-impact-validation` - "Analyze impact on validation schemas"
4. `schema-impact-routers` - "Analyze impact on tRPC routers"
5. `schema-impact-tests` - "Analyze impact on unit/integration tests"
6. `schema-impact-e2e` - "Analyze impact on E2E tests"
7. `schema-impact-openapi` - "Analyze impact on OpenAPI specification"
8. `schema-impact-docs` - "Analyze impact on documentation"
9. `schema-report` - "Generate comprehensive impact report"
10. `schema-implement` - "Implement changes (if approved)"
11. `schema-quality` - "Run quality gates and verify changes"
12. `schema-summary` - "Generate final summary"

Update status: Mark `in_progress` when starting each, `completed` when done.

## Example Scenarios

### Scenario 1: Remove field from input schema
- A field (e.g., `block_id`) should no longer be accepted
- Create entity-specific schema variant excluding the field
- Update routers to remove handling code
- Convert success tests to error tests
- Update OpenAPI with new schema variant

### Scenario 2: Add required field to schema
- Add field to Zod schema with validation
- Update routers to handle new field
- Add test coverage for new field
- Update OpenAPI schema
- Update documentation

### Scenario 3: Change field type or constraints
- Update Zod schema with new type/constraints
- Review router logic for compatibility
- Update tests with new valid/invalid values
- Update OpenAPI schema
- Document breaking change in CHANGELOG

## Quality Gates

- ✅ All impacted files identified
- ✅ Schema changes consistent across Zod, OpenAPI, and Prisma
- ✅ Tests updated (no false positives/negatives)
- ✅ OpenAPI spec matches implementation
- ✅ Documentation reflects new behavior
- ✅ `pnpm lint && pnpm typecheck && pnpm test` passes
