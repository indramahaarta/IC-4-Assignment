import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "../models/model";

const dialect = new PostgresDialect({
  pool: async () =>
    new Pool({
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      port: Number(process.env.DB_PORT),
    }),
});

const db = new Kysely<DB>({
  dialect,
});

export default db;
