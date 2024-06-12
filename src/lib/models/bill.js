import { getDB } from "$lib/db";
import { formatDate, formatTime, toDateTime } from "$lib/helper";

export class Bill {
    constructor({ bill_id = null, payment_id, datetime = null, amount, status }) {
        this.id = bill_id;
        this.payment_id = payment_id;
        this.datetime = datetime;
        this.amount = amount / 100;
        this.status = status;
    }

    async save() {
        let date = new Date();
        this.datetime = toDateTime(formatDate(date), formatTime(date));
        let db = await getDB();
        let query = "INSERT INTO bill (payment_id, datetime, amount, status) VALUES (?, ?, ?, ?)";
        let result = await db.execute(query, [this.payment_id, this.datetime, this.amount * 100, this.status]);
        this.id = result.lastInsertId;
        return result.rowsAffected === 1;
    }

    async update() {
        let db = await getDB();
        let query = "UPDATE bill SET payment_id = ?, datetime = ?, amount = ?, status = ? WHERE bill_id = ?";
        let result = await db.execute(query, [this.payment_id, this.datetime, this.amount * 100, this.status, this.id]);
        return result.rowsAffected === 1;
    }

    static async create({ payment_id, amount, status }) {
        let bill = new Bill({ payment_id, amount: amount * 100, status });
        let success = await bill.save();
        return success ? bill : null;
    }
}

/**
 * Get bill by payment_id
 * @param {number} payment_id - Payment ID
 * @returns {Promise<Bill|null>} - Bill object or null if not found
 */
export async function getBillByPaymentId(payment_id) {
    let db = await getDB();
    let query = "SELECT * FROM bill WHERE payment_id = ?";
    let result = await db.select(query, [payment_id]);
    return result.length === 1 ? new Bill(result[0]) : null;
}