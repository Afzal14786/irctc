import { env } from "../config/env.js";

import {
  create_rate_limiter,
  rate_limit_guard,
} from "./rate-limit.middleware.js";

const create_configured_limiter = ({ prefix, window_ms, max, message }) => {
  const limiter = create_rate_limiter({
    prefix,
    window_ms,
    max,
    message,
  });

  return rate_limit_guard(limiter);
};

/**
 * General API limiter.
 *
 * 100 requests / 15 minutes
 */
export const api_limiter = create_configured_limiter({
  prefix: "rl:api:",
  window_ms: env.RATE_LIMIT_API_WINDOW_MS,
  max: env.RATE_LIMIT_API_MAX,
  message: "Too many requests. Please try again later.",
});

/**
 * Login limiter.
 *
 * 8 requests / 15 minutes
 */
export const login_limiter = create_configured_limiter({
  prefix: "rl:login:",
  window_ms: env.RATE_LIMIT_LOGIN_WINDOW_MS,
  max: env.RATE_LIMIT_LOGIN_MAX,
  message: "Too many login attempts. Please try again later.",
});

/**
 * Registration limiter.
 *
 * 5 requests / hour
 */
export const register_limiter = create_configured_limiter({
  prefix: "rl:register:",
  window_ms: env.RATE_LIMIT_REGISTER_WINDOW_MS,
  max: env.RATE_LIMIT_REGISTER_MAX,
  message: "Too many registration attempts. Please try again later.",
});

/**
 * Email action limiter.
 *
 * 5 requests / hour
 */
export const email_action_limiter = create_configured_limiter({
  prefix: "rl:email:",
  window_ms: env.RATE_LIMIT_EMAIL_WINDOW_MS,
  max: env.RATE_LIMIT_EMAIL_MAX,
  message: "Too many email actions requested. Please try again later.",
});
