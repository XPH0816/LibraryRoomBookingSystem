// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;

use envcrypt::envc;
use jsonwebtoken::{
    decode, encode, get_current_timestamp, Algorithm, DecodingKey, EncodingKey, Header, Validation,
};
use models::{User, UserForm, UserToken};
use tauri_plugin_log::LogTarget;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn login(user: UserForm) -> UserToken {
    let iat = get_current_timestamp() as usize;
    let exp = iat + 2 * 60 * 60;
    let user_data = User {
        id: user.user_id,
        username: user.username.clone(),
        email: user.email.clone(),
        usertype: user.usertype.clone(),
        phone: user.phone.clone(),
        exp,
        iat,
    };
    UserToken {
        token: encode(
            &Header::new(Algorithm::RS256),
            &user_data,
            &EncodingKey::from_rsa_pem(include_bytes!("private.pem")).expect("Key not found"),
        )
        .expect("Error while encoding token"),
        exp,
    }
}

#[tauri::command]
fn check_auth(token: &str) -> Result<User, String> {
    let key = include_bytes!("public.pem");
    let token_data = decode::<User>(
        &token,
        &DecodingKey::from_rsa_pem(key).expect("Key not found"),
        &Validation::new(Algorithm::RS256),
    )
    .map_err(|e| {
        println!("Error: {:?}", e);
        "Invalid token or token expired".to_string()
    });
    match token_data {
        Ok(data) => Ok(data.claims),
        Err(e) => Err(e),
    }
}

#[tauri::command]
fn get_env(key: &str) -> Result<String, String> {
    dotenvy::dotenv().ok();
    match std::env::var(key) {
        Ok(value) => Ok(value),
        Err(_) => Err(format!("No value found for key: {}", key)),
    }
}

#[tauri::command]
fn get_db_url() -> Result<String, String> {
    Ok(envc!("DATABASE_URL").to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).level(log::LevelFilter::Info).build())
        .invoke_handler(tauri::generate_handler![login, get_env, check_auth, get_db_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
