# Chalanges faced while building this project 

*this is the markdown where i will mention what are the chalanges I faced while designing and building this project from scratch as well as how i researched the problem and things while building this*  

--- 

## Initial thoughts

- I chalange this on **August 31, 2026 Monday**. And I don't know how much time it will take to complete this but yes I will complete this ASAP.
- And also I commit a chalange, that I am not going use any **AI agent for coding**, off course for **research** I may use AI and I'll mention in this markdown exact which point I have used AI but for **coding**, definitely I am **not** going to use any AI agents. 
- The agenda of this project is to make myself comfortable with **backend engineering** and converting **my own thoughts** into **code** and then code will **convert into a virtual world**.  

## First Challange that i faced

_**The management of the codebase**_  

- My question is how we are going to manage the codebase because this backend is having multiple services and each are independent of each other and what we should use to keep this codebase proper.
- After detail review and consideration; for this project we are going to **manage following folder structure**.  

```markdown
irctc-backend/                          ← monorepo root
├── package.json                        ← root, defines workspaces
├── pnpm-workspace.yaml
├── .npmrc
├── .env
├── nginx/
│   └── irctc.conf
├── docs/                               ← your design docs
├── prisma/
│   └── schema.prisma                   ← one shared DB, one schema
│
├── packages/                           ← shared libraries (not services)
│   ├── common/
│   │   ├── package.json                → "@irctc/common"
│   │   └── src/
│   │       ├── logger.js
│   │       ├── apiResponse.js
│   │       ├── asyncHandler.js
│   │       ├── errors.js
│   │       └── index.js                ← re-exports everything
│   │
│   ├── config/
│   │   ├── package.json                → "@irctc/config"
│   │   └── src/
│   │       ├── env.js
│   │       ├── db.js                   ← Prisma client singleton
│   │       ├── redis.js
│   │       └── queue.js                ← RabbitMQ connection
│   │
│   ├── middlewares/
│   │   ├── package.json                → "@irctc/middlewares"
│   │   └── src/
│   │       ├── auth.middleware.js
│   │       ├── role.middleware.js
│   │       ├── errorHandler.middleware.js
│   │       └── rateLimiter.middleware.js
│   │
│   └── queue/
│       ├── package.json                → "@irctc/queue"
│       └── src/
│           ├── producer.js
│           └── consumer.js
│
├── services/                           ← each service = its own package
│   ├── auth/
│   │   ├── package.json                → "@irctc/auth"
│   │   ├── node_modules/               ← symlinked deps, incl. workspace pkgs
│   │   ├── src/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validation.js
│   │   │   ├── strategies/google.strategy.js
│   │   │   ├── lib/                    ← private to this service only
│   │   │   └── index.js                ← exports the router
│   │   └── tests/
│   │
│   ├── user/          (same shape)
│   ├── search/
│   │   └── src/fuzzy.util.js           ← private to search, not shared
│   ├── route/
│   ├── booking/
│   │   └── src/seatLock.service.js     ← private to booking
│   └── payment/
│       └── src/adapters/
│           ├── payment.adapter.interface.js
│           ├── razorpay.adapter.js
│           └── stripe.adapter.js
│
└── gateway/                             ← the app that actually runs
    ├── package.json                     → "@irctc/gateway"
    └── src/
        ├── routes/index.js              ← imports + mounts every service router
        ├── app.js
        └── server.js
``` 

> **note** : Here i took help AI agent for understanding the codebase and the management of files and the trade-offs between different codebase . 

- what we are going to use to maintain this folder structure? 
- ans : `pnpm-workspace.yaml`; This will help us to manage the entire code base very efficiently and here is the break down what each folde contain and how ..  


- Ok this is really a boring task to explain what each folder contains and how it contains everything as well as the flow of folder. FAAAA  
- **here is the detailed folder structure with proper explanation -- some of the things are changed in this folder structure as well as I am explaning why behind this changes**  

```markdown
backend/
│
├── apps/
│   └── api-gateway/
│       ├── src/
│       │   ├── middleware/          # gateway-level: auth check, rate limit, CORS
│       │   ├── routes/              # route table: which path → which service
│       │   ├── proxy/               # forwards requests to each microservice
│       │   ├── health/              # aggregated health check across services
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/
│       ├── package.json
│       └── Dockerfile
│
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── train-service/
│   ├── station-service/
│   ├── route-service/
│   ├── search-service/
│   ├── seat-service/
│   ├── booking-service/
│   ├── payment-service/
│   └── notification-service/
│       (each with the same internal shape — shown below)
│
├── packages/
│   ├── config/          # env loading, per-service config schemas
│   ├── logger/           # shared logger instance/factory
│   ├── errors/           # custom error classes (NotFoundError, ValidationError...)
│   ├── http/              # HTTP_CODES, API_STATUS, apiResponse helpers
│   ├── database/         # Prisma client factory / DB connection helper
│   ├── redis/            # Redis client factory
│   ├── messaging/        # RabbitMQ/Kafka producer & consumer wrappers
│   ├── contracts/        # shared DTOs, event schemas, OpenAPI/type defs
│   ├── validation/       # shared Zod/Joi schemas & helpers
│   └── utils/            # generic helpers (date, string, pagination)
│
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml
│   ├── nginx/
│   ├── postgres/
│   ├── redis/
│   └── elasticsearch/
│
├── docs/
│   └── architecture/
│
├── scripts/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```  

**Why `api-gateway` replaces the old `gateway/` (the very first folder structure)**  

This is the most important conceptual shift from what we described earlier. In the `single-process` version, the gateway imported each service's router directly (import `bookingRouter` from '@irctc/booking') — everything ran in one **Node process**, so that worked.  

Now that each service is its **own container**, that's no longer possible — `api-gateway` and `booking-service` are separate **processes**, possibly on **separate machines**. So **api-gateway** doesn't import anything from `services/`. Instead, `proxy/` holds the logic that forwards an incoming request to the **right service** over HTTP, e.g. using `http-proxy-middleware`:  

**example**  

**in the current purposed architecture**  
```javascript
// apps/api-gateway/src/proxy/booking.proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export const bookingProxy = createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL, // e.g. http://booking-service:4006
  changeOrigin: true,
  pathRewrite: { '^/api/bookings': '' },
});
```  

**in the previous architecture**  
```javascript
// apps/api-gateway/src/routes/index.js
router.use('/api/bookings', authMiddleware, bookingProxy);
router.use('/api/search', searchProxy);
```  

**Inside each service — the DDD/hexagonal layers**  

We've adopted a `clean/hexagonal` architecture per service, which is a solid choice once services get this granular. Using auth-service as the concrete example:

```markdown
services/auth-service/
├── src/
│   ├── domain/              # pure business logic, zero framework/DB knowledge
│   │   ├── entities/User.js
│   │   └── valueObjects/Email.js
│   │
│   ├── application/         # use cases — orchestrate domain + infra
│   │   ├── useCases/loginUser.js
│   │   └── useCases/registerUser.js
│   │
│   ├── infrastructure/      # concrete implementations (the "how")
│   │   ├── postgres/userRepository.js
│   │   └── external/googleOAuthClient.js
│   │
│   ├── interfaces/          # how the outside world talks to this service
│   │   └── http/
│   │       ├── auth.controller.js
│   │       └── auth.routes.js
│   │
│   ├── common/               # helpers private to this service only
│   ├── routes/
│   ├── app.js
│   └── server.js
├── tests/
├── package.json
├── Dockerfile
└── README.md
```  

**Another challange is: what will be the order of implementation and the dependend of services and the depended of common modules**  
- here I am not able to decide from where to start means from exact which point to start, I know that the first step is to setup the files and folder but the question is ?

- **do i need to start coding from `auth-service` or first we have to figure what are the common files we need to implement becuase most of the services dependend some of the common files or say imports (right now i don't have exact word)**  
- **example:**  
    - `api_response.js` : this file give us a common structure to send a proper response
    - `http_status.js` : this file give us all the common status which we use while sending a response
    - `http_codes.js` : this file give us all the common http status codes which we are going to use while sending a response
        - (e.g) : **HTTP_STATUS.OK** | **HTTP_STATUS.UNAUTHORAISED** | **HTTP_STATUS.TOO_MANY_REQUEST**
- so we need to first figure out the order of implementation and then we'll move to the setup of this project and then we'll move to the coding of the common files which are going to use setup the database. 
- we are going to use one single DB only not multiple db for each services  -- bhai abhi itna bhi advance nhi hai 

**I guess i found the answer of the above questions**  

- yes we do need some common files but not every common files which are going do defines inside `/packages`. 
- now we should start by first setting up the folder structure and then first code few common files like we describe just above.

--- 

## This is day 2 : 1st September 2026  

**Today i am going to code the authentiation and user service**  

- what is the things we are going to do here 
- very first things I am going to do is :
    - designing the database for authentication and user service but how ?
    - the real question is how we can saperate the tables means is authentication and user tables is going to be seprate ?
    - or how we gonna decide things will handle and store and exactly what are the `attributes` we gonna define and definitely we are going to use AI here to understand the sepration of tables and implementation in a **micro services architecture**.  

