/**
 * @function request_serializer
 *
 * @description
 * Serializes an Express request into a safe,
 * structured representation for Pino.
 *
 * Never serialize the complete Express request object.
 */

export const request_serializer = (req) => {
    if (!req || typeof req !== "object") {
        return req;
    }

    return {
        id: req.id,
        method: req.method,
        url: req.originalUrl ?? req.url,
        path: req.path,
        query: req.query,
        user_agent: req.get?.("user-agent"),
        remote_address:
            req.ip ??
            req.socket?.remoteAddress,
    };
};