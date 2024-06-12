export const prerender = true
export const ssr = false

import { getRoomById } from '$lib/models/room';
import { error } from '@sveltejs/kit';

/** @type {import('$types/(authed)/booking/room/$types').PageLoad} */
export async function load({ url }) {
    let id = parseInt(url.searchParams.get('id'));
    let dateTime = new Date(parseInt(url.searchParams.get('datetime')));
    if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
    if (!dateTime) return error(400, 'Bad Request - Missing or Invalid Date Time');
    let room = await getRoomById(id);
    return {
        room,
        dateTime
    }
}