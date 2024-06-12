import { formatDate, formatTime, toDateTime } from "$lib/helper";
import { cancelBooking, getBookingsByUserId } from "$lib/models/booking";
import { getRoomNameByIds } from "$lib/models/room";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 * @param {Array<import("$lib/models/booking").Booking>} bookings - Array of bookings
 * @param {Array<import("$lib/models/room").Room>} rooms - Array of rooms
 */
export class HistoryRepo {
    constructor(bookings = [], rooms = []) {
        this.datas = bookings.map((booking) => {
            let startDateTime = new Date(booking.startDateTime);
            let endDateTime = new Date(booking.endDateTime);
            let room = rooms.find((room) => room.room_id == booking.room_id);
            let action = {};
            if (booking.status === "approved") {
                if (room.price > 0) {
                    action = {
                        pay: "/payment?id=" + booking.booking_id
                    };
                } else {
                    action = {
                        show: () => { () => { } }
                    }
                }
            }
            else if (booking.status === "pending") action = { cancel: cancelBooking(booking.booking_id) };
            else action = { show: () => { () => { } } };
            return {
                booking_id: booking.booking_id,
                room: room.roomName,
                start_date: formatDate(startDateTime),
                end_date: formatDate(endDateTime),
                start_time: formatTime(startDateTime),
                end_time: formatTime(endDateTime),
                reason: booking.reason,
                status: booking.status,
                action
            }
        });
    }
    static async getHistory(userId) {
        let bookings = await getBookingsByUserId(userId);
        let rooms = await getRoomNameByIds(bookings.map(booking => booking.room_id));
        return new HistoryRepo(bookings, rooms).datas;
    }
}