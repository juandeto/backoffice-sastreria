# EXPLAIN Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Explain how file/folder/feature works. Break down logic, explain decisions, trace flows, optionally suggest improvements.

## Instructions

1. **Discovery:**
   - Ask: "What to explain? (file/folder/feature)"
   - Examine code and context

2. **Scope:**
   - Ask: detail level (`high-level`/`detailed`/`deep-dive`), suggest improvements?, specific aspects? (data flow, error handling, performance, security)

3. **Analyze:**
   - Read target files
   - Understand purpose, functionality
   - Trace execution flow, data transformations
   - Identify dependencies, integrations
   - Note error handling, edge cases
   - Recognize architectural patterns
   - Check related files (README, tests, types)

4. **Structured explanation:**
   - **Files:** Purpose/context, imports/dependencies, main logic step-by-step, edge cases/error handling/security, non-obvious code/debt
   - **Folders/Modules:** Purpose/responsibility, structure/organization, entry points/public API, usage patterns
   - **Features:** User perspective, implementation across files (frontend→backend→database), data flow, integration points/business logic

5. **Language:**
   - High-level → details
   - Analogies/examples when helpful
   - Define technical terms
   - Break complex logic into chunks
   - Mermaid diagrams for complex flows
   - Highlight "why" behind decisions

6. **Improvements (if requested):**
   - Analyze using project standards: code quality, performance, security, architecture
   - Format: Priority (High/Medium/Low), Category, Current vs Suggested, Benefits/trade-offs, Effort estimate

7. **Summary:**
   - Recap main points
   - Highlight takeaways
   - Top priority suggestions if provided
   - Offer deeper dive
   - Ask: "Explain specific part in detail or help implement improvements?"
