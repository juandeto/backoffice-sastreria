# ADR: Unified Management of Blocks and Coalitions in Parties Section

*   **Status:** Draft
*   **Author:** Archer (@architect)
*   **Stakeholders:** Data Analysts, Developers, Product Owners
*   **Date:** 2026-01-23

## Context and Problem Statement

The Congressional Index backoffice requires a systematic way to manage parliamentary groupings: **Blocks** (`block` table) and **Coalitions/Interbloques** (`block_coalition` table). These entities are fundamentally related as blocks often form part of larger coalitions. 

The current UI structure for the "Parties" section needs to accommodate CRUD operations for both entities and allow users to manage the relationship between them (i.e., which blocks belong to which coalition via `block_membership`).

## Decision Drivers

*   **UX Consistency:** Blocks and Coalitions are logically part of the "Political Parties/Groups" domain.
*   **Navigation Efficiency:** Users should be able to switch between managing individual blocks and their broader coalitions without leaving the section.
*   **Visual Hierarchy:** The relationship between a Coalition and its member Blocks should be easy to navigate and visualize.

## Considered Options

### Option 1: Unified Tabbed Interface in `/parties`

Use the `Tabs` component within the `DataTable` component at `src/app/(main)/(admin)/sections/parties/page.tsx`.

*   **Pros:**
    *   Single point of entry for all political group management.
    *   Consistent UX across related entities.
    *   Reduces sidebar/menu complexity.
*   **Cons:**
    *   The `DataTable` component becomes more complex as it must handle different data types and column definitions.
*   **Effort:** Medium.

### Option 2: Separate Top-Level Pages

Create separate menu items and pages for `/admin/blocks` and `/admin/coalitions`.

*   **Pros:**
    *   Simpler, isolated page logic.
    *   Direct URLs for each entity.
*   **Cons:**
    *   Fragmented user experience.
    *   Increased sidebar clutter.
*   **Effort:** Low.

## Decision Outcome

**Chosen Option: Option 1 (Unified Tabbed Interface)**

We will implement a tabbed interface where "Blocks" and "Interbloques" (Coalitions) are separate tabs within the same main section. This approach aligns with the "Colocate by domain" principle and provides a better experience for analysts who work with these entities simultaneously.

### Justification

The relationship between blocks and coalitions is tight enough that separating them into different top-level sections would hinder productivity. The `Tabs` pattern is already partially implemented in the codebase and provides a natural way to switch contexts while remaining within the same domain.

## Consequences

*   **Positive:** Improved discoverability and management of parliamentary groups.
*   **Positive:** Clearer mental model for users: "Go to Parties to manage all groups".
*   **Negative/Neutral:** Requires a clean abstraction in the `DataTable` to handle multiple schemas and tRPC procedures.

## Implementation

### 1. UI Structure
- Modify `src/app/(main)/(admin)/sections/parties/_components/data-table.tsx` to use tabs: "Bloques" and "Interbloques".
- Each tab will render a `DataTableNew` instance with its corresponding column definitions.

### 2. Management of Memberships
- In the "Interbloques" tab, the "Actions" column will include a "Ver más" (View more) option.
- This will navigate to a detail page (e.g., `/sections/parties/coalition/[id]`) where the user can see the coalition's metadata and a list of `block_membership` to add/remove blocks.

### 3. Data Fetching
- Use tRPC routers (`blocksRouter` and `blockCoalitionsRouter`) to fetch data for each tab.

## Validation

*   **Success Metrics:**
    *   Users can navigate between Blocks and Coalitions in under 2 clicks.
    *   CRUD operations are functional for both entities within their respective tabs.
    *   Successful management of block-to-coalition membership via the detail view.

## References

*   `PRODUCT.md`: Requirement for backoffice congressional data management.
*   `src/lib/db/schema.ts`: Database definitions for `block`, `block_coalition`, and `block_membership`.
