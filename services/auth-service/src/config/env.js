import "@irctc/config";
import { z } from "zod";

const auth_env = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  AUTH_SERVICE_PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32, "secret key minimum length is 32"),
  JWT_ACCESS_EXPIRE: z.string().min(1).default("1d"),
  JWT_REFRESH_SECRET: z.string().min(32, "refresh key minimum length is 32"),
  JWT_REFRESH_EXPIRE: z.string().min(1).default("7d"),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, "google client must there for auth-service"),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "google client secret key must be there"),
  JWT_ISSUER: z.string().min(1).default("irctc-auth-service"),
  JWT_AUDIENCE: z.string().min(1).default("irctc-api"),
  AUTH_SERVICE: z.string().min(1).default("AUTH_SERVICE"),
});

// this is going to use inside auth-service only
export const env = auth_env.parse(process.env);
