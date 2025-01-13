export const prerender = true
export const ssr = false

import { invoke } from '@tauri-apps/api/tauri';
import { user } from '$lib/store';
import { getItem } from '$lib/helper';
import { error } from '@sveltejs/kit';

export async function load() {
    let token = getItem('token');
    if (!token) return error(403, 'You are not logged in or your session has expired');
    user.set(await invoke('check_auth', { token }));
}