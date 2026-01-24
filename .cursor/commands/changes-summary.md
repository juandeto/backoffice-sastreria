# CHANGES-SUMMARY Task

**Persona:** `@developer` (Devin, Staff Engineer). Load `.rulesync/subagents/developer.md`.

## Objective

Generate a summary report of changes since a specified time, with emphasis on new endpoints and technical infrastructure. Includes GitHub attribution for all changes.

## Instructions

1. **Discovery:**
   - Check if `CHANGELOG.md` exists and read most recent date entry
   - Calculate smart time range:
     - If today is Monday: From Friday 1:00pm ET to today 1:00pm ET (includes weekend)
     - If today is a weekday (Tue-Fri): From previous day 1:00pm ET to today 1:00pm ET (24 hours)
     - If today is weekend: From Friday 1:00pm ET to today 1:00pm ET
   - Ask: "Since when? (default: calculated smart range, format: 'YYYY-MM-DD HH:MM' or relative like 'yesterday 12:00')"
   - If not specified, use calculated smart range
   - Note: All times are in ET (America/New_York timezone)

2. **Analyze Git History:**
   - Run: `git log --since="{time}" --oneline --all`
   - Run: `git log --since="{time}" --name-status --pretty=format:"%h %s (%an, %ar)"`
   - Extract commit authors and GitHub usernames from commit messages and email addresses
   - Map commits to features (endpoints, infrastructure, tests, etc.)

3. **Categorize Changes (in this order):**
   - **Recently Proposed/Finalized ADRs** (optional): Any ADRs proposed or finalized in the time period, including DRAFT ADRs in active feature branches
   - **Additions to API Endpoints:** Group by API (Pages, Blocks, Users, etc.), include % completion counter for remaining API endpoint stubs
   - **Technical Infrastructure:** E2E tests, utilities, workflows, commands, seed scripts
   - **Notable Implementation Details:** Key points about implementations
   - **Test Infrastructure:** Integration tests, test helpers
   - **Documentation:** ADRs, specs, briefs

4. **Extract Details:**
   - For each endpoint: HTTP method, path, key features, validation, error handling
   - Calculate API endpoint completion percentage: Count total endpoints from OpenAPI spec, exclude Auth API (out of scope) and Comments API (deprioritized) per PRODUCT.md, count implemented endpoints, calculate percentage (implemented/total)
   - For infrastructure: Purpose, location, usage, dependencies
   - For tests: Count, coverage, status (active/skipped/placeholder)
   - For ADRs: Check both dev branch and active feature branches (`git branch -r --no-merged dev`) for DRAFT ADRs in `docs/decisions/`

5. **Check Implementation Status:**
   - Verify endpoints are actually implemented (not placeholders)
   - Check if implementations exist in feature branches vs dev branch
   - Note any reverts or unmerged work
   - Distinguish between implemented vs placeholder endpoints

6. **Generate Report:**
   - Use template structure (see below)
   - Include GitHub usernames for all contributions
   - **CHANGES_SUMMARY.md format:** Slack-compatible markdown. Use `_text_` for italics (section labels). No headings (##, ###, etc.). Very brief summaries, sacrificing grammar for brevity. Include link to CHANGELOG.md for detailed information.
   - **CHANGELOG.md format:** Standard markdown. Use appropriate heading levels (## for main sections, ### for subsections, #### for API groups)
   - Save to: `CHANGES_SUMMARY.md` in project root (temporary file)
   - Also append to `CHANGELOG.md` in project root with date header
   - If `CHANGELOG.md` doesn't exist, create it with header
   - **GitHub URLs for Slack sharing:** When generating CHANGES_SUMMARY.md, convert all file paths to full GitHub URLs:
     - Files: `https://github.com/{org}/{repo}/blob/{branch}/{path}`
     - Directories: `https://github.com/{org}/{repo}/tree/{branch}/{path}`
     - URL-encode special characters (e.g., `[` → `%5B`, `]` → `%5D`)

7. **Report Structure:**

   **For CHANGES_SUMMARY.md (temporary file - Slack-compatible format):**

   ```
   _Summary of Changes Since {time}_

   _Recently Proposed ADRs_ (if any)
   - [DRAFT-adr-name.md](https://github.com/{org}/{repo}/blob/{branch}/docs/decisions/DRAFT-adr-name.md) - Brief description (@username)

   _API Endpoints_ ({X}/{Y} implemented - {Z}%)

   Note: Auth (4) and Comments (3) excluded per PRODUCT.md scope.

   - _Pages API_ ({X}/{Y} - {Z}%): `GET /pages/{id}`, `POST /pages` (@username)
   - _Users API_ ({X}/{Y} - {Z}%): `GET /users` (@username)
   - _Remaining stubs_: {count} endpoints (Databases, Files, Search, Data Sources)

   _Technical Infrastructure_
   - E2E tests for blocks ([e2e/specs/blocks/](https://github.com/{org}/{repo}/tree/{branch}/e2e/specs/blocks)) (@username)
   - Workspace seeding ([prisma/seed.ts](https://github.com/{org}/{repo}/blob/{branch}/prisma/seed.ts)) (@username)

   _Notable Details_
   - Pages API: Full CRUD with workspace scoping
   - Blocks API: Complete impl in feature branch

   See [CHANGELOG.md](https://github.com/{org}/{repo}/blob/{branch}/CHANGELOG.md) for detailed information.
   ```

   **For CHANGELOG.md (appended entry - detailed format):**

   ```
   ## YYYY-MM-DD

   ### Summary of Changes Since {start_time} ET to {end_time} ET

   #### Recently Proposed ADRs

   ##### [DRAFT-adr-name.md](docs/decisions/DRAFT-adr-name.md) (@username)
   - **Status:** Proposed (DRAFT) - on dev branch
   - **Category:** Process/Tooling
   - **Summary:** Full description

   ##### [DRAFT-feature-adr.md](docs/decisions/DRAFT-feature-adr.md) (@username)
   - **Status:** Proposed (DRAFT) - branch: `feature/branch-name`
   - **Category:** API Implementation
   - **Summary:** Description of feature ADR in active branch

   #### Additions to API Endpoints

   **API Endpoint Completion: {X}/{Y} implemented ({Z}%)**

   ##### Pages API ({X}/{Y} implemented - {Z}%)
   - **`GET /pages/{page_id}`** - Retrieve a page by UUID with all relations (created_by, last_edited_by) (@username)
   - **`POST /pages`** - Create a new page with support for all parent types (@username)

   ##### Remaining API Endpoint Stubs ({count} endpoints - {Z}%)
   - **Databases API** (0/4): getDatabase, updateDatabase, createDatabase, queryDatabase
   - **Files API** (0/5): createFileUpload, listFileUploads, getFileUpload, sendFileUpload, completeFileUpload
   - **Search API** (0/1): search
   - **Data Sources API** (0/6): createDataSource, getDataSource, updateDataSource, updateDataSourceProperties, queryDataSource, listDataSourceTemplates

   Note: Auth API (4 endpoints) and Comments API (3 endpoints) excluded from calculation per PRODUCT.md (out of scope / deprioritized).

   #### Technical Infrastructure

   ##### 1. E2E Test Infrastructure for Blocks (@username)
   - Comprehensive E2E test suite for block endpoints
   - Test files: [`e2e/specs/blocks/get-block.spec.ts`](e2e/specs/blocks/get-block.spec.ts)
   - Helper utilities: [`e2e/helpers/block-types.ts`](e2e/helpers/block-types.ts)

   #### Notable Implementation Details

   - **Pages API**: Full CRUD operations with workspace scoping, parent validation, and Notion-style URL generation. Implementation in [`app/api/trpc/routers/pages.ts`](app/api/trpc/routers/pages.ts).
   - **Users API**: Workspace-scoped filtering ensures users are only returned if they're members of the configured workspace.

   All endpoints include OpenAPI metadata, Zod validation, and error handling per project standards.
   ```

8. **Attribution:**
   - Extract GitHub usernames from commit author emails (format: `{id}+{username}@users.noreply.github.com` → `@username`)
   - For commits without GitHub email, use name or infer from commit context
   - Include attribution in parentheses: `(@username)` after each item

9. **Validation:**
   - Verify all endpoints mentioned actually exist in codebase
   - Check if endpoints are implemented or placeholders
   - Note branch status if implementations exist elsewhere
   - Include warnings about unmerged work if applicable

10. **CHANGELOG.md Integration:**
    - Read existing `CHANGELOG.md` if present
    - Parse most recent date entry (format: `## YYYY-MM-DD`)
    - Check if entry for today's date already exists
    - If today's entry exists: Ask user if they want to overwrite or append
    - Calculate date for new entry (today's date in YYYY-MM-DD format, ET timezone)
    - Append new entry to `CHANGELOG.md`:
      - Format: `## YYYY-MM-DD` as heading (level 2 heading for date)
      - Include full summary content with appropriate heading levels (## for main sections, ### for subsections)
      - Add separator line (`---`) before entry if not first entry
      - Append at end of file (chronological order, newest at bottom)
    - If `CHANGELOG.md` doesn't exist:
      - Create with header: `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n`
      - Add first entry with today's date

11. **Time Range Calculation Logic:**
    - Get current date/time in ET timezone (America/New_York)
    - Determine day of week:
      - **Monday (1)**: Start = Friday 1:00pm ET (includes full weekend: Fri 1pm → Mon 1pm = 72 hours)
      - **Tuesday-Friday (2-5)**: Start = Previous day 1:00pm ET (24 hours: e.g., Wed 1pm → Thu 1pm)
      - **Saturday-Sunday (6-7)**: Start = Friday 1:00pm ET (includes weekend: Fri 1pm → Sat/Sun 1pm)
    - End = Today 1:00pm ET
    - Convert to UTC for git log queries (git uses UTC)
    - Format for display: Show ET times in summary
    - Example: If today is Monday Nov 27, 2025 at 2pm ET:
      - Start: Friday Nov 24, 2025 1:00pm ET
      - End: Monday Nov 27, 2025 1:00pm ET
      - Git query: `--since="2025-11-24 18:00:00"` (1pm ET = 6pm UTC, accounting for EST/EDT)

12. **Summary:**
    - Provide concise summary of what changed
    - Highlight most significant additions
    - Note any pending merges or incomplete work
    - Show time range used
    - Ask: "Review the report? Modify anything?"

## Key Rules

- **Section ordering** - ADRs (optional) → API endpoints (with completion %) → Technical infrastructure → Notable implementation details → Other sections (tests, docs)
- **CHANGES_SUMMARY.md format** - Slack-compatible: Use `_text_` for italics (section labels), no headings (##, ###, etc.). Very brief summaries, sacrificing grammar for brevity. All file links must be full GitHub URLs. Include link to CHANGELOG.md for detailed information.
- **CHANGELOG.md format** - Standard markdown: Use `## YYYY-MM-DD` as date heading (level 2), then `###` for main sections, `####` for subsections, `#####` for API groups. Detailed format with full descriptions. Relative file paths are acceptable.
- **API completion percentage** - Calculate and display: Count total endpoints from OpenAPI spec, **exclude Auth API (4 endpoints, out of scope) and Comments API (3 endpoints, deprioritized) per PRODUCT.md**, count implemented endpoints, show percentage (implemented/total) and breakdown by API group
- **ADRs from active branches** - Check `git branch -r --no-merged dev` for unmerged branches, then `git diff dev...origin/{branch} --name-only -- "docs/decisions/*.md"` for DRAFT ADRs. Include branch name in status.
- **Always include attribution** - Every feature/endpoint must have GitHub username
- **Verify implementations** - Check actual code, not just commit messages
- **Note branch status** - Mention if work exists in feature branches
- **Be concise** - Focus on what's useful for the team
- **Group logically** - Endpoints by API, infrastructure by type
- **Time ranges** - Always show ET timezone in summaries, convert to UTC for git queries
- **Weekend handling** - Monday entries include Friday-Sunday work automatically
- **File references** - CHANGES_SUMMARY.md (Slack): Full GitHub URLs `[filename](https://github.com/{org}/{repo}/blob/{branch}/path/to/file)`. CHANGELOG.md: Relative paths `[filename](path/to/file)`. URL-encode special characters in paths (e.g., `[...path]` → `%5B...path%5D`).
