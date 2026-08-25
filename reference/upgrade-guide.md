---
title: Upgrade Guide
description: Migration instructions for upgrading between major and minor versions of Kyro CMS.
---

# Upgrade Guide

Kyro CMS follows [semantic versioning](https://semver.org/). Future breaking changes and migration steps will be documented here.

---

## v0.13.2

- **Dynamic Icon Rendering Engine (`@kyro-cms/admin`, `@kyro-cms/core`)**: Added `DynamicIcon` component with support for cross-library icon rendering, interactive `IconPickerModal`, icon picker form fields, and updated schema override path traversal logic.
- **Model Context Protocol Enhancements (`@kyro-cms/mcp`)**: Updated MCP stdio transport, JSON-RPC protocol refinements, schema scaffolding tools, and configuration validation utilities.

## v0.13.1

- **Admin UI Code Splitting & Performance**: Optimized chunk distribution and lazy loading for heavy admin views and dashboards.
- **Dependency & Package Resolvers**: Improved package installation and workspace dependency linking across monorepo packages.

## v0.13.0

- **Model Context Protocol Server (`@kyro-cms/mcp`)**: New official package enabling LLMs and AI coding agents (Claude Desktop, Cursor, Antigravity) to query collections, mutate documents, inspect schemas, and scaffold Astro components. Add to your project via `pnpm add -D @kyro-cms/mcp`.
- **Multiplayer Presence & Real-Time Collaboration**: Real-time presence indicators and collaborative awareness are powered by the native WebSocket server. Ensure your Astro adapter supports persistent WebSocket connections (e.g. Node or Cloudflare Durable Objects).
- **Design Tokens API**: Dynamic CSS and token JSON endpoints are now available under `GET /api/tokens` and `GET /api/tokens.css` without requiring custom route configurations.
- **Content Health Dashboard**: The audit engine is now available at `/admin/content-health` for real-time SEO, accessibility, and schema health reports.

## v0.12.72
- **CLI Scaffolding Scope**: Standardized scaffolding package on `@kyro-cms/create`. Projects can now be generated using `pnpm create @kyro-cms@latest`.

## v0.12.71

- **Search & UI Refinements**: Non-breaking maintenance release improving quick search title resolutions and UI dashboard spacing. No migration steps required.

## v0.12.70

- **Zero-Config Browser Shims**: `@kyro-cms/admin` automatically injects SSR-aware browser shims into Vite so users do not need manual aliases or `events` polyfills in their `astro.config.mjs`.
- **Scaffolding CLI**: `@kyro-cms/create` now generates boilerplate instantaneously without running package installation during initialization.

## v0.12.69

- **Admin Client Islands**: All Admin Dashboard components rendered in Astro pages should use `client:only="react"` instead of `client:load` to prevent SSR serialization mismatches.

## v0.12.68

- **Live Preview System**: Full-width interactive preview viewport with signed 1-hour JWT tokens (`?draft=true&kyroToken=<token>`) and custom `admin.preview` resolvers on collections and `collectionOverrides`.
- **Global & Collection Overrides**: Added `admin.globalOverrides` and deep object traversal for schema overrides. No breaking changes; backward compatible with existing flat string paths.

## v0.12.66

- **Astro 7+ Required**: The `astro` peer dependency is now `^7.1.1`. Astro 5 and 6 are no longer supported. Upgrade your project with `pnpm add astro@latest`.

## v0.12.61

- **`defineKyroConfig` Standardization (Breaking)**: The config export is now exclusively `defineKyroConfig`. If you were importing `defineConfig` from `@kyro-cms/core`, rename it to `defineKyroConfig` to avoid collision with Astro/Vite's own `defineConfig`.
- **`kyro-app.ts` Rebranding**: Internal server init renamed from `hono-app.ts` / `HonoAppOptions` to `kyro-app.ts` / `KyroAppOptions`. Update any direct imports of `HonoAppOptions`.

## v0.12.44

- **ESM Code-Splitting Enabled**: `@kyro-cms/core` now emits split ESM chunks (`splitting: true`). If you previously relied on the monolithic bundle shape, dynamic imports may now resolve differently. Verify any custom Vite/Rollup configurations that reference `dist/` internals.

## v0.12.21

- **Admin Sidebar Minimization**: The admin sidebar now collapses to a 76px icon rail. No config changes required; purely additive.
- **Role-Based Navigation**: Sidebar links are automatically filtered by user role (`super_admin`, `admin`, `editor`, `author`, `customer`). Review role assignments to ensure users see the correct navigation items.

## v0.12.20

- **User Registration Toggle**: A new `Enable User Registration` setting controls access to `POST /api/auth/register` and the `/admin/register` page. Registration is disabled by default on new installs — enable it explicitly in **System Settings** if needed.
- **RBAC Role Protection**: Role changes are now restricted to `super_admin` only. Existing `admin`-level code that modifies user roles via the API will receive `403 Forbidden` responses.

## v0.12.18

- **Dynamic Content Overrides**: Full support for `"<blocksFieldName>.<blockSlug>.<fieldInBlock>"` syntax in `collectionOverrides`.
- **Form State & React Deduplication**: Updated `@kyro-cms/astro` integration to deduplicate `react` and `react-dom` in Vite config.
- **Array Item Titles**: Excluded discriminator keys (`linkType`, `type`, `blockType`, etc.) from being selected as tab titles.

## v0.12.17

- **Dynamic Content Overrides**: Supports path syntax `"<blocksFieldName>.<blockSlug>.<fieldInBlock>"` in `collectionOverrides`.
- **Array Item Tab Titles**: Discriminators (`linkType`, `type`, `blockType`, etc.) are automatically ignored in favor of real title/label/relationship targets.
- **Legacy Tabs Migration**: If migrating from legacy nested tab structures, use `node scripts/flatten-tabs.mjs --execute`.

## v0.12.16

Release of Kyro CMS v0.12.16.
