mod commands;
mod db;
mod models;

use db::{init_database, Database};
use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let db = init_database(app.handle())?;
            app.manage(Database::new(db));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::bootstrap_app,
            commands::list_users,
            commands::create_user,
            commands::touch_user,
            commands::list_module_progress,
            commands::list_game_sessions,
            commands::save_game_session,
            commands::get_vocabulary_pack,
            commands::replace_vocabulary,
            commands::reset_vocabulary,
            commands::upsert_vocabulary_block,
            commands::delete_vocabulary_block,
            commands::upsert_vocabulary_term,
            commands::delete_vocabulary_term
        ])
        .run(tauri::generate_context!())
        .expect("error while running IkasLab");
}
