CREATE TABLE IF NOT EXISTS users (
  id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT,
  email                   TEXT NOT NULL UNIQUE,
  email_verified          TIMESTAMP,
  image                   TEXT,
  role_id                 VARCHAR(20) NOT NULL DEFAULT 'LEARNER'
);
