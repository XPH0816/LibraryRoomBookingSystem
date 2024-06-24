import { getDB } from "$lib/db";
import { formatDate, formatTime, isFreeRoom } from "$lib/helper";
import { approveBooking, getBookings, rejectBooking } from "$lib/models/booking";
import { getRoomById } from "$lib/models/room";
import { getUserById } from "$lib/models/user";
import { user as cred } from "$lib/store";
import { get } from "svelte/store";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 */
export class BookingManageRepo {
    /**
     * @constructs FeedBackRepo
     * @param {{ booking_id, username, room_number,type, start_datetime, end_datetime, status }} bookings - Array of feedbacks
     */
    constructor({ booking_id, username, room_number, type, start_datetime, end_datetime, status }) {
        start_datetime = new Date(start_datetime);
        end_datetime = new Date(end_datetime);
        this.no = booking_id;
        this.user = username;
        this.room = room_number == 0 ? type : type + "_" + room_number;
        this.date = formatDate(start_datetime) == formatDate(end_datetime) ? formatDate(start_datetime) : `${formatDate(start_datetime)} - ${formatDate(end_datetime)}`;
        this.status = status;
        this.action = status == "pending" ? {
            show: () => { },
            approve: approveBooking(booking_id, get(cred).id, status),
            reject: rejectBooking(booking_id, get(cred).id)
        } : {
            show: () => { }
        };
    }
    static async getBookings() {
        let db = await getDB();
        let query = `SELECT booking_id, username, room_number, room.type, start_datetime, end_datetime, booking.status FROM booking INNER JOIN room ON booking.room_id = room.room_id INNER JOIN user ON booking.user_id = user.user_id;`;
        let result = await db.select(query);
        return result.map(v => new BookingManageRepo(v));
    }
}