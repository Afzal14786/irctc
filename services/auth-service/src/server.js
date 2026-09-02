import app from "./app.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";
import { redis_client_service } from "@irctc/redis";

const PORT = env.AUTH_SERVICE_PORT;

const start_server = async () => {
  try {
    /**
     * Connect required infrastructure
     * before accepting HTTP requests.
     */
    await redis_client_service.connect_redis();

    const server = app.listen(PORT, () => {
      logger.info(
        {
          port: PORT,
        },
        "Auth Service started",
      );
    });

    /**
     * HTTP server error.
     */
    server.on("error", (err) => {
      logger.fatal(
        {
          err,
          port: PORT,
        },
        "Auth Service failed to start",
      );

      process.exit(1);
    });

    /**
     * Graceful shutdown.
     */
    const shutdown = async (signal) => {
      logger.info({ signal }, "Shutting down the auth service");

      server.close(async (server_error) => {
        if (server_error) {
          logger.error(
            {
              err: server_error,
            },
            "Error while closing HTTP server",
          );
        }

        try {
          await redis_client_service.disconnect_redis();

          logger.info("Auth service shutdown completed");

          process.exit(0);
        } catch (error) {
          logger.fatal(
            {
              err: error,
            },
            "Error while shutting down infrastructure",
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.fatal(
      {
        err: error,
        port: PORT,
      },
      "Unable to start auth service",
    );

    process.exit(1);
  }
};

start_server();
