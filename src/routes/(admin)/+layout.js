export const prerender = true
export const ssr = false

import { error } from '@sveltejs/kit';
import { invoke } from '@tauri-apps/api/tauri';
import { user } from '$lib/store';
import { get } from 'svelte/store';
import { getItem } from '$lib/helper';

export async function load() {
    let token = getItem('token');
    if (!token) return error(403, 'You are not logged in or your session has expired');
    user.set(await invoke('check_auth', { token }));
    if (get(user).usertype != 'admin') {
        return error(403, 'Unauthorized');
    }
}