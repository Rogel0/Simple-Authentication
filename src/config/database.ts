import { Pool } from "pg";
import { env } from "./env";
import { logger } from "../utils/logger";

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

const connectDB = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT current_database()");
        logger.info(
            "PostgreSQL connected to: %s",
            result.rows[0]?.current_database,
        );
        logger.info("Database connection established");
        client.release();
    } catch (error) {
        logger.error("Failed to connect to PostgreSQL", { error });
        throw error;
    }
}


pool.on("error", (err: Error) => {
    logger.error("Unexpected error on client", { err });
    process.exit(1);
})


export default connectDB;