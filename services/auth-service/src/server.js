import app from "./app.js";
import {env} from "./config/env.js";
import logger from "./config/logger.js";

const PORT = env.AUTH_SERVICE_PORT;

const server = app.listen(PORT, ()=> {
    logger.info(`Authentication Service | Server Running on ${PORT}`);
});

server.on("error", (err) => {
    logger.error({err: err}, "error while running authentication service");
    process.exit(1);
});