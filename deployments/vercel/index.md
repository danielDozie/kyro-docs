# Deploying to Vercel

Vercel provides seamless deployment for Astro and Kyro CMS.

## Deployment Steps

1. Push your codebase to a Git repository (GitHub, GitLab, Bitbucket).
2. Import your project into Vercel.
3. Vercel will automatically detect **Astro**.
4. In the Environment Variables section, add your `KYRO_DATABASE_URL`.
5. Click **Deploy**.

## Node.js Serverless vs Vercel Edge

By default, Vercel deploys Astro API routes as Node.js Serverless Functions. This is fully compatible with all Kyro database adapters (SQLite, PostgreSQL, MongoDB).

If you want to use Vercel Edge Functions, you must use an Edge-compatible database adapter such as `createNeonAdapter()` or `createTursoAdapter()`.

### Edge Setup Example (`kyro.config.ts`)

```typescript
import { defineKyroConfig, createTursoAdapter } from '@kyro-cms/core';

export default defineKyroConfig({
  adapter: createTursoAdapter({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});
```
