import { getDB } from "$lib/db";

export class FeedBack {
    constructor({ user_id, date, content,  status = "open", feedback_id = null, admin_id = null, comment = null}) {
        this.id = feedback_id;
        this.user_id = user_id;
        this.admin_id = admin_id;
        this.date = date;
        this.content = content;
        this.comment = comment;
        this.status = status;
    }

    async save() {
        let db = await getDB();
        let query = `INSERT INTO feedback (user_id, date, content) VALUES (?, ?, ?)`;
        let result = await db.execute(query, [this.user_id, this.date, this.content]);
        this.id = result.lastInsertId;
        return result.rowsAffected === 1;
    }

    async update() {
        let db = await getDB();
        let query = `UPDATE feedback SET user_id = ?, date = ?, content = ?, admin_id = ?, comment = ? WHERE feedback_id = ?`;
        let result = await db.execute(query, [this.user_id, this.date, this.content, this.admin_id, this.comment, this.id]);
        return result.rowsAffected === 1;
    }

    async updateStatus() {
        let db = await getDB();
        let query = `UPDATE feedback SET status = ? WHERE feedback_id = ?`;
        let result = await db.execute(query, [this.status, this.id]);
        return result.rowsAffected === 1;
    }
}

export async function getFeedbacks() {
    let db = await getDB();
    let query = `SELECT * FROM feedback`;
    let result = await db.select(query);
    return result.map(row => new FeedBack(row));
}

/**
 * 
 * @param {String} user_id
 * @returns 
 */
export async function getFeedbacksByUserId(user_id) {
    let db = await getDB();
    let query = `SELECT * FROM feedback WHERE user_id = ?`;
    let result = await db.select(query, [user_id]);
    return result.map(row => new FeedBack(row));
}

/**
 * 
 * @param {String} admin_id
 * @returns 
 */
export async function getFeedbacksByAdminId(admin_id) {
    let db = await getDB();
    let query = `SELECT * FROM feedback WHERE admin_id = ?`;
    let result = await db.select(query, [admin_id]);
    return result.map(row => new FeedBack(row));
}


/**
 * 
 * @param {Number} id 
 */
export async function getFeedbackById(id) {
    let db = await getDB();
    let query = `SELECT * FROM feedback WHERE feedback_id = ?`;
    /** @types Array<{ user_id, date, content, id, admin_id, comment}> */
    let result = await db.select(query, [id]);
    return new FeedBack(result.pop());
}

/**
 * 
 * @param {String} id
 * @param {String} admin_id
 * @param {String} comment
 * @returns 
 */
export async function replyFeedback(id, admin_id, comment) {
    let db = await getDB();
    let query = `UPDATE feedback SET comment = ?, admin_id = ?, status = "closed" WHERE feedback_id = ?`;
    let result = await db.execute(query, [comment, admin_id, id]);
    return result.rowsAffected === 1;
}

/**
 * 
 * @param {String} id
 * @returns
 */
export async function closeFeedback(id) {
    let db = await getDB();
    let query = `UPDATE feedback SET status = "closed" WHERE feedback_id = ?`;
    let result = await db.execute(query, [id]);
    return result.rowsAffected === 1;
}