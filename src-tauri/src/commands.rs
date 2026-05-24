use crate::db::Database;
use crate::models::{
    CreateUserInput, GameSession, ModuleProgress, SaveGameSessionInput, User, VocabularyBlock,
    VocabularyPack, VocabularyTerm,
};
use chrono::Utc;
use rusqlite::{params, OptionalExtension};
use serde_json::{json, Value};
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn bootstrap_app(db: State<'_, Database>) -> Result<(), String> {
    let connection = db.lock()?;
    connection
        .execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(to_string)?;
    Ok(())
}

#[tauri::command]
pub fn list_users(db: State<'_, Database>) -> Result<Vec<User>, String> {
    let connection = db.lock()?;
    let mut statement = connection
        .prepare(
            "SELECT id, name, avatar_id, total_points, created_at, updated_at, last_used_at
             FROM users ORDER BY COALESCE(last_used_at, created_at) DESC",
        )
        .map_err(to_string)?;

    let rows = statement
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
                avatar_id: row.get(2)?,
                total_points: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                last_used_at: row.get(6)?,
            })
        })
        .map_err(to_string)?;

    collect_rows(rows)
}

#[tauri::command]
pub fn create_user(db: State<'_, Database>, input: CreateUserInput) -> Result<User, String> {
    let name = input.name.trim();
    if name.len() < 2 {
        return Err("El nombre debe tener al menos 2 caracteres.".to_string());
    }

    let now = Utc::now().to_rfc3339();
    let user = User {
        id: Uuid::new_v4().to_string(),
        name: name.to_string(),
        avatar_id: input.avatar_id,
        total_points: 0,
        created_at: now.clone(),
        updated_at: now,
        last_used_at: None,
    };

    let connection = db.lock()?;
    connection
        .execute(
            "INSERT INTO users (id, name, avatar_id, total_points, created_at, updated_at, last_used_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                user.id,
                user.name,
                user.avatar_id,
                user.total_points,
                user.created_at,
                user.updated_at,
                user.last_used_at
            ],
        )
        .map_err(to_string)?;

    Ok(user)
}

#[tauri::command]
pub fn touch_user(db: State<'_, Database>, user_id: String) -> Result<Option<User>, String> {
    let now = Utc::now().to_rfc3339();
    let connection = db.lock()?;
    connection
        .execute(
            "UPDATE users SET last_used_at = ?1, updated_at = ?1 WHERE id = ?2",
            params![now, user_id],
        )
        .map_err(to_string)?;

    get_user(&connection, &user_id)
}

#[tauri::command]
pub fn list_module_progress(
    db: State<'_, Database>,
    user_id: String,
) -> Result<Vec<ModuleProgress>, String> {
    let connection = db.lock()?;
    let mut statement = connection
        .prepare(
            "SELECT user_id, module_id, points, best_score, sessions_count, last_played_at, data
             FROM module_progress WHERE user_id = ?1",
        )
        .map_err(to_string)?;

    let rows = statement
        .query_map(params![user_id], |row| {
            let data: String = row.get(6)?;
            Ok(ModuleProgress {
                user_id: row.get(0)?,
                module_id: row.get(1)?,
                points: row.get(2)?,
                best_score: row.get(3)?,
                sessions_count: row.get(4)?,
                last_played_at: row.get(5)?,
                data: parse_json(&data),
            })
        })
        .map_err(to_string)?;

    collect_rows(rows)
}

#[tauri::command]
pub fn list_game_sessions(
    db: State<'_, Database>,
    user_id: String,
    module_id: Option<String>,
) -> Result<Vec<GameSession>, String> {
    let connection = db.lock()?;
    let sql = if module_id.is_some() {
        "SELECT id, user_id, module_id, started_at, ended_at, score, correct_count, wrong_count,
         hints_used, selected_blocks, total_questions, data
         FROM game_sessions WHERE user_id = ?1 AND module_id = ?2 ORDER BY ended_at DESC"
    } else {
        "SELECT id, user_id, module_id, started_at, ended_at, score, correct_count, wrong_count,
         hints_used, selected_blocks, total_questions, data
         FROM game_sessions WHERE user_id = ?1 ORDER BY ended_at DESC"
    };

    let mut statement = connection.prepare(sql).map_err(to_string)?;
    let mapper = |row: &rusqlite::Row<'_>| -> rusqlite::Result<GameSession> {
        let selected_blocks: String = row.get(9)?;
        let data: String = row.get(11)?;
        Ok(GameSession {
            id: row.get(0)?,
            user_id: row.get(1)?,
            module_id: row.get(2)?,
            started_at: row.get(3)?,
            ended_at: row.get(4)?,
            score: row.get(5)?,
            correct_count: row.get(6)?,
            wrong_count: row.get(7)?,
            hints_used: row.get(8)?,
            selected_blocks: parse_string_array(&selected_blocks),
            total_questions: row.get(10)?,
            data: parse_json(&data),
        })
    };

    if let Some(module_id) = module_id {
        collect_rows(
            statement
                .query_map(params![user_id, module_id], mapper)
                .map_err(to_string)?,
        )
    } else {
        collect_rows(
            statement
                .query_map(params![user_id], mapper)
                .map_err(to_string)?,
        )
    }
}

#[tauri::command]
pub fn save_game_session(
    db: State<'_, Database>,
    input: SaveGameSessionInput,
) -> Result<GameSession, String> {
    let mut connection = db.lock()?;
    let transaction = connection.transaction().map_err(to_string)?;
    let session = GameSession {
        id: Uuid::new_v4().to_string(),
        user_id: input.user_id,
        module_id: input.module_id,
        started_at: input.started_at,
        ended_at: input.ended_at,
        score: input.score,
        correct_count: input.correct_count,
        wrong_count: input.wrong_count,
        hints_used: input.hints_used,
        selected_blocks: input.selected_blocks,
        total_questions: input.total_questions,
        data: input.data,
    };

    transaction
        .execute(
            "INSERT INTO game_sessions
             (id, user_id, module_id, started_at, ended_at, score, correct_count, wrong_count,
              hints_used, selected_blocks, total_questions, data)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                session.id,
                session.user_id,
                session.module_id,
                session.started_at,
                session.ended_at,
                session.score,
                session.correct_count,
                session.wrong_count,
                session.hints_used,
                stringify_json(&session.selected_blocks)?,
                session.total_questions,
                stringify_json(&session.data)?
            ],
        )
        .map_err(to_string)?;

    transaction
        .execute(
            "INSERT INTO module_progress
             (user_id, module_id, points, best_score, sessions_count, last_played_at, data)
             VALUES (?1, ?2, ?3, ?3, 1, ?4, ?5)
             ON CONFLICT(user_id, module_id) DO UPDATE SET
               points = points + excluded.points,
               best_score = MAX(best_score, excluded.best_score),
               sessions_count = sessions_count + 1,
               last_played_at = excluded.last_played_at,
               data = excluded.data",
            params![
                session.user_id,
                session.module_id,
                session.score,
                session.ended_at,
                stringify_json(&json!({
                    "lastSelectedBlocks": session.selected_blocks,
                    "lastCorrectCount": session.correct_count,
                    "lastTotalQuestions": session.total_questions
                }))?
            ],
        )
        .map_err(to_string)?;

    transaction
        .execute(
            "UPDATE users SET total_points = total_points + ?1, updated_at = ?2 WHERE id = ?3",
            params![session.score, session.ended_at, session.user_id],
        )
        .map_err(to_string)?;

    transaction.commit().map_err(to_string)?;
    Ok(session)
}

#[tauri::command]
pub fn get_vocabulary_pack(db: State<'_, Database>) -> Result<VocabularyPack, String> {
    let connection = db.lock()?;
    Ok(VocabularyPack {
        schema_version: 1,
        module_id: "english-vocabulary".to_string(),
        exported_at: None,
        blocks: list_vocabulary_blocks(&connection)?,
        terms: list_vocabulary_terms(&connection)?,
    })
}

#[tauri::command]
pub fn replace_vocabulary(db: State<'_, Database>, pack: VocabularyPack) -> Result<(), String> {
    let mut connection = db.lock()?;
    let transaction = connection.transaction().map_err(to_string)?;

    transaction
        .execute("DELETE FROM vocabulary_terms", [])
        .map_err(to_string)?;
    transaction
        .execute("DELETE FROM vocabulary_blocks", [])
        .map_err(to_string)?;

    for block in pack.blocks {
        insert_block(&transaction, &block)?;
    }

    for term in pack.terms {
        insert_term(&transaction, &term)?;
    }

    transaction.commit().map_err(to_string)?;
    Ok(())
}

#[tauri::command]
pub fn reset_vocabulary(db: State<'_, Database>) -> Result<(), String> {
    let connection = db.lock()?;
    connection
        .execute("DELETE FROM vocabulary_terms", [])
        .map_err(to_string)?;
    connection
        .execute("DELETE FROM vocabulary_blocks", [])
        .map_err(to_string)?;
    Ok(())
}

#[tauri::command]
pub fn upsert_vocabulary_block(
    db: State<'_, Database>,
    block: VocabularyBlock,
) -> Result<(), String> {
    let connection = db.lock()?;
    insert_block(&connection, &block)
}

#[tauri::command]
pub fn delete_vocabulary_block(db: State<'_, Database>, block_id: String) -> Result<(), String> {
    let connection = db.lock()?;
    connection
        .execute("DELETE FROM vocabulary_blocks WHERE id = ?1", params![block_id])
        .map_err(to_string)?;
    Ok(())
}

#[tauri::command]
pub fn upsert_vocabulary_term(db: State<'_, Database>, term: VocabularyTerm) -> Result<(), String> {
    let connection = db.lock()?;
    insert_term(&connection, &term)
}

#[tauri::command]
pub fn delete_vocabulary_term(db: State<'_, Database>, term_id: String) -> Result<(), String> {
    let connection = db.lock()?;
    connection
        .execute("DELETE FROM vocabulary_terms WHERE id = ?1", params![term_id])
        .map_err(to_string)?;
    Ok(())
}

fn get_user(connection: &rusqlite::Connection, user_id: &str) -> Result<Option<User>, String> {
    connection
        .query_row(
            "SELECT id, name, avatar_id, total_points, created_at, updated_at, last_used_at
             FROM users WHERE id = ?1",
            params![user_id],
            |row| {
                Ok(User {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    avatar_id: row.get(2)?,
                    total_points: row.get(3)?,
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                    last_used_at: row.get(6)?,
                })
            },
        )
        .optional()
        .map_err(to_string)
}

fn list_vocabulary_blocks(connection: &rusqlite::Connection) -> Result<Vec<VocabularyBlock>, String> {
    let mut statement = connection
        .prepare(
            "SELECT id, title, description, difficulty, order_index, enabled
             FROM vocabulary_blocks ORDER BY order_index ASC, title ASC",
        )
        .map_err(to_string)?;

    let rows = statement
        .query_map([], |row| {
            Ok(VocabularyBlock {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                difficulty: row.get(3)?,
                order_index: row.get(4)?,
                enabled: row.get::<_, i64>(5)? == 1,
            })
        })
        .map_err(to_string)?;

    collect_rows(rows)
}

fn list_vocabulary_terms(connection: &rusqlite::Connection) -> Result<Vec<VocabularyTerm>, String> {
    let mut statement = connection
        .prepare(
            "SELECT id, block_id, word, sentence, translation, hint, difficulty, distractors,
                    enabled, accepted_answers
             FROM vocabulary_terms ORDER BY block_id ASC, word ASC",
        )
        .map_err(to_string)?;

    let rows = statement
        .query_map([], |row| {
            let distractors: String = row.get(7)?;
            let accepted_answers: Option<String> = row.get(9)?;
            Ok(VocabularyTerm {
                id: row.get(0)?,
                block_id: row.get(1)?,
                word: row.get(2)?,
                sentence: row.get(3)?,
                translation: row.get(4)?,
                hint: row.get(5)?,
                difficulty: row.get(6)?,
                distractors: parse_string_array(&distractors),
                enabled: row.get::<_, i64>(8)? == 1,
                accepted_answers: accepted_answers.map(|value| parse_string_array(&value)),
            })
        })
        .map_err(to_string)?;

    collect_rows(rows)
}

fn insert_block(connection: &rusqlite::Connection, block: &VocabularyBlock) -> Result<(), String> {
    connection
        .execute(
            "INSERT INTO vocabulary_blocks (id, title, description, difficulty, order_index, enabled)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET
               title = excluded.title,
               description = excluded.description,
               difficulty = excluded.difficulty,
               order_index = excluded.order_index,
               enabled = excluded.enabled",
            params![
                block.id,
                block.title,
                block.description,
                block.difficulty,
                block.order_index,
                bool_to_i64(block.enabled)
            ],
        )
        .map_err(to_string)?;
    Ok(())
}

fn insert_term(connection: &rusqlite::Connection, term: &VocabularyTerm) -> Result<(), String> {
    connection
        .execute(
            "INSERT INTO vocabulary_terms
             (id, block_id, word, sentence, translation, hint, difficulty, distractors, enabled, accepted_answers)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
             ON CONFLICT(id) DO UPDATE SET
               block_id = excluded.block_id,
               word = excluded.word,
               sentence = excluded.sentence,
               translation = excluded.translation,
               hint = excluded.hint,
               difficulty = excluded.difficulty,
               distractors = excluded.distractors,
               enabled = excluded.enabled,
               accepted_answers = excluded.accepted_answers",
            params![
                term.id,
                term.block_id,
                term.word,
                term.sentence,
                term.translation,
                term.hint,
                term.difficulty,
                stringify_json(&term.distractors)?,
                bool_to_i64(term.enabled),
                term.accepted_answers
                    .as_ref()
                    .map(stringify_json)
                    .transpose()?
            ],
        )
        .map_err(to_string)?;
    Ok(())
}

fn collect_rows<T>(
    rows: rusqlite::MappedRows<'_, impl FnMut(&rusqlite::Row<'_>) -> rusqlite::Result<T>>,
) -> Result<Vec<T>, String> {
    rows.collect::<rusqlite::Result<Vec<T>>>().map_err(to_string)
}

fn parse_json(value: &str) -> Value {
    serde_json::from_str(value).unwrap_or_else(|_| json!({}))
}

fn parse_string_array(value: &str) -> Vec<String> {
    serde_json::from_str(value).unwrap_or_default()
}

fn stringify_json<T: serde::Serialize>(value: &T) -> Result<String, String> {
    serde_json::to_string(value).map_err(to_string)
}

fn bool_to_i64(value: bool) -> i64 {
    if value {
        1
    } else {
        0
    }
}

fn to_string(error: impl std::fmt::Display) -> String {
    error.to_string()
}
