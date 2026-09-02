import { generate_otp } from "@irctc/utils";

/**
 *
 * @returns 6 digit otp
 */
export const create_verification_otp = () => {
  return generate_otp(6);
};
