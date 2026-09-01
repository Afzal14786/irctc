/**
 * @function create_development_transport
 *
 * @description
 * Creates a pino-pretty transport for development.
 *
 * Pretty logging should not be used in production.
 * Production logs remain structured JSON.
 */
export const create_development_transport = () => {
    return {
        target: "pino-pretty",

        options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss.l",
            ignore: "pid,hostname",
            singleLine: false,
        },
    };
};