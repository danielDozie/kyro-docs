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
   import { kyroAdmin } from '@kyro-cms/admin/integration';

   export default defineConfig({
     output: 'server',
     adapter: cloudflare(),
     integrations: [kyro(), kyroAdmin()],
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



## 6. Database Migrations

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
