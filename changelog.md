# Changelog

## v0.12.61 (2026-08-08)

- **`defineKyroConfig` Standardization**: Standardized configuration exports on `defineKyroConfig` to prevent collision with Astro/Vite `defineConfig`.
- **`kyro-app.ts` Core Engine Rebranding**: Rebranded core server initialization from `hono-app.ts` (`HonoAppOptions`) to `kyro-app.ts` (`KyroAppOptions`).
- **Batched Relationship Population**: Optimized `populateRelationships` to execute single batched `IN` queries per collection depth layer instead of $O(N)$ sequential DB lookups.
- **Zero-Latency Access Control**: Synchronous reads from cached instance settings in `checkAccessEnabled()` for zero per-request DB overhead.
- **Non-TTY Terminal Fallback**: Bulletproof Non-TTY CLI execution (`!process.stdout.isTTY` check) and argument parsing in `create-kyro` for headless CI/CD.
- **Cloudflare Deployment "Coming Soon" Mode**: Disabled direct Cloudflare deploy trigger in Admin UI with visual disabled styling and `COMING SOON` badge while Cloudflare deployment features are undergoing refactoring.
- **Configurable Logger**: Added level-gated `Logger` utility controlled by `KYRO_LOG_LEVEL` (`debug`, `info`, `warn`, `error`).

## v0.12.44 (2026-08-04)

- **ESM Code Splitting**: Enabled bundler code-splitting (`splitting: true`), reducing core entrypoint bundle sizes by ~98% to 99.9% (e.g. `api-handler.js` reduced from 2.55 MB to 1.38 KB).
- **Database Adapter Factory Pattern**: Created `AdapterFactory` (`src/database/factory.ts`) with lazy dynamic `import()` loading for database adapters.
- **Admin View Code-Splitting**: Converted heavy admin views (`MediaGallery`, `WebhookManager`, `DeveloperCenter`, `BrandingHub`, `UserManagement` in `Admin.tsx`) to `React.lazy()` + `<Suspense>` dynamic imports.
- **Document Hook Pipeline Pattern**: Implemented `HookPipeline` (`src/hooks/HookPipeline.ts`) using the Pipeline Pattern for document lifecycle hook execution.
- **Field Strategy Pattern Registry**: Created `FieldStrategyRegistry` (`admin/src/services/FieldStrategyRegistry.ts`) establishing a Strategy Pattern for form field renderers.
- **LocalAdapter Handle Recovery**: Enhanced `LocalAdapter` connection lifecycle with `SELECT 1` health checks and `this.db = null` reset on disconnect to prevent `ERR_INVALID_STATE` (database is not open) errors.
- **Vite Dynamic Import Compatibility**: Standardized dynamic driver imports in `drizzle/adapter.ts` with `/* @vite-ignore */` comments, resolving dev server import warnings.

## v0.12.21 (2026-07-27)

- **Collapsible Sidebar & Icon Rail**: Interactive minimization toggle for the admin sidebar with smooth transitions to a compact 76px icon rail mode.
- **Hover Context Tooltips**: Instant floating context tooltips on hover for minimized navigation items.
- **React Portal Dropdowns**: Upgraded `Dropdown.tsx` to mount menus via `createPortal`, floating user account menus cleanly to the right of the minimized rail without clipping.
- **Role-Based Navigation & Explorer Pruning**: Automatic filtering of sidebar links and dashboard quick-actions based on active user role permissions (`super_admin`, `admin`, `editor`, `author`, `customer`).
- **React Hydration & Vite Optimization**: Resolved React hydration mismatch errors in `UserDetail.tsx` and optimized client directives (`client:only="react"`) for dynamic dashboard metric cards and charts.

## v0.12.20 (2026-07-27)

- **Registration Controls**: Added `Enable User Registration` toggle in System Settings global (`/admin/settings/system`) to enable/disable public sign-ups on `/admin/register` and `POST /api/auth/register`.
- **Configurable Default Registration Role**: Added `Default Registration Role` setting allowing administrators to set the automatic role (`customer`, `author`, `editor`, `admin`) for newly registered users.
- **RBAC & Role Assignment Protection**: Restricted user role modifications exclusively to `super_admin` users across REST API endpoints (`POST /api/users`, `PATCH /api/users/:id`) and Admin UI components (`UserDetail`, `UserManagement`).
- **Users REST API Fix**: Fixed `GET /api/users` endpoint to query `sessionAuthAdapter.findUsers()` directly from auth storage.

## v0.12.18 (2026-07-25)

- **Collection Overrides & Dynamic Content**: Full support for overriding dynamic content & block fields (e.g. `"content.recentFeed.selectedItems"`).
- **Admin UI & Layout Fixes**: Fixed `TabsLayout` key preservation during hot reload, excluded discriminator field names from tab item headers, and improved dynamic relationship target title resolution.
- **Astro Integration**: Added React deduplication in Astro Vite configuration and fixed SEO tab selector for collection fields.
- **Templates**: Updated `menuCollection` template to include an optional label field for external links.

## v0.12.17 (2026-07-24)

- **Collection Overrides**: Added support for overriding dynamic content & block fields (e.g. `"content.recentFeed.selectedItems"`).
- **Admin UI Enhancements**: Improved array item header resolution (dynamic relationship target title fetching, discriminator name filtering).
- **SEO Tabs Integration**: Automatic injection of SEO Settings tab for collections with `seo: true`.
- **Database Migrations**: Added database-agnostic legacy tabs flattening utility (`scripts/flatten-tabs.mjs`).

## v0.12.16 (2026-07-21)

- Rebuild and release of Kyro CMS v0.12.16.
