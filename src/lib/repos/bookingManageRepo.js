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
     * @param {Array<import("$lib/models/booking").Booking>} bookings - Array of feedbacks
     * @param {Array<import("$lib/models/user").User>} users - Array of feedbacks
     * @param {Array<import("$lib/models/room").Room>} rooms - Array of feedbacks
     */
    constructor(bookings = [], users = [], rooms = []) {
        if (bookings.length != users.length || bookings.length != rooms.length) throw new Error("Invalid data");
        this.datas = bookings.map((booking, index) => {
            let user = users[index];
            let room = rooms[index];
            let action = {};
            booking.startDateTime = new Date(booking.startDateTime);
            booking.endDateTime = new Date(booking.endDateTime);
            let status = isFreeRoom(room.type) ? "completed" : "approved";
            if (booking.status == "pending") {
                action.show = () => { () => { } }
                action.approve = approveBooking(booking.booking_id, get(cred).id, status);
                action.reject = rejectBooking(booking.booking_id, get(cred).id);
            } else {
                action.show = () => { () => { } }
            }
            return {
                no: booking.booking_id,
                user: user.username,
                room: room.roomName,
                date: formatDate(booking.startDateTime) == formatDate(booking.endDateTime) ? formatDate(booking.startDateTime) : `${formatDate(booking.startDateTime)} - ${formatDate(booking.endDateTime)}`,
                time: formatTime(booking.startDateTime) == "08:00" && formatTime(booking.endDateTime) == "22:00" ? "All Day" : `${formatTime(booking.startDateTime)} - ${formatTime(booking.endDateTime)}`,
                status: booking.status,
                action
            }
        });
    }
    static async getBookings() {
        let bookings = await getBookings();
        let users = [];
        let rooms = [];
        for (let booking of bookings) {
            let user = await getUserById(booking.user_id, "user");
            let room = await getRoomById(booking.room_id);
            users.push(user);
            rooms.push(room);
        }
        return new BookingManageRepo(bookings, users, rooms).datas;
    }
}