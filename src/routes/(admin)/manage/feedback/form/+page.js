export const prerender = true
export const ssr = false

import { getFeedbackById } from '$lib/models/feedback';
import { getUserById } from '$lib/models/user';
import { error } from '@sveltejs/kit';

/** @type {import('$types/(admin)/manage/feedback/form/$types').PageLoad} */
export async function load({ url }) {
    let data = {};
    if (url.searchParams.get('view')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        let feedback = await getFeedbackById(id);
        if (feedback.status == "open") {
            feedback.status = "in_progress";
            await feedback.updateStatus();
        }
        let reply, admin, user;
        user = await getUserById(feedback.user_id, 'user');
        if (feedback.admin_id) {
            admin = await getUserById(feedback.admin_id, 'admin');
            reply = { user_id: user.user_id, username:user.username, admin_id: admin.username, feedback_id: feedback.id, comment: feedback.comment, date: feedback.date, status: feedback.status };
        }
        data = reply ? { feedback, reply, disabled: true } : { feedback, user, disabled: true };
    } else if (url.searchParams.get('edit')) {
        let id = parseInt(url.searchParams.get('id'));
        if (!id) return error(400, 'Bad Request - Missing or Invalid Room ID');
        let feedback = await getFeedbackById(id);
        let reply, admin, user;
        user = await getUserById(feedback.user_id, 'user');
        if (feedback.admin_id) {
            admin = await getUserById(feedback.admin_id, 'admin');
            reply = { user_id: user.user_id, username:user.username, admin_id: admin.username, comment: feedback.comment, date: feedback.date };
        }
        data = reply ? { feedback, reply, disabled: false } : { feedback, user, disabled: false };
    }
    return data;
}