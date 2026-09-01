import { randomUUID } from "node:crypto";

/**
 * Express request logging middleware.
 *
 * Responsibilities:
 * - Creates a request ID when one is not supplied.
 * - Attaches request ID to the Express request.
 * - Creates a request-scoped child logger.
 * - Exposes the child logger as req.log.
 * - Adds X-Request-ID to the response.
 * - Logs the completed request.
 *
 * @param {import("pino").Logger} logger
 * @returns {import("express").RequestHandler}
 */
export const request_logger_middleware = (logger) => {
    if (!logger) {
        throw new Error(
            "request_logger_middleware requires a logger instance"
        );
    }

    return (req, res, next) => {
        const request_id =
            req.get("x-request-id") ||
            randomUUID();

        req.id = request_id;

        res.setHeader("X-Request-ID", request_id);

        const request_logger = logger.child({
            request_id,
        });

        req.log = request_logger;

        const start_time = process.hrtime.bigint();

        res.on("finish", () => {
            const duration_ns =
                process.hrtime.bigint() - start_time;

            const duration_ms =
                Number(duration_ns) / 1_000_000;

            request_logger.info(
                {
                    req,
                    response: {
                        status_code: res.statusCode,
                    },
                    response_time_ms: Number(
                        duration_ms.toFixed(2)
                    ),
                },
                "HTTP request completed"
            );
        });

        next();
    };
};