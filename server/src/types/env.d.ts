export interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    ACCESS_TOKEN_EXPIRES: string;
    LOG_LEVEL?: string;
}