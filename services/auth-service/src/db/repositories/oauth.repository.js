import { and, eq } from "drizzle-orm";

import db from "../index.js";

import { oauth_accounts } from "../schemas/schema.oauth_accounts.js";

export class OAuthRepository {
  constructor(db) {
    if (!db) {
      throw new Error("OAuthRepository requires a database instance");
    }
    this.db = db;
  }

  /**
   * Find one OAuth account by provider + provider user ID.
   *
   * @param {Object} params
   * @param {string} params.provider
   * @param {string} params.provider_user_id
   *
   * @returns {Promise<Object|null>}
   */
  async find_oauth_account({ provider, provider_user_id }) {
    const [account] = await this.db
      .select()
      .from(oauth_accounts)
      .where(
        and(
          eq(oauth_accounts.provider, provider),
          eq(oauth_accounts.provider_user_id, provider_user_id),
        ),
      )
      .limit(1);

    return account ?? null;
  }

  /**
   * Find all OAuth accounts belonging to a user.
   *
   * @param {string} user_id
   *
   * @returns {Promise<Array>}
   */
  async find_oauth_accounts_by_user_id(user_id) {
    return this.db
      .select()
      .from(oauth_accounts)
      .where(eq(oauth_accounts.user_id, user_id));
  }

  /**
   * Create an OAuth account.
   *
   * @param {Object} params
   * @param {string} params.user_id
   * @param {string} params.provider
   * @param {string} params.provider_user_id
   *
   * @returns {Promise<Object>}
   */
  async create_oauth_account({ user_id, provider, provider_user_id }) {
    const [account] = await this.db
      .insert(oauth_accounts)
      .values({
        user_id,
        provider,
        provider_user_id,
      })
      .returning();

    return account;
  }

  /**
   * Delete an OAuth account by ID.
   *
   * @param {string} account_id
   *
   * @returns {Promise<Object|null>}
   */
  async delete_oauth_account(account_id) {
    const [account] = await this.db
      .delete(oauth_accounts)
      .where(eq(oauth_accounts.id, account_id))
      .returning();

    return account ?? null;
  }
}

/**
 * Default repository instance used by the service.
 */
export const oauth_repository = new OAuthRepository(db);
export default oauth_repository;
