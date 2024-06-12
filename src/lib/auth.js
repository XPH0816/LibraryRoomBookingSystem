import { invoke } from "@tauri-apps/api/tauri";
import { goto } from "$app/navigation";
import { hashPassword, verify } from "./crypto/hashing";
import Cookies from "js-cookie";
import { getDB } from "./db";
import { getUserByEmail } from "./models/user";

export async function login(email, password, usertype, link) {
    let user = await getUserByEmail(email, usertype);

    if (!user) throw new Error("User not found");
    if (!await verify(password, user.password)) throw new Error("Invalid password");

    user.usertype = usertype == "admin" ? "admin" : user.type;
    user.user_id = user[`${usertype}_id`];

    let token = await invoke("login", {
        user,
    });

    let expiredDate = new Date(token.exp * 1000);
    Cookies.set("token", token.token, { expires: expiredDate });
    goto(link);
};

export async function register(email, password, phone, usertype) {
    let db = await getDB();
    let username = email.split("@")[0];
    let hashedPassword = await hashPassword(password);
    let query = `INSERT INTO user (username, password, email, phone, type) VALUES (?, ?, ?, ?, ?);`;
    let result = await db.execute(query, [
        username,
        hashedPassword,
        email,
        phone,
        usertype,
    ]);
    if (result.rowsAffected !== 1) throw new Error("Failed to register user.");
}

export async function updatePassword(password, usertype, id) {
    let db = await getDB();
    let hashedPassword = await hashPassword(password);
    let query = `UPDATE ${usertype} SET password = ? WHERE ${usertype}_id = ?`;
    let result = await db.execute(query, [hashedPassword, id]);
    if (result.rowsAffected !== 1) throw new Error("Failed to change password.");
}

export async function verifyOldPassword(password, usertype, id) {
    let db = await getDB();
    let query = `SELECT password FROM ${usertype} WHERE ${usertype}_id = ?`;
    let result = await db.select(query, [id]);
    if (result.length == 0) throw new Error("User not found.");
    return await verify(password, result[0].password);
}