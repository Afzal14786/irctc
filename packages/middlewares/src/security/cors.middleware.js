import cors from "cors";

import { env } from "../config/env.js";

/**
 * Creates the application's CORS middleware.
 */
export const cors_middleware = () => {
  if (!env.CORS_ENABLED) {
    return (req, res, next) => {
      next();
    };
  }

  const origins = env.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return cors({
    origin(origin, callback) {
      /**
       * Allow non-browser requests that do not
       * contain an Origin header.
       */
      if (!origin) {
        return callback(null, true);
      }

      if (origins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },

    credentials: env.CORS_CREDENTIALS,
  });
};

export default cors_middleware;
