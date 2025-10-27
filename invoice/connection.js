import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Log all env variables for verification
console.log("🔍 Checking env variables:");
console.log({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  passwordType:typeof process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.SSL,
});

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log("✅ Connected to NeonDB successfully"))
  .catch((err) => {
    console.error("❌ Connection error details:");
    console.error(err);
  });

export default pool;
