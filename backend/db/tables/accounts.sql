CREATE TABLE IF NOT EXISTS accounts (
  user_id                                 TEXT NOT NULL, -- REFERENCES users(id),
  type                                    TEXT NOT NULL,
  provider                                TEXT NOT NULL,
  provider_account_id                     TEXT NOT NULL,
  refresh_token                           TEXT,
  access_token                            TEXT,
  expires_at                              INTEGER,
  token_type                              TEXT,
  scope                                   TEXT,
  id_token                                TEXT,
  session_state                           TEXT,
  PRIMARY KEY (provider, provider_account_id)
);
