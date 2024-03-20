import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"

const pool = new Pool({
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}?schema=public`
})

pool.connect()

export const db = drizzle(pool, {schema: schema})