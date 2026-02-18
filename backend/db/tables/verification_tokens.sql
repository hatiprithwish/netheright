CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier              TEXT NOT NULL,
  token                   TEXT NOT NULL,
  expires                 TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);