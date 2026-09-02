import { redis_client } from "./client.js";

export const connect_redis = async () => {
    if (
        redis_client.status === "ready" ||
        redis_client.status === "connecting"
    ) {
        return redis_client;
    }

    await redis_client.connect();

    return redis_client;
};

export const disconnect_redis = async () => {
    if (
        redis_client.status === "end"
    ) {
        return;
    }

    await redis_client.quit();
};