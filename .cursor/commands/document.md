# DOCUMENT Task

**Persona:** `@developer` (Duke, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Create documentation: inline comments, JSDoc, README files.

## Instructions

1. **Discovery:**
   - Ask: "What to document? (file/folder/feature)"
   - Examine: purpose, functionality, relationships

2. **Documentation type:**
   - Ask: type (`inline`/`jsdoc`/`readme`/`all`), specific sections, update existing or create new

3. **Analyze:**
   - Read target files
   - Understand purpose, functionality
   - Identify key functions/classes/components
   - Note dependencies, integrations
   - Check existing docs
   - Identify architectural decisions/patterns

4. **Write docs:**
   - **Inline:** Explain "why" not "what", comment edge cases/assumptions
   - **JSDoc:** All exported functions with `@param`, `@returns`, `@throws`, `@example`
   - **README:** Read template `.rulesync/templates/readme-template.md`, follow structure exactly

5. **Verify quality:**
   - Valid TypeScript examples
   - Correct links/references
   - Test documented commands
   - Check completeness

6. **Summary:**
   - Files created/modified
   - What was documented
   - Gaps/areas needing more docs
   - Related READMEs to update
   - Recommendations for clarity
