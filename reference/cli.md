---
title: CLI Reference
description: Complete reference for all Kyro CMS CLI commands available via npx kyro or the installed CLI.
---

# CLI Reference

The Kyro CMS CLI is available as `npx kyro` or as a command in your project after installing `@kyro-cms/core`.

## `kyro dev`

Start the development server with hot reload.

```bash
kyro dev [--port <port>] [--host <host>]
npx kyro dev --port 4321 --host localhost
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--port`, `-p` | `number` | `4321` | Development server port |
| `--host`, `-h` | `string` | `localhost` | Host interface to bind to |

---

## `kyro generate`

Generate TypeScript type definitions and client code from collection configurations or a remote Kyro CMS instance.

```bash
# Generate from local config files
kyro generate --config ./src/kyro --output ./src/types/kyro.d.ts --watch

# Generate from a remote running Kyro instance
kyro generate --url https://my-cms.example.com --api-key kc_abc123 --output ./src/types/kyro.d.ts
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--config`, `-c` | `string` | `./src/kyro` | Path to config file or directory |
| `--output`, `-o` | `string` | `./src/types/kyro.d.ts` | Output file path for generated TypeScript declarations |
| `--watch`, `-w` | `boolean` | `false` | Watch config directory for changes and regenerate automatically |
| `--url` | `string` | — | Base URL of a running Kyro CMS server for remote schema generation |
| `--api-key` | `string` | — | API key for authentication when using `--url` |

---

## Database Commands (`kyro db`)

### `kyro db generate`

Generate migration files from your current database schema definitions via Drizzle Kit.

```bash
kyro db generate
npx kyro db generate
```

---

### `kyro db migrate`

Run pending database migrations.

```bash
kyro db migrate
npx kyro db migrate
```

---

### `kyro db push`

Push schema changes directly to the database in development mode without creating migration files.

```bash
kyro db push
npx kyro db push
```

> [!WARNING]
> In production environments, use `kyro db migrate` rather than `push` to prevent unintended data loss.

---

### `kyro db seed`

Seed the database with default initial data using `src/database/drizzle/seed.ts`.

```bash
kyro db seed
npx kyro db seed
```

---

### `kyro db studio`

Launch Drizzle Studio in your browser to visually explore and edit database tables.

```bash
kyro db studio
npx kyro db studio
```

---

## Authentication Commands (`kyro auth`)

### `kyro auth bootstrap`

Create the initial admin user account. Required on first deployment or setting up a fresh database.

```bash
kyro auth bootstrap --email admin@example.com --password "SecurePass123!" --role admin
```

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--email`, `-e` | `string` | `KYRO_ADMIN_EMAIL` env | Admin user email address |
| `--password`, `-p` | `string` | `KYRO_ADMIN_PASSWORD` env | Admin user password |
| `--role`, `-r` | `string` | `admin` | Admin user role |

---

## System Commands

### `kyro health`

Check system and database connection health (verifies PostgreSQL, MongoDB, or SQLite connectivity).

```bash
kyro health
npx kyro health
```

---

## `kyro-codegen`

Generate TypeScript types from a **running Kyro server** via HTTP. Ships as a binary with the `@kyro-cms/connect` package.

```bash
npx kyro-codegen \
  --url https://my-cms.example.com \
  --api-key kc_abc123 \
  --output ./src/kyro.generated.d.ts
```

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--url` | Yes | — | Base URL of a running Kyro CMS server |
| `--api-key` | Yes | — | API key with access to the schema endpoint |
| `--output` | No | `kyro.generated.d.ts` | Output path |

