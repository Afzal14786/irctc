import { refresh_cookie_config } from "../config/cookie.config.js";

/**
 * @class CookieService
 * @description Handles refresh token cookie operations.
 */
export class CookieService {
  constructor(cookie_config) {
    if (!cookie_config) {
      throw new Error("CookieService requires cookie configuration");
    }

    this.cookie_config = cookie_config;
  }

  /**
   * Set refresh token cookie.
   *
   * @param {Object} res
   * @param {String} refresh_token
   * @returns {void}
   */
  set_refresh_cookie(res, refresh_token) {
    const config = this.cookie_config;

    res.cookie(config.name, refresh_token, {
      httpOnly: config.httpOnly,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
      maxAge: config.maxAge,
    });
  }

  /**
   * Clear refresh token cookie.
   *
   * @param {Object} res
   * @returns {void}
   */
  clear_refresh_cookie(res) {
    const config = this.cookie_config;

    res.clearCookie(config.name, {
      httpOnly: config.httpOnly,
      secure: config.secure,
      sameSite: config.sameSite,
      path: config.path,
    });
  }

  /**
   * Get refresh token from request cookies.
   *
   * @param {Object} req
   * @returns {String|undefined}
   */
  get_refresh_token(req) {
    return req.cookies?.[this.cookie_config.name];
  }
}

export const cookie_service = new CookieService(refresh_cookie_config);

export default cookie_service;
