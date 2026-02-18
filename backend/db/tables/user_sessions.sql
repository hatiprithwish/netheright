CREATE TABLE IF NOT EXISTS user_sessions (
  session_token               TEXT PRIMARY KEY,
  user_id                     TEXT NOT NULL, -- REFERENCES users(id),
  expires                     TIMESTAMP NOT NULL
);
