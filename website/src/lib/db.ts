import mysql from "serverless-mysql";
import env from "env.json";

const db = mysql({
  config: {
    host: env.database.host,
    port: env.database.port,
    database: env.database.database,
    user: env.database.credentials.user,
    password: env.database.credentials.password
  }
});

export default async function execute(query: string, ...values:any[] ) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}