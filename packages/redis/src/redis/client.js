import Redis from "ioredis";

import { env } from "../config/env.js";

export const redis_client = new Redis(
    env.REDIS_URL,
    {
        connectTimeout: env.REDIS_CONNECT_TIMEOUT_MS,

        maxRetriesPerRequest:
            env.REDIS_MAX_RETRIES,

        lazyConnect: true,

        enableReadyCheck: true,
    },
);