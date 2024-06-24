import { getDB } from "$lib/db";
import { formatDate, formatTime } from "$lib/helper";
import { cancelBooking } from "$lib/models/booking";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 * @param {Array<import("$lib/models/booking").Booking>} bookings - Array of bookings
 * @param {Array<import("$lib/models/room").Room>} rooms - Array of rooms
 */
export class HistoryRepo {
    constructor({ booking_id, room_number, type, start_datetime, end_datetime, status, reason }) {
        start_datetime = new Date(start_datetime);
        end_datetime = new Date(end_datetime);
        this.booking_id = booking_id;
        this.room = room_number == 0 ? type : type + "_" + room_number;
        this.start_date = formatDate(start_datetime);
        this.end_date = formatDate(end_datetime);
        this.start_time = formatTime(start_datetime);
        this.end_time = formatTime(end_datetime);
        this.status = status;
        this.reason = reason;
        this.action = status === "approved" ? {
            pay: "/payment?id=" + booking_id
        } : status === "pending" ? {
            cancel: cancelBooking(booking_id)
        } : {
            show: () => { }
        };
    }
    static async getHistory(userId) {
        let db = await getDB();
        let query = `SELECT booking_id, room_number, room.type, start_datetime, end_datetime, booking.status, reason FROM booking INNER JOIN room ON booking.room_id = room.room_id WHERE user_id = ?;`;
        let result = await db.select(query, [userId]);
        return result.map(v => new HistoryRepo(v));
    }
}