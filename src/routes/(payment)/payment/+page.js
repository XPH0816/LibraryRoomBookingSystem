export const prerender = true
export const ssr = false

import { getBookingById } from '$lib/models/booking.js';
import { getRoomById } from '$lib/models/room.js';
import { error, redirect } from '@sveltejs/kit';

/** @type {import('$types/(payment)/payment/$types').PageLoad} */
export async function load({ url }) {
    let data = {};
    let id = parseInt(url.searchParams.get('id'));
    if (!id) return error(400, 'Bad Request - Missing or Invalid Booking ID');

    let booking = await getBookingById(id);
    let room = await getRoomById(booking.room_id);
    if(room.price == 0) {
        booking.status = "completed";
        await booking.update();
        return redirect(301, "/history");
    }
    data = { booking, amount: room.price };

    return data;
}