import "@irctc/config";
import { z } from "zod";

/**
 * Logger environment configuration.
 *
 * Raw values come from process.env.
 * This file is responsible only for validation and type conversion.
 */

const logger_environment = z.object({
    /**
     * Application environment.
     *
     * development → developer-friendly logging
     * test        → minimal/silent logging
     * production  → structured JSON logging
     */
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    /**
     * Minimum log level to output.
     *
     * trace  → most detailed
     * debug  → debugging information
     * info   → normal application events
     * warn   → warnings
     * error  → errors
     * fatal  → critical application failures
     * silent → disable logs
     *
     * Optional because logger.config.js will provide
     * environment-specific defaults.
     */
    LOG_LEVEL: z
        .enum([
            "trace",
            "debug",
            "info",
            "warn",
            "error",
            "fatal",
            "silent",
        ])
        .optional(),

    /**
     * Enable or disable logging completely.
     */
    LOG_ENABLED: z
        .enum(["true", "false"])
        .default("true")
        .transform((value) => value === "true"),

    /**
     * Pretty-print logs.
     *
     * Optional because logger.config.js will decide the
     * default based on NODE_ENV.
     */
    LOG_PRETTY: z
        .enum(["true", "false"])
        .optional()
        .transform((value) => {
            if (value === undefined) return undefined;
            return value === "true";
        }),

    /**
     * Enable sensitive-data redaction.
     *
     * This is enabled by default.
     */
    LOG_REDACT: z
        .enum(["true", "false"])
        .default("true")
        .transform((value) => value === "true"),
});

export const env = logger_environment.parse(process.env);