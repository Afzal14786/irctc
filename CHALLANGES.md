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

- every we have to first code some common files which help us while coding these services like `logger`, `api-responses` and all the `errors` and other common `middlewares`. 
---  

### Answer ?? 

**So let decide first, for what the authentication service is responsible for ?**  
The authentication service is responsible for : 
- Authentication
- Authorization
- Password Storing 
- Session Management
- JWT / Refresh Token handling
- OAuth 
- Password Reset
- Email Verification

**and what the user-service is responsible for**  

- view profile
- Personal Details management -- user should able to update their profile
- view booking history  

---  

### work flow and methods we are going to implement here ..  

To understand this in a better way I go through this article which explain how exactly the tables and databases manages in a microservics codebase .  

- Article URL : [microservices-authn-authz-part-1](https://microservices.io/post/architecture/2025/04/25/microservices-authn-authz-part-1-introduction.html) 

> abhi 3 hrs ho chuke hai or ek line of code tk nhi likha hai. It's really hacktic and fucking worst . But i force my brain to do it any how. but fuckig do it 

till now i define the databases means i decided the number of tables and the attributes each table can have . But now still i have to decide how the tables within two different services communicated, and how two tables within the same services going to comminucates :  

**example**  

- as per design principle we should never consider **foreign key** when two tables communicate with two different services tables for *example :* 
    - refresh_token tables need's to check the **user_id** of the **user** and this **user_id** reside in the **user_table** which is in the ***user_service*** although they are having the *same physical database* (in current design patten) but it is good to avoid **foreign key** here so we can **scale** this database latter easily and having one database for each service.  

    - and the other issue is at what moment within the same service two tables are going to communicate.
    **for example :** 
        - let say user is going to update their profile or consider some other scenarios.

- **So this is what i currently I want to know and exploring things step by step**  

### Finally we designed the tables and we break down each tables and decide the attributes ... here is the break down ...   

**Auth Service Tables**

#### auth_users

| Column            | Type                     | Constraints / Description                               |
| ----------------- | ------------------------ | ------------------------------------------------------- |
| `id`              | `UUID` / `BIGINT`        | Primary Key                                             |
| `email`           | `text(255)`           | Unique, Not Null                                        |
| `password_hash`   | `text(255)`           | Hashed password                                         |
| `is_email_verified`| `BOOLEAN`                | Default: `false`                                        |
| `role`            | `ENUM["ADMIN", "USER"]`            | e.g., `'ADMIN'`, `'USER'`                               |
| `status`          | `ENUM["ACTIVE", "SUSPENDED", "BANNED"]`            | e.g., `'active'`, `'suspended'`, `'banned'`            |
| `last_login_at`   | `TIMESTAMP`              | Nullable                                                |
| `created_at`      | `TIMESTAMP`              | Default: `CURRENT_TIMESTAMP`                            |
| `updated_at`      | `TIMESTAMP`              | Auto-updated on row change                              |

---

#### refresh_tokens

| Column       | Type              | Constraints / Description                       |
| ------------ | ----------------- | ----------------------------------------------- |
| `id`         | `UUID` / `BIGINT` | Primary Key                                     |
| `user_id`    | `UUID` / `BIGINT` | Foreign Key → `auth_users(id)` `ON DELETE CASCADE` |
| `token_hash` | `text(255)`    | Hashed refresh token, Unique                    |
| `expires_at` | `TIMESTAMP`       | Token expiration time                          |
| `created_at` | `TIMESTAMP`       | Default: `CURRENT_TIMESTAMP`                   |

---

#### oauth_accounts

| Column            | Type              | Constraints / Description                              |
| ----------------- | ----------------- | ------------------------------------------------------ |
| `id`              | `UUID` / `BIGINT` | Primary Key                                            |
| `user_id`         | `UUID` / `BIGINT` | Foreign Key → `auth_users(id)` `ON DELETE CASCADE`    |
| `provider`        | `ENUM["local", "google"]`     | e.g., `'google'`, `'local'`, `'facebook'`            |
| `provider_user_id`| `text(255)`    | User ID from the external OAuth provider              |
| `created_at`      | `TIMESTAMP`       | Default: `CURRENT_TIMESTAMP`                          |
| *Unique Constraint* |                   | `(provider, provider_user_id)` composite unique key   |

---

#### password_reset_tokens

| Column       | Type              | Constraints / Description                          |
| ------------ | ----------------- | -------------------------------------------------- |
| `id`         | `UUID` / `BIGINT` | Primary Key                                        |
| `user_id`    | `UUID` / `BIGINT` | Foreign Key → `auth_users(id)` `ON DELETE CASCADE`|
| `token_hash` | `text(255)`    | Hashed reset token, Unique                        |
| `expires_at` | `TIMESTAMP`       | Token expiration time                            |
| `used_at`    | `TIMESTAMP`       | Nullable – set when the token is consumed        |
| `created_at` | `TIMESTAMP`       | Default: `CURRENT_TIMESTAMP`                     |

---

#### email_verification_tokens

| Column        | Type              | Constraints / Description                           |
| ------------- | ----------------- | --------------------------------------------------- |
| `id`          | `UUID` / `BIGINT` | Primary Key                                         |
| `user_id`     | `UUID` / `BIGINT` | Foreign Key → `auth_users(id)` `ON DELETE CASCADE` |
| `token_hash`  | `text(255)`    | Hashed verification token, Unique                  |
| `expires_at`  | `TIMESTAMP`       | Token expiration time                             |
| `verified_at` | `TIMESTAMP`       | Nullable – set when email is successfully verified |
| `created_at`  | `TIMESTAMP`       | Default: `CURRENT_TIMESTAMP`                      |  


**note** : the current table desing of this auth-service supports multiple sessions per user  

**example**  
```text
Afzal logs in from laptop
          ↓
refresh token A

Afzal logs in from phone
          ↓
refresh token B

Afzal logs in from browser
          ↓
refresh token C
```  

**Database looks like**  

```markdown
refresh_tokens

id    user_id    token_hash    expires_at
------------------------------------------
1     user-A     hash-A        ...
2     user-A     hash-B        ...
3     user-A     hash-C        ...
```  

**It gives me the option to later implement:**  

```markdown
Logout current session
Logout all sessions
Revoke one session
List active sessions
```  

---  

**User Service Tables**

#### user_profiles

| Column             | Type              | Constraints / Description                                                         |
| ------------------ | ----------------- | --------------------------------------------------------------------------------- |
| `user_id`          | `UUID` / `BIGINT` | Primary Key – manually set to the same value as `auth_users.id` (no formal FK)   |
| `first_name`       | `text(100)`    |                                                                                   |
| `last_name`        | `text(100)`    |                                                                                   |
| `phone`            | `text(20)`     | Nullable                                                                          |
| `date_of_birth`    | `DATE`            | Nullable                                                                          |
| `gender`           | `ENUM["MALE", "FEMALE", "OTHER"]`     | Nullable, e.g., `'MALE'`, `'FEMALE'`, `'OTHER'`                                  |
| `profile_image_url`| `TEXT`            | Nullable                                                                          |
| `created_at`       | `TIMESTAMP`       | Default: `CURRENT_TIMESTAMP`                                                      |
| `updated_at`       | `TIMESTAMP`       | Auto-updated on row change                                                        |

---

#### passenger_profiles

| Column    | Type              | Constraints / Description                                         |
| --------- | ----------------- | ----------------------------------------------------------------- |
| `id`      | `UUID` / `BIGINT` | Primary Key                                                       |
| `user_id` | `UUID` / `BIGINT` | Foreign Key → `user_profiles(user_id)` `ON DELETE CASCADE`       |
| `name`    | `text(100)`    | Full name of the passenger (e.g., family member)                 |
| `age`     | `INT`             | Nullable                                                          |
| `gender`  | `text(20)`     | Nullable, e.g., `'male'`, `'female'`, `'other'`                  |
| *Note*    |                   | This table stores additional passengers, not the primary account holder |

---

#### user_addresses

| Column         | Type              | Constraints / Description                                   |
| -------------- | ----------------- | ----------------------------------------------------------- |
| `id`           | `UUID` / `BIGINT` | Primary Key                                                 |
| `user_id`      | `UUID` / `BIGINT` | Foreign Key → `user_profiles(user_id)` `ON DELETE CASCADE` |
| `label`        | `ENUM["HOME", "OFFICE", "WEEKEND_HOUSE"]`     | e.g., `'Home'`, `'Office'`, `'Weekend House'`              |
| `address_line1`| `text(255)`    |                                                             |
| `city`         | `text(100)`    |                                                             |
| `state`        | `text(100)`    |                                                             |
| `pincode`      | `text(6)`     | and this is fixed, because in India having only 6 digit pin code  |

---

#### user_preferences (we'll implement this latters)

| Column                | Type              | Constraints / Description                                   |
| --------------------- | ----------------- | ----------------------------------------------------------- |
| `id`                  | `UUID` / `BIGINT` | Primary Key                                                 |
| `user_id`             | `UUID` / `BIGINT` | Foreign Key → `user_profiles(user_id)` `ON DELETE CASCADE` |
| `language`            | `text(10)`     | e.g., `'en'`, `'es'`, `'fr'` – Nullable, default `'en'`    |
| `notification_email`  | `BOOLEAN`         | Default: `true`                                             |
| `notification_sms`    | `BOOLEAN`         | Default: `true`                                             |  


#### The database should look like   

**user_profiles table**  
This is the main profile of the account holder.  

```markdown
user_profiles
────────────────────────────────────
user_id
first_name
last_name
phone
date_of_birth
gender
profile_image_url
created_at
updated_at
```  

**Example**  

```markdown
user_profiles

user_id                                first_name   last_name   phone
────────────────────────────────────────────────────────────────────────
550e8400-e29b-41d4-a716-446655440000    Md           Afzal       9876543210
72c1d8a2-...                            Rahul        Kumar       9876543211
```

**Important design**  
`user_id` is the primary key.  
It is the same UUID generated by the Auth Service:  

```text
auth_users.id
      =
user_profiles.user_id
```  

There is no database foreign key between Auth Service and User Service because they are separate service boundaries.  

```markdown
Auth Service
auth_users.id = U001

             ↓ same UUID

User Service
user_profiles.user_id = U001 
```  
> This is a logical relationship, not a cross-service database FK.  

**passenger_profiles**  

This stores people whom the account holder may book tickets for.  
A user can have **many passengers**.  

```markdown
passenger_profiles
────────────────────────────────────
id
user_id
name
date_of_birth
gender
created_at
updated_at
``` 

**Example**  

```markdown
passenger_profiles

id       user_id   name              date_of_birth   gender
────────────────────────────────────────────────────────────
P001     U001      Md Aslam          1975-02-10       male
P002     U001      Fatima Begum      1978-08-21       female
P003     U001      Arman Ansari      2001-06-15       male
P004     U001      Rahul Kumar       2003-11-12       male
```  

**Relationship:**  

```markdown
user_profiles
     │
     │ 1
     │
     │ N
     ▼
passenger_profiles
```  

**For example:**  

```markdown
U001
 ├── P001 → Father
 ├── P002 → Mother
 ├── P003 → Brother
 └── P004 → Friend
```  

> Why `id` is **required** here  

Unlike `user_profiles`, this is a **one-to-many** relationship.  
*One user can have many passenger records, so each passenger needs its own ID.*  

**user_addresses**  

This stores addresses saved by the user.  
Since you've decided that a user can create **multiple addresses**, your model is:  

```markdown
user_profiles
     │
     │ 1
     │
     │ N
     ▼
user_addresses
```  

**table structure:**  

```markdown
user_addresses
────────────────────────────────
id
user_id
label
address_line1
city
state
pincode
created_at
updated_at
```  

**Example**  

```markdown
user_addresses

id     user_id   label            city       state       pincode
──────────────────────────────────────────────────────────────────
A001   U001      home             Delhi      Delhi       110001
A002   U001      home             Ranchi     Jharkhand   834001
A003   U001      office           Bangalore  Karnataka   560001
A004   U001      weekend_house    Godda      Jharkhand   814133
```

---  

#### User Service responsibility in one picture  

```markdown

                         USER SERVICE
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
      user_profiles    passenger_profiles   user_addresses
             │                │                │
             │                │                │
        1 user          many passengers    many addresses
             │                │                │
             └────────────────┴────────────────┘
                              │
                           user_id
```  

**The clean boundary is:**  

```markdown
AUTH SERVICE
────────────────────────
Who is the user?
Can they log in?
Password
OAuth
Sessions
Refresh tokens
Account status
Role

USER SERVICE
────────────────────────
Who is the person?
Name
Phone
DOB
Profile
Passengers
Addresses
```

---  

### The why ? behind this desing for now  

We choose this design because splitting the tables give me more clear picture of the work flow of the system and to keep things seprate. 

So I break down this into multiple tables.  

- Credentials (auth) and profile (user) are split by ownership — security-sensitive vs. general data.
- `role`/`status` sit in auth because they're read from the JWT on every request, no DB call needed.  
- `oauth_accounts` is its own table so one account can link multiple login methods.  
- `refresh_tokens`, `password_reset_tokens`, `email_verification_tokens` are separate from `auth_users` because each is per-session or per-token, not per-user singular.
- `user_profiles.user_id` is the PK itself — always exactly 1:1 with an auth user, no redundant id.
- Real FK within a service, none across services — same reasoning as before, just not repeating it all here.  

> note : to understand the desing pattern and understanding the splitting the database we take help from `claud` . You can refer the chat link : [Claud Chat Link](https://claude.ai/share/47c7f1a3-5cc8-46b3-9101-2614d5924db0)  

**_now it's time to code, let first design the schemas then we'll move and code some basic middlewares like logger's limiters and role.middlewares and so on, then we'll actually code the auth and user service, but first i'll code the auth-service then move to the user-service. let's code this now_**  

---  

**Now it is 21:05 PM, let's go ahead and code the common files which are necessary to code first before implementing the services**  

- i'll first code the logger file which is going to use accross the services and then the middlewares
- faa we fix this logger issue and finally this is working now and easily we are integrating it with other services 
- yes for fixing this i took help from chatgpt and since i am familier for the very first time with this logger's things using `pino` module so we also took help in orgenizing the file and folders and coding of the some parts.  
- this is how the auth service logs look like while running :  

```javascript
➜  backend git:(master) ✗ pnpm dev:auth                           
$ pnpm --filter @irctc/auth-service dev
$ nodemon src/server.js
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
◇ injected env (4) from ../../.env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
[02:19:07.066] INFO: Authentication Service | Server Running on 4001
    host: "0x4f5a4c"
    service: "AUTH_SERVICE"
    env: "development"
    version: "1.0.0"

```  
---  

```javascript
[02:21:55.102] INFO: HTTP request completed
    host: "0x4f5a4c"
    service: "AUTH_SERVICE"
    env: "development"
    version: "1.0.0"
    request_id: "f4d4f5aa-789d-406c-b0e9-765292682394"
    req: {
      "id": "f4d4f5aa-789d-406c-b0e9-765292682394",
      "method": "GET",
      "url": "/favicon.ico",
      "path": "/favicon.ico",
      "query": {},
      "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.134.0 Chrome/148.0.7778.280 Electron/42.8.1 Safari/537.36",
      "remote_address": "::1"
    }
    response: {
      "status_code": 404
    }
    response_time_ms: 6.89
```  
---  

we till now we coded the middlewares and to understand the architecture of packages in a micro service architecture i took help from chatgpt and also to understand some coding part -- sikh rha hu bhai abhi ...   

---  

- abhi bj rahe hai subha ke 4:54 AM, 3 September 2026 and still I am coding this project, and abhi tk hame jo code kiya wo hai  
- niche mention sari file jo aaj raat abhi tk implement hui 

```javascript
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   packages/database/migrations/meta/_journal.json
        modified:   packages/redis/src/index.js
        modified:   packages/redis/src/redis/client.js
        modified:   packages/redis/src/redis/connection.js
        modified:   pnpm-lock.yaml
        modified:   pnpm-workspace.yaml
        modified:   services/auth-service/package.json
        modified:   services/auth-service/src/config/env.js
        modified:   services/auth-service/src/config/logger.js
        modified:   services/auth-service/src/db/index.js
        deleted:    services/auth-service/src/db/repositories/.txt
        modified:   services/auth-service/src/db/schemas/schema.auth_users.js
        modified:   services/auth-service/src/db/schemas/schema.oauth_accounts.js
        modified:   services/auth-service/src/db/schemas/schema.refresh_tokens.js
        deleted:    services/auth-service/src/db/schemas/text.txt
        modified:   services/auth-service/src/server.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        packages/database/migrations/0001_friendly_angel.sql
        packages/database/migrations/meta/0001_snapshot.json
        services/auth-service/src/config/cookie.config.js
        services/auth-service/src/config/jwt.config.js
        services/auth-service/src/constants/
        services/auth-service/src/db/repositories/index.js
        services/auth-service/src/db/repositories/oauth.repository.js
        services/auth-service/src/db/repositories/password-reset.repository.js
        services/auth-service/src/db/repositories/refresh-token.repository.js
        services/auth-service/src/db/repositories/user.repository.js
        services/auth-service/src/db/repositories/verification.repository.js
        services/auth-service/src/routes/
        services/auth-service/src/schemas/
        services/auth-service/src/services/
        services/auth-service/src/utils/
```  

## Chalo sote hai Good Ny8 😴️😪️  
