-- Add indexes for metrics tables to optimize query performance

-- Index for legislative_metric lookups by vote_id (used when recalculating by vote)
CREATE INDEX IF NOT EXISTS "legislative_metric_vote_id_idx" ON "legislative_metric" ("vote_id");

-- Index for legislative_metric lookups by person_id and legislative_term_id (for person-level queries)
CREATE INDEX IF NOT EXISTS "legislative_metric_person_term_idx" ON "legislative_metric" ("person_id", "legislative_term_id");

-- Index for legislative_metric aggregation by session_id and chamber (for IAO calculation)
CREATE INDEX IF NOT EXISTS "legislative_metric_session_chamber_idx" ON "legislative_metric" ("session_id", "chamber");

-- Unique index for legislative_term_metric (person_id + legislative_term_id) for fast lookup and delta updates
CREATE UNIQUE INDEX IF NOT EXISTS "legislative_term_metric_person_term_unique_idx" ON "legislative_term_metric" ("person_id", "legislative_term_id");

-- Index for chamber_metric lookups by session_id and chamber
CREATE UNIQUE INDEX IF NOT EXISTS "chamber_metric_session_chamber_unique_idx" ON "chamber_metric" ("session_id", "chamber");
