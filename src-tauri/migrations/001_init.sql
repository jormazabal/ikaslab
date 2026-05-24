PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO app_meta (key, value) VALUES ('schema_version', '1');

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_used_at TEXT
);

CREATE TABLE IF NOT EXISTS module_progress (
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  last_played_at TEXT,
  data TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  hints_used INTEGER NOT NULL,
  selected_blocks TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  data TEXT NOT NULL DEFAULT '{}',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_module ON game_sessions(user_id, module_id);

CREATE TABLE IF NOT EXISTS vocabulary_blocks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS vocabulary_terms (
  id TEXT PRIMARY KEY,
  block_id TEXT NOT NULL,
  word TEXT NOT NULL,
  word_translation TEXT,
  sentence TEXT NOT NULL,
  translation TEXT,
  hint TEXT,
  difficulty TEXT NOT NULL,
  distractors TEXT NOT NULL,
  accepted_answers TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (block_id) REFERENCES vocabulary_blocks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_block ON vocabulary_terms(block_id);
