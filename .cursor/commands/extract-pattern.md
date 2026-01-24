# EXTRACT PATTERN Task

**Persona:** `@architect` (Archer, Principal Architect). Load `.rulesync/subagents/architect.md`.

## Objective

Find recurring patterns, document comprehensively, suggest rule file placement for standardization.

## Instructions

1. **Discovery:**
   - Ask: Pattern to extract? (e.g., "tRPC procedure error handling"), Where to look? (directories/file types/entire codebase), Standardize or document?

2. **Search instances:**
   - Use codebase search for all occurrences
   - Examine different implementations
   - Note variations and inconsistencies

3. **Analyze:**
   - For each instance: Core structure, common elements, variations and differences, best implementation

4. **Categorize:**
   - **Consistent:** Same way everywhere
   - **Inconsistent:** Variations (needs standardization)
   - **Outdated:** Old pattern coexisting with new (needs migration)
   - **Anti-pattern:** Should be avoided

5. **Document:**
   - Pattern Name, Purpose (what/when), Context (where/why), Implementation (Recommended Approach with code, Common Variations with code, Anti-patterns with code), Examples from Codebase (Good examples with file:line, Examples needing improvement), Related Patterns, Testing (how to test), Migration Guide (if standardizing)

6. **Statistics:**
   - Total instances, Consistent/Inconsistent/Outdated counts/percentages, Files analyzed

7. **Rule file placement:**
   - Recommend: Target rule domain (e.g., "unit testing", "code quality", "architecture"), Reasoning, Section to add to, Alternative rule domains if applicable

8. **Refactoring recommendations (if needed):**
   - Priority (High/Medium/Low), Impact, Files to update, Refactoring steps, Breaking changes, Estimated effort

9. **Code examples:**
   - Provide ready-to-use examples: Recommended Pattern with code, Real examples with file:line

10. **Next steps:**
    - Add pattern to recommended rule file?
    - Create refactoring task for inconsistencies?
    - Generate tests for pattern?
