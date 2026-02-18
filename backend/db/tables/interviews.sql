CREATE TABLE IF NOT EXISTS interviews (
  id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 TEXT NOT NULL, -- REFERENCES users(id)
  problem_id              INTEGER NOT NULL,
  status                  INTEGER NOT NULL DEFAULT 1,
  current_phase           INTEGER NOT NULL DEFAULT 1,
  start_time              TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time                TIMESTAMP,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW()
);