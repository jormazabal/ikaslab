use rusqlite::Connection;
use std::fs;
use std::path::PathBuf;
use std::sync::{Mutex, MutexGuard};
use tauri::{AppHandle, Manager};

pub struct Database {
    connection: Mutex<Connection>,
}

impl Database {
    pub fn new(connection: Connection) -> Self {
        Self {
            connection: Mutex::new(connection),
        }
    }

    pub fn lock(&self) -> Result<MutexGuard<'_, Connection>, String> {
        self.connection
            .lock()
            .map_err(|_| "No se pudo bloquear la conexión SQLite.".to_string())
    }
}

pub fn init_database(app: &AppHandle) -> Result<Connection, Box<dyn std::error::Error>> {
    let app_data_dir: PathBuf = app.path().app_local_data_dir()?;
    fs::create_dir_all(&app_data_dir)?;
    let db_path = app_data_dir.join("ikaslab.sqlite3");
    let connection = Connection::open(db_path)?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.execute_batch(include_str!("../migrations/001_init.sql"))?;
    Ok(connection)
}
