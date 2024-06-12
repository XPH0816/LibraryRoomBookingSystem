use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub username: String,
    pub email: String,
    pub usertype: String,
    pub phone: String,
    pub exp: usize,
    pub iat: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserForm {
    pub user_id: u64,
    pub username: String,
    pub email: String,
    pub password: String,
    pub phone: String,
    pub usertype: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserToken {
    pub token: String,
    pub exp: usize,
}
