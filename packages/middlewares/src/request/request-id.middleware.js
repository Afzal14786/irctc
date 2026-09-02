import { randomUUID } from "node:crypto";

import { env } from "../config/env.js";

/**
 * Adds a request ID to every request.
 *
 * If the caller already supplied the configured header,
 * reuse it. Otherwise generate a UUID.
 */
export const request_id_middleware = () => {
  return (req, res, next) => {
    const header_name = env.REQUEST_ID_HEADER;

    const incoming_id = req.get(header_name);

    const request_id = incoming_id || randomUUID();

    req.id = request_id;

    res.setHeader(header_name, request_id);

    next();
  };
};

export default request_id_middleware;
