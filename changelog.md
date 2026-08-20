# Changelog

All notable changes to **Kyro CMS** are documented here.

---

## v0.12.70 (2026-08-20)

- **Instant Scaffolding**: `create-kyro` now generates projects instantaneously without blocking on package installation. Automatically detects your active package manager (`pnpm`, `bun`, `yarn`, `npm`) and suggests tailored next steps.
- **Zero-Config Browser Shims**: Added SSR-safe browser `EventEmitter` shims to `@kyro-cms/admin`, eliminating hydration errors and manual Vite alias configuration in user projects.

## v0.12.69 (2026-08-20)

- **Admin Client Hydration**: Standardized admin page routes to `client:only="react"` to prevent SSR serialization mismatches on dynamic form fields.

## v0.12.68 (2026-08-20)

- **Interactive Live Preview**: Added real-time preview with signed JWT tokens (`?draft=true&kyroToken=...`) and custom `admin.preview` URL resolvers.
- **Schema & Global Overrides**: Added `admin.globalOverrides` and deep nested object support for granular collection and global schema customization.
- **Media Optimization**: Added AVIF image format support and improved thumbnail serving in the Admin Media Library.

## v0.12.66 (2026-08-17)

- **Astro 7+ Support**: Upgraded peer dependencies to require Astro 7+.

## v0.12.61 (2026-08-08)

- **`defineKyroConfig` Standardization**: Standardized configuration exports to `defineKyroConfig` to prevent collisions with Astro/Vite `defineConfig`.
- **Query Performance**: Batched relationship population to reduce database queries on nested documents.
- **Access Control Optimization**: Zero-latency permission checks via cached instance settings.
- **Headless CI/CD Scaffolding**: Added automatic non-TTY terminal detection in `create-kyro` for background jobs and headless environments.

## v0.12.44 (2026-08-04)

- **ESM Code Splitting**: Enabled code splitting across core entrypoints, reducing bundle sizes by up to 99%.
- **Admin Lazy Loading**: Code-split heavy admin views (Media Gallery, Webhooks, Dev Center) with `React.lazy` for faster initial dashboard loads.
- **Database Connection Recovery**: Improved SQLite connection lifecycle checks and handle recovery.

## v0.12.21 (2026-07-27)

- **Collapsible Sidebar**: Added minimizable sidebar that transitions into a compact icon rail mode with floating context tooltips.
- **Role-Based Navigation**: Admin sidebar items and actions automatically filter according to user permissions.

## v0.12.20 (2026-07-27)

- **User Registration Controls**: Added toggle in System Settings to control public registration access and default user roles.
- **Role Protection**: Restricted user role modifications exclusively to `super_admin` accounts.

## v0.12.18 (2026-07-25)

- **Dynamic Content Overrides**: Support for customizing dynamic block and relationship fields via `collectionOverrides`.
- **SEO Tab Injection**: Automated SEO metadata tab injection for collections with `seo: true`.
