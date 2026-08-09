---
title: Getting Started
description: Quick start guide to creating a Kyro CMS project or adding it to an existing Astro app.
---

# Getting Started

Kyro CMS is built for **Astro** from the ground up. Unlike other CMS solutions that bolt on Astro support, Kyro is architected to leverage Astro's islands architecture, server output modes, and performance-first approach.

## Option 1: Create New Project (Recommended)

The easiest way to start is with the `@kyro-cms/create` CLI, which scaffolds a fresh Astro project pre-configured with Kyro CMS, a database adapter, and styling of your choice.

```bash
pnpm create @kyro-cms@latest
```

This will launch an interactive wizard that asks you a few questions:

1. **Project name**: The name of your new directory.
2. **Database**: Choose between SQLite (default/dev), PostgreSQL, or MongoDB.
3. **Styling**: Tailwind CSS, CSS Modules, Styled Components, or None.
4. **Authentication**: Enable JWT authentication and role-based access.
5. **Starting template**: Choose from Blog, E-Commerce, Minimal, or Kitchen Sink templates.

Once complete, `cd` into your project and start the development server:

```bash
cd my-kyro-app
npm install
npm run dev
```

Visit `http://localhost:4321/admin` to access your new CMS dashboard, and `http://localhost:4321/graphql` for the interactive GraphQL playground.

## Option 2: Add to Existing Astro Project

If you already have an Astro project, you can easily integrate Kyro CMS.

### 1. Install Dependencies

::: info Modular Architecture
Kyro CMS features a decoupled architecture split into two packages:
- **`@kyro-cms/core`** — Headless CMS engine, ORM adapters, and auto-generated APIs (REST, GraphQL, tRPC, WebSocket).
- **`@kyro-cms/admin`** — React-powered visual management dashboard.

Install both packages for the complete CMS experience, or use `@kyro-cms/core` standalone for headless API-only backends.
:::

```bash
npm install @kyro-cms/core @kyro-cms/admin
```

### 2. Create your Configuration

At the root of your project, create a `kyro.config.ts` file. This is the **single source of truth** for your entire CMS.

```typescript
// kyro.config.ts
import { defineKyroConfig, createLocalAdapter } from "@kyro-cms/core";
import { coreGlobalSettings } from "@kyro-cms/core/templates";

export default defineKyroConfig({
  adapter: createLocalAdapter({ path: "./data/kyro.db" }),
  collections: [
    {
      slug: "posts",
      label: "Posts",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true },
        { name: "content", type: "richtext" },
        { name: "published", type: "checkbox", defaultValue: false },
      ],
    },
  ],
  globals: coreGlobalSettings, // Default core settings panels (Site, SEO, Brand, Email, Storage, Access, System)
});
```

> [!NOTE]
> **Understanding `globals` & Setting Bundles:**
> Passing `globals` registers settings panels and singleton schemas in your admin dashboard and API layer.
> - **`coreGlobalSettings` (Default & Recommended):** Includes the 7 core settings panels needed by standard content sites and blogs: **Site, SEO, Brand, Email, Storage, Access, and System**.
> - **`allGlobalSettings` (E-Commerce Use Case):** Use `allGlobalSettings` when building e-commerce or store applications. In addition to the 7 core panels, it adds **Store Settings** (currency, tax rules) and **Shipping Settings** (zones, rates).
> - **Custom Singletons:** You can also define custom global schemas directly in `globals` (e.g. `{ slug: "header-banner", label: "Header Banner", fields: [...] }`), or omit `globals` altogether if you only want custom collections.

### Global Settings Options

Kyro CMS provides pre-built global setting panels exported from `@kyro-cms/core/templates` that you can import and pass to `globals`:

| Export / Global Option | Panel Slug | Included in `coreGlobalSettings`? | Description |
|------------------------|------------|-----------------------------------|-------------|
| `siteSettingsGlobal` | `site-settings` | ✅ Yes | Site title, tagline, logo, description, maintenance mode |
| `seoSettingsGlobal` | `seo-settings` | ✅ Yes | Default meta title, description, OpenGraph image, Twitter handle |
| `brandSettingsGlobal` | `brand-settings` | ✅ Yes | Primary brand colors, favicon, custom theme styles |
| `emailSettingsGlobal` | `email-settings` | ✅ Yes | SMTP host, port, authentication, sender email & name |
| `storageSettingsGlobal` | `storage-settings` | ✅ Yes | S3, R2, GCS, Cloudinary, FTP, and local storage provider settings |
| `accessSettingsGlobal` | `access-settings` | ✅ Yes | User registration toggles, default roles, email verification |
| `systemSettingsGlobal` | `system-settings` | ✅ Yes | System logs, cache purge options, API key management |
| `storeSettingsGlobal` | `store-settings` | 🛒 E-Commerce only (`allGlobalSettings`) | Store details, currency symbol, tax calculation rules |
| `shippingSettingsGlobal` | `shipping-settings` | 🛒 E-Commerce only (`allGlobalSettings`) | Shipping zones, flat rates, free shipping thresholds |

#### Pre-packaged Bundles:
- **`coreGlobalSettings` (Recommended Default)**: Includes the 7 core panels above (omitting store & shipping).
- **`allGlobalSettings` (E-Commerce & Stores)**: Includes all 9 global settings panels (adds Store & Shipping).
- **Custom Singletons**: You can also define your own custom global schemas directly in `globals` (e.g. `{ slug: "header-banner", label: "Header Banner", fields: [...] }`).

> [!TIP]
> **Using Pre-built Templates:** Instead of writing collections from scratch, you can import Kyro's pre-built templates (like `blog`, `ecommerce`, `minimal`) directly into your config:
> ```typescript
> import { defineKyroConfig } from "@kyro-cms/core";
> import { templateCollections, allGlobalSettings } from "@kyro-cms/core/templates";
>
> export default defineKyroConfig({
>   adapter,
>   collections: templateCollections.blog,
>   globals: allGlobalSettings,
> });
> ```

### 3. Add the Astro Integration

Update your `astro.config.mjs` to include the Kyro integration:

```js
import { defineConfig } from "astro/config";
import kyro from "@kyro-cms/core/integration";

export default defineConfig({
  integrations: [
    kyro(), // Auto-mounts API endpoints and the Admin UI at `/admin`
  ],
});
```

This automatically sets up your API routes and mounts the admin dashboard at `/admin`.

> [!TIP]
> **Customizing Base Paths:** You can easily change where Kyro CMS mounts its Admin UI and API. In your `astro.config.mjs`, simply pass `adminPath` and `apiPath` options to `kyro()`. All internal links and routes are fully dynamic and will automatically adjust!
> ```typescript
> export default defineConfig({
>   integrations: [
>     kyro({ adminPath: "/dashboard", apiPath: "/kyro-api" }),
>   ],
> });
> ```

### 4. Setup API Routes (Optional)

If you need custom API route handling in your Astro project, create an endpoint at `src/pages/api/[...kyro].ts`:

```typescript
// src/pages/api/[...kyro].ts
import { createKyroHandler } from "@kyro-cms/core";
import kyroConfig from "../../../kyro.config";

export const ALL = createKyroHandler(kyroConfig);
```

### 5. Start the Server

Start your Astro development server:

```bash
npm run dev
```

You can now access:
- **Admin Dashboard:** `http://localhost:4321/admin`
- **GraphQL Playground:** `http://localhost:4321/graphql`
- **REST API Base:** `http://localhost:4321/api`

## Next Steps

Now that you're up and running, dive into the core concepts:

- Understand the [Architecture](/architecture)
- Configure your [Database Adapter](/guides/database-adapters)

- Explore the [Multi-Protocol APIs](/reference/api-overview)