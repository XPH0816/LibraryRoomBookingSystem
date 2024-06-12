import { getDB } from "$lib/db";

/**
 * User class
 * @class
 * @description User class to handle user data
 */
export class User {
    /**
     * @param {String} username 
     * @param {String} email 
     * @param {String} phone 
     * @param {"admin"|"student"|"staff"|"visitor"} usertype 
     * @param {Number} id 
     */
    constructor(username, email, phone, usertype, id) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.usertype = usertype;
        this.id = id;
    }

    async save() {
        if (this.usertype === "admin") throw new Error("Cannot create admin user.");
        let db = await getDB();
        let query = `INSERT INTO user (username, email, phone) VALUES (?, ?, ?)`;
        let result = await db.execute(query, [this.username, this.email, this.phone]);
        this.id = result.lastInsertId;
        return result.rowsAffected === 1;
    }
}

/**
 * 
 * @param {String} email
 * @param {"admin"|"user"} usertype
 * @returns 
 */
export async function getUserByEmail(email, usertype) {
    let db = await getDB();
    let query = `SELECT * FROM ${usertype} WHERE email = ?`;
    let result = await db.select(query, [email]);
    
    if (result.length == 0) throw new Error("No user found with that email");

    return result.pop();
}

/**
 * 
 * @param {Number} id
 * @param {"admin"|"user"} usertype
 * @returns 
 */
export async function getUserById(id, usertype) {
    let db = await getDB();
    let query = `SELECT * FROM ${usertype} WHERE ${usertype}_id = ?`;
    let result = await db.select(query, [id]);
    
    if (result.length == 0) throw new Error("No user found with that ID");

    return result.pop();
}

/**
 * 
 * @param {String} username
 * @param {String} email
 * @param {String} phone
 * @param {"admin"|"user"} usertype
 * @param {Number} id
 * @returns 
 */
export async function updateUserById(username, email, phone, usertype, id) {
    let db = await getDB();
    let query = `UPDATE ${usertype} SET username = ?, email = ?, phone = ? WHERE ${usertype}_id = ?`;
    let result = await db.execute(query, [username, email, phone, id]);
    if (result.rowsAffected !== 1) throw new Error("Failed to update user profile.");
}

/**
 * 
 * @param {"admin"|"user"} usertype
 * @returns 
 */
export async function getUsers(usertype) {
    let db = await getDB();
    let query = `SELECT * FROM ${usertype}`;
    return await db.select(query);
}