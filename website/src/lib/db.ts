import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.SQL_HOST,
    port: Number.isInteger(process.env.SQL_PORT) ? Number.parseInt(process.env.SQL_PORT!) : 3306,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD
  }
});

const execute = async <T>(query: string, ...values:any): Promise<T[] | any> => {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export { execute };