/**
 * @function create_error_serializer
 *
 * @description
 * Formats thrown errors into a predictable structure.
 *
 * Production:
 * - hides stack traces
 *
 * Development/test:
 * - preserves stack traces for debugging
 */
export const create_error_serializer = ({ environment }) => {
    const is_production = environment === "production";

    return (err) => {
        if (!err || typeof err !== "object") {
            return err;
        }

        const serialized_error = {
            type: err.name || "Error",
            message: err.message,
        };

        if (
            err.status_code !== undefined ||
            err.status !== undefined
        ) {
            serialized_error.status_code =
                err.status_code ??
                err.status;
        }

        if (err.code !== undefined) {
            serialized_error.code = err.code;
        }

        if (!is_production && err.stack) {
            serialized_error.stack = err.stack;
        }

        if (err.cause instanceof Error) {
            serialized_error.cause = {
                type: err.cause.name || "Error",
                message: err.cause.message,
            };

            if (!is_production && err.cause.stack) {
                serialized_error.cause.stack = err.cause.stack;
            }
        }

        return serialized_error;
    };
};