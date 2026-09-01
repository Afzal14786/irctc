/**
 * @function create_bindings
 *
 * @description
 * Customizes the fields attached to every log line.
 *
 * These bindings identify which service produced the log.
 *
 * Example:
 *
 * {
 *   pid: 1234,
 *   host: "auth-server-01",
 *   service: "auth-service",
 *   env: "production",
 *   version: "1.0.0"
 * }
 */
export const create_bindings = ({
    service_name,
    environment,
    version,
}) => {
    if (!service_name) {
        throw new Error("create_bindings requires a service_name");
    }

    return (default_bindings) => ({
        pid: default_bindings.pid,
        host: default_bindings.hostname,

        service: service_name,
        env: environment,

        ...(version ? { version } : {}),
    });
};