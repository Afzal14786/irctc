import app from "./app.js";
import {env} from "./config/env.js";

const PORT = env.AUTH_SERVICE_PORT;
const ENVIRONMENT = env.NODE_ENV;
const SERVICE_NAME = env.AUTH_SERVICE;

const server = app.listen(PORT, ()=> {
    console.info(`The [${SERVICE_NAME}] is running on port ${PORT} in ${ENVIRONMENT}`);
});

server.on("error", (err) => {
    console.error(`error while running ${SERVICE_NAME}`);
});