CREATE TABLE IF NOT EXISTS roles (
  id                    VARCHAR(20) PRIMARY KEY,
  name                  VARCHAR(100) NOT NULL,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);
