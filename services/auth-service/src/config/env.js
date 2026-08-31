import "@irctc/config";
import {z} from "zod";

const auth_env = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AUTH_SERVICE_PORT: z.coerce.number().default(4001),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "secret key minimum length is 32"),
    JWT_EXPIRES_IN: z.string().min(1).default("1d"),
    REFRESH_SECRET_KEY: z.string().min(32, "refresh key minimum length is 32"),
    REFRESH_EXPIRES_IN: z.string().min(1).default("7d"),
    GOOGLE_CLIENT_ID: z.string().min(1, "google client must there for auth-service"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "google client secret key must be there"),
    AUTH_SERVICE: z.string().min(1).default("AUTH_SERVICE")
});

// this is going to use inside auth-service only
export const env = auth_env.parse(process.env);