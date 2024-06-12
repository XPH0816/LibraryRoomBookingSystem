export const prerender = true
export const ssr = false

import { error } from '@sveltejs/kit';

/** @type {import('$types/(admin)/manage/booking/$types').PageLoad} */
export async function load({ url }) {
    let data = {};
    if (url.searchParams.get('view')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        data = { disabled: true };
    } else if (url.searchParams.get('edit')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        data = { disabled: false };
    }
    return data;
}