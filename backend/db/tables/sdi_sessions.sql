
CREATE TABLE IF NOT EXISTS sdi_sessions (
  id                      BIGSERIAL PRIMARY KEY,
  user_id                 TEXT NOT NULL, -- REFERENCES users(id)
  problem_id              TEXT NOT NULL,
  status                  INTEGER NOT NULL DEFAULT 1,
  current_phase           INTEGER NOT NULL DEFAULT 1,
  start_time              TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time                TIMESTAMP,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW()
);
