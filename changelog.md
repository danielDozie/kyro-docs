# Changelog

All notable changes to **Kyro CMS** are documented here.

## v0.13.2 (2026-08-24)

- **Dynamic Icon Rendering Engine (`@kyro-cms/admin`, `@kyro-cms/core`)**: Added `DynamicIcon` component with support for cross-library icon rendering, interactive `IconPickerModal`, icon picker form fields, and updated schema override path traversal logic.
- **Model Context Protocol Enhancements (`@kyro-cms/mcp`)**: Added documentation, JSON-RPC stdio protocol refinements, schema scaffolding tools, and configuration validation utilities.

## v0.13.1 (2026-08-24)

- **Admin UI Code Splitting & Performance**: Optimized chunk distribution and lazy loading for heavy admin views and dashboards.
- **Dependency & Package Resolvers**: Improved package installation and workspace dependency linking across monorepo packages.

## v0.13.0 (2026-08-23)

- **Model Context Protocol Server (`@kyro-cms/mcp`)**: Introduced official MCP server empowering AI tools (Claude Desktop, Cursor, Antigravity, GitHub Copilot) to introspect collections, query data, mutate documents, diff & migrate schemas, validate config, and scaffold Astro components.
- **Multi-User Real-Time Collaboration & Presence**: Added native WebSocket presence engine (`/api/ws/presence`), live collaborator avatar stack (`CollaboratorAvatars`), active editing indicators, and per-contributor version attribution tracking (`AutoFormVersionView`).
- **Design Token Synchronization Engine**: Added centralized design token management with `/api/tokens` and dynamic `/api/tokens.css` endpoints for automatic real-time styling synchronization with Astro and Tailwind CSS.
- **AI Intelligence & Semantic Search (`@kyro-cms/ai`)**: Added Prompt-to-Schema synthesis directly within the Admin UI, automated vector embeddings pipeline (`AiVectorPlugin`) with `/api/:collection/semantic-search`, and Vision AI alt-text generation in Media Gallery.
- **Content Health & Quality Auditor**: Integrated real-time SEO, accessibility, and schema validation auditor with dedicated `/admin/content-health` dashboard.
- **Virtual Folder & Tree Hierarchy**: Added nested hierarchy management with tree view and compact mode options in Admin collection lists.
- **Form Layouts & E-Commerce Upgrades**: Enhanced draggable/collapsible Tabs, Accordion, and Array form layouts, multi-item order management schemas, and transactional email templates.

## v0.12.72 (2026-08-22)

- **CLI Package Standardization**: Reverted scaffolding CLI to `@kyro-cms/create` under the official `@kyro-cms` scope to ensure unified `pnpm create @kyro-cms@latest` execution.
- **Dependency Scaffolding Flow**: Scaffolding completes instantly with clear interactive instructions for the developer's detected package manager.

## v0.12.71 (2026-08-21)

- **Admin Dashboard Quick Search**: Improved document title resolution in quick search dropdown (resolving human-readable `name`, `label`, `title`, `email`, `slug` instead of raw hex IDs) with updated responsive styling.
- **Admin UX Refinements**: Polished mobile navigation behavior and layout spacing across admin dashboard views.

## v0.12.70 (2026-08-20)

- **Instant Scaffolding**: `@kyro-cms/create` now generates projects instantaneously without blocking on package installation. Automatically detects your active package manager (`pnpm`, `bun`, `yarn`, `npm`) and suggests tailored next steps.
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
- **Headless CI/CD Scaffolding**: Added automatic non-TTY terminal detection in `@kyro-cms/create` for background jobs and headless environments.

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
