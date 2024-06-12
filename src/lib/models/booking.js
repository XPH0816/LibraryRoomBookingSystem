import { getDB } from '$lib/db';

export class Booking {
    constructor({ room_id, user_id, start_datetime, end_datetime, reason, admin_id = null, status = null, booking_id = null }) {
        this.booking_id = booking_id;
        this.room_id = room_id;
        this.user_id = user_id;
        this.admin_id = admin_id;
        this.startDateTime = start_datetime;
        this.endDateTime = end_datetime;
        this.reason = reason;
        this.status = status ?? 'pending';
    }

    async save() {
        let db = await getDB();
        let query = `INSERT INTO booking (room_id, user_id, start_datetime, end_datetime, reason, status) VALUES (?, ?, ?, ?, ?, ?)`;
        let result = await db.execute(query, [this.room_id, this.user_id, this.startDateTime, this.endDateTime, this.reason, this.status]);
        this.booking_id = result.lastInsertId;
        return result.rowsAffected === 1;
    }

    async update() {
        let db = await getDB();
        let query = `UPDATE booking SET room_id = ?, user_id = ?, start_datetime = ?, end_datetime = ?, reason = ?, status = ? WHERE booking_id = ?`;
        let result = await db.execute(query, [this.room_id, this.user_id, this.startDateTime, this.endDateTime, this.reason, this.status, this.booking_id]);
        return result.rowsAffected === 1;
    }

    static async create({ room_id, user_id, startDateTime, endDateTime, reason }) {
        let booking = new Booking({ room_id, user_id, start_datetime: startDateTime, end_datetime: endDateTime, reason });
        let success = await booking.save();
        return success ? booking : null;
    }
}

/**
 * @returns {Promise<Booking[]>}
 */
export async function getBookings() {
    let db = await getDB();
    let query = `SELECT * FROM booking`;
    let result = await db.select(query);
    return result.map(row => new Booking(row));
}

/**
 * 
 * @param {Number|String} room_id
 * @returns
 */
export async function getBookingsByRoomId(room_id) {
    let db = await getDB();
    let query = `SELECT * FROM booking WHERE room_id = ?`;
    let result = await db.select(query, [room_id]);
    return result.map(row => new Booking(row));
}

/**
 * 
 * @param {Number|String} user_id
 * @returns
 */
export async function getBookingsByUserId(user_id) {
    let db = await getDB();
    let query = `SELECT * FROM booking WHERE user_id = ?`;
    let result = await db.select(query, [user_id]);
    return result.map(row => new Booking(row));
}

/**
 * 
 * @param {Number|String} booking_id
 * @returns
 */
export async function getBookingById(booking_id) {
    let db = await getDB();
    let query = `SELECT * FROM booking WHERE booking_id = ?`;
    let result = await db.select(query, [booking_id]);
    return new Booking(result.pop());
}

/**
 * @param {String} startDateTime
 * @param {String} endDateTime 
 * @returns boolean
 */
export async function checkAvailability(room_id, startDateTime, endDateTime) {
    let db = await getDB();
    let query = `SELECT * FROM booking WHERE room_id = ? AND (start_datetime >= ? AND start_datetime < ? OR end_datetime > ? AND end_datetime <= ?) AND status != 'canceled'`;
    let result = await db.select(query, [room_id, startDateTime, endDateTime, startDateTime, endDateTime]);
    return result.length === 0;
}

export function approveBooking(booking_id, admin_id, status = 'approved') {
    return async () => {
        let db = await getDB();
        let query = `UPDATE booking SET status = ?, admin_id = ? WHERE booking_id = ?`;
        let result = await db.execute(query, [status, admin_id, booking_id]);
        return result.rowsAffected === 1;
    }
}

export function rejectBooking(booking_id, admin_id) {
    return async () => {
        let db = await getDB();
        let query = `UPDATE booking SET status = 'rejected', admin_id = ? WHERE booking_id = ?`;
        let result = await db.execute(query, [admin_id, booking_id]);
        return result.rowsAffected === 1;
    }
}

export function cancelBooking(booking_id, admin_id) {
    return async () => {
        let db = await getDB();
        let query = `UPDATE booking SET status = 'canceled', admin_id = ? WHERE booking_id = ?`;
        let result = await db.execute(query, [admin_id, booking_id]);
        return result.rowsAffected === 1;
    }
}