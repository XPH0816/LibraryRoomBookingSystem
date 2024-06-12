export const prerender = true
export const ssr = false

import { getRoomById } from '$lib/models/room';
import { error } from '@sveltejs/kit';

/** @type {import('$types/(admin)/manage/room/form/$types').PageLoad} */
export async function load({ url }) {
    let data = {};
    if (url.searchParams.get('view')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        let room = await getRoomById(id);
        data = { room, disabled: true };
    } else if (url.searchParams.get('edit')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        let room = await getRoomById(id);
        data = { room, disabled: false };
    }
    return data;
}