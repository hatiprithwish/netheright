CREATE TABLE IF NOT EXISTS role_features (
  id                        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ACID compliant primary key type
  role_id                   VARCHAR(20) NOT NULL,
  feature_id                VARCHAR(20) NOT NULL,
  is_active                 BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (role_id, feature_id)
);
