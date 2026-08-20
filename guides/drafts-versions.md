---
title: Drafts & Versioning
description: Unified save system with draft/publish workflows, version history, autosave, and the X-Draft header pattern.
---

# Drafts & Versioning

Kyro CMS provides a built-in versioning system where each document can have multiple versions. The latest version determines the document's status (`draft`, `published`, etc.). The main document table keeps a lightweight `status` column for fast filtering without joining the versions table.

## Per-Collection Configuration

Enable versioning and drafts on a per-collection basis:

```ts
import { defineKyroConfig } from "@kyro-cms/core";

export default defineKyroConfig({
  collections: [
    {
      name: "posts",
      fields: [/* ... */],
      versions: {
        drafts: true,       // Enable draft/publish workflow (default: false)
        maxPerDoc: 10,      // Max versions per doc, older pruned (default: 10)
        retainDeleted: 30,  // Days to retain deleted versions (default: 30)
      },
    },
  ],
});
```

| Option           | Type      | Default | Description                              |
|------------------|-----------|---------|------------------------------------------|
| `drafts`         | `boolean` | `false` | Enable draft/publish workflow            |
| `maxPerDoc`      | `number`  | `10`    | Max versions kept per doc; oldest pruned |
| `retainDeleted`  | `number`  | `30`    | Days to retain versions after deletion   |

## Unified Save Flow

All write requests go through the same PATCH/POST endpoints. Whether a write creates a draft or publishes is controlled by the `X-Draft` HTTP header.

### Create

| Request | Behaviour |
|---------|-----------|
| `POST /api/posts` with `X-Draft: true` | Creates as draft, status = `draft` |
| `POST /api/posts` without `X-Draft` header | Creates as published, status = `published` |

### Update

| Request | Behaviour |
|---------|-----------|
| `PATCH /api/posts/:id` with `X-Draft: true` | Saves as draft version, status stays `draft` |
| `PATCH /api/posts/:id` with `X-Draft: false` (or no header) | Publishes, status becomes `published` |

### Reading Drafts

| Request | Behaviour |
|---------|-----------|
| `GET /api/posts/:id?draft=true` | Returns version-merged document |
| `GET /api/posts/:id?draft=false` | Returns published document only |
| `GET /api/posts/:id` (no param) | Authenticated users see version-merged; anonymous see published |

## Autosave

PATCH with `X-Draft: true` and `?autosave=true` reuses a single version slot instead of creating a new version every time. The autosave column in the `kyro_versions` table marks these rows. The `findVersions` endpoint excludes autosave rows (shows only manual saves). Pruning logic also skips autosave versions.

```bash
curl -X PATCH http://localhost:4321/api/posts/abc123 \
  -H "Content-Type: application/json" \
  -H "X-Draft: true" \
  -d '{"title": "Autosaved draft"}' \
  "?autosave=true"
```

## Version History

`GET /api/posts/:id/_versions` returns all non-autosave versions for a document.

```json
[
  {
    "id": "v1",
    "documentId": "abc123",
    "data": { "title": "Version 1" },
    "status": "published",
    "createdAt": "2025-06-01T00:00:00Z",
    "createdBy": "user_123"
  }
]
```

The Admin UI sidebar shows the version list with preview, compare, and restore actions.

## Status Lifecycle

Documents toggle freely between draft and published:

```
draft → published → draft → published
```

No separate publish, unpublish, or draft-snapshot endpoints are needed. Every write via the `X-Draft` header transitions the status automatically.

## GraphQL Mutations

When versioning with drafts is enabled, mutations accept a `draft` argument:

```graphql
mutation {
  createPost(data: { title: "Draft post" }, draft: true) {
    doc { id title }
  }
}

mutation {
  updatePost(id: "abc", data: { title: "Updated" }, draft: true) {
    doc { id title }
  }
}
```

Queries return published documents by default. Authenticated requests can access draft content via the `draft` argument.

## REST Draft Parameter (`?draft=true` vs `?draft=false`)

The `?draft` query parameter on GET requests controls whether published or draft data is returned:

| Value | Behavior | Access Requirements | Use Case |
|---|---|---|---|
| `false` *(or omitted)* | **Published Version Only** — returns the live published document (`status: "published"`). | Public / Anonymous | Default for public website visitors. |
| `true` | **Latest Working Draft** — returns the latest draft revisions (`status: "draft"` or unpublished changes). | Requires Admin Auth OR valid `&kyroToken=<token>` | Live previews, staging reviews, and editor approvals. |

### What Happens When an Item Has No Draft?
- **Published with No Pending Edits**: If you query `?draft=true` on a document that is already published and has no working draft, Kyro **automatically falls back to the published record**. You will never get a 404 simply because no draft edits exist.
- **Draft Only (Never Published)**: If a public visitor queries a draft-only item without `?draft=true`, Kyro filters it out and returns `404 Not Found` to keep unpublished work private.
- **Collections Without Drafts**: If a collection has `drafts: false`, all saves are immediately live; `?draft=true` and `?draft=false` return the same live record.

## Live Preview & Preview Tokens

Kyro CMS includes an integrated live preview system that allows editors to preview unpublished draft content in full fidelity directly within the Admin UI.

### Live Preview Workflow

1. Click the **Preview** button in the document action bar or press `Cmd/Ctrl + P`.
2. The editor expands to a **full-width interactive live viewport** embedded directly in the admin.
3. The server generates a signed preview JWT token (`kyroToken`) valid for 1 hour.
4. The embedded iframe requests your frontend route with `?draft=true&kyroToken=<token>`, displaying unpublished draft states in real time.
5. The preview header bar includes a **Reload Preview** button (`RefreshCw`), **Open in New Tab** (`ExternalLink`), and live connecting indicators.

### Customizing the Preview URL in Collections or Overrides

By default, preview URLs resolve to `/:collection/:slug` (or `/:collection/:id`). You can customize this logic directly on the collection definition or via `admin.collectionOverrides`:

```typescript
// In kyro.config.ts or collection file
import { defineCollection } from "@kyro-cms/core";

export const Products = defineCollection({
  slug: "products",
  admin: {
    preview: (doc, { token }) => {
      const identifier = doc.slug || doc.id;
      return `/menu/${identifier}?draft=true&kyroToken=${token}`;
    },
  },
  fields: [/* ... */],
});
```

Or in `collectionOverrides`:

```typescript
export default defineKyroConfig({
  admin: {
    collectionOverrides: {
      products: {
        admin: {
          preview: (doc, { token }) => `/menu/${doc.slug || doc.id}?draft=true&kyroToken=${token}`,
        },
      },
    },
  },
});
```

### Reading Draft Content in Astro Pages

In your Astro page templates, inspect the query parameters and pass `draft` and `token` to the Kyro Client:

```astro
---
// src/pages/menu/[slug].astro
import Layout from "../../layouts/Layout.astro";
import { client } from "../../lib/kyro";

const { slug } = Astro.params;
const isDraft = Astro.url.searchParams.get("draft") === "true";
const kyroToken = Astro.url.searchParams.get("kyroToken");

const product = await client.collection("products").findBySlug(slug, {
  draft: isDraft,
  token: kyroToken,
});

if (!product) {
  return Astro.redirect("/404");
}
---

<Layout title={`${product.name} | Lagos Buka`}>
  <h1>{product.name}</h1>
  <p>{product.description}</p>
  {isDraft && <div class="preview-badge">Live Preview Mode</div>}
</Layout>
```

## Admin UI

When versioning is enabled for a collection, the Admin UI adapts with:

- **Save Draft / Publish buttons** in the ActionBar
- **Status badges** (`Draft`, `Published`, `Unpublished Changes`) in list and detail views
- **Autosave indicator** showing real-time draft status
- **Version history panel** with preview, compare, and restore
- **Action Bar View Reset** — switching documents automatically resets the active tab to `Edit`


