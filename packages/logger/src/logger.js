import pino from "pino";

import { create_bindings } from "./formatters/bindings.js";
import { get_logger_config } from "./config/logger.config.js";
import { create_error_serializer } from "./serializers/error.serializer.js";
import { request_serializer } from "./serializers/request.serializer.js";
import { create_development_transport } from "./transports/development.transport.js";
import { REDACTION_PATHS } from "./redaction/paths.js";

/**
 * @function create_logger
 *
 * @description
 * Creates one Pino logger instance for a service.
 *
 * Call this once during service startup.
 * Do not create a new logger inside request handlers.
 */
export const create_logger = ({
    service_name,
    version = "1.0.0",
    config = get_logger_config(),
}) => {
    if (!service_name) {
        throw new Error(
            "create_logger requires a service_name"
        );
    }

    const {
        environment,
        level,
        enabled,
        pretty,
        redact,
    } = config;

    const pino_options = {
        level,
        enabled,

        formatters: {
            bindings: create_bindings({
                service_name,
                environment,
                version,
            }),
        },

        serializers: {
            err: create_error_serializer({
                environment,
            }),
            req: request_serializer,
        },
    };

    /**
     * Redaction is initialization-time configuration.
     * Do not build paths from user input.
     */
    if (redact) {
        pino_options.redact = {
            paths: REDACTION_PATHS,
            censor: "[REDACTED]",
        };
    }

    /**
     * Pretty transport is only enabled when configuration
     * explicitly says pretty output should be used.
     */
    if (pretty) {
        pino_options.transport =
            create_development_transport();
    }

    return pino(pino_options);
};