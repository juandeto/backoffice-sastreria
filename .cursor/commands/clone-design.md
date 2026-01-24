# CLONE-DESIGN Task

## Core Principles

1. **Autonomous execution** - proceed through all phases systematically without waiting for user confirmation (except when login is required); make design and implementation decisions independently based on target analysis; work continuously until all phases are complete
2. **Respect scope** - check `PRODUCT.md` for out-of-scope items; skip them during cloning
3. **Explore exhaustively** - click and hover every element; discover all hidden UI (modals, menus, tooltips, hover-revealed actions)
4. **Document all states** - default, hover, active, focus, disabled, loading, error, open, closed, expanded, collapsed
5. **Progressive documentation** - write analysis files immediately as pages are discovered, not later
6. **Mirror URL structure exactly** - preserve target's route hierarchy including dynamic segments (e.g., `/[userId]/page-name`)
7. **Visual fidelity** - layout/structure must match exactly; small color/spacing discrepancies acceptable if target values are hard to extract
8. **Fonts** - exact match or closest free alternative (Google Fonts preferred)
9. **Cross-reference constantly** - compare local vs target during build, not just at the end
10. **Clone interactivity** - implement all behaviors with mock data, including hover-revealed actions
11. **Test everything** - verify all interactions; document failures and continue
12. **Snapshot-first** - always capture page state before any interaction
13. **Color mode support** - capture both modes; functional toggle; use semantic color aliases
14. **Facsimile at root** - cloned UI at `app/`; mirror target's route hierarchy exactly
15. **Relocate existing** - move pre-existing `page.tsx` to `app/_docs/` before building
16. **No server start** - never start the dev server yourself; verify it's running, fix errors first
17. **Ignore accessibility** - do not spend time on ARIA, screen readers, or a11y concerns
18. **Done = nothing left to fix** - a phase is complete when multiple review passes reveal nothing further to create or fix
19. **Unlimited time authorized** - never cancel TODOs or skip work due to concerns about time; unlimited time is authorized to complete this exercise thoroughly and completely
20. **No summary documents** - do not create summary documents, reports, or phase completion summaries at the end of each phase; proceed directly to the next phase upon completion

## Tech Stack

**Component Strategy (in priority order):**

1. Extend existing shadcn/ui components (`components/ui/`) with CVA variants
2. Use existing libraries already in the project (check `package.json`)
3. Use Radix UI primitives if shadcn is missing functionality
4. Create new component only if nothing suitable exists

**Styling:**

- Tailwind CSS for all styling
- CVA for component variants
- **Both light and dark mode** - see Color Mode Strategy section

**State & Interactivity:**

- React useState/useReducer for local state (no external state management)
- `useMemo` for derived state (filtered/sorted lists)
- Drag-and-drop: `@dnd-kit/core` if in project, otherwise native HTML5 drag

**Stories:** Colocated with components using `{ComponentName}.stories.tsx` naming. **Every UI component MUST have a story file - no exceptions.**

**Icons/Assets:**

- Copy SVG icons directly from target where possible (inspect element → copy SVG)
- If SVG is unavailable or complex, use [Lucide](https://lucide.dev/) as fallback
- Store custom SVGs in `components/icons/` as React components
- For placeholder images: use `placeholder.com`, `picsum.photos`, or similar services

**Mock Data:**

- Store in `lib/mock-data/{domain}.ts` (e.g., `lib/mock-data/users.ts`, `lib/mock-data/posts.ts`)
- Copy realistic data shapes from what you observe in the target
- Include TypeScript interfaces matching observed data structures
- Generate 5-20 items per collection for realistic feel
- **Document empty/error/loading states** when discovered in target - these must be cloned too

## Deliverables

**IMPORTANT:** These are the ONLY artifacts to create. Do not create additional documentation, reports, or summary files beyond this list.

| Deliverable            | Location                                | Description                                                                                                                                                                                                 |
| ---------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitives             | `components/primitives/`                | Atomic building blocks: buttons, inputs, badges, icons, typography, checkboxes, switches, selects, textareas, etc. These are the fundamental UI elements that are composed together to form `compositions`. |
| Compositions           | `components/compositions/`              | Combined units: sidebars, headers, modals, cards, forms. These are built by composing multiple `primitives` together.                                                                                       |
| Custom Icons           | `components/icons/`                     | SVG icons copied from target as React components                                                                                                                                                            |
| Storybook Stories      | `components/**/*.stories.tsx`           | **REQUIRED for ALL UI components, no exceptions**                                                                                                                                                           |
| Facsimile Routes       | `app/`                                  | Mirror target URL structure at application root                                                                                                                                                             |
| Existing Pages         | `app/_docs/`                            | Pre-existing page.tsx files relocated here                                                                                                                                                                  |
| Mock Data              | `lib/mock-data/`                        | TypeScript files with interfaces and realistic mock data                                                                                                                                                    |
| Analysis Checklist     | `docs/design/analysis-checklist.md`     | Target URL, page discovery, completion status                                                                                                                                                               |
| Architectural Analysis | `docs/design/architectural-patterns.md` | Shared systems, core components, page differentiation                                                                                                                                                       |
| Page Graph             | `docs/design/page-graph.md`             | Graph of discovered pages, static vs dynamic routes, navigation flow                                                                                                                                        |
| Page Analysis          | `docs/design/pages/{page-id}.md`        | Detailed per-page findings (created progressively during recon)                                                                                                                                             |

**Naming Convention for `{page-id}`:**

- Static routes: use path without leading slash (`/dashboard` → `dashboard`)
- Dynamic routes: preserve brackets (`/[userId]` → `[userId]`, `/[workspaceId]/settings` → `[workspaceId]-settings`)
- This keeps it obvious which routes are dynamic vs static

### Pages vs Panels/Modals

**Pages** = Have their own URL route (e.g., `/settings`, `/dashboard`)
**Panels/Modals** = Overlay UI that opens on the current page (no URL change)

- **Pages** → Create as `app/{route}/page.tsx`
- **Panels/Modals** → Create as compositions (e.g., `SettingsModal.tsx`, `SearchPanel.tsx`)
- **Trigger** → Wire button to open the panel/modal (useState for visibility)

If clicking "Settings" in sidebar opens a modal (URL doesn't change), clone it as a composition, not a route.

### Component Placement Rules

- **DO:** Place new components in `components/primitives/` or `components/compositions/`
  - **Primitives** (`components/primitives/`): Atomic UI building blocks like buttons, inputs, badges, icons, typography, checkboxes, switches, selects, textareas, tooltips, etc. These are the fundamental elements that get composed together.
  - **Compositions** (`components/compositions/`): Combined components built from primitives, such as sidebars, headers, modals, cards, forms, navigation menus, etc.
- **DO:** Remove or update existing components to match the cloned design
- **DO:** Keep `components/ui/` for shadcn/ui base components (extend these with CVA variants)
- **DO NOT:** Create target-specific subfolders (e.g., `components/{target-name}/`)
- **DO NOT:** Nest primitives inside compositions folders or vice versa
- **DO NOT:** Leave orphaned components that are no longer used

### Relocation Rules

When preparing for the facsimile:

| Move to `app/_docs/`         | Modify in place (DO NOT move)       |
| ---------------------------- | ----------------------------------- |
| `app/page.tsx`               | `app/layout.tsx` → update for clone |
| `app/[param]/page.tsx` files | `app/globals.css` → update styles   |
| `app/{feature}/page.tsx`     | `app/api/` → leave untouched        |
| Any other `page.tsx` files   |                                     |

**Key distinction:** Only move `page.tsx` files. Layout files (`layout.tsx`) should be modified to fit the cloned application's design (fonts, global structure, providers).

## Element Tagging

Tag interactive and significant elements for traceability:

```
data-ui-id="{page}-{section}-{component}-{instance}"
```

Examples:

- `data-ui-id="dashboard-sidebar-nav-link-1"`
- `data-ui-id="settings-form-input-email"`
- `data-ui-id="header-user-menu-avatar"`

**Note:** This is separate from `data-testid` used for testing. Both can coexist.

## Hidden UI Discovery

Click and hover every element. Skip only external links and third-party embeds.

**CRITICAL: Multi-Level Exploration**

- **Nested menus:** Click through ALL levels of nested menus (e.g., Settings → Preferences → Appearance → Theme)
- **Multi-level dialogs:** If a dialog opens another dialog, explore that too
- **Settings paths:** Navigate through ENTIRE deep settings paths, documenting each level
- **Popovers within popovers:** If a popover contains triggers for other popovers, explore those
- **Form wizards:** Complete entire multi-step flows and document each step
- **Breadcrumb navigation:** Follow breadcrumb trails to understand full navigation hierarchy

### Hidden UI Types

| UI Type         | How to trigger                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modals/Dialogs  | Click buttons labeled "New", "Create", "Edit", etc. **Explore ALL tabs/sections within dialogs. MANDATORY: Catalog ALL modal links to other pages - document every link that navigates away from the modal.** |
| Dropdowns       | Click elements with chevrons, carets, arrows **Click through nested dropdown items. MANDATORY: Catalog ALL dropdown links to other pages - document every link that navigates to a different page.**          |
| Context menus   | Right-click on items, rows, cards **Explore nested context menu items**                                                                                                                                       |
| Tooltips        | Hover over icons, truncated text, info indicators                                                                                                                                                             |
| Popovers        | Click user avatars, info icons, "more" buttons **Explore nested popovers. MANDATORY: Catalog ALL popover links to other pages - document every link that navigates to a different page.**                     |
| Drawers/Panels  | Click hamburger menus, settings icons, sidebars **Navigate through all drawer sections**                                                                                                                      |
| Accordions      | Click section headers, expandable rows **Expand all accordion sections**                                                                                                                                      |
| Tabs            | Click all tab labels to reveal tab content **Explore nested tabs**                                                                                                                                            |
| Hover cards     | Hover over links, usernames, previews                                                                                                                                                                         |
| Expand/collapse | Click "+", "−", "Show more", "See all" elements                                                                                                                                                               |
| Nested menus    | Hover/click menu items that have sub-items **Click through ALL nested levels**                                                                                                                                |
| Toast/Snackbar  | Trigger actions that show notifications                                                                                                                                                                       |
| Command palette | Try Cmd+K, Ctrl+K, "/" keyboard shortcuts **Explore all command categories**                                                                                                                                  |
| Hover actions   | Hover list items, rows, cards, blocks to reveal action buttons                                                                                                                                                |
| Settings paths  | Navigate Settings → [all sub-sections] → [all options] **MANDATORY: ALL settings must be explored and replicated. Document complete multi-level paths, every category, subcategory, and option.**             |

### Hover Action Discovery

Many applications hide action buttons until hover. Hover every list item, row, card, block, and tree node:

1. **Note what appears:** action buttons, drag handles, "⋯" menus, checkboxes, quick actions
2. **Click revealed actions** to discover what they trigger
3. **Document:** background change, action positions, icon styles, spacing
4. **Test both color modes** - hover states often differ

## Interactive Behaviors

Clone functional behaviors with mock data (5-20 items, TypeScript interfaces, local state only):

| Behavior       | Implementation                                      |
| -------------- | --------------------------------------------------- |
| Sorting        | Clickable headers, asc/desc toggle, indicator (▲/▼) |
| Filtering      | Real-time updates via `useMemo`                     |
| Search         | Debounced input, text match filter                  |
| Reordering     | Drag handles, drag-and-drop, persist in state       |
| Pagination     | Page controls, slice data                           |
| Selection      | Checkboxes, "select all", tracked state             |
| Inline editing | Click-to-edit, save/cancel flow                     |
| Toggle states  | Switches/checkboxes update state                    |
| Bulk actions   | Apply to selection, confirm if destructive          |

## Color Mode Strategy

### Discovery

1. **Find toggle:** Look for sun/moon icons, "Theme", "Appearance" in settings, header, or sidebar
2. **Capture both modes:** Screenshot target in light mode AND dark mode
3. **Extract colors:** Use browser dev tools to get exact hex values for both modes
4. **Document:** Record all colors in analysis checklist

### Implementation

**Color Aliases in `globals.css` (Tailwind v4):**

```css
@import "tailwindcss";

/* Enable class-based dark mode (instead of prefers-color-scheme) */
@custom-variant dark (&:where(.dark, .dark *));

/* Theme tokens - creates utilities AND CSS variables */
/* Light mode values defined here */
@theme {
  /* Typography */
  --font-body: "Inter", sans-serif;

  /* Spacing */
  --spacing-sidebar: 240px;
  --radius-default: 0.5rem;

  /* Colors - light mode defaults */
  --color-surface: #ffffff;
  --color-surface-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted: #9ca3af;
  --color-border: #e5e7eb;
  --color-accent: /* target brand color */;
}

:root {
  color-scheme: light;
}

/* Dark mode - override the @theme CSS variables */
.dark {
  color-scheme: dark;

  --color-surface: #111827;
  --color-surface-secondary: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #6b7280;
  --color-border: #374151;
  --color-accent: /* target brand color dark */;
}
```

**Toggle dark mode:**

```tsx
// Add/remove .dark class on <html> element
document.documentElement.classList.toggle("dark", isDark);
```

**Usage in components:**

```tsx
// Colors auto-switch based on .dark class - no dark: prefix needed!
<div className="bg-surface text-text-primary border-border">
  Content
</div>

// Use dark: ONLY for mode-specific overrides outside the shared palette
<div className="bg-surface-secondary text-text-muted dark:opacity-80">
  Secondary content with dark-mode-specific opacity
</div>
```

> **Key:** `@theme` creates CSS variables that `.dark` can override. Use utilities directly: `bg-surface`, `text-text-primary`.

### Color Mode Toggle Component

If target has a toggle, implement it as a primitive:

```tsx
// components/primitives/ColorModeToggle.tsx
"use client";
import { useEffect, useState, useRef } from "react";

export function ColorModeToggle() {
  // Initialize state from localStorage/prefers-color-scheme immediately
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("color-mode");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Track if this is the initial mount to avoid overwriting localStorage
  const isInitialMount = useRef(true);

  // Apply class on mount and when isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    // Only write to localStorage when user explicitly toggles (not on initial mount)
    if (!isInitialMount.current) {
      localStorage.setItem("color-mode", isDark ? "dark" : "light");
    }
    isInitialMount.current = false;
  }, [isDark]);

  return (
    <button onClick={() => setIsDark(!isDark)} aria-label="Toggle color mode">
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### Usage Rules

| DO                                                     | DON'T                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| `bg-surface` `text-primary` `border-border`            | `bg-white dark:bg-gray-900`                 |
| Extract exact colors from target via dev tools         | Guess or approximate colors                 |
| Match target's toggle behavior (icon, position, style) | Use generic toggle if target has custom one |

## Rich Text Editor Discovery

Many applications include rich text editing capabilities. Document these thoroughly:

### Editor Detection

1. **Identify editor presence:** Look for contenteditable regions, text formatting toolbars, or slash command triggers
2. **Test formatting capabilities:** Try keyboard shortcuts (Cmd+B, Cmd+I, Cmd+U, Cmd+K) and observe results
3. **Select text to reveal floating toolbar:** Many editors show a bubble menu on text selection with formatting options
4. **Document block types:** What content blocks can be inserted? (headings, lists, code, images, embeds, etc)
5. **Note inline formatting:** Bold, italic, underline, strikethrough, code, links, mentions, highlights
6. **Check special features:** Slash commands, @ mentions, drag-to-reorder, nested content

### Floating Toolbar / Bubble Menu Detection

Select text in the editor and observe:

1. **Does a floating toolbar appear?** Note position (above/below selection)
2. **What actions are available?** Document all buttons/options in the toolbar
3. **Toolbar behavior:**
   - Does it follow the selection as you extend it?
   - Does it disappear when clicking outside?
   - Are there nested menus (e.g., "Turn into" dropdown)?
4. **Screenshot the toolbar** for reference during implementation

### Editor Capability Checklist

Document in `docs/design/architectural-patterns.md` under "Primary Editor/Canvas":

```markdown
### Rich Text Capabilities

**Inline Formatting:**

- [ ] Bold (Cmd+B)
- [ ] Italic (Cmd+I)
- [ ] Underline (Cmd+U)
- [ ] Strikethrough
- [ ] Inline code
- [ ] Links (Cmd+K)
- [ ] Highlights/colors
- [ ] Mentions (@user, @page, @date)

**Block Types:**

- [ ] Paragraph
- [ ] Heading 1/2/3
- [ ] Bulleted list
- [ ] Numbered list
- [ ] To-do / checkbox
- [ ] Quote / blockquote
- [ ] Code block (with language)
- [ ] Divider / horizontal rule
- [ ] Callout / alert
- [ ] Toggle / collapsible
- [ ] Image
- [ ] Embed (video, iframe)
- [ ] Table

**Editor Features:**

- [ ] Slash command menu (/)
- [ ] Floating toolbar on text selection (bubble menu)
- [ ] Block drag-and-drop reordering
- [ ] Nested blocks (indentation)
- [ ] Placeholder text
- [ ] Markdown shortcuts (e.g., # for heading, - for bullet)
- [ ] Paste handling (plain text, rich text, URLs)

**Floating Toolbar Actions (if present):**

- [ ] Bold/Italic/Underline toggles
- [ ] Link insertion
- [ ] Text color/highlight
- [ ] Turn into (block type conversion)
- [ ] Comment/mention
- [ ] AI assist or other custom actions
```

### Implementation with TipTap

Use [TipTap](https://tiptap.dev/) to replicate rich text editing:

**Required packages:**

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm
```

**Common extensions based on capabilities detected:**

| Capability       | TipTap Extension                                              |
| ---------------- | ------------------------------------------------------------- |
| Bold/Italic/etc. | `@tiptap/starter-kit` (included)                              |
| Links            | `@tiptap/extension-link`                                      |
| Placeholder      | `@tiptap/extension-placeholder`                               |
| Task lists       | `@tiptap/extension-task-list` + `@tiptap/extension-task-item` |
| Code blocks      | `@tiptap/extension-code-block-lowlight`                       |
| Images           | `@tiptap/extension-image`                                     |
| Tables           | `@tiptap/extension-table`                                     |
| Mentions         | `@tiptap/extension-mention`                                   |
| Highlights       | `@tiptap/extension-highlight`                                 |
| Floating toolbar | `@tiptap/react` → `BubbleMenu` component (on text selection)  |
| Empty line menu  | `@tiptap/react` → `FloatingMenu` component (on empty lines)   |
| Slash commands   | Custom extension (see TipTap docs for suggestions)            |

**TipTap documentation:** https://tiptap.dev/docs

**Basic TipTap setup:**

```tsx
"use client";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });

  if (!editor) return null;

  return (
    <>
      {/* Floating toolbar on text selection */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex gap-1 rounded-lg bg-surface p-1 shadow-lg border">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Italic
          </button>
          {/* Add more formatting buttons as needed */}
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} className="prose" />
    </>
  );
}
```

**For floating menus (appears on empty lines):**

```tsx
import { FloatingMenu } from "@tiptap/react";

<FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
  <div className="floating-menu">{/* Block type insertion buttons */}</div>
</FloatingMenu>;
```

**Key implementation notes:**

- TipTap outputs JSON or HTML; use JSON for structured content
- `BubbleMenu` appears on text selection; `FloatingMenu` appears on empty lines
- Style the editor container and content with Tailwind's `prose` class or custom styles
- Create custom extensions for app-specific features (slash commands, custom blocks)
- Match the target's toolbar/bubble menu behavior if present
- For dropdowns inside BubbleMenu, use portal containers to prevent focus issues
- See [TipTap docs on custom menus](https://tiptap.dev/docs/editor/getting-started/style-editor/custom-menus) for advanced patterns

## Edge Cases

| Scenario           | Action                                                                         |
| ------------------ | ------------------------------------------------------------------------------ |
| Login required     | Prompt user ONCE to log in manually, wait for confirmation                     |
| Async/lazy content | Wait for load, scroll to trigger lazy elements                                 |
| Canvas/WebGL/SVG   | Screenshot for reference, implement visual representation based on screenshots |
| Third-party embeds | Skip entirely (maps, videos, ads)                                              |
| Complex animations | Implement static version that captures the visual state; proceed autonomously  |
| Licensed fonts     | Use closest free alternative, document substitution                            |
| Existing component | Remove or update to match cloned design                                        |
| Keyboard shortcuts | Test common shortcuts (Cmd+K, Esc, Enter) for hidden UI                        |
| System pref only   | Respect prefers-color-scheme if no toggle exists                               |

## Browser Interaction Protocol

Always capture page state before interacting. Screenshots should be taken for reference during analysis, but are not required to be saved to the local application.

1. Navigate to page
2. Capture state (REQUIRED before any interaction)
3. Take screenshot for reference (not saved locally)
4. Interact: click, hover, type, press keys
5. Capture result state
6. Take screenshot of new state for reference (not saved locally)

---

## Workflow Resume Strategy

If the workflow is interrupted (context ends, browser crashes, etc.), resume by:

1. Read `docs/design/analysis-checklist.md` - contains target URL, link discovery queue status, and completion status
2. **Check link discovery queue** - if Phase 1 was interrupted:
   - Review "Link Discovery Queue Status" section to see individually listed pending vs explored static links
   - **Each static link must be individually mentioned** with full path, source, and status
   - Resume recursive link discovery from the "Pending Links" list
   - Continue until "Pending Links" section is empty before proceeding to next phase
3. Check TODO items for incomplete work
4. Review `docs/design/pages/` to see which pages have been analyzed
5. **Verify prior phases are actually complete:**
   - Spot check documentation files to ensure they contain actual content, not just stubs
   - Verify built components exist and match the documented analysis
   - Check that routes documented in the page graph are actually implemented
   - **Verify "Pending Links" section in analysis checklist is empty** if claiming Phase 1 is complete
   - **Verify all static links are individually listed** in "Explored Links" with full path, source, and analysis file reference
   - If any prior work is incomplete or missing, complete it before resuming the interrupted phase
6. Continue from the last incomplete phase/step

The analysis checklist serves as the persistent state for this workflow. **Do not trust documentation alone - verify actual implementation exists and is complete before proceeding.**

---

## Phase 1: Deep Reconnaissance & Analysis

**Goal:** Discover ALL major pages, understand the application's purpose, identify architectural patterns, AND perform comprehensive deep analysis of each page during initial discovery.

**CRITICAL:** This phase combines discovery and deep analysis into a single pass. For each page discovered, complete ALL documentation (visible UI, hidden UI, states, behaviors, screenshots) BEFORE moving to the next page. Do not defer deep analysis to a later phase.

**What is a "major page"?** All unique page routes including settings, admin, and user-facing pages. Excludes modals/overlays that don't change the URL (those are documented as compositions).

**Target URL:** The target URL is provided during command invocation. Persist it in `docs/design/analysis-checklist.md` immediately for workflow resumption.

### 1.1 Context Gathering

Before exploring the UI, understand what you're cloning:

1. **Persist target URL** in `docs/design/analysis-checklist.md` (for workflow resumption)
2. Read `PRODUCT.md` and note any features/pages explicitly marked out of scope
3. **Web search** to understand the target application:
   - What problem does this application solve?
   - What are the primary user workflows?
   - What terminology and mental models does it use?
   - Are there tutorials, docs, or reviews that explain how it works?
4. Document findings in `docs/design/architectural-patterns.md` (see template below)

### 1.2 Page Discovery & Deep Analysis

**CRITICAL WORKFLOW:** Navigate systematically through the entire application. For EACH page discovered, perform COMPLETE deep analysis immediately (visible UI, hidden UI, interactive behaviors, all states, color modes) before moving to the next page.

**This phase does NOT conclude until ALL major pages have been discovered AND deeply analyzed.**

**RECURSIVE LINK DISCOVERY:** Maintain a queue of internal links to explore. As each page/UI is visited, extract ALL internal links (from navigation, modals, dropdowns, popovers, header, footer, page content) and add them to the queue. Continue exploring until the queue is empty. Exclude:

- External links (different domain)
- Dynamic/templated routes that require parameters (e.g., `/in/[username]`, `/messaging/thread/[id]`, `/company/12345`) - **document the route pattern** (e.g., `/in/[username]`) in the page graph as a dynamic route, but don't attempt to visit specific instances without real data
- Third-party embeds
- Out-of-scope routes per `PRODUCT.md`
- Links requiring authentication/permissions you don't have (document the route pattern instead)

**Identifying Dynamic Routes:** A route is dynamic if:

- The URL contains user-generated identifiers (usernames, IDs, slugs)
- The same page template is reused with different data (e.g., all user profiles use `/in/[username]`)
- You see a pattern like `/resource/123`, `/resource/456` pointing to similar content structures
- Document the pattern once (e.g., `/resource/[id]`), don't follow every instance

**Links Discovery Queue Management:**

- Start with the target URL as the first item
- After analyzing each page/UI, extract all internal static links and add new ones to the queue
- Mark links as "explored" after completing their deep analysis
- Continue until no new static links remain

6. Navigate to target URL
7. Capture page structure
8. If login required → prompt user ONCE, wait for them to complete, then capture again
9. Initialize links queue with target URL

10. **For EACH page/link in the queue, perform COMPLETE analysis before proceeding:**

    **CRITICAL: Triple Review Requirement**

- Each page MUST be reviewed **3 separate times** to ensure ALL interactive elements are captured
- Each review pass should approach the page from a different angle:
  - **Pass 1:** Systematic top-to-bottom, left-to-right scan
  - **Pass 2:** Focus on hover states, hidden actions, empty states, error states, loading states
  - **Pass 3:** Deep dive into nested menus, multi-level dialogs, and settings paths
- Document findings from each pass in `docs/design/pages/{page-id}.md`

**a) Initial Documentation:**

- Take screenshot for reference (not saved locally)
- Create `docs/design/pages/{page-id}.md` with URL, purpose, initial observations
- Update `docs/design/analysis-checklist.md` to add this page
- Update `docs/design/page-graph.md` with page node and navigation relationships

**b) Classify Architecture:**

- Does this page use a shared editor/canvas?
- What global shell components are present? (sidebar, header, etc.)
- What's unique to this page vs shared with others?

**c) Document Visible UI:**

- Layout structure (grid, flex, positioning)
- All visible components (mark as `shared` or `page-specific`)
- All interactive elements (buttons, links, inputs)
- Typography, spacing, colors (extract exact values via dev tools)

**d) Discover ALL Hidden UI (Pass 1 - Systematic):**

- Click every button, dropdown trigger, section header, tab
- Right-click items for context menus
- Hover every list item, row, card, block for tooltips and action buttons
- Try Cmd+K, Ctrl+K, "/", Esc keyboard shortcuts
- Click revealed actions to see what they trigger
- Screenshot each modal/overlay for reference (not saved locally)

**d2) Deep Multi-Level UI Exploration (Pass 2 & 3):**

- **Multi-level menus:** Click through ALL nested menu levels (e.g., Settings → Preferences → Appearance → Theme)
- **Popovers:** Click every popover trigger, explore all options within each popover
- **Dialogs:** Open every dialog, click through all tabs/sections within dialogs
- **Settings paths - MANDATORY EXPLORATION:**
  - **ALL settings must be explored and replicated** - no settings section can be skipped
  - If settings experience is multiple levels deep, navigate through the ENTIRE path:
    - Click every option, toggle, input, and button at each level
    - Screenshot each level and state for reference (not saved locally)
    - Document the complete navigation path in the analysis file
  - **Every settings category, subcategory, and option must be documented** - create a comprehensive settings inventory
  - Test all settings toggles, inputs, dropdowns, and save/cancel behaviors
  - Document default values, validation rules, and any dependencies between settings
- **Links to other pages - MANDATORY CATALOGUING & RECURSIVE DISCOVERY:**
  - **ALL links to other pages from modals, dropdowns, popovers, navigation, header, footer, and page content must be considered, catalogued, AND added to the discovery queue for individual followup**
  - For each UI element containing links that navigate to other pages, document AND add to queue:
    - **Modals/Dialogs:** The modal/dialog name and trigger, all links within that navigate to other pages
    - **Dropdowns:** The dropdown name/trigger, all menu items that are links to other pages
    - **Popovers:** The popover trigger, all links within that navigate to other pages
    - **Navigation:** All navigation links (sidebar, main nav, breadcrumbs)
    - **Header:** All header links (logo, nav items, user menu items)
    - **Footer:** All footer links (footer navigation, footer menus)
    - **Page Content:** All internal links within the page body/content area
    - For each link, document:
      - The link text/label
      - The destination page/route
      - Whether the link opens in the same tab, new tab, or replaces the current context
      - Any conditions or states that affect the link (e.g., logged-in vs logged-out)
    - **Add to discovery queue in analysis checklist:** If the link is:
      - Internal (same domain)
      - Static (not a dynamic/templated route requiring parameters)
      - Not already explored or in queue
      - Not out-of-scope per `PRODUCT.md`
      - **Then individually add it** to `docs/design/analysis-checklist.md` "Pending Links" section with:
        - Full path (e.g., `/settings/privacy`)
        - Source page (e.g., found on `/settings` in sidebar navigation)
        - Status: pending (until analysis complete)
    - Screenshot each UI element showing the links for reference (not saved locally)
  - Create a dedicated section in `docs/design/pages/{page-id}.md` titled "Links to Other Pages" with subsections for:
    - Modal Links
    - Dropdown Links
    - Popover Links
    - Navigation Links
    - Header Links
    - Footer Links
    - Page Content Links
  - Update `docs/design/page-graph.md` to show navigation relationships from all UI elements to pages
- **Nested overlays:** If opening a dialog reveals another dialog/menu, explore that too
- **Breadcrumbs/navigation:** Follow breadcrumb trails and back buttons to understand full navigation flow
- **Form wizards:** If multi-step forms exist, complete the entire flow and document each step

**e) Document Interactive Behaviors:**

- Sorting, filtering, search, pagination, selection, drag-and-drop
- Test each interaction and document how it works
- Note any animations or transitions

**f) Capture Both Color Modes:**

- Screenshot light mode for reference (not saved locally)
- Screenshot dark mode for reference (not saved locally)
- Document color differences in analysis file

**g) Document All States:**

- Default, hover, active, focus, disabled, loading, error
- Screenshot states as needed for reference (not saved locally)
- Note responsive breakpoints (inspect CSS for media queries)

**h) Finalize Page Analysis:**

- Update `docs/design/pages/{page-id}.md` with complete findings from all 3 review passes
- Mark as `shared` vs `page-specific` components
- Document all multi-level navigation paths discovered
- **Include "Links to Other Pages" section** cataloguing all links from modals, dropdowns, popovers, navigation, header, footer, and page content (with subsections for each type)
- **Include "Settings Inventory" section** if this page contains settings (list all categories, subcategories, and options)
- **Extract and queue all internal static links discovered:**
  - For each link, determine if it's static (can be visited as-is) or templated (requires dynamic parameters)
  - **Every static link must be individually added to `docs/design/analysis-checklist.md` in the "Link Discovery Queue Status" section with:**
    - Full URL/path
    - Source (which page/UI element it was found on)
    - Status (pending/explored)
  - Templated routes are documented as patterns only (e.g., `/in/[username]`)
- Mark this page/link as "explored" in the analysis checklist
- **ONLY AFTER completing a-h with all 3 review passes, proceed to next link in the discovery queue**

11. **Continue recursive discovery:** Process each link in the "Pending Links" section of analysis checklist
    - **For each link in "Pending Links":** Navigate to it and perform complete analysis (steps 10a-h)
    - **As each page is analyzed:**
      - Extract all internal static links and individually add new ones to "Pending Links" section (with full path and source)
      - Move the completed link from "Pending Links" to "Explored Links" with ✅ status and reference to analysis file
    - **Continue until "Pending Links" section is empty:** All internal static links must be individually listed, followed, and analyzed
    - **Each link must be individually mentioned** in the checklist - no summarizing or grouping

12. **Verify completeness:** Review sidebar/header/footer navigation, settings menus, tabs, and discovery queue in analysis checklist
    - **Discovery queue "Pending Links" section must be empty** - all internal static links individually listed and followed
    - **Every static link must be individually mentioned** in the analysis checklist with source, path, and status
    - Count pages in `docs/design/pages/` - matches all links in "Explored Links" section?
    - Verify templated routes are documented as patterns (not individually followed)
    - **If "Pending Links" section has items remaining, return to step 11**
    - **If manually noticed static links are missing from checklist, add them individually to "Pending Links" and return to step 11**

13. Determine root behavior: does `/` show content or redirect?

14. **Finalize page graph:** Verify `docs/design/page-graph.md` completeness
    - **Check `docs/design/analysis-checklist.md` - "Pending Links" section must be empty** - all internal static links individually listed and followed recursively
    - All pages discovered via recursive link following shown in Mermaid diagram with static (blue) and dynamic (orange) color coding
    - All navigation relationships documented (including links from modals, dropdowns, popovers, page content)
    - Route classification list (static vs dynamic)
    - **If "Pending Links" section in analysis checklist has items, return to step 11 to continue recursive discovery**
    - **If any static links or pages are missing from individual listing in analysis checklist, add them individually to "Pending Links" and return to step 11**

### 1.3 Architectural Pattern Analysis

**Critical:** Before proceeding to Phase 2, identify what's **shared** across all discovered pages:

**Architectural Pattern Discovery:**

Before building, identify what makes pages **similar** vs **different**:

### Shared Core Systems

Most applications have a **shared core** that appears across all pages. Identify:

| Pattern             | Examples                                | Questions to Answer                                                        |
| ------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| **Editor/Canvas**   | Block editor, rich text, drawing canvas | Is there a unified editing experience? What content types does it support? |
| **Shell/Chrome**    | Sidebar, header, navigation             | What layout wraps all pages? What's persistent vs page-specific?           |
| **Data Display**    | Tables, lists, cards, grids             | Is there a consistent way data is rendered?                                |
| **Modals/Overlays** | Settings, search, pickers               | What global overlays exist across all pages?                               |

### Page Differentiation

Pages typically differ only in **content and configuration**, not structure:

- **Same editor, different content** - e.g., document apps where each page uses the same block editor
- **Same layout, different data** - e.g., dashboards where each view shows different metrics
- **Same components, different composition** - e.g., settings pages with varying form fields

15. Compare 3+ pages and answer:
    - What components appear on **every** page? (shell, navigation, global modals)
    - What's the **core editing/viewing experience**? (block editor, form builder, canvas, etc.)
    - How do pages **differ**? (only content? different layouts? different feature sets?)
    - Are there **content types** that reuse the same renderer with different data?

16. Create `docs/design/architectural-patterns.md`:

```markdown
# Architectural Patterns

Target: {url}
Analyzed: {date}

## Application Purpose

{1-2 sentences describing what this application does and who uses it}

## Page Structure

See `docs/design/page-graph.md` for complete page graph showing static vs dynamic routes and navigation flow.

## Core Systems (shared across all pages)

### Shell/Chrome

- Sidebar: {description}
- Header: {description}
- Navigation pattern: {description}

### Primary Editor/Canvas

- Type: {block editor | rich text | form builder | canvas | data grid | none}
- Library recommendation: {TipTap for rich text | other}
- Capabilities: {list key features}
- Used on: {which pages/routes}

### Rich Text Capabilities (if applicable)

- Inline formatting: {bold, italic, links, mentions, etc.}
- Block types: {headings, lists, code, images, etc.}
- Special features: {slash commands, drag reorder, nested blocks, etc.}

### Global Overlays

- {Modal/Drawer name}: {trigger and purpose}

## Page Differentiation

| Page Type | What's Unique | What's Shared |
| --------- | ------------- | ------------- |
| {type}    | {differences} | {shared core} |

## Content Types

| Content Type | Renderer Used | Example Pages |
| ------------ | ------------- | ------------- |
| {type}       | {component}   | {pages}       |

## Key Insight

{1-2 sentences summarizing the architectural pattern, e.g., "All pages use the same block-based editor with different content. The sidebar, header, and modal system are global. Only the page content differs."}
```

17. Create `docs/design/analysis-checklist.md` with sections for:
    - **Target URL** (persisted for workflow resumption)
    - **Link Discovery Queue Status** - EVERY static link must be individually listed with:
      - **Pending Links** (not yet explored):
        - `/path/to/page` - found on [source page] in [UI element type]
        - `/another/path` - found on [source page] in [UI element type]
      - **Explored Links** (analysis complete):
        - `/explored/path` - ✅ analyzed, see `docs/design/pages/{page-id}.md`
      - **Templated Routes** (documented patterns only, not individually visited):
        - `/in/[username]` - user profile route pattern
        - `/company/[id]` - company page route pattern
      - **Total Count Summary** (X pending, Y explored, Z templated patterns)

      **Example format:**

      ```markdown
      ## Link Discovery Queue Status

      ### Pending Links (0)

      <!-- All pending links explored -->

      ### Explored Links (5)

      - `/feed` - ✅ analyzed, see `docs/design/pages/feed.md` (found on homepage in main navigation)
      - `/settings` - ✅ analyzed, see `docs/design/pages/settings.md` (found on `/feed` in user dropdown menu)
      - `/settings/privacy` - ✅ analyzed, see `docs/design/pages/settings-privacy.md` (found on `/settings` in sidebar navigation)
      - `/notifications` - ✅ analyzed, see `docs/design/pages/notifications.md` (found on `/feed` in header)
      - `/jobs` - ✅ analyzed, see `docs/design/pages/jobs.md` (found on `/feed` in footer links)

      ### Templated Routes (2 patterns)

      - `/in/[username]` - user profile route pattern (examples: `/in/johnsmith`, `/in/janedoe`)
      - `/company/[id]` - company page route pattern (examples: `/company/12345`)

      ### Total Count Summary

      - Pending: 0
      - Explored: 5
      - Templated Patterns: 2
      ```

    - Route structure, out-of-scope items, shared systems
    - Pages discovered (checklist format with recursive discovery lineage)
    - Components detected, global elements
    - **Responsive breakpoints** (note any media queries or responsive classes observed in HTML/CSS)
    - Color mode analysis (toggle location, colors for both modes)
    - Hidden/interactive UI discovery checklists
    - Rich text editor capabilities (if detected)
    - Interaction testing checklist (for Phase 4)

18. **FINAL VALIDATION:** Verify page count matches, all sections represented
    - **If missing pages, return to step 10**

19. Create TODO items for deep analysis of each page and modal/drawer (skip out-of-scope)

20. **CRITICAL CHECKPOINT:** Only proceed to Phase 2 after:
    - ✅ **Link discovery queue "Pending Links" section is EMPTY** - all internal static links individually listed, recursively followed, and analyzed
    - ✅ **EVERY static link individually mentioned** in `docs/design/analysis-checklist.md` with full path, source, and exploration status
    - ✅ ALL major pages discovered via recursive link discovery
    - ✅ **EACH page reviewed 3 separate times** (systematic scan, hover/hidden actions, multi-level exploration)
    - ✅ ALL major pages have COMPLETE deep analysis files (`docs/design/pages/{page-id}.md`) with findings from all 3 review passes
    - ✅ ALL hidden UI discovered and documented for each page (including nested menus, multi-level dialogs, popovers)
    - ✅ **ALL multi-level UI paths fully explored** (settings paths, nested dialogs, form wizards, breadcrumb navigation)
    - ✅ **ALL settings explored and documented** - every category, subcategory, option, toggle, and input catalogued
    - ✅ **ALL links to other pages individually catalogued in analysis checklist and followed** - every static link from modals, dropdowns, popovers, navigation, header, footer, and page content documented with full path, source, and status
    - ✅ ALL interactive behaviors tested and documented for each page
    - ✅ `docs/design/page-graph.md` created with page structure graph (static vs dynamic routes, navigation flow, all UI element-to-page links)
    - ✅ `docs/design/analysis-checklist.md` updated with individual listing of all static links from recursive discovery (pending section empty, explored section complete)
    - ✅ `docs/design/architectural-patterns.md` created with shared systems identified

**If any of the above is incomplete, continue Phase 1 deep reconnaissance until complete. Do not proceed to Phase 2 until ALL items are complete - implement missing documentation, individually list all static links in analysis checklist, discover missing pages via recursive link discovery, and complete all analysis before moving forward.**

---

## Phase 2: Build

**⚠️ BEFORE STARTING:** Re-read `.rulesync/commands/clone-design.md` to refresh on all instructions and standards.

### 2.1 Setup (steps 1-5)

1. Review `docs/design/architectural-patterns.md` to prioritize build order
2. Consolidate component inventory from all page analyses, categorizing:
   - **Core systems** (shared across all pages) - build first
   - **Page-specific components** - build after core systems
3. **Relocate existing content:**
   - Move page routes from `app/` to `app/_docs/` per relocation rules above
   - Update any internal links in moved files to reflect new paths
4. **Create root redirect (if needed):**
   - If target's `/` redirects, create `app/page.tsx`:
     ```tsx
     import { redirect } from "next/navigation";
     export default function Home() {
       redirect("/{target-default-path}");
     }
     ```
5. **Configure placeholder image domains:**
   - Add any placeholder image domains used (e.g., `placeholder.com`, `picsum.photos`, `i.pravatar.cc`) to `next.config.js` under `images.remotePatterns`:
     ```js
     images: {
       remotePatterns: [
         {
           protocol: "https",
           hostname: "placeholder.com",
           pathname: "/**",
         },
         // Add other placeholder domains as needed
       ],
     },
     ```
6. Create TODO items for each component to build (including a Storybook story)

### 2.2 Build Core Systems First (steps 6-9)

**Build order matters:** Shared systems before page-specific components.

**Priority 1 - Shell/Chrome:**

6. Build the application shell (sidebar, header, layout wrapper)
7. Build global modals/overlays (search, settings, etc.)
   - **CRITICAL:** If settings or other experiences are multi-level deep (e.g., Settings → Preferences → Appearance → Theme), implement the ENTIRE navigation path
   - **MANDATORY:** ALL settings discovered in Phase 1 must be replicated - every category, subcategory, option, toggle, and input
   - **MANDATORY:** ALL links to other pages catalogued in Phase 1 must be implemented - ensure modals, dropdowns, popovers, navigation, header, and footer can navigate to their documented destination pages
   - Build nested dialogs, multi-level menus, and popover hierarchies as discovered in Phase 1
   - Ensure all documented multi-level paths from Phase 1 are fully implemented

**Priority 2 - Primary Editor/Canvas:**

8. If the application has a shared editor/canvas (block editor, rich text, form builder, etc.), build it as a reusable composition
9. The editor should accept content as props, not hardcode specific page content

**For rich text editors, use TipTap:**

- Install: `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm` + capability-specific extensions
- Use `BubbleMenu` (text selection) and `FloatingMenu` (empty lines) as needed
- See Rich Text Editor Discovery section and https://tiptap.dev/docs

### 2.3 Build Components (steps 10-13)

**Placement rules:**

- **Primitives** → `components/primitives/{ComponentName}.tsx` - Atomic building blocks (buttons, inputs, badges, icons, typography, checkboxes, switches, selects, textareas, tooltips, etc.) that are composed to form compositions
- **Compositions** → `components/compositions/{ComponentName}.tsx` - Combined components built from primitives (sidebars, headers, modals, cards, forms, etc.)
- Stories → colocated as `{ComponentName}.stories.tsx` (both primitives and compositions)
- **NO target-specific subfolders**

10. For each component TODO:
    - Check if similar exists in `components/` → extend with variants if so
    - Otherwise create in appropriate folder:
      - **Primitives** (`components/primitives/`): buttons, inputs, badges, icons, typography, checkboxes, switches, selects, textareas, tooltips, and other atomic UI elements
      - **Compositions** (`components/compositions/`): sidebars, headers, modals, cards, forms, and other combined components
    - Use CVA for variants
    - **Create colocated Storybook story file (`{ComponentName}.stories.tsx`) - MANDATORY, no exceptions**
11. Build primitives first (buttons, inputs, badges, icons, checkboxes, switches, selects, textareas, tooltips, etc.) - these are the atomic units that compose into larger components
12. Build compositions second (they may depend on primitives) - these combine multiple primitives together
13. **Set up color aliases and toggle** (see Color Mode Strategy section above for implementation)

### 2.4 Build Routes (steps 14-20)

**Key insight:** If pages share a core editor/canvas, routes should be thin wrappers that pass different content to the same components.

**For each route, complete fully before moving to next:**

**Before testing routes:** Verify dev server is running and responding. If it is not running, ask the user to start it. If server returns errors, fix build errors before proceeding.

14. Create route file at `app/{path}/page.tsx` mirroring target URL structure (replicate dynamic path segments as needed, remove or relocate existing routes that would conflict with the new structure)
15. **Compose from shared systems:**
    - Use the shell/layout built in 2.2
    - Use the shared editor/canvas if applicable
    - Only add page-specific components where truly needed
16. Import components, add `data-ui-id` tags to important sections of the UI
17. **Generate mock data:**
    - Create files in `lib/mock-data/{domain}.ts`
    - Create TypeScript interfaces matching data shapes observed
    - Copy realistic data from target where visible
    - Generate 5-20 items per collection
    - Use placeholder.com or picsum.photos for images (ensure these domains are configured in `next.config.js` `images.remotePatterns` - see step 2.1.5)
    - **Include empty/error/loading states if discovered in target**
18. **Implement interactive behaviors** (per Interactive Behaviors section above)
19. **Verify against target:**
    - Open local at `localhost:3000/{path}` and screenshot
    - Open target and screenshot
    - Compare: layout, spacing, colors, typography, sizing
    - Test interactivity: click sort headers, type in filters, drag items
    - Fix discrepancies until layout/structure and behaviors match
20. Mark route complete, proceed to next route

21. **TODO: Verify Page Graph Completeness**
    - Review `docs/design/page-graph.md` and ensure every noted page or route has been implemented
    - Check all static routes (blue nodes) are implemented at `app/{path}/page.tsx`
    - Check all dynamic routes (orange nodes) are implemented at `app/{path}/page.tsx` with proper dynamic segments
    - **CRITICAL:** Verify ALL settings subroutes are implemented (e.g., `/settings`, `/settings/preferences`, `/settings/preferences/appearance`, `/settings/preferences/appearance/theme`, etc.)
    - Cross-reference with `docs/design/analysis-checklist.md` to ensure no pages were missed
    - **If any pages/routes are missing, implement them before proceeding to Phase 3** - do not skip missing routes, build them completely following steps 14-20 above

**After ALL routes complete AND page graph verification passes → Proceed immediately to Phase 3 (do not create summary documents)**

---

## Phase 3: Review & Interaction Testing

**⚠️ BEFORE STARTING:** Re-read `.rulesync/commands/clone-design.md` to refresh on all instructions and standards.

**Goal:** Verify all interactions function. Fix bugs immediately when found.

**Local URL:** For all interaction testing, use `localhost:3000` as the base URL (e.g., `localhost:3000/{path}`).

**Bug Fixing Policy:** During interaction testing, any bugs found must be fixed immediately before moving on to the next test or page. Do not accumulate bugs to fix later - fix them as they are discovered.

### 3.1 Visual Comparison

1. Compare each page: local snapshot vs target snapshot; load the target live URL and compare as well
2. Fix discrepancies immediately
3. **Verify ALL components have story files** - check `components/primitives/`, `components/compositions/`, `components/icons/` for missing `*.stories.tsx` files. **If any story files are missing, create them before proceeding** - do not skip missing stories, implement them completely following the Storybook story requirements.

### 3.2 Interaction Testing

Test per Interaction Testing Checklist in `docs/design/analysis-checklist.md`:

- Navigate to local page at `localhost:3000/{path}`, screenshot, hover all items to reveal actions
- Test all interactions (navigation, modals, forms, sorting, filtering, etc.)
- **When bugs are found:** Fix them immediately before continuing to the next test
- Screenshot discrepancies (target vs local), fix until resolved
- Only proceed to next test/page after all bugs for current test/page are fixed

### 3.3 Final Walkthrough

Navigate entire app from root via UI only (test both color modes). Fix any bugs found immediately before proceeding.

**Proceed to Phase 4 only after all bugs discovered during interaction testing have been fixed (do not create summary documents).**

---

## Phase 4: Design Polish

**⚠️ BEFORE STARTING:** Re-read `.rulesync/commands/clone-design.md` to refresh on all instructions and standards.

**Goal:** Align visual details with target. Compare side-by-side and refine.

### 4.1 Detail Comparison

For each page:

1. Open local and target side-by-side (or alternating screenshots)
2. Compare and fix:

| Category        | Details to Check                                   |
| --------------- | -------------------------------------------------- |
| **Spacing**     | Margins, padding, gaps between elements            |
| **Typography**  | Font size, weight, line-height, letter-spacing     |
| **Alignment**   | Text alignment, element centering, vertical rhythm |
| **Colors**      | Exact hex values, opacity, gradients               |
| **Borders**     | Width, radius, style, color                        |
| **Shadows**     | Box-shadow values, blur, spread                    |
| **Sizing**      | Width, height, min/max constraints                 |
| **Transitions** | Duration, easing, properties animated              |
| **Animations**  | Keyframes, timing, triggers                        |
| **Icons**       | Size, stroke width, alignment                      |
| **Color Mode**  | Both modes match target exactly                    |

### 4.2 Polish Workflow

3. Use browser dev tools to inspect target values
4. Update Tailwind classes or CSS variables to match
5. Verify hover/focus/active state styling matches
6. Check responsive breakpoints if applicable

### 4.3 Acceptance

7. Final side-by-side: differences should be imperceptible at normal viewing distance

**Proceed to Phase 5 (do not create summary documents)**

---

## Phase 5: Update Documentation/Demo Pages

**⚠️ BEFORE STARTING:** Re-read `.rulesync/commands/clone-design.md` to refresh on all instructions and standards.

**Goal:** Update any pre-existing documentation or demo pages to use the new component system.

**Note:** If starting from scratch with no pre-existing pages, skip this phase.

1. Review all pages in `app/_docs/`
2. For each documentation/demo page:
   - Identify components it uses from old `components/` structure
   - Replace with equivalent new primitives/compositions
   - Update imports to reference `components/primitives/` or `components/compositions/`
   - Update to use the new color mode system (semantic color aliases)
   - Test that page still renders correctly
3. Remove any orphaned old components no longer in use
4. Verify `app/_docs/` pages function with new component library and styling system
   - **If any pages fail to render or have errors, fix them before proceeding** - update components, imports, and styling until all `app/_docs/` pages function correctly

**Proceed to Phase 6 (do not create summary documents)**

---

## Phase 6: Final Review & Verification

**⚠️ BEFORE STARTING:** Re-read `.rulesync/commands/clone-design.md` to refresh on all instructions and standards.

**Goal:** Verify ALL deliverables are complete and implement anything missing.

### 6.1 Deliverable Verification Checklist

**For each deliverable below, verify it exists and meets requirements. If missing or incomplete, implement immediately.**

1. **Primitives (`components/primitives/`):**
   - [ ] Verify all atomic UI elements exist (buttons, inputs, badges, icons, typography, checkboxes, switches, selects, textareas, tooltips, etc.)
   - [ ] Check each primitive has a colocated `.stories.tsx` file
   - [ ] Verify primitives use CVA for variants where applicable
   - [ ] Test in Storybook (if available)
   - **If missing:** Build missing primitives from target analysis

2. **Compositions (`components/compositions/`):**
   - [ ] Verify all combined components exist (sidebars, headers, modals, cards, forms, navigation menus, etc.)
   - [ ] Check each composition has a colocated `.stories.tsx` file
   - [ ] Verify compositions are built from primitives (not standalone)
   - [ ] Test in Storybook (if available)
   - **If missing:** Build missing compositions from target analysis

3. **Custom Icons (`components/icons/`):**
   - [ ] Verify all custom SVG icons from target are present as React components
   - [ ] Check icons have a colocated `.stories.tsx` file
   - [ ] Verify icons are properly exported
   - **If missing:** Extract SVGs from target or use Lucide alternatives

4. **Storybook Stories (`components/**/*.stories.tsx`):**
   - [ ] **CRITICAL:** Verify EVERY component has a story file - NO EXCEPTIONS
   - [ ] List all components without stories
   - [ ] Create missing story files immediately
   - **If missing:** Create story for every component without one

5. **Facsimile Routes (`app/`):**
   - [ ] Verify all routes from `docs/design/page-graph.md` are implemented
   - [ ] Check static routes: `/feed`, `/mynetwork/grow/`, `/mynetwork/catch-up/all/`, `/jobs/`, `/notifications/`
   - [ ] Check dynamic routes: `/messaging/thread/[threadId]`, `/in/[username]`
   - [ ] Verify settings routes: `/mypreferences/d/dark-mode` and all categories
   - [ ] Test each route loads without errors
   - [ ] Find all anchor or next.js Links in the created pages and implement any routes that are missing
   - **If missing:** Build missing routes per page analysis files

6. **Existing Pages (`app/_docs/`):**
   - [ ] Verify pre-existing `page.tsx` files have been moved here
   - [ ] Check internal links updated to reflect new paths
   - [ ] Verify pages still render correctly
   - **If missing:** Move any remaining old pages to `_docs/`

7. **Mock Data (`lib/mock-data/`):**
   - [ ] Verify mock data files exist for each domain (users, posts, jobs, messages, notifications, invitations)
   - [ ] Check TypeScript interfaces match observed data structures
   - [ ] Verify 5-20 items per collection
   - [ ] Check empty/error/loading states included where documented
   - **If missing:** Create missing mock data files with realistic data

8. **Analysis Checklist (`docs/design/analysis-checklist.md`):**
   - [ ] Verify file exists and is complete
   - [ ] Check target URL is documented
   - [ ] Verify all pages discovered are listed
   - [ ] Check completion status is accurate
   - [ ] Verify color mode analysis is complete
   - **If missing:** Update with missing information

9. **Architectural Analysis (`docs/design/architectural-patterns.md`):**
   - [ ] Verify file exists and is complete
   - [ ] Check shared systems are documented
   - [ ] Verify core components identified
   - [ ] Check page differentiation is clear
   - [ ] Verify color mode details are present
   - **If missing:** Update with missing patterns

10. **Page Graph (`docs/design/page-graph.md`):**
    - [ ] Verify file exists and is complete
    - [ ] Check Mermaid diagram shows all pages
    - [ ] Verify static vs dynamic routes are color-coded
    - [ ] Check navigation relationships are documented
    - [ ] Verify route classification list is complete
    - **If missing:** Update with missing pages/routes

11. **Page Analysis Files (`docs/design/pages/{page-id}.md`):**
    - [ ] Verify analysis file exists for EACH major page
    - [ ] Check all 3 passes are documented (systematic scan, hover states, multi-level exploration)
    - [ ] Verify Pass 2 findings (hover states, hidden UI) are complete
    - [ ] Verify Pass 3 findings (multi-level exploration, nested menus) are complete
    - [ ] Check color mode details are documented
    - **If missing:** Create or update missing page analysis files

### 6.2 Implementation Gaps

**After verification, if ANY deliverables are missing or incomplete:**

1. Create TODO items for each gap
2. Implement missing deliverables immediately
3. Re-verify all deliverables are complete
4. Run all static checks like typechecking, linting, etc (see github action workflow files for common checks) and resolve any issues that arise before finishing the workflow

---

Do not return control to the user until **ALL** to-dos and phases have been completed. Always check `docs/design/analysis-checklist.md` to verify what has been completed and keep working until the entire list is complete.
