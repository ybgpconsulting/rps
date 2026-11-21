CREATE TABLE IF NOT EXISTS published_content (
  id TEXT PRIMARY KEY NOT NULL,
  content_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
