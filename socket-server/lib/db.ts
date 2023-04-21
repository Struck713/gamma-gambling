import mysql from "mysql";
import env from "../env.json";

const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.credentials.user,
    password: env.database.credentials.password,
    database: env.database.database
});


export const execute = <T>(query: string, ...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        pool.query(query, args, (error, results) => {
            if (error) return reject(error);
            else return resolve(results as T);
        })
    });
};