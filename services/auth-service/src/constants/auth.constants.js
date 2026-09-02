export const AUTH_CONSTANTS = Object.freeze({
  /**
   * JWT token type used in the Authorization header.
   */
  ACCESS_TOKEN_TYPE: "Bearer",

  /**
   * Authentication providers.
   *
   * These values correspond to the provider enum used
   * by the database layer.
   */
  PROVIDER_LOCAL: "local",
  PROVIDER_GOOGLE: "google",
  PROVIDER_FACEBOOK: "facebook",
  PROVIDER_GITHUB: "github",

  /**
   * OTP format.
   */
  OTP_LENGTH: 6,

  /**
   * Token purposes.
   */
  TOKEN_PURPOSE_EMAIL_VERIFICATION: "email_verification",
  TOKEN_PURPOSE_PASSWORD_RESET: "password_reset",
  TOKEN_PURPOSE_REFRESH: "refresh_token",
});

export default AUTH_CONSTANTS;
