CREATE TABLE IF NOT EXISTS hld_diagrams (
  id                      BIGSERIAL PRIMARY KEY,
  session_id              TEXT NOT NULL, -- REFERENCES sdi_sessions(id),
  topology                JSONB NOT NULL,
  raw_react_flow          JSONB NOT NULL,
  phase                   INT NOT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by              BIGINT NOT NULL, -- REFERENCES users(id)
  updated_by              BIGINT NOT NULL -- REFERENCES users(id)
);