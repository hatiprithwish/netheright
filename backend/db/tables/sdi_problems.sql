CREATE TABLE IF NOT EXISTS sdi_problems (
    id                                      BIGSERIAL PRIMARY KEY,
    title                                   VARCHAR(255) NOT NULL,
    description                             TEXT NOT NULL,
    functional_requirements                 TEXT[] NOT NULL,
    non_functional_requirements             TEXT[] NOT NULL,
    bote_factors                            TEXT[] NOT NULL,
    created_at                              TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at                              TIMESTAMP NULL
);