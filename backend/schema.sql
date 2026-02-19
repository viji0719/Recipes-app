-- SQL Schema for Recipes Database
-- Compatible with PostgreSQL and SQLite

CREATE TABLE IF NOT EXISTS recipes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    cuisine       VARCHAR(255),
    title         VARCHAR(255),
    rating        FLOAT,            -- NULL if original value was NaN
    prep_time     INTEGER,          -- NULL if original value was NaN
    cook_time     INTEGER,          -- NULL if original value was NaN
    total_time    INTEGER,          -- NULL if original value was NaN
    description   TEXT,
    nutrients     JSON,             -- JSONB in PostgreSQL
    serves        VARCHAR(100)
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_recipes_rating   ON recipes (rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_title    ON recipes (title);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine  ON recipes (cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_total_time ON recipes (total_time);

-- Note: NaN handling is performed in the application layer before INSERT.
-- Any numeric field (rating, prep_time, cook_time, total_time) that
-- contains NaN or invalid data is stored as NULL.
