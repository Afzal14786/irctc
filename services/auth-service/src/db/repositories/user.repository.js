import { eq } from "drizzle-orm";

import db from "../index.js";
import auth_user from "../schemas/schema.auth_users.js";

export class UserRepository {
  constructor(db) {
    if (!db) {
      throw new Error("user repository required a database instance");
    }
    this.db = db;
  }

  /**
   *
   * @param {String} user_id
   * @returns {Promise<Object|null>}
   */
  async find_by_id(user_id) {
    const [user] = await db
      .select()
      .from(auth_user)
      .where(eq(auth_user.id, user_id))
      .limit(1);
    return user ?? null;
  }

  /**
   *
   * @param {String} email
   * @returns {Promise<Object|null>}
   */
  async find_by_email(email) {
    const [user] = await db
      .select()
      .from(auth_user)
      .where(eq(auth_user.email, email))
      .limit(1);
    return user ?? null;
  }

  /**
   *
   * @param {Object} param
   * @param {String} email
   * @param {String} password_hashed
   * @returns {Promise<Object>}
   */
  async create_user({ email, password_hashed = null }) {
    const [user] = await db
      .insert(auth_user)
      .values({ email, password_hashed })
      .returning();
    return user;
  }

  /**
   *
   * @param {Object} param
   * @param {String} user_id
   * @param {String} password_hashed
   *
   * @returns {Promise<Object|null>}
   */
  async update_user_password({ user_id, password_hashed }) {
    const [user] = await db
      .update(auth_user)
      .set({ password_hashed })
      .where(eq(auth_user.id, user_id))
      .returning();
    return user ?? null;
  }

  /**
   *
   * @param {String} user_id
   * @returns {Promise<Object>}
   */
  async mark_email_verifies(user_id) {
    const [record] = await db
      .select()
      .from(auth_user)
      .set({ is_email_verified: true })
      .where(eq(auth_user.id, user_id))
      .returning();
    return record;
  }

  /**
   *
   * @param {String} user_id
   * @returns {Promise<Object|null>}
   */
  async update_last_login(user_id) {
    const [user] = await db
      .update(auth_user)
      .set({ last_login_at: new Date() })
      .where(eq(auth_user.id, user_id))
      .returning();
    return user ?? null;
  }
}

export const user_repository = new UserRepository(db);
export default user_repository;
