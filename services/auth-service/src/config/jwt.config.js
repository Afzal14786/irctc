import { env } from "./env.js";

export const jwt_config = Object.freeze({
  access: {
    secret: env.JWT_ACCESS_SECRET,
    expires_in: env.JWT_ACCESS_EXPIRE,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithm: "HS256",
  },

  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expires_in: env.JWT_REFRESH_EXPIRE,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithm: "HS256",
  },
});

export default jwt_config;
