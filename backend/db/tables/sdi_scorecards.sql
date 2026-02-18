CREATE TABLE IF NOT EXISTS sdi_scorecards (
  id                          BIGSERIAL PRIMARY KEY,
  session_id                  TEXT NOT NULL, -- REFERENCES sdi_sessions(id)
  overall_grade               INTEGER NOT NULL,
  requirements_gathering      INTEGER NOT NULL,
  data_modeling               INTEGER NOT NULL,
  trade_off_analysis          INTEGER NOT NULL,
  scalability                 INTEGER NOT NULL,
  strengths                   TEXT[] NOT NULL,
  growth_areas                TEXT[] NOT NULL,
  actionable_feedback         TEXT NOT NULL,
  created_at                  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMP NOT NULL DEFAULT NOW()
);
