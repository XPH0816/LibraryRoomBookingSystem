export const prerender = true
export const ssr = false

import Cookies from 'js-cookie';
import { error } from '@sveltejs/kit';
import { invoke } from '@tauri-apps/api/tauri';
import { user } from '$lib/store';
import { get } from 'svelte/store';

export async function load() {
    let token = Cookies.get('token');
    if (!token) return error(403, 'You are not logged in or your session has expired');
    user.set(await invoke('check_auth', { token }));
    if (get(user).usertype != 'admin') {
        return error(403, 'Unauthorized');
    }
}