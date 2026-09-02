import { and, eq, gt } from "drizzle-orm";
import db from "../index.js";
import { refresh_tokens } from "../schemas/schema.refresh_tokens.js";

export class RefreshTokenRepository {
  constructor(db) {
    if (!db) {
      throw new Error("Refresh Token Repository required a database instance");
    }
    this.db = db;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   * @param {Date} expires_at
   *
   * @returns {Promise<Object|null>}
   */

  async create_refresh_token({ user_id, token_hash, expires_at }) {
    const [record] = await db
      .insert(refresh_tokens)
      .values({ user_id, token_hash, expires_at })
      .returning();
    return record;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} token_hash
   *
   * @return {Promise<Object|null>}
   */
  async find_valid_refresh_token({ user_id, token_hash }) {
    const [record] = await db
      .select()
      .from(refresh_tokens)
      .where(
        and(
          eq(refresh_tokens.user_id, user_id),
          eq(refresh_tokens.token_hash, token_hash),
          gt(refresh_tokens.expires_at, new Date()),
        ),
      )
      .limit(1);
    return record ?? null;
  }

  /**
   *
   * @param {String} token_hash
   * @returns {Promise<Object|null>}
   */
  async find_refresh_token_by_hash(token_hash) {
    const [record] = await db
      .select()
      .from(refresh_tokens)
      .where(eq(refresh_tokens.token_hash, token_hash))
      .limit(1);
    return record ?? null;
  }

  /**
   *
   * @param {String} token_id
   * @returns {Promise<Object|null>}
   */
  async delete_refresh_token(token_id) {
    const [record] = await db
      .delete(refresh_tokens)
      .where(eq(refresh_tokens.id, token_id))
      .returning();
    return record ?? null;
  }

  /**
   *
   * @param {String} user_id
   * this is useful during logout-all/suspension/security events
   * @returns {Prmise<Object|null>}
   */
  async delete_user_refresh_tokens(user_id) {
    const [record] = await db
      .delete(refresh_tokens)
      .where(eq(refresh_tokens.user_id, user_id))
      .returning();
    return record;
  }

  /**
   *
   * @param {String} token_id
   * @returns {Promise<Object|null>}
   */
  async revoke_refresh_token(token_id) {
    const [record] = await db
      .update(refresh_tokens)
      .set({ revoked_at: new Date() })
      .where(eq(refresh_tokens.id, token_id))
      .returning();
    return record;
  }
}

export const refresh_token_repository = new RefreshTokenRepository(db);
export default refresh_token_repository;
