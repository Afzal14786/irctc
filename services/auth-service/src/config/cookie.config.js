import { env } from "./env.js";

export const refresh_cookie_config = Object.freeze({
  name: "refresh_token",
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export default refresh_cookie_config;
