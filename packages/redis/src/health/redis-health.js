import { redis_client } from "../redis/client.js";

export const is_redis_healthy = async () => {
    try {
        const result = await redis_client.ping();

        return result === "PONG";
    } catch {
        return false;
    }
};