import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "../../backend/db/tables";
import { envConfig } from "@/lib/envConfig";

/*DEV_NOTE: Lazy connection logic is not needed here. NeonDB manages connection pooling automatically.
 */
const pool = new Pool({ connectionString: envConfig.DATABASE_URL });

const neonDBClient = drizzle(pool, { schema });

export default neonDBClient;
