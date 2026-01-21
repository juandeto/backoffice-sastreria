# Base Development Proposal

## Congressional Index – Data Backoffice Platform for Parliamentary Behavior Analysis

**Client:** La Sastrería  
**Development Period:** Through mid / late February  
**Version:** Initial Draft  

---

## 1. Executive Summary

This proposal describes the development of a **data backoffice platform** designed to support the analysis of parliamentary behavior in relation to the governing coalition. The platform is conceived as an internal system for **structured data ingestion, management, and political modeling**, serving as the foundational layer for analytical products and public-facing applications built on top of it.

The primary objective of the backoffice is to enable the systematic recording of legislators, bills, votes, and governing coalition preferences, and to provide a consistent analytical logic for interpreting legislative behavior beyond a binary vote classification.

This proposal represents a **base development phase**, with scope defined through mid/late February, intended to establish a robust, extensible, and reusable data architecture for current and future iterations of the Congressional Index.

---

## 2. Project Objectives

### General Objective

To develop a backoffice platform that enables the structured ingestion, management, and analysis of parliamentary data, supporting the construction of political metrics that capture legislators’ behavior in relation to the governing coalition over time.

### Specific Objectives

- Provide tools for the structured registration of legislators, bills, and votes.
- Model governing coalition preferences per vote as explicit, ordered political strategies.
- Enable the interpretation of absences and abstentions as politically meaningful behaviors.
- Generate consistent, reusable alignment metrics derived from voting data.
- Establish a scalable data foundation for future analytical layers and visual platforms.

---

## 3. Scope of the Backoffice Platform

The platform is designed as an **internal data management and analysis system**, without public-facing visualizations. Its purpose is to define, validate, and persist the data and analytical rules that underpin all downstream outputs.

The backoffice provides interfaces and workflows for data entry, editing, validation, and metric computation, ensuring data consistency and analytical traceability.

---

## 4. Core Data Model and Management Logic

### 4.1 Legislators

The system allows the registration and management of legislators as core entities.

Each legislator record includes:

- Unique identifier.
- Personal and institutional metadata.
- Chamber affiliation.
- Political block or caucus.
- Territorial representation.
- Mandate periods and status.

Legislator records are designed to support longitudinal analysis across multiple legislative periods.

---

### 4.2 Bills and Legislative Initiatives

Bills and legislative initiatives are managed as independent entities.

Each bill includes:

- Unique identifier.
- Title and descriptive metadata.
- Legislative chamber(s) involved.
- Relevant dates.
- Status and classification attributes.

Bills serve as the contextual anchor for one or more recorded votes.

---

### 4.3 Vote Records

Each vote constitutes a central analytical unit in the system.

For every vote, the backoffice records:

- Associated bill or initiative.
- Legislative chamber.
- Date of the vote.
- Type of vote.
- Overall outcome.

Votes are stored as independent events, without requiring prior aggregation into sessions, enabling flexible cross-sectional and longitudinal analysis.

---

### 4.4 Individual Voting Behavior

For each vote, the platform records the behavior of each legislator.

Possible behaviors include:

- Vote in favor.
- Vote against.
- Abstention.
- Absence.

These behaviors are stored as raw data, without interpretation at the time of ingestion.

---

## 5. Governing Coalition Preference Modeling

A key feature of the backoffice is the ability to explicitly define the **governing coalition’s preferred legislative behavior** for each vote.

### 5.1 Preference Hierarchies

For each vote, the system allows the configuration of an ordered set of preferred behaviors, prioritized according to political desirability.

Example hierarchy:

1. Vote in favor  
2. Vote against  
3. Be absent  
4. Abstain  

This hierarchy represents the governing coalition’s strategic preference for that specific vote.

### 5.2 Contextual Nature of Preferences

Preferences are defined on a per-vote basis and are not assumed to be uniform across votes or time.

This design allows the system to capture situations where:

- Tactical absences are preferable to explicit opposition.
- Abstentions have different political meanings depending on context.
- The same behavior can be interpreted differently across votes.

---

## 6. Legislative Behavior Evaluation Logic

The backoffice includes a rules engine that evaluates each legislator’s behavior by comparing:

- The legislator’s recorded action in a vote.
- The governing coalition’s preference hierarchy for that vote.

Based on this comparison, each behavior is classified as:

- **Aligned** with the primary preference.
- **Partially aligned**, according to the preference order.
- **Not aligned**.

This classification is computed dynamically and remains traceable to the underlying raw data and preference definitions.

---

## 7. Derived Metrics and Indexes

The platform computes analytical metrics derived from the combination of voting behavior and governing coalition preferences.

### 7.1 Officialism Alignment Index (OAI)

The **Officialism Alignment Index (OAI)** is the primary synthetic metric produced by the system.

It summarizes, in a normalized value, the degree to which a Congress Chamber (Deputies or Senators) are aligned with the Executive.

It’s the average ESP metric for each chamber of Congress (Deputies or Senators) across a specific set of votes or time period.

---

### 7.2 Complementary Metrics

Additional metrics computed by the system include:

#### Executive Support Percentage (ESP)

It summarizes, in a normalized value, the degree to which a legislator’s behavior aligns with governing coalition preferences across a defined set of votes.

The OAI is calculated by:

- Weighting each legislative action based on its position in the preference hierarchy.
- Aggregating results across votes.
- Normalizing values to enable comparison across legislators, caucuses, and time periods.

#### Attendance Index (AI)

Measures the proportion of votes in which the legislator was present, independent of alignment.

#### Parliamentary Conduct Indicators

Derived classifications based on combinations of OAI, ESP, and AI, enabling qualitative categorization of legislative behavior patterns.

---

## 8. Backoffice Workflows and Data Governance

The platform supports structured workflows for:

- Data creation and editing.
- Validation of votes and preference definitions.
- Recalculation of metrics upon data updates.
- Versioning and auditability of analytical rules.

This ensures transparency, reproducibility, and consistency of all derived metrics.

---

## 9. Dataset Evolution and Development Phases

The backoffice is designed to support incremental expansion without requiring changes to the core data model.

### Phase 1 — Core Data and Metrics Infrastructure

Scope of this proposal:

- Core entity modeling (legislators, bills, votes).
- Recording of individual voting behavior.
- Definition of governing coalition preferences per vote.
- Implementation of OAI, ESP, and AI calculations.
- Administrative interfaces for data management.

### Phase 2 — Advanced Analytical Capabilities

Potential extensions:

- Comparative analysis across legislative periods.
- Grouping by political leadership or territorial criteria.
- Temporal evolution of alignment metrics.
- Advanced filtering and ranking logic.

### Phase 3 — Extensions and Integrations

Future possibilities:

- Integration with external data sources.
- Automated or assisted data enrichment.
- Custom analytical outputs for specific use cases.

---

## 10. Deliverables

At the end of the development phase covered by this proposal, the following will be delivered:

- Backoffice web platform for parliamentary data management.
- Structured database schema supporting analytical use cases.
- Implementation of alignment metrics and calculation logic.
- Functional documentation of data models and workflows.