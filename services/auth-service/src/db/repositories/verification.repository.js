import { and, eq, gt, isNull } from "drizzle-orm";
import db from "../index.js";
import { email_verification_tokens } from "../schemas/schema.email_verification_tokens.js";

export class VerificationReporitory {
  constructor(db) {
    if (!db) {
      throw new Error("verification repository required a database instance");
    }
    this.db = db;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   * @param {String} expires_at
   *
   * @returns {Promise<Object>}
   */
  async create_verification_token({ user_id, token_hash, expires_at }) {
    const [record] = await db
      .insert(email_verification_tokens)
      .values({
        user_id,
        token_hash,
        expires_at,
      })
      .returning();

    return record;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   *
   * @returns {Promise<Object|null>}
   */
  async find_active_verification_token({ user_id, token_hash }) {
    const [record] = await db
      .select()
      .from(email_verification_tokens)
      .where(
        and(
          eq(email_verification_tokens.user_id, user_id),
          eq(email_verification_tokens.token_hash, token_hash),
          isNull(email_verification_tokens.verified_at),
          gt(email_verification_tokens.expires_at, new Date()),
        ),
      )
      .limit(1);

    return record ?? null;
  }

  /**
   *
   * @param {String} token_id
   * @returns {Promise<Object|null>}
   */
  async mark_verification_token_verified(token_id) {
    const [record] = await db
      .update(email_verification_tokens)
      .set({ verified_at: new Date() })
      .where(eq(email_verification_tokens.id, token_id))
      .returning();
    return record ?? null;
  }

  /**
   *
   * @param {String} user_id
   * @returns {Promise<Object>}
   */
  async invalidate_user_verification_tokens(user_id) {
    const [record] = await db
      .update(email_verification_tokens)
      .set({ verified_at: new Date() })
      .where(
        and(
          eq(email_verification_tokens.user_id, user_id),
          isNull(email_verification_tokens.verified_at),
        ),
      );

    return record;
  }
}

export const verification_repository = new VerificationReporitory(db);
export default verification_repository;
