# IRCTC Backend

Monorepo for the IRCTC-style train booking backend. pnpm workspaces, one shared
Postgres DB, each service independently dockerized behind an api-gateway.

## Structure
- `apps/api-gateway` — single entrypoint, proxies to each service, terminates auth checks
- `services/*` — one folder per business domain (auth, booking, payment, ...)
- `packages/*` — shared code every service depends on (http helpers, errors, config, db/redis/queue clients, middlewares)
- `infrastructure/` — docker-compose, nginx, and per-datastore config
- `prisma/schema.prisma` — single shared schema
- `docs/architecture/` — design docs

See `docs/architecture/irctc-backend-design.md` for the full design writeup and
`scripts/create-service.sh` for scaffolding a new service in this same shape.

## Getting started
```bash
cp .env.example .env
pnpm install
pnpm docker:up          # brings up postgres, redis, rabbitmq, gateway, auth-service
```
