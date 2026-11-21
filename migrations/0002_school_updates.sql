CREATE TABLE IF NOT EXISTS school_updates (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'holiday',
      'notice',
      'news',
      'examination',
      'event',
      'admission',
      'parent-information'
    )
  ),
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TEXT NOT NULL,
  effective_at TEXT,
  reopening_at TEXT,
  school_closed INTEGER CHECK (school_closed IN (0, 1)),
  expires_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  ever_published INTEGER NOT NULL DEFAULT 0 CHECK (ever_published IN (0, 1)),
  pinned INTEGER NOT NULL DEFAULT 0 CHECK (pinned IN (0, 1)),
  attachments_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS school_updates_publication
  ON school_updates (status, published_at DESC);

CREATE INDEX IF NOT EXISTS school_updates_pinned
  ON school_updates (pinned DESC, published_at DESC);
