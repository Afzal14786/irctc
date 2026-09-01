/**
 * Sensitive fields that must never appear in logs.
 *
 * These paths are static application configuration.
 * They must not be built from user input.
 */
export const REDACTION_PATHS = [
    "password",
    "password_hashed",

    "token",

    "access_token",
    "refresh_token",

    "authorization",

    "req.headers.authorization",
    "req.headers.cookie",

    "request.headers.authorization",
    "request.headers.cookie",
];