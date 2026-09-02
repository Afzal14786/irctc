import { redis_client } from "./client.js";

export class RedisClientService {
  constructor(redis_client) {
    if (!redis_client) {
      throw new Error("Redis client requires a valid instance");
    }

    this.redis_client = redis_client;
    this.connecting = null;
  }

  async connect_redis() {
    if (this.redis_client.status === "ready") {
      return this.redis_client;
    }

    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = this.redis_client
      .connect()
      .then(() => this.redis_client)
      .finally(() => {
        this.connecting = null;
      });

    return this.connecting;
  }

  async disconnect_redis() {
    if (this.redis_client.status === "end") {
      return;
    }

    await this.redis_client.quit();
  }
}

export const redis_client_service = new RedisClientService(redis_client);
export default redis_client_service;
