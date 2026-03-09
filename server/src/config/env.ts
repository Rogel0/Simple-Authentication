import type { EnvConfig } from "../types/env.d.ts";
import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue!;
}

export const env: EnvConfig = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: parseInt(getEnv("PORT", "3000"), 10),
    DATABASE_URL: getEnv("DATABASE_URL"),
    JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
    ACCESS_TOKEN_EXPIRES: getEnv("ACCESS_TOKEN_EXPIRES", "24h"),
    LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
}