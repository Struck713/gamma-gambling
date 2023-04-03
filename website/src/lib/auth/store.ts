import { SessionStore } from "next-session";
import { SessionData, SessionRecord } from "next-session/lib/types";
import { execute } from "../db";

interface Options {

    clearExpired: boolean;
    checkExpirationInterval: number;
    expiration: number;

}

interface Session {



}

class ServerlessSQLStore implements SessionStore {

    private options: Options;

    constructor(options?: Options) {
        if (!options) {
            this.options = {
                clearExpired: true,
                checkExpirationInterval: 900000,
                expiration: 86400000
            }
        } else this.options = options;
    }

    async get(session_id: string): Promise<SessionData<SessionRecord> | null | undefined> {
        const sql: string = "SELECT data, expires FROM session WHERE session_id = ?";
        let [ row ]: any = await execute(sql, session_id);
        if (!row) return null;

        const now = Math.round(Date.now() / 1000);
        if (row.expires < now) return null;

        let data = row.data;
        if (typeof data === 'string') data = JSON.parse(data);
        return data;
    }

    async set(session_id: string, record: SessionData<SessionRecord>): Promise<void> {
        let expires = record.cookie.expires ? record.cookie.expires : Date.now() + this.options.expiration;
		if (!(expires instanceof Date)) expires = new Date(expires);
        expires = Math.round(expires.getTime() / 1000); // use seconds
        const sql: string = "INSERT INTO session VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE expires = VALUES(expires), data = VALUES(data)";
        await execute(sql, session_id, expires, record);
    }

    async destroy(session_id: string): Promise<void> {
        const sql: string = "DELETE FROM session WHERE session_id = ?";
        await execute(sql, session_id);
    }

    async touch?(session_id: string, record: SessionData<SessionRecord>): Promise<void> {
        let expires = record.cookie.expires ? record.cookie.expires : Date.now() + this.options.expiration;
		if (!(expires instanceof Date)) expires = new Date(expires);
        expires = Math.round(expires.getTime() / 1000); // use seconds
        const sql: string = "UPDATE session SET expires = ? WHERE session_id = ?";
        await execute(sql, expires, session_id);
    }
    
}

export { ServerlessSQLStore };