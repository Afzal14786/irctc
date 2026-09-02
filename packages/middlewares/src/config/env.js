import "@irctc/config";

import { z } from "zod";

const middleware_environment = z.object({
    /**
     * --------------------------------------------------
     * Request ID
     * --------------------------------------------------
     */
    REQUEST_ID_HEADER: z
        .string()
        .min(1)
        .default("X-Request-ID"),

    /**
     * --------------------------------------------------
     * Request timeout
     * --------------------------------------------------
     */
    REQUEST_TIMEOUT_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(30_000),

    /**
     * --------------------------------------------------
     * Rate limiting
     * --------------------------------------------------
     */
    RATE_LIMIT_ENABLED: z
        .enum(["true", "false"])
        .default("true")
        .transform((value) => value === "true"),

    RATE_LIMIT_API_WINDOW_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(15 * 60 * 1000),

    RATE_LIMIT_API_MAX: z
        .coerce
        .number()
        .int()
        .positive()
        .default(100),

    RATE_LIMIT_LOGIN_WINDOW_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(15 * 60 * 1000),

    RATE_LIMIT_LOGIN_MAX: z
        .coerce
        .number()
        .int()
        .positive()
        .default(8),

    RATE_LIMIT_REGISTER_WINDOW_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(60 * 60 * 1000),

    RATE_LIMIT_REGISTER_MAX: z
        .coerce
        .number()
        .int()
        .positive()
        .default(5),

    RATE_LIMIT_EMAIL_WINDOW_MS: z
        .coerce
        .number()
        .int()
        .positive()
        .default(60 * 60 * 1000),

    RATE_LIMIT_EMAIL_MAX: z
        .coerce
        .number()
        .int()
        .positive()
        .default(5),

    /**
     * --------------------------------------------------
     * CORS
     * --------------------------------------------------
     */
    CORS_ENABLED: z
        .enum(["true", "false"])
        .default("true")
        .transform((value) => value === "true"),

    CORS_ORIGINS: z
        .string()
        .default("http://localhost:3000"),

    CORS_CREDENTIALS: z
        .enum(["true", "false"])
        .default("true")
        .transform((value) => value === "true"),

    /**
     * --------------------------------------------------
     * Express proxy configuration
     * --------------------------------------------------
     *
     * Kept as a string because Express supports
     * boolean, number and IP/subnet style trust values.
     *
     * We normalize it in the middleware.
     */
    TRUST_PROXY: z
        .enum(["true", "false"])
        .default("false")
        .transform((value) => value === "true"),
});

export const env =
    middleware_environment.parse(process.env);