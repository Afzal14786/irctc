import "@irctc/config";

import { z } from "zod";

const redis_environment = z.object({
    REDIS_URL: z
        .string()
        .min(1, "REDIS_URL is required"),

    REDIS_CONNECT_TIMEOUT_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(10_000),

    REDIS_MAX_RETRIES: z
        .coerce
        .number()
        .int()
        .min(0)
        .default(3),
});

export const env = redis_environment.parse(
    process.env,
);