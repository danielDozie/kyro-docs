---
title: Deployment
description: Learn how to deploy your Kyro CMS instance to production using Vercel, Cloudflare Workers, Railway, or Docker.
---

# Deployment Guide

Because Kyro CMS is Astro-native and Edge-ready out-of-the-box, deploying it is virtually identical to deploying any standard Astro SSR application.

---

## 1. Environment Variables

Before deploying, ensure your target environment has the following variables configured:

```bash
# REQUIRED: Your database connection string (PostgreSQL, Neon, MongoDB, or SQLite)
KYRO_DATABASE_URL=postgresql://user:password@host:5432/kyro_cms

# OPTIONAL: Used to bootstrap your first admin user on a fresh database
KYRO_ADMIN_EMAIL=admin@yourdomain.com
KYRO_ADMIN_PASSWORD=SecurePassword123!
```

---

## 2. Vercel (Serverless & Edge Ready)

Vercel provides seamless deployment for Astro and Kyro CMS.

### Deployment Steps:
1. Push your codebase to GitHub.
2. Import the repository into Vercel.
3. Ensure the framework preset is set to **Astro**.
4. Add your `KYRO_DATABASE_URL` under Vercel Environment Variables.
5. Click **Deploy**.

### Node.js Serverless vs Vercel Edge:

* **Node.js Serverless (Default)**: Fully compatible out-of-the-box with all Kyro database adapters (SQLite, PostgreSQL, MongoDB).
* **Vercel Edge**: Use Edge-native HTTP adapters such as `createNeonAdapter()` or `createTursoAdapter()` for edge-compatible database connections.

#### Edge Setup Example (`kyro.config.ts`):
```typescript
import { defineKyroConfig, createTursoAdapter } from '@kyro-cms/core';

export default defineKyroConfig({
  adapter: createTursoAdapter({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});
```

---

## 3. Cloudflare Workers / Pages

Kyro CMS runs natively on Cloudflare Workers and Pages Edge runtimes without native Node.js binary dependencies.

1. Install the Cloudflare Astro adapter: `pnpm add @astrojs/cloudflare`
2. Configure `astro.config.mjs`:
   ```javascript
   import { defineConfig } from 'astro/config';
   import cloudflare from '@astrojs/cloudflare';
   import kyro from '@kyro-cms/astro';

   export default defineConfig({
     output: 'server',
     adapter: cloudflare(),
     integrations: [kyro()],
   });
   ```
3. Deploy with Wrangler: `pnpm dlx wrangler pages deploy`

---

## 4. Railway

Railway makes it simple to provision a PostgreSQL database and host your Kyro CMS application simultaneously.

1. Install Railway CLI: `npm i -g @railway/cli`
2. Authenticate: `railway login`
3. Provision PostgreSQL: `railway add` → Select **PostgreSQL**.
4. Deploy: `railway up`

---

## 5. Docker (VPS / AWS / DigitalOcean)

For hosting on custom infrastructure, Docker provides a production-ready container setup using `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "4321:4321"
    environment:
      - KYRO_DATABASE_URL=postgresql://kyro:kyro@db:5432/kyro
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=kyro
      - POSTGRES_PASSWORD=kyro
      - POSTGRES_DB=kyro
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

To run: `docker-compose up -d`

---

## 6. Framework Agnostic & Standalone Deployment

While Kyro CMS features native integration with Astro via `@kyro-cms/astro`, the core backend engine (`@kyro-cms/core`) is **100% framework-agnostic**. Built on top of Hono and Web Standard Fetch APIs (`Request` / `Response`), Kyro can be embedded or deployed across any JavaScript runtime or full-stack framework.

### Option A: Standalone Node.js HTTP Server (`@hono/node-server`)

For microservice architectures or dedicated API backends deployed on Docker, Railway, Render, or AWS EC2.

**How to use:**
1. Install dependencies: `pnpm add @kyro-cms/core @hono/node-server`
2. Create a `kyro.config.ts` at the project root with your collections and adapter.
3. Create `server.ts` with the following:

```typescript
// server.ts
import { serve } from "@hono/node-server";
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "./kyro.config";

const handler = createKyroHandler(kyroConfig);
const PORT = Number(process.env.PORT) || 4000;

serve({
  fetch: handler,
  port: PORT,
}, (info) => {
  console.log(`[Kyro CMS] Backend running at http://localhost:${info.port}`);
  console.log(`[Kyro CMS] REST API:     http://localhost:${info.port}/api`);
  console.log(`[Kyro CMS] GraphQL API:  http://localhost:${info.port}/api/graphql`);
  console.log(`[Kyro CMS] tRPC API:     http://localhost:${info.port}/api/trpc`);
});
```

4. Run with: `npx tsx server.ts`

---

### Option B: Native Bun Runtime (`Bun.serve`)

Bun provides ultra-fast HTTP request handling natively out of the box with zero additional dependencies.

**How to use:**
1. Install dependencies: `bun add @kyro-cms/core`
2. Create a `kyro.config.ts` at the project root.
3. Create `server.bun.ts`:

```typescript
// server.bun.ts
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "./kyro.config";

const handler = createKyroHandler(kyroConfig);
const PORT = Number(process.env.PORT) || 4000;

export default {
  port: PORT,
  fetch(request: Request) {
    return handler(request);
  },
};

console.log(`[Kyro CMS] Bun server active on http://localhost:${PORT}`);
```

4. Run with: `bun server.bun.ts`

---

### Option C: Next.js (App Router Route Handler)

Mount Kyro inside a Next.js 14/15 application to serve CMS endpoints under `/api/[...kyro]`.

**How to use:**
1. Install in your Next.js project: `pnpm add @kyro-cms/core`
2. Create a `kyro.config.ts` at the project root.
3. Create the catch-all API route at `app/api/[...kyro]/route.ts`:

```typescript
// app/api/[...kyro]/route.ts
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "@/kyro.config";

const handler = createKyroHandler(kyroConfig);

export const GET = (req: Request) => handler(req);
export const POST = (req: Request) => handler(req);
export const PUT = (req: Request) => handler(req);
export const PATCH = (req: Request) => handler(req);
export const DELETE = (req: Request) => handler(req);
export const OPTIONS = (req: Request) => handler(req);
```

4. Start your Next.js dev server: `pnpm dev`

---

### Option D: SvelteKit (`+server.ts`)

Mount Kyro in a catch-all SvelteKit server endpoint.

**How to use:**
1. Install in your SvelteKit project: `pnpm add @kyro-cms/core`
2. Create a `kyro.config.ts` in your `src/lib/` directory.
3. Create the catch-all endpoint at `src/routes/api/[...kyro]/+server.ts`:

```typescript
// src/routes/api/[...kyro]/+server.ts
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "$lib/kyro.config";

const handler = createKyroHandler(kyroConfig);

export const fallback = ({ request }: { request: Request }) => {
  return handler(request);
};
```

4. Start your SvelteKit dev server: `pnpm dev`

---

### Option E: Nuxt 3 (`server/api/[...kyro].ts`)

Mount Kyro inside a Nuxt 3 server route using H3 event handlers.

**How to use:**
1. Install in your Nuxt 3 project: `pnpm add @kyro-cms/core`
2. Create a `kyro.config.ts` at the project root.
3. Create the server route at `server/api/[...kyro].ts`:

```typescript
// server/api/[...kyro].ts
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "~~/kyro.config";

const handler = createKyroHandler(kyroConfig);

export default defineEventHandler((event) => {
  return handler(toWebRequest(event));
});
```

4. Start your Nuxt dev server: `pnpm dev`

---

## 7. Database Migrations

During build or CI/CD pipelines, run the Kyro CLI migration command to keep database schemas in sync:

```bash
npx kyro db migrate
```

> [!IMPORTANT]
> **This command only applies to Drizzle-based adapters.** Under the hood, `kyro db migrate` runs `drizzle-kit migrate`, which requires a valid `drizzle.config.ts` in your project root.

### Adapter Compatibility

| Adapter | Migrations Required? | `kyro db migrate` |
|---|---|---|
| `createDrizzleAdapter` (PostgreSQL) | ✅ Yes | ✅ Supported |
| `createNeonAdapter` (Neon PostgreSQL) | ✅ Yes | ✅ Supported |
| `createTursoAdapter` (Turso / libSQL) | ✅ Yes | ✅ Supported |
| `createLocalAdapter` (SQLite) | ❌ No — schema is managed automatically | Not needed |
| `createMongoDBAdapter` (MongoDB) | ❌ No — MongoDB is schemaless | Not applicable |

For PostgreSQL-based adapters, you should also generate migration files whenever your collections change:

```bash
# Generate migration files from schema changes
npx kyro db generate

# Apply pending migrations
npx kyro db migrate
```
