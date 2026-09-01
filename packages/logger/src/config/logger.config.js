import { env } from "./env.js";

/**
 * Default logger configuration by environment.
 */
const default_log_levels = {
    development: "debug",
    test: "silent",
    production: "info",
};

const default_pretty_by_environment = {
    development: true,
    test: false,
    production: false,
};

/**
 * Returns the final logger configuration.
 *
 * Environment variables can override the defaults.
 */
export const get_logger_config = () => {
    const environment = env.NODE_ENV;

    const level =
        env.LOG_LEVEL ??
        default_log_levels[environment];

    const pretty =
        env.LOG_PRETTY ??
        default_pretty_by_environment[environment];

    return {
        environment,

        /**
         * Whether Pino should produce logs at all.
         */
        enabled: env.LOG_ENABLED,

        /**
         * Effective Pino log level.
         */
        level,

        /**
         * Whether pretty output should be used.
         */
        pretty,

        /**
         * Whether sensitive fields should be redacted.
         */
        redact: env.LOG_REDACT,
    };
};

export default get_logger_config;