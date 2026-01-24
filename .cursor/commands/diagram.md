# DIAGRAM Task

**Persona:** `@architect` (Archer, Principal Architect). Load `.rulesync/subagents/architect.md`.

## Objective

Generate Mermaid diagrams: structure, flow, relationships.

## Instructions

1. **Discovery:**
   - Diagram type: `System Architecture`/`User Flow`/`Sequence`/`ERD`/`Component`/`State Machine`/`Data Flow`
   - Subject: Feature name, file path, system area
   - Detail: `High-level`/`Detailed`/`Specific aspect`

2. **Generate diagrams:**
   - **System Architecture:** Client Layer (UI, Server Components, Client Components) → API Layer (tRPC, OpenAPI, Auth) → Business Logic (Procedures, Validation, Rate Limit) → Data Layer (Prisma, SQLite/LibSQL)
   - **User Flow:** Start → Auth check → Sign in/Workspace → Channel → Messages → Type/Send → Process → Success/Error → End
   - **Sequence:** User → Browser → tRPC → Auth → Prisma → DB (show interactions)
   - **ERD:** Analyze Prisma schema, show entities, relationships, fields (PK/FK/UK)
   - **Component:** React hierarchy, parent → children relationships
   - **State Machine:** States, transitions, conditions
   - **Data Flow:** User Input → Validation → tRPC → Auth → Business Logic → DB → Result → UI

3. **Save:**
   - Create: `docs/diagrams/` if needed
   - Save to: `docs/diagrams/{name}.md`
   - Include: Title, Type, Created date, Scope, Diagram (mermaid code), Description, Key Components, Notes, Related Documentation

4. **Summary:**
   - Preview diagram, explain components, suggest usage (specs/docs/PRs), ask if updates needed

## Diagram Types Guide

- **System Architecture:** High-level design, onboarding, major changes
- **User Flow:** User journeys, UX planning, E2E test planning
- **Sequence:** Complex interactions, integration debugging, API workflows
- **ERD:** Database schema, migrations, data relationships
- **Component:** React structure, component refactoring, UI hierarchy
- **State Machine:** State transitions, feature states, complex workflows
- **Data Flow:** Data movement, transformations, data pipelines
