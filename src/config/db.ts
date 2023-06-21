import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "../models/model";

const dialect = new PostgresDialect({
  pool: async () =>
    new Pool({
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    }),
});

const db = new Kysely<DB>({
  dialect,
});

export default db;
