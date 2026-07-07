# Backend Setup

This document outlines the initial setup and dependencies installed for the backend portion of the project.

## Initialization

The project was initialized using:

```bash
npm init -y
```

TypeScript configuration was generated using:

```bash
npx tsc --init
```

## Production Dependencies

The following packages were installed for the application's runtime:

### Core Framework & API

- **`express`**: Fast, unopinionated web framework for Node.js.
- **`dotenv`**: Module to load environment variables from a `.env` file.

### Database & ORM

- **`pg`**: PostgreSQL client for Node.js.
- **`@prisma/client`** & **`@prisma/adapter-pg`**: Prisma ORM and its PostgreSQL adapter for database access and type-safe queries.

### Security, Validation & Authentication

- **`bcryptjs`**: Library for securely hashing passwords.
- **`jsonwebtoken`**: For generating and verifying JSON Web Tokens (JWT) for authentication.
- **`cors`**: Middleware to enable Cross-Origin Resource Sharing.
- **`helmet`**: Middleware to secure the Express app by setting various HTTP headers.
- **`express-rate-limit`**: Basic rate-limiting to protect against brute-force attacks.
- **`zon` (Zod)**: TypeScript-first schema declaration and validation. _(Note: Typically installed as `zod`, it appears `zon` was installed here)._

### Utilities

- **`axios`**: Promise-based HTTP client.
- **`uuid`**: For generating globally unique identifiers.
- **`winston`**: A versatile logging library for Node.js.

### Client-Side / Shared Libraries

_Note: These are typically frontend libraries, but they were included in the backend dependencies, possibly for a monorepo setup, SSR, or shared types._

- **`@tanstack/react-query`** & **`@tanstack/react-query-devtools`**: Data fetching and state management.
- **`zustand`**: Lightweight state management.

## Development Dependencies

The following packages were installed to support development, TypeScript, and the Prisma CLI:

```bash
yarn add -D @types/bcryptjs @types/cors @types/express @types/jsonwebtoken @types/node @types/pg @types/uuid nodemon prisma ts-node typescript
```

- **`typescript`** & **`ts-node`**: For writing and executing TypeScript code directly.
- **`nodemon`**: Utility that monitors for any changes in your source and automatically restarts the server.
- **`prisma`**: The Prisma CLI for database migrations and studio.
- **`@types/*`**: TypeScript definitions for the respective libraries to provide type safety and intellisense.

## Next Steps

1. **Configure Prisma**: Run `npx prisma init` to set up your Prisma schema and `.env` file.
2. **Setup Scripts**: Add development scripts to your `package.json`:
   ```json
   "scripts": {
     "dev": "nodemon --exec ts-node src/index.ts",
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```
3. **Entry Point**: Create a `src/index.ts` file to initialize your Express server.
