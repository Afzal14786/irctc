import { env } from "../config/env.js";

/**
 * Aborts requests that exceed the configured timeout.
 */
export const timeout_middleware = (timeout_ms = env.REQUEST_TIMEOUT_MS) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          status: "ERROR",
          message: "Request timed out",
        });
      }
    }, timeout_ms);

    res.on("finish", () => {
      clearTimeout(timer);
    });

    res.on("close", () => {
      clearTimeout(timer);
    });

    next();
  };
};

export default timeout_middleware;
