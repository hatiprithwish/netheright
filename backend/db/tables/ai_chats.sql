CREATE TABLE IF NOT EXISTS ai_chats (
  id                      BIGSERIAL PRIMARY KEY,
  session_id              BIGINT NOT NULL, -- REFERENCES sdi_sessions(id),
  role                    INT NOT NULL,
  content                 TEXT NOT NULL,
  phase                   INT NOT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW()
);
