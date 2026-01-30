CREATE TABLE IF NOT EXISTS red_flags (
    id                                  BIGSERIAL PRIMARY KEY,
    session_id                          TEXT NOT NULL,
    type                                TEXT NOT NULL,
    reason                              TEXT NOT NULL,
    phase                               INTEGER NOT NULL,
    created_at                          TIMESTAMP NOT NULL DEFAULT NOW()
);
