---
title: Field Types Reference
description: Comprehensive reference for all 25+ field types available in Kyro CMS collection schemas.
---

# Field Types Reference

Kyro provides 25+ field types for defining collection schemas. Each field type supports common options like `required`, `unique`, `defaultValue`, `admin`, `access`, `validate`, `hooks`, and `deprecated`.

## Common Options

All field types share these configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `required` | `boolean` | `false` | Whether the field must have a value |
| `unique` | `boolean` | `false` | Whether the value must be unique across all documents |
| `defaultValue` | `any` | `undefined` | Default value assigned to new documents |
| `indexed` | `boolean` | `false` | Add a database index for this field |
| `admin` | `AdminOptions` | `{}` | Admin UI configuration |
| `access` | `AccessOptions` | `{}` | Field-level access control |
| `validate` | `(value, options) => true \| string` | `undefined` | Custom validation function |
| `hooks` | `FieldHooks` | `{}` | Lifecycle hooks (`beforeValidate`, `beforeChange`, `afterChange`, `afterRead`) |
| `deprecated` | `boolean \| { message }` | `false` | Mark the field as deprecated in the admin UI |

### Admin Options

The `admin` object customizes how individual fields appear and behave in the document edit view:

| Option | Type | Description |
|--------|------|-------------|
| `position` | `"sidebar" \| "main"` | Place field in the sticky right sidebar (e.g. status, dates, slug, badges) vs the main column |
| `readOnly` | `boolean \| Function` | Field is visible and focusable but cannot be edited |
| `hidden` | `boolean \| Function` | Field is hidden from the admin form UI entirely |
| `placeholder` | `string` | Placeholder text shown inside empty input fields |
| `description` | `string` | Explanatory helper text shown beneath the input |
| `autoGenerate` | `string` | Auto-generate value from another field (e.g. `autoGenerate: "title"` for slugs) |
| `collapsible` | `boolean` | Enable collapsible accordion header for group fields |
| `initCollapsed` | `boolean` | Start accordion, group, or array cards closed by default |
| `display` | `"pills" \| "default"` | Array presentation mode. `"pills"` renders compact inline pill capsules with count multipliers and totals |
| `inline` | `boolean` | Render group subfields horizontally in a flex row |
| `condition` | `Function \| Object` | Conditionally show/hide the field based on other field values |
| `width` | `string` | CSS width constraint (e.g., `"50%"`) |
| `columns` | `number` | Grid column span for tab/group layouts |

### Field-Level Access

```ts
access: {
  read: ({ doc, user }) => boolean,
  update: ({ doc, data, user }) => boolean,
}
```

---

## text

Single-line text input.

```ts
TextConfig: {
  type: 'text',
  minLength?: number
  maxLength?: number
  pattern?: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLength` | `number` | `undefined` | Minimum character length |
| `maxLength` | `number` | `undefined` | Maximum character length |
| `pattern` | `string` | `undefined` | Regex pattern string the value must match |

```ts
{
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  pattern: "^[a-z0-9-]+$",
  admin: { placeholder: "my-post-slug" }
}
```

> [!WARNING]
> The `pattern` option must match the **entire** string. Use `^` and `$` anchors in your regex.

## textarea

Multi-line text input.

```ts
TextareaConfig: {
  type: 'textarea',
  minLength?: number
  maxLength?: number
  rows?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLength` | `number` | `undefined` | Minimum character length |
| `maxLength` | `number` | `undefined` | Maximum character length |
| `rows` | `number` | `5` | Visible row count in the textarea |

```ts
{
  name: "bio",
  type: "textarea",
  rows: 8,
  maxLength: 500,
  admin: { description: "Brief biography (max 500 chars)" }
}
```

## number

Numeric input supporting integers and floats.

```ts
NumberConfig: {
  type: 'number',
  min?: number
  max?: number
  step?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `min` | `number` | `undefined` | Minimum allowed value |
| `max` | `number` | `undefined` | Maximum allowed value |
| `step` | `number` | `1` | Increment step for stepper controls |

```ts
{
  name: "price",
  type: "number",
  min: 0,
  step: 0.01,
  required: true
}
```

## email

Email input with built-in validation.

```ts
EmailConfig: {
  type: 'email',
  unique?: boolean
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `unique` | `boolean` | `false` | Enforce unique email addresses across documents |

```ts
{
  name: "email",
  type: "email",
  required: true,
  unique: true
}
```

## url

URL input with built-in URL validation.

```ts
UrlConfig: {
  type: 'url'
}
```

```ts
{
  name: "website",
  type: "url",
  admin: { placeholder: "https://example.com" }
}
```

> [!TIP]
> URLs are validated client-side and server-side. The value must include a protocol (`http://` or `https://`).

## password

Password field. Passwords are **automatically hashed** before storage and are **never** returned via any API.

```ts
PasswordConfig: {
  type: 'password'
}
```

```ts
{
  name: "password",
  type: "password",
  required: true
}
```

> [!WARNING]
> Password fields are **write-only**. The stored hash is never exposed through REST, GraphQL, or tRPC responses. Attempting to read a password field via `access.read` will still return `null`.

## select

Dropdown select from a predefined list of options.

```ts
SelectConfig: {
  type: 'select',
  options: { label: string, value: string }[]
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `{ label: string, value: string }[]` | `[]` | Available options shown in the dropdown |

```ts
{
  name: "status",
  type: "select",
  required: true,
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" }
  ],
  defaultValue: "draft"
}
```

## radio

Radio button group for selecting a single option.

```ts
RadioConfig: {
  type: 'radio',
  options: { label: string, value: string }[]
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `{ label: string, value: string }[]` | `[]` | Available radio options |

```ts
{
  name: "layout",
  type: "radio",
  options: [
    { label: "Full Width", value: "full" },
    { label: "Boxed", value: "boxed" },
    { label: "Sidebar", value: "sidebar" }
  ],
  defaultValue: "full"
}
```

## checkbox

Boolean checkbox toggle.

```ts
CheckboxConfig: {
  type: 'checkbox'
}
```

```ts
{
  name: "published",
  type: "checkbox",
  defaultValue: false
}
```

## date

Date picker storing values in ISO date format. Set `time: true` to enable time selection.

```ts
DateConfig: {
  type: 'date',
  minDate?: string,
  maxDate?: string,
  time?: boolean
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minDate` | `string` | `undefined` | Earliest selectable date (ISO 8601 string) |
| `maxDate` | `string` | `undefined` | Latest selectable date (ISO 8601 string) |
| `time` | `boolean` | `false` | Enable date + time picker controls |

```ts
{
  name: "publishDate",
  type: "date",
  time: true,
  required: true,
  minDate: "2026-01-01"
}
```

## richtext

Rich text editor powered by TipTap/ProseMirror. Stores content as structured JSONContent.

```ts
RichTextConfig: {
  type: 'richtext',
  defaultValue?: Record<string, any>,
  localized?: boolean
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultValue` | `Record<string, any>` | `undefined` | Initial TipTap JSON document state |
| `localized` | `boolean` | `false` | Enable multi-locale translations |

```ts
{
  name: "content",
  type: "richtext",
  localized: true
}
```

> [!TIP]
> Rich text content is stored as ProseMirror JSON, not raw HTML. Use the `@kyro-cms/rich-text-react` package or `@kyro-cms/astro` components to render it on the frontend.

## markdown

Markdown editor with live preview.

```ts
MarkdownConfig: {
  type: 'markdown',
  localized?: boolean
}
```

```ts
{
  name: "body",
  type: "markdown",
  admin: { description: "Write in Markdown with live preview" }
}
```

## code

Code editor with syntax highlighting.

```ts
CodeConfig: {
  type: 'code',
  language?: string,
  defaultValue?: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | `string` | `"plaintext"` | Syntax highlighting language (e.g. `"typescript"`, `"json"`, `"html"`) |

```ts
{
  name: "snippet",
  type: "code",
  language: "typescript"
}
```

## json

JSON editor. Stores parsed JSON objects and validates input.

```ts
JsonConfig: {
  type: 'json',
  defaultValue?: Record<string, any>
}
```

```ts
{
  name: "metadata",
  type: "json"
}
```

## relationship

Document relationship field (belongs-to or has-many). Stores referenced document ID(s).

```ts
RelationshipConfig: {
  type: 'relationship',
  relationTo: string | string[],
  hasMany?: boolean,
  maxDepth?: number,
  filterOptions?: (args: { data: any, user: any }) => Record<string, any>
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `relationTo` | `string \| string[]` | required | Target collection slug(s), or `"*"` for polymorphic relations |
| `hasMany` | `boolean` | `false` | When `true`, allows selecting multiple related documents |
| `maxDepth` | `number` | `undefined` | Depth threshold for auto-populating relation data |
| `filterOptions` | `Function` | `undefined` | Dynamic filter function returning query filter criteria |

```ts
// Single relationship (belongs-to)
{
  name: "author",
  type: "relationship",
  relationTo: "users",
  required: true
}

// Multiple relationship (has-many)
{
  name: "categories",
  type: "relationship",
  relationTo: "categories",
  hasMany: true
}
```

## upload

File and media upload field referencing an upload collection.

```ts
UploadConfig: {
  type: 'upload',
  relationTo: string,
  hasMany?: boolean,
  maxDepth?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `relationTo` | `string` | required | Upload collection slug (e.g. `"media"`) |
| `hasMany` | `boolean` | `false` | Allow attaching multiple uploaded files |
| `maxDepth` | `number` | `undefined` | Populate depth for file metadata |

```ts
{
  name: "heroImage",
  type: "upload",
  relationTo: "media",
  required: true
}
```

## blocks

Content blocks builder for composing dynamic layout sections.

```ts
BlocksConfig: {
  type: 'blocks',
  blocks?: Block[],
  minRows?: number,
  maxRows?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `blocks` | `Block[]` | `[]` | Array of block definitions (`slug`, `label`, `fields`, `admin`) |
| `minRows` | `number` | `undefined` | Minimum block count constraint |
| `maxRows` | `number` | `undefined` | Maximum block count constraint |

```ts
{
  name: "layout",
  type: "blocks",
  blocks: [
    {
      slug: "hero",
      label: "Hero Banner",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "image", type: "upload", relationTo: "media" }
      ]
    },
    {
      slug: "cta",
      label: "Call to Action",
      fields: [
        { name: "buttonText", type: "text", required: true },
        { name: "link", type: "text", variant: "url" }
      ]
    }
  ]
}
```

## group

Nested field group. Stored as a JSON object (or JSONB in PostgreSQL) in a single database column.

```ts
GroupConfig: {
  type: 'group',
  fields: Field[]
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fields` | `Field[]` | `[]` | Array of sub-fields in the group |

### Reusable Example

```ts
// src/fields/seo.ts
import type { Field } from "@kyro-cms/core";

export const seoGroup: Field = {
  name: "seo",
  type: "group",
  label: "SEO Settings",
  fields: [
    { name: "title", type: "text", maxLength: 60, admin: { placeholder: "SEO Title" } },
    { name: "description", type: "textarea", maxLength: 160 },
    { name: "ogImage", type: "upload", relationTo: "media" }
  ]
};
```

---

### Advantages of Grouping

Using `group` fields provides significant architectural and usability benefits:

1. **Database Schema Cleanliness**: Grouping related fields stores them as a nested JSON object in a single column (`jsonb` on PostgreSQL, `text` on SQLite). This keeps the root table schema clean and prevents hitting maximum column limits in databases.
2. **Encapsulation & Reusability**: You can define a group field in a separate module and import it into multiple collections (e.g., repeating the same Address, Social Links, or SEO block across collections).
3. **Copy & Paste Productivity**: Group fields include built-in Copy/Paste UI buttons in the admin panel header. Content creators can copy the entire group's dataset to their clipboard as a serialized JSON payload and paste it into any matching group field structure.
4. **Custom Group Layouts**: Groups support `admin: { inline: true }` which collapses all nested primitive fields horizontally into a side-by-side flex layout — perfect for related inputs like `width` + `height` or `firstName` + `lastName`.

---

### Gotchas & Limitations

> [!WARNING]
> While group fields are powerful, be aware of these common database and validation gotchas:
>
> 1. **Indexing Nested Fields**: Because group fields store values in a JSON blob, you cannot easily create standard SQL indexes on nested properties (e.g., indexing `seo.title` to speed up searches). If you need to query or sort records frequently by a sub-field, keep it at the top level instead.
> 2. **Query Filtering complexity**: Filtering API requests by nested properties (e.g., `where[seo.title][equals]=value`) requires database-specific JSON path queries which can be slower than querying standard columns.
> 3. **Validation and Required Fields**: If a sub-field within a group is marked as `required: true`, the group itself must have a value for validation to run. If the entire group is omitted or null, nested validation might be skipped or fail silently depending on the database adapter.
> 4. **Layout-Only Alternatives**: Do not confuse `group` with layout containers like `tabs`, `row`, or `collapsible`. Layout fields do **not** nest data in the database — they keep fields flat at the root level of the document and only change how they are grouped visually in the admin UI. Use `group` only when you explicitly want nested object output in your JSON payload.

---

## array

Repeating field group. Stored as a JSON array of objects in the database.

```ts
ArrayConfig: {
  type: 'array',
  fields: Field[]
  minRows?: number
  maxRows?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fields` | `Field[]` | `[]` | Sub-fields for each array item |
| `minRows` | `number` | `0` | Minimum number of items required |
| `maxRows` | `number` | `undefined` | Maximum number of items allowed |

```ts
{
  name: "teamMembers",
  type: "array",
  minRows: 1,
  maxRows: 20,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text" },
    { name: "avatar", type: "upload", mimeTypes: ["image/*"] }
  ]
}
```

> [!TIP]
> Arrays with **4 or fewer primitive sub-fields** automatically render in compact inline mode in the admin UI — no accordion, no expand/collapse.

## tabs

Tabbed field layout for organizing fields into labeled tabs in the admin UI. No effect on data storage.

```ts
TabsConfig: {
  type: 'tabs',
  tabs: { label: string, fields: Field[] }[]
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `{ label: string, fields: Field[] }[]` | `[]` | Tab definitions with label and fields |

```ts
{
  name: "content",
  type: "tabs",
  tabs: [
    {
      label: "Main",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "richText" }
      ]
    },
    {
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" }
      ]
    }
  ]
}
```

> [!NOTE]
> `tabs` is a **layout-only** field type. It does not affect how data is stored in the database — it only organizes the admin UI form. Use `group` when you want data nesting.
> 
> **Copy & Paste:** Tab fields support Copy/Paste UI buttons in the tab bar. Even though tabs are layout-only, you can copy the fields within all tabs to your clipboard and paste them into another tab field layout that shares a matching tabs/fields definition.

## row

Inline horizontal row layout. Renders sub-fields side by side in a single row.

```ts
RowConfig: {
  type: 'row',
  fields: Field[]
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fields` | `Field[]` | `[]` | Sub-fields rendered horizontally |

```ts
{
  type: "row",
  fields: [
    { name: "firstName", type: "text", required: true, admin: { width: "50%" } },
    { name: "lastName", type: "text", required: true, admin: { width: "50%" } }
  ]
}
```

> [!TIP]
> Use `row` inside a `group` or at the top level of a collection to create compact form layouts with fields displayed side by side.

## collapsible

Collapsible field group. Fields can be expanded/collapsed in the admin UI.

```ts
CollapsibleConfig: {
  type: 'collapsible',
  fields: Field[]
  label: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fields` | `Field[]` | `[]` | Sub-fields inside the collapsible |
| `label` | `string` | `""` | Label shown in the collapsible header |

```ts
{
  type: "collapsible",
  label: "Advanced Settings",
  fields: [
    { name: "customCSS", type: "code", language: "css" },
    { name: "customJS", type: "code", language: "javascript" }
  ]
}
```

> [!TIP]
> **Copy & Paste:** Collapsible accordion fields feature Copy/Paste UI buttons in the header row, allowing content creators to duplicate complex settings configurations across collapsible sections instantly.

## ui

UI-only field that renders a custom component without storing any data in the database.

```ts
UiConfig: {
  type: 'ui',
  component: string
  path?: string
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `component` | `string` | required | Path to a custom React component |
| `path` | `string` | `undefined` | Admin route path for the component |

```ts
{
  name: "dashboardPreview",
  type: "ui",
  component: "@/components/CustomDashboardPreview",
  path: "preview"
}
```

> [!WARNING]
> `ui` fields are **not stored** in the database and are **not returned** by any API. They only exist in the admin dashboard UI. They are useful for custom dashboards, preview panels, or embedded tools.

## list

Array of primitive string items (tag lists, keywords, features).

```ts
ListConfig: {
  type: 'list',
  defaultValue?: string[]
}
```

```ts
{
  name: "tags",
  type: "list",
  defaultValue: ["astro", "cms"]
}
```

---

## password

Obfuscated password field for secure credential storage.

```ts
PasswordConfig: {
  type: 'password'
}
```

```ts
{
  name: "password",
  type: "password",
  required: true
}
```

---

## image

Dedicated image upload field with thumbnail preview and count constraints.

```ts
ImageConfig: {
  type: 'image',
  minCount?: number,
  maxCount?: number,
  allowedTypes?: string[],
  maxSize?: number
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minCount` | `number` | `undefined` | Minimum number of required images |
| `maxCount` | `number` | `undefined` | Maximum allowed images |
| `allowedTypes` | `string[]` | `undefined` | Allowed file MIME types (e.g. `["image/png", "image/jpeg"]`) |
| `maxSize` | `number` | `undefined` | Maximum allowed file size in bytes |

```ts
{
  name: "avatar",
  type: "image",
  maxCount: 1,
  allowedTypes: ["image/png", "image/webp"]
}
```

---

## button

Admin UI action trigger button for custom field handlers or webhooks.

```ts
ButtonConfig: {
  type: 'button',
  label: string,
  action?: string,
  method?: string,
  inline?: boolean
}
```

```ts
{
  name: "triggerSync",
  type: "button",
  label: "Sync External Data",
  action: "/api/sync-data",
  method: "POST"
}
```

---

## row

Horizontal layout container that groups child fields in a flex row.

```ts
RowConfig: {
  type: 'row',
  fields: Field[]
}
```

```ts
{
  type: "row",
  fields: [
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
  ]
}
```

---

## collapsible

Accordion container for collapsing complex field groups in the admin UI.

```ts
CollapsibleConfig: {
  type: 'collapsible',
  label: string,
  fields: Field[]
}
```

```ts
{
  type: "collapsible",
  label: "Advanced SEO Overrides",
  fields: [
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea" },
  ]
}
```

## action

Trigger action field for invoking custom server side endpoints or API handlers from the admin form.

```ts
ActionConfig: {
  type: 'action',
  label: string,
  action?: string,
  method?: string,
  inline?: boolean
}
```

```ts
{
  name: "reindexSearch",
  type: "action",
  label: "Re-index Document",
  action: "/api/reindex"
}
```

---

## secret

Masked secret key / token input for API credentials and tokens.

```ts
SecretConfig: {
  type: 'secret'
}
```

```ts
{
  name: "stripeSecretKey",
  type: "secret",
  required: true
}
```

---

## icon

Icon selector field for choosing icons from the admin Lucide icon library.

```ts
IconConfig: {
  type: 'icon'
}
```

```ts
{
  name: "menuIcon",
  type: "icon"
}
```

---

## Comparison Guide

| Need | Use |
|------|-----|
| Single text input | `text` |
| URL address | `text` with `variant: "url"` |
| Multi-line text | `textarea` |
| Numeric value | `number` |
| Rich formatting | `richtext` or `markdown` |
| Document reference (single) | `relationship` |
| Document reference (multiple) | `relationship` with `hasMany: true` |
| Nested JSON data | `group` |
| Repeating items | `array` |
| Simple string tags | `list` |
| Password credential | `password` |
| Secret API key | `secret` |
| Icon selection | `icon` |
| Image asset | `image` |
| UI trigger button | `button` or `action` |
| Horizontal layout | `row` |
| Accordion section | `collapsible` |
| Composable layout | `blocks` |
| Tabbed admin UI | `tabs` |
| File upload | `upload` |
| Non-stored custom UI | `ui` |
