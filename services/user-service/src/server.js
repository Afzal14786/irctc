import "@irctc/config";
import app from "./app.js";
import {env} from "./config/env.js";
import { z } from "zod";

const PORT = env.USER_SERVICE_PORT;
const NODE_ENV = env.NODE_ENV;
const SERVICE_NAME = env.USER_SERVICE;

const server = app.listen(PORT, ()=> {
    console.info(`the [${SERVICE_NAME}] is running on ${PORT} in [${NODE_ENV}]`);
});

server.on("error", (err) => {
    console.error(`error while running [${SERVICE_NAME}]`);
    process.exit(1);
});

