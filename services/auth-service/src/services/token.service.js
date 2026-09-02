import jwt from "jsonwebtoken";
import { jwt_config } from "../config/jwt.config.js";

/**
 * @class TokenService
 * @description Handles JWT access and refresh token generation.
 */
export class TokenService {
  constructor(jwt_config) {
    if (!jwt_config) {
      throw new Error("TokenService requires JWT configuration");
    }

    this.jwt_config = jwt_config;
  }

  /**
   * Generate JWT access token.
   *
   * @param {Object} payload
   * @returns {String}
   */
  generate_access_token(payload) {
    const config = this.jwt_config.access;

    return jwt.sign(payload, config.secret, {
      expiresIn: config.expires_in,
      issuer: config.issuer,
      audience: config.audience,
      algorithm: config.algorithm,
    });
  }

  /**
   * Generate JWT refresh token.
   *
   * @param {Object} payload
   * @returns {String}
   */
  generate_refresh_token(payload) {
    const config = this.jwt_config.refresh;

    return jwt.sign(payload, config.secret, {
      expiresIn: config.expires_in,
      issuer: config.issuer,
      audience: config.audience,
      algorithm: config.algorithm,
    });
  }
}

export const token_service = new TokenService(jwt_config);
export default token_service;
