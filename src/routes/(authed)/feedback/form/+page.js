export const prerender = true
export const ssr = false

import { getFeedbackById } from '$lib/models/feedback';
import { getUserById } from '$lib/models/user';

/** @type {import('$types/(authed)/feedback/form/$types').PageLoad} */
export async function load({ url }) {
    let id = parseInt(url.searchParams.get('id'));
    let edit = url.searchParams.get('edit') === 'true';
    if (id) {
        let feedback = await getFeedbackById(id);
        let reply, admin;
        if (feedback.admin_id) {
            admin = await getUserById(feedback.admin_id, 'admin');
            reply = { admin_id: admin.username, comment: feedback.comment, date: feedback.date, status: feedback.status };
        }
        return reply ? { feedback, reply } : { feedback, reply: { date: feedback.date, status: feedback.status }, edit };
    }
}