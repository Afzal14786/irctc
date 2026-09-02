import helmet from "helmet";

export const security_middleware = () => {
  return helmet();
};

export default security_middleware;
