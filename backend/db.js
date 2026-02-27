import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();
const { Pool } = pkg;

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

db.connect()
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.error("Database connection error", err));

export default db;
