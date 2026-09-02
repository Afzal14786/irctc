import argon2 from "argon2";

/**
 * @class PasswordService
 * @description Handles password hashing and password verification.
 */
export class PasswordService {
  /**
   * Hash a plain-text password.
   *
   * @param {String} password
   * @returns {Promise<String>}
   */
  async hash_password(password) {
    return argon2.hash(password);
  }

  /**
   * Verify a plain-text password against a password hash.
   *
   * @param {String} password
   * @param {String} password_hash
   * @returns {Promise<Boolean>}
   */
  async verify_password(password, password_hash) {
    return argon2.verify(password_hash, password);
  }
}

export const password_service = new PasswordService();
export default password_service;
