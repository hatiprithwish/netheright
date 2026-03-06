import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./tables";
import { envConfig } from "@/lib/envConfig";

const pool = new Pool({ connectionString: envConfig.DATABASE_URL });
export const db = drizzle(pool, { schema });
