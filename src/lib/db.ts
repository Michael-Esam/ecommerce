import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL || "postgres://neondb_owner:npg_mock_password@ep-mock-region.aws.neon.tech/neondb?sslmode=require");
export const db = drizzle(sql, { schema });
