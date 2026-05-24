use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: String,
    pub name: String,
    pub avatar_id: String,
    pub total_points: i64,
    pub created_at: String,
    pub updated_at: String,
    pub last_used_at: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserInput {
    pub name: String,
    pub avatar_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModuleProgress {
    pub user_id: String,
    pub module_id: String,
    pub points: i64,
    pub best_score: i64,
    pub sessions_count: i64,
    pub last_played_at: Option<String>,
    pub data: Value,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameSession {
    pub id: String,
    pub user_id: String,
    pub module_id: String,
    pub started_at: String,
    pub ended_at: String,
    pub score: i64,
    pub correct_count: i64,
    pub wrong_count: i64,
    pub hints_used: i64,
    pub selected_blocks: Vec<String>,
    pub total_questions: i64,
    pub data: Value,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveGameSessionInput {
    pub user_id: String,
    pub module_id: String,
    pub started_at: String,
    pub ended_at: String,
    pub score: i64,
    pub correct_count: i64,
    pub wrong_count: i64,
    pub hints_used: i64,
    pub selected_blocks: Vec<String>,
    pub total_questions: i64,
    pub data: Value,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabularyBlock {
    pub id: String,
    pub title: String,
    pub description: String,
    pub difficulty: String,
    pub order_index: i64,
    pub enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabularyTerm {
    pub id: String,
    pub block_id: String,
    pub word: String,
    pub word_translation: Option<String>,
    pub sentence: String,
    pub translation: Option<String>,
    pub hint: Option<String>,
    pub difficulty: String,
    pub distractors: Vec<String>,
    pub enabled: bool,
    pub accepted_answers: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabularyPack {
    pub schema_version: i64,
    pub module_id: String,
    pub exported_at: Option<String>,
    pub blocks: Vec<VocabularyBlock>,
    pub terms: Vec<VocabularyTerm>,
}
