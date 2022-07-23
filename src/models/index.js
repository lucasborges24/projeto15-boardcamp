import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { connection };

export * as categories from "./categories.js";
export * as games from "./games.js";
export * as customers from "./customers.js";
