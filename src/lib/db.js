import Database from "tauri-plugin-sql-api";
import { invoke } from "@tauri-apps/api/tauri";

export async function getDB() {
    let dbUrl = await invoke("get_env", { key: "DATABASE_URL" });
    return await Database.load(dbUrl);
}