# @kyro-cms/create

`@kyro-cms/create` is an interactive scaffolding command-line utility designed to set up a clean, running Kyro CMS workspace in seconds.

---

## 1. Quick Scaffolding

To start the interactive prompt, execute:

```bash
pnpm create @kyro-cms@latest my-cms-project
```

### Supported Package Managers
The CLI detects your running terminal manager automatically and scaffolds lockfiles accordingly:
*   `pnpm` (Recommended)
*   `npm`
*   `yarn`
*   `bun`

---

## 2. Interactive Prompts & Setup Flow

When launched, `@kyro-cms/create` guides you through a series of structural configurations:

1.  **Project Location**: Specify the directory to initialize (defaults to the current path `./`).
2.  **Starter Template Selection**:
    *   `Blog`: Configures collections for pages, articles, authors, and tag metadata.
    *   `E-commerce`: Sets up products, variants, orders, inventories, and customer accounts.
    *   `Minimal`: Scaffolds a single, simple collection with a title and content field for custom builds.
    *   `Kitchen Sink`: Registers every available collection and template for discovery.
3.  **Database Selection**:
    *   `SQLite (Local)`: Automatically sets up Node's native `DatabaseSync` for immediate offline dev.
    *   `PostgreSQL`: Scaffolds a Drizzle Postgres schema structure.
    *   `MongoDB`: Pre-sets environment variables and configurations for NoSQL.
4.  **Auto-Install Dependencies**: Opt-in to install all `package.json` dependencies automatically.

---

## 3. CLI Command Options

You can bypass interactive prompts by passing direct flags:

```bash
npx @kyro-cms/create@latest my-project --template blog --db sqlite --install
```

### Available Command Parameters

| Flag Option | Allowed Inputs | Role |
| :--- | :--- | :--- |
| `-t, --template` | `blog`, `ecommerce`, `minimal`, `kitchen-sink` | Selection for starting collection structures |
| `-d, --db` | `sqlite`, `postgres`, `mongodb` | Selection of database adapter configuration |
| `-i, --install` | None | Installs npm dependencies automatically |
| `-y, --yes` | None | Bypasses all prompt checks and uses default settings |
| `--help` | None | Lists command parameters |

### Non-TTY & Headless CI/CD Support

`create-kyro` includes automatic Non-TTY terminal detection (`!process.stdout.isTTY`). When running in non-interactive CI/CD runners, automated deployment scripts, or background tasks, `create-kyro` automatically falls back to argument scanning and default settings without hanging on stdin prompts.

---

## 4. Programmatic Deployment API

`@kyro-cms/create` packages an automated zero-config deployer API that provisions Cloudflare Workers, Cloudflare D1 (SQLite), Cloudflare R2 (media storage), seeds super admin accounts, and deploys your application. 

*(Note: If you're using the CLI, you can simply run `npx kyro deploy cloudflare` which is provided by the `@kyro-cms/core` package).*

You can run Cloudflare deployments programmatically with real-time SSE progress streaming using this package:

```typescript
import { deployCloudflare } from "@kyro-cms/create/deployers/cloudflare";

for await (const event of deployCloudflare({
  projectDir: "/path/to/project",
  projectName: "my-kyro-app",
  database: "d1",
  adminEmail: "admin@example.com",
})) {
  console.log(event.type, event.step, event.message);
}
```
