import { SessionStore } from "next-session";
import { SessionData, SessionRecord } from "next-session/lib/types";
import { execute } from "../db";

interface Options {

    clearExpired: boolean;
    checkExpirationInterval: number;
    expiration: number;

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
        let result = await execute(sql, [session_id]);
        
        let [ rows ]: any = result;
        let row = rows[0] || null;
        if (!row) return null;

        const now = Math.round(Date.now() / 1000);
        if (row.expires < now) return null;

        let data = row.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        return data;
    }

    set(session_id: string, record: SessionData<SessionRecord>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    destroy(session_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    touch?(session_id: string, sess: SessionData<SessionRecord>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}

export { ServerlessSQLStore };