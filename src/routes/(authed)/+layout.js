export const prerender = true
export const ssr = false

import Cookies from 'js-cookie';
import { redirect } from '@sveltejs/kit';
import { invoke } from '@tauri-apps/api/tauri';
import { user } from '$lib/store';

export async function load() {
    let token = Cookies.get('token');
    if (!token) {
        return redirect(301, '/');
    }
    user.set(await invoke('check_auth', { token }));
}