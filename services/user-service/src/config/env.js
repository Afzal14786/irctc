/**
 * @file env.js inside user-service
 * @method user_env
 * @description this will contain all the environment which required here in this service
 */

import "@irctc/config";
import {z} from "zod";

const user_env = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    USER_SERVICE: z.string().min(1, "service_name required").default("USER_SERVICE"),
    USER_SERVICE_PORT: z.coerce.number().int().default(4002),
});

export const env = user_env.parse(process.env);