import { getDB } from "$lib/db";
import { formatDate, formatTime, toDateTime } from "$lib/helper";

export class Payment {
    constructor({ payment_id = null, booking_id, datetime = null, amount, method, payment_status }) {
        this.id = payment_id;
        this.booking_id = booking_id;
        this.amount = amount / 100
        this.datetime = datetime;
        this.method = method;
        this.payment_status = payment_status;
    }

    async save() {
        let date = new Date();
        this.datetime = toDateTime(formatDate(date), formatTime(date));
        let db = await getDB();
        let result = await db.execute(
            `INSERT INTO payment (booking_id, datetime, amount, method, payment_status) VALUES (?, ?, ?, ?, ?)`,
            [this.booking_id, this.datetime, this.amount * 100, this.method, this.payment_status]
        );
        this.id = result.lastInsertId;
        return result.rowsAffected === 1;
    }

    static async create({ booking_id, amount, method, payment_status }) {
        let payment = new Payment({ booking_id, amount: amount * 100, method, payment_status });
        let success = await payment.save();
        return success ? payment : null;
    }
}

export async function getPaymentMethods() {
    let db = await getDB();
    let result = await db.select(`SHOW COLUMNS FROM payment WHERE Field = 'method'`);
    return result[0].Type.match(/'([^']+)'/g).map((v) => v.slice(1, -1));
}

/**
 * Get payment by booking_id
 * @param {number} booking_id - Payment ID
 * @returns {Promise<Payment|null>} - Payment object or null if not found
 */
export async function getPaymentByBookingId(booking_id) {
    let db = await getDB();
    let result = await db.select(`SELECT * FROM payment WHERE booking_id = ?`, [booking_id]);
    return result.length === 1 ? new Payment(result[0]) : null;
}