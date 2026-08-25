---
title: Configuration Reference
description: Complete API reference for kyro.config.ts, defineKyroConfig(), and all configuration options in Kyro CMS.
---

# Configuration Reference

Kyro CMS is driven by a single `kyro.config.ts` file at the root of your project. Use the `defineKyroConfig` helper from `@kyro-cms/core` for type-safe configuration.

> [!TIP]
> **Why `defineKyroConfig`?**
> Using `defineKyroConfig` avoids naming collisions with Astro's `import { defineConfig } from "astro/config"` and Vite's `defineConfig`. `defineConfig` is also exported as an alias for backwards compatibility.

```typescript
// kyro.config.ts
import { defineKyroConfig, createLocalAdapter } from "@kyro-cms/core";

export default defineKyroConfig({
  adapter: createLocalAdapter({ path: "./data/kyro.db" }),
  // ... options
});
```

## Top-Level Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collections` | `CollectionConfig[]` | `[]` | Collection definitions |
| `globals` | `GlobalConfig[]` | `[]` | Global singleton definitions |
| `adapter` | `BaseAdapter` | — | Database adapter instance (`createLocalAdapter`, `createDrizzleAdapter`, `createMongoDBAdapter`, `createTursoAdapter`, `createNeonAdapter`) |
| `plugins` | `KyroPlugin[]` | `[]` | Plugin instances |
| `auth` | `AuthConfig` | — | Auth configuration |
| `admin` | `AdminConfig` | — | Admin dashboard configuration |
| `upload` | `UploadConfig` | — | Media upload configuration |
| `graphQL` | `GraphQLConfig` | — | GraphQL-specific options |
| `cors` | `CorsOptions` | — | Cross-Origin Resource Sharing configuration |
| `rateLimit` | `RateLimitOptions` | — | API rate limiting rules |
| `localization` | `LocalizationConfig` | — | Multi-language localization configuration |
| `typescript` | `TypescriptConfig` | — | TypeScript type generator options |
| `debug` | `boolean` | `false` | Enable detailed debug logging |

## Collection Config

Each entry in `collections` defines a content type with its own API endpoints, database table, and admin UI.

| Option | Type | Description |
|--------|------|-------------|
| `slug` | `string` | Unique identifier used in API paths and database table names |
| `label` | `string` | Human-readable singular display label in the admin UI |
| `labelPlural` | `string` | Human-readable plural display label in the admin UI |
| `fields` | `Field[]` | Array of field definitions (text, number, relationship, etc.) |
| `access` | `CollectionAccess` | Access control functions for read/create/update/delete |
| `admin` | `AdminCollectionConfig` | Admin UI settings (icon, group, list columns, preview, etc.) |
| `hooks` | `CollectionHooks` | Lifecycle hooks (`beforeChange`, `afterChange`, `afterRead`, etc.) |
| `versions` | `VersionConfig` | Versioning and draft settings (`{ drafts: boolean, maxPerDoc: number }`) |
| `timestamps` | `boolean` | Automatically manage `createdAt` and `updatedAt` fields |
| `tenantScoped` | `boolean` | Enables multi-tenant row-level security (RLS) for the collection |
| `tenantField` | `string` | Custom field name to map tenant relations (defaults to `tenantId`) |
| `upload` | `UploadConfig` | Collection-level file upload settings (static directory, allowed MIME types, max file size) |
| `auth` | `boolean \| AuthConfig` | Enable authentication strategy specifically for this collection (e.g. users, customers) |
| `graphQL` | `{ singularName?: string, pluralName?: string }` | Custom GraphQL type and query naming overrides |
| `seo` | `boolean \| Record<string, any>` | Enable or configure SEO fields metadata |
| `tabs` | `TabConfig[]` | Tabbed layout groupings for fields in the admin edit view |

```typescript
{
  slug: "posts",
  label: "Posts",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "richtext" },
  ],
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
  },
  versions: { drafts: true, maxPerDoc: 10 },
  admin: {
    useAsTitle: "title",
    icon: "FileText",
    group: "Content",
    preview: (doc) => `/blog/${doc.slug}`,
  },
}
```

### AdminCollectionConfig

The `admin` property configures how the collection is displayed and organized in the admin UI and sidebar navigation.

| Option | Type | Description |
|--------|------|-------------|
| `group` | `string` | Sidebar group name (e.g. `"Commerce"`, `"Restaurant Menu"`, `"Content"`). Collections with the same group are grouped into a collapsible section. |
| `folder` | `string` | Alias for `group`. Organizes the collection into a sidebar section. |
| `order` | `number` | Controls the sorting order of the collection within its sidebar group (lower numbers appear first). |
| `icon` | `string` | Icon name from [Lucide](https://lucide.dev/icons) (e.g. `"Utensils"`, `"Receipt"`, `"ShoppingBag"`) or [Heroicons](https://heroicons.com/) (e.g. `"hero:Sparkles"`, `"hero-solid:Fire"`). |
| `useAsTitle` | `string` | The field name to use as the document title in lists, breadcrumbs, and relation dropdowns |
| `defaultColumns` | `string[]` | Array of field names to display as columns in the list view table |
| `hidden` | `boolean` | Hide the collection from the sidebar navigation while keeping APIs active |
| `description` | `string` | Description text displayed beneath the collection title in the admin UI |
| `disableDuplicate` | `boolean` | Hide the "Duplicate" document button in the edit form |
| `disablePreview` | `boolean` | Hide the live preview split panel button in the admin UI |
| `hideAPIURL` | `boolean` | Hide the quick API endpoint link badge in the detail view |
| `pagination` | `{ defaultLimit?: number, limits?: number[] }` | Page limit configuration for list views |
| `layout` | `"split" \| "single"` | Edit view layout. `"split"` places sidebar fields on the right, `"single"` creates a full-width column |
| `preview` | `(doc, options) => string \| Promise<string>` | Preview URL generator — receives document and returns live preview URL |

## Global Config

Globals are singleton documents — there is exactly one instance per global slug. Useful for site settings, SEO defaults, header/footer content, etc.

| Option | Type | Description |
|--------|------|-------------|
| `slug` | `string` | Unique identifier used in API paths |
| `label` | `string` | Human-readable label displayed in sidebar |
| `fields` | `Field[]` | Field definitions |
| `access` | `GlobalAccess` | Access control functions |
| `admin` | `AdminConfig` | Admin UI settings |
| `hooks` | `GlobalHooks` | Lifecycle hooks |
| `versions` | `VersionConfig` | Version history settings |
| `graphQL` | `{ name?: string }` | Custom GraphQL type naming override |
| `typescript` | `{ interface?: string }` | Custom TypeScript interface name override |

```typescript
{
  slug: "site-settings",
  label: "Site Settings",
  fields: [
    { name: "siteName", type: "text" },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "socialLinks", type: "array", fields: [
      { name: "platform", type: "text" },
      { name: "url", type: "text" },
    ]},
  ],
}
```

## Auth Config

Configure authentication, sessions, and security policies.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `secret` | `string` | — | JWT signing secret — load from env variable |
| `tokenExpiration` | `number` | `86400` | Access token expiration duration in seconds |
| `maxLoginAttempts` | `number` | `5` | Consecutive failed logins before account lockout |
| `lockTime` | `number` | `600` | Account lockout duration in seconds |
| `cookies` | `{ secure?: boolean, sameSite?: "strict" \| "lax" \| "none", domain?: string }` | — | Cookie security parameters |
| `forgotPassword` | `{ generateEmailHTML?: fn, generateEmailSubject?: fn }` | — | Custom reset password email templates |

```typescript
auth: {
  secret: process.env.JWT_SECRET,
  tokenExpiration: 3600,
  maxLoginAttempts: 5,
  lockTime: 600,
  cookies: {
    secure: true,
    sameSite: "lax",
  },
}
```

## Admin Config (Top-Level)

Customize the global admin dashboard appearance and behavior.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `meta` | `{ title?: string, description?: string, ogImage?: string }` | — | HTML meta tags (title, description, and preview image) for the admin dashboard |
| `dateFormat` | `string` | `"YYYY-MM-DD"` | Date and time display format used throughout the dashboard |
| `avatar` | `"default" \| "gravatar"` | `"default"` | Profile avatar style selection |
| `disable` | `boolean` | `false` | Set to `true` to completely disable the Admin dashboard route |
| `indexRoute` | `string` | `"/collections"` | Default landing page route path after logging in |
| `components` | `Record<string, any>` | — | Custom React components to override default admin views |
| `collectionOverrides` | `Record<string, CollectionOverrideConfig>` | — | Customize collection settings, inject blocks/tabs, modify fields, and extend relationships |
| `globalOverrides` | `Record<string, GlobalOverrideConfig>` | — | Customize global schemas, labels, permissions, and field overrides |

```typescript
admin: {
  meta: {
    title: "My CMS Admin",
    description: "Manage content easily",
    ogImage: "/og-image.jpg",
  },
  dateFormat: "YYYY-MM-DD",
  avatar: "gravatar",
  indexRoute: "/collections/pages",
  collectionOverrides: {
    pages: {
      labels: { singular: "Landing Page", plural: "Landing Pages" },
      fields: {
        // Direct block path (transparent container traversal)
        recentFeed: {
          selectedItems: {
            relationTo: ["posts", "food-menu"],
          },
        },
        hero: {
          singleSlide: {
            ratingText: { type: "text", label: "Rating Text" },
          },
        },
      },
      // Direct block injection
      blocks: {
        customCta: {
          slug: "customCta",
          label: "Call to Action",
          fields: [{ name: "buttonText", type: "text", label: "Button Text" }],
        },
      },
    },
  },
  globalOverrides: {
    "site-settings": {
      fields: {
        branding: {
          logo: { label: "Primary Brand Logo" },
        },
      },
    },
  },
}
```

## GraphQL Config

Control the auto-generated GraphQL schema and runtime behavior.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxComplexity` | `number` | `1000` | Maximum GraphQL query complexity validation threshold |
| `disablePlayground` | `boolean` | `false` | Disable GraphQL Playground IDE interface |

```typescript
graphQL: {
  maxComplexity: 500,
  disablePlayground: false,
}
```

## Complete Example

```typescript
import {
  defineKyroConfig,
  createLocalAdapter,
} from "@kyro-cms/core";

export default defineKyroConfig({
  adapter: createLocalAdapter({ path: "./data/kyro.db" }),

  collections: [
    {
      slug: "posts",
      label: "Posts",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "text", required: true, unique: true },
        { name: "content", type: "richtext" },
        {
          name: "author",
          type: "relationship",
          relationTo: "users",
        },
        { name: "publishedAt", type: "date" },
      ],
      versions: { drafts: true, maxPerDoc: 25 },
      admin: {
        useAsTitle: "title",
        icon: "FileText",
        preview: (doc) => `/blog/${doc.slug}`,
      },
    },
    {
      slug: "users",
      label: "Users",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email", required: true },
        { name: "role", type: "select", options: [
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
        ] },
      ],
    },
  ],

  globals: [
    {
      slug: "site-settings",
      label: "Site Settings",
      fields: [
        { name: "siteName", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],

  auth: {
    secret: process.env.JWT_SECRET!,
    tokenExpiration: 3600,
    maxLoginAttempts: 5,
  },

  graphQL: {
    maxComplexity: 500,
    disablePlayground: false,
  },

  cors: {
    origins: ["http://localhost:3000"],
    credentials: true,
  },

  rateLimit: {
    window: 60000,
    max: 100,
  },

  admin: {
    meta: { title: "My Kyro CMS" },
  },

  debug: false,
});
```
