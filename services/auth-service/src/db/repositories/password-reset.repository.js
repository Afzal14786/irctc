import { eq, gt, isNull } from "drizzle-orm";
import db from "../index.js";
import { password_reset_tokens } from "../schemas/schema.password_reset_tokens.js";

export class PasswordResetRepository {
  constructor(db) {
    if (!db) {
      throw new Error("Password Reset Repository requires a database instance");
    }
    this.db = db;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   * @param {String} expires_at
   * @returns {Promise<Object|null>}
   */

  async create_password_reset_token({ user_id, token_hash, expires_at }) {
    const [record] = await db
      .insert(password_reset_tokens)
      .values({ user_id, token_hash, expires_at })
      .returning();
    return record;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   * @returns {Promise<Object|null>}
   */
  async find_active_password_reset_token({ user_id, token_hash }) {
    const [record] = await db
      .select()
      .from(password_reset_tokens)
      .where(
        and(
          eq(password_reset_tokens.user_id, user_id),
          eq(password_reset_tokens.token_hash, token_hash),
          isNull(password_reset_tokens.used_at),
          gt(password_reset_tokens.expires_at, new Date()),
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
  async mark_password_reset_token_used(token_id) {
    const [record] = await db
      .update(password_reset_tokens)
      .set({ used_at: new Date() })
      .where(eq(password_reset_tokens.id, token_id))
      .returning();
    return record ?? null;
  }

  /**
   *
   * @param {String} user_id
   * @returns {Promise<Object|null>}
   */
  async invalidate_user_password_reset_tokens(user_id) {
    const [record] = await db
      .select()
      .from(password_reset_tokens)
      .where(
        ans(
          eq(password_reset_tokens.user_id, user_id),
          isNull(password_reset_tokens.used_at),
        ),
      );
    return record;
  }
}

export const password_reset_repository = new PasswordResetRepository(db);
export default password_reset_repository;
