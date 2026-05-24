# Modelo de Datos

SQLite guarda los datos principales.

## users

- `id`
- `name`
- `avatar_id`
- `total_points`
- `created_at`
- `updated_at`
- `last_used_at`

## module_progress

- `user_id`
- `module_id`
- `points`
- `best_score`
- `sessions_count`
- `last_played_at`
- `data`

## game_sessions

- `id`
- `user_id`
- `module_id`
- `started_at`
- `ended_at`
- `score`
- `correct_count`
- `wrong_count`
- `hints_used`
- `selected_blocks`
- `total_questions`
- `data`

## vocabulary_blocks

- `id`
- `title`
- `description`
- `difficulty`
- `order_index`
- `enabled`

## vocabulary_terms

- `id`
- `block_id`
- `word`
- `sentence`
- `translation`
- `hint`
- `difficulty`
- `distractors`
- `accepted_answers`
- `enabled`

## Migraciones

La versión inicial está en `src-tauri/migrations/001_init.sql`.
