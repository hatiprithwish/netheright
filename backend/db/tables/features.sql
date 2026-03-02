CREATE TABLE IF NOT EXISTS features (
  id                    VARCHAR(20) PRIMARY KEY,
  description           VARCHAR(255) NOT NULL,
  perm_bit              INTEGER NOT NULL, -- Permission bit for this feature (0-31)
  perm_bit_index        INTEGER NOT NULL, -- Index at which this permission bit is set
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(perm_bit, perm_bit_index),
  CHECK(perm_bit >= 0 AND perm_bit <= 31)
);
