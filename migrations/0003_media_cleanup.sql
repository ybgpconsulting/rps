CREATE TABLE IF NOT EXISTS media_cleanup_locks (
  media_key TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_references (
  media_key TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('content', 'announcement')),
  source_id TEXT NOT NULL,
  PRIMARY KEY (media_key, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS media_references_key
  ON media_references (media_key);

CREATE TRIGGER IF NOT EXISTS media_references_source_guard_insert
BEFORE INSERT ON media_references
WHEN (NEW.source_type = 'content' AND NOT EXISTS (
    SELECT 1 FROM published_content WHERE id = NEW.source_id
  ))
  OR (NEW.source_type = 'announcement' AND NOT EXISTS (
    SELECT 1 FROM school_updates WHERE id = NEW.source_id
  ))
BEGIN
  SELECT RAISE(ABORT, 'media reference source does not exist');
END;

CREATE TRIGGER IF NOT EXISTS media_references_cleanup_guard_insert
BEFORE INSERT ON media_references
WHEN EXISTS (SELECT 1 FROM media_cleanup_locks WHERE media_key = NEW.media_key)
BEGIN
  SELECT RAISE(ABORT, 'media object is being cleaned up');
END;

CREATE TRIGGER IF NOT EXISTS media_references_cleanup_guard_update
BEFORE UPDATE OF media_key ON media_references
WHEN EXISTS (SELECT 1 FROM media_cleanup_locks WHERE media_key = NEW.media_key)
BEGIN
  SELECT RAISE(ABORT, 'media object is being cleaned up');
END;
