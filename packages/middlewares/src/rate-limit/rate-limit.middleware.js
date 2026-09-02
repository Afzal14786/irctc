import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { redis_client } from "@irctc/redis";
import { HTTP_CODES } from "@irctc/http";
import { env } from "../config/env.js";

/**
 * Creates a Redis-backed Express rate limiter.
 *
 * @param {Object} options
 * @param {string} options.prefix
 * @param {number} options.window_ms
 * @param {number} options.max
 * @param {string} options.message
 */
export const create_rate_limiter = ({ prefix, window_ms, max, message }) => {
  if (!prefix) {
    throw new Error("Rate limiter prefix is required");
  }

  const store = new RedisStore({
    sendCommand: async (...args) => {
      return redis_client.call(...args);
    },

    prefix,
  });

  return rateLimit({
    windowMs: window_ms,
    limit: max,

    store,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    handler: (req, res) => {
      return res.status(HTTP_CODES.TOO_MANY_REQUESTS).json({
        status: "FAIL",
        message,
        data: null,
      });
    },
  });
};

/**
 * Middleware that disables rate limiting
 * when RATE_LIMIT_ENABLED=false.
 */
export const rate_limit_guard = (limiter) => {
  return (req, res, next) => {
    if (!env.RATE_LIMIT_ENABLED) {
      return next();
    }

    return limiter(req, res, next);
  };
};
