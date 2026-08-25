---
title: Admin Customization
description: Learn how to customize the Kyro CMS Admin Dashboard and extend the core system with custom plugins.
---

# Admin Customization

Kyro CMS is designed to be highly extensible. While the core system provides a robust API and Admin UI, you will inevitably encounter use-cases specific to your business logic. You can handle these requirements using **Plugins** and **Admin UI Customization**.

## The Plugin System

Plugins are the primary way to package and share custom functionality. A plugin can modify your schema, inject custom API endpoints, register lifecycle hooks, and even inject custom React components into the Admin Dashboard.

### Using Existing Plugins

Kyro provides several official plugins that you can import and register in your `kyro.config.ts`:

```typescript
import { defineKyroConfig, SEOPlugin, AnalyticsPlugin } from "@kyro-cms/core";

export default defineKyroConfig({
  // ...
  plugins: [
    new SEOPlugin(),
    new AnalyticsPlugin(),
  ],
});
```

### Creating Custom Plugins

To create your own plugin, extend the `KyroPlugin` base class.

```typescript
import { KyroPlugin } from "@kyro-cms/core";

export class CustomStripePlugin extends KyroPlugin {
  constructor() {
    super("custom-stripe-plugin");
    this.displayName = "Stripe Integration";
    this.description = "Logs and manages Stripe payment transactions";

    // Register custom collections
    this.collections.push({
      slug: "stripe-logs",
      label: "Stripe Logs",
      fields: [
        { name: "eventId", type: "text", required: true },
        { name: "type", type: "text", required: true },
        { name: "amount", type: "number" },
      ],
    });

    // Register lifecycle hooks
    this.hooks = {
      afterServerStart: [
        async () => {
          console.log("Stripe plugin initialized");
        },
      ],
    };
  }
}
```

## Admin UI Customization

The Admin Dashboard is built with React. You can inject your own custom React components into specific slots within the UI.

### Custom Fields

If the 21 built-in field types aren't enough, you can build your own. For example, a custom color picker:

```typescript
// kyro.config.ts
export default {
  collections: [
    {
      slug: "settings",
      label: "Settings",
      fields: [
        {
          name: "themeColor",
          type: "color",
          admin: {
            // Tell the admin dashboard to use your custom component
            component: "CustomColorPicker"
          }
        }
      ]
    }
  ]
}
```

Then, when mounting your admin dashboard, you register the component:

```astro
---
// admin/index.astro
import { Admin } from '@kyro-cms/admin';
import config from '../kyro.config';
import CustomColorPicker from '../components/admin/CustomColorPicker';

const customComponents = {
  CustomColorPicker
};
---

<Admin client:load config={config} components={customComponents} />
```

### Custom Views & Pages

You can also inject entirely new pages into the sidebar navigation.

```typescript
// kyro.config.ts
export default defineKyroConfig({
  admin: {
    views: [
      {
        path: "/reports",
        name: "Monthly Reports",
        component: "ReportsDashboard",
        icon: "chart-bar"
      }
    ]
  }
});
```

## Granular Collection Overrides (`admin.collectionOverrides`)

One of Kyro's most powerful customization features is **`collectionOverrides`**. It allows you to modify admin options, customize field labels, alter sidebar positioning, and extend relationships on pre-built template collections (like `posts`, `pages`, or `products`) **without editing or duplicating template source code**.

### 1. Overriding Collection Admin Settings

Customize default list columns, icons, and sidebar group names for built-in collections:

```typescript
// kyro.config.ts
import { defineKyroConfig } from "@kyro-cms/core";
import { templateCollections } from "@kyro-cms/core/templates";

export default defineKyroConfig({
  collections: templateCollections["kitchen-sink"],
  admin: {
    collectionOverrides: {
      posts: {
        label: "Blog Articles",
        defaultColumns: ["title", "slug", "status", "updatedAt"],
        icon: "file-text",
        group: "Editorial Content",
      },
    },
  },
});
```

### 2. Dot-Notation Path Overrides (`fields`)

You can target nested fields inside groups, tabs, arrays, or semantic blocks using dot-notation path strings (e.g. `"content.heroBlock.title"` or `"category.relationTo"`).

```typescript
admin: {
  collectionOverrides: {
    posts: {
      fields: {
        // Change category field to allow selecting multiple categories
        "category": {
          relationTo: ["categories", "topics"],
          hasMany: true,
        },
        // Target a field inside nested tabs/blocks
        "content.heroBlock.title": {
          label: "Headline Override",
          admin: { description: "Custom hero title for marketing pages" },
        },
      },
    },
  },
}
```

## Live Preview Configuration (`admin.preview`)

You can attach a custom preview URL generator to any collection or global. Kyro passes the active document and a signed preview token so you can construct authenticated preview paths:

```typescript
export default defineKyroConfig({
  collections: [
    {
      slug: "products",
      admin: {
        preview: (doc, { token }) => `/shop/${doc.slug || doc.id}?draft=true&kyroToken=${token}`,
      },
      fields: [/* ... */],
    },
  ],
  // Alternatively, using collectionOverrides:
  admin: {
    collectionOverrides: {
      products: {
        admin: {
          preview: (doc, { token }) => `/shop/${doc.slug || doc.id}?draft=true&kyroToken=${token}`,
        },
      },
    },
  },
});
```

When clicked in the Admin UI, the editor switches to a full-width live preview iframe with real-time reload controls (`RefreshCw`) and external tab options (`ExternalLink`).

## Form Layouts & Collapsible Accordions

- **Arrays and Nested Groups**: Array items automatically feature collapsible headers/accordions for compact, distraction-free editing.
- **Form Entries Mapping**: JSON field types and form entries display formatted, mapped key-value pairs instead of raw JSON payloads.
- **Action Bar Tab Reset**: The `Edit` / `Version` / `API` tabs strictly reset to `Edit` on document transitions, ensuring a clean editing context.

## Styling the Admin

If you just want to tweak the colors and branding of the Admin Dashboard, you don't need a plugin. Kyro provides a theming utility:

```typescript
import { createAdminStyling } from "@kyro-cms/core/client";

const myTheme = createAdminStyling({
  primaryColor: "#6366f1",
  borderRadius: "medium",
  fontFamily: "Inter, sans-serif",
});
```

You can then pass this theme object or generated CSS variables to your `<Admin />` component.

### Custom Block Visual Identity (Theming)

If you have built custom Semantic Blocks using a plugin or local extension, you can tap into the internal `blockTheme` system so your custom blocks perfectly match the core UI's aesthetic.

By assigning unique Tailwind class strings to your custom block slug, Kyro will automatically render glowing borders, colored icons, and colored `SlidePanel` accent lines for your block.

```typescript
// Example: Registering visual identity for a custom block
import { blockTheme } from "@kyro-cms/admin/components";

// Target your custom block's exact slug
blockTheme["my-custom-quiz-block"] = {
  text: "text-purple-500",
  border: "border-purple-500",
  borderLeft: "border-l-2 border-purple-500"
};
```

### Adding Custom Blocks to the UI Drawer

In Kyro, the `+ Add Block` UI drawer is completely dynamic. You don't need to write any React code to add your custom blocks to the admin panel. 

By simply defining `admin.group` and `admin.description` in your block's schema definition, the CMS will automatically construct the UI drawer category for you.

```typescript
// kyro.config.ts
export default defineConfig({
  collections: [
    {
      name: "pages",
      fields: [
        {
          name: "content",
          type: "blocks",
          blocks: [
            ...coreSemanticBlocks,
            {
              slug: "my-custom-quiz-block",
              label: "Interactive Quiz",
              // The drawer will automatically group this block under "Custom Widgets"
              admin: {
                group: "Custom Widgets",
                description: "A specialized quiz block for engagement"
              },
              fields: [
                { name: "title", type: "text" }
              ]
            }
          ]
        }
      ]
    }
  ]
});
```
If you omit the `admin.group`, Kyro will gracefully fall back to placing your block in a default "Custom Blocks" category.

### Block Picker Modes

Blocks-type fields offer two picker modes controlled by `admin.pickerMode`:

- **`"drawer"` (default):** The slide-out `BlockDrawer` panel with a grid layout, categories, and drag-and-drop support — ideal for larger block sets like page content.
- **`"dropdown"`:** A compact inline dropdown menu that appears below the "Add Element" button — ideal for small sets of inline primitives (e.g., the built-in heading/text/image/button/video/list elements).

```typescript
{
  name: "elements",
  type: "blocks",
  label: "Extra Content Elements",
  blocks: elementBlocks,
  admin: { pickerMode: "dropdown" },
}
```

### Inline Group Layout

Groups support `admin: { inline: true }` to render sub-fields in a horizontal flex row instead of the default vertical stack. This is useful for compact field combinations like label + URL pairs:

```typescript
{
  name: "buttonData",
  type: "group",
  label: "Button",
  admin: { inline: true },
  fields: [
    { name: "text", type: "text", label: "Label" },
    { name: "url", type: "text", label: "URL" },
  ],
}
```

### Compact Array Rendering

Array fields with 4 or fewer sub-fields that are all primitive types (`text`, `textarea`, `number`, `checkbox`, `select`, `radio`, `color`, `email`, `password`, `code`, `markdown`, `upload`) automatically render as compact inline rows — no accordion, no expand/collapse. Each item appears as a single numbered row with inline fields and a remove button.

## Collection & Global Overrides

Overrides allow you to customize how built-in template collections and globals behave without modifying their source definitions. This includes extending relationships, customizing labels, injecting custom blocks/tabs, altering layout, and appending new fields.

### Overview: All the Ways Overrides Work

| Method / Mode | Syntax Example | What It Does |
| :--- | :--- | :--- |
| **Nested Object Tree** | `menuItem: { internalTarget: { ... } }` | Clean hierarchy mirroring your schema without repeating strings |
| **Dot-Notation Path** | `"menuItem.internalTarget": { ... }` | Compact single-line targeting for quick one-off overrides |
| **Transparent Block Traversal** | `hero: { singleSlide: { rating: { ... } } }` | Directly targets blocks without prepending parent `content` field name |
| **Layout Container Transparency** | `"title": { label: "Main Title" }` | Automatically searches through unnamed `tabs`, `rows`, and `collapsibles` |
| **Explicit Tab Targeting** | `"tab[Content].title": { ... }` | Disambiguates and targets fields inside specific named tabs |
| **Array Subfield Granular Patching** | `stats: { label: { placeholder: "100+" } }` | Patches or appends specific subfields inside arrays without redefining all fields |
| **Dynamic Field Creation** | `subtitle: { type: "text", label: "Subtitle" }` | Appends a brand new field to the container when `type` is present |
| **Direct Block Injection** | `blocks: { customCta: { slug, label, fields } }` | Appends new custom blocks to a collection's `blocks` field |
| **Tab Insertion** | `tabs: { "SEO Settings": { fields: [...] } }` | Adds new tabs or wraps a flat collection into a tabbed layout |
| **Top-Level Settings Merging** | `labels: { singular: "Dish" }, timestamps: true` | Overrides collection metadata, versioning, access control, and hooks |
| **Global Schema Overrides** | `admin.globalOverrides: { "site-settings": { ... } }` | Applies identical field, block, and tab overrides to global singletons |

> [!TIP]
> **Modifying and Adding Fields**
> Overrides can be used both to modify properties of **existing** fields and to **append new fields**. If the field path you specify does not exist in the collection, Kyro CMS will automatically append it as a new field at the target path (provided a `type` is specified).

### 1. Flexible Syntax: Nested Objects or Dot-Notation

You can specify field overrides using either **Nested Object Trees** or classic **Dot-Notation Paths**:

```typescript
// kyro.config.ts
export default defineKyroConfig({
  admin: {
    collectionOverrides: {
      menu: {
        fields: {
          // Nested object syntax:
          menuItem: {
            internalTarget: {
              relationTo: ["pages", "posts", "food-menu-category"],
            },
          },
          // ...or dot-notation syntax:
          // "menuItem.internalTarget": { relationTo: ["pages", "posts", "food-menu-category"] }
        },
      },
    },
  },
});
```

---

### 2. Transparent Structural & Block Traversal

You don't need to memorize whether a field is wrapped in `tabs`, `rows`, or a dynamic `blocks` field (like `content`). Kyro transparently navigates through layout containers and block slugs:

```typescript
pages: {
  fields: {
    // Directly target the 'recentFeed' block inside the 'content' blocks field!
    recentFeed: {
      selectedItems: {
        relationTo: ["food-menu", "food-menu-category"],
      },
    },
    // Directly target the 'hero' block and nested 'singleSlide' group
    hero: {
      singleSlide: {
        ratingText: {
          type: "text",
          label: "Rating Text",
        },
        videoBg: {
          type: "upload",
          relationTo: "media",
          label: "Video Background",
        },
      },
    },
  },
}
```

---

### 3. Explicit Tab Selector Syntax (`tab[Name]`)

When multiple tabs contain fields with similar names or when you want to target a specific tab unambiguously:

```typescript
pages: {
  fields: {
    "tab[Content].title": {
      label: "Page Headline",
      admin: { description: "Main H1 title for search engines" },
    },
    "tab[Meta].seoDescription": {
      type: "textarea",
      label: "Meta Description",
    },
  },
}
```

---

### 4. Granular Array Subfield Overrides

Modify or append individual subfields inside `array` fields without having to re-declare the entire array schema:

```typescript
hero: {
  singleSlide: {
    stats: {
      // Modifies just the 'label' subfield inside the stats array
      label: {
        label: "Metric Label",
        placeholder: "e.g. Total Customers",
      },
      // Appends a new 'icon' subfield to the stats array
      icon: {
        type: "text",
        label: "Icon Name",
      },
    },
  },
}
```

---

### 5. Direct Block Injection (`blocks`)

Append brand new custom blocks directly to a collection's `blocks` field without re-declaring or spreading built-in semantic blocks:

```typescript
pages: {
  blocks: {
    chefStory: {
      slug: "chefStory",
      label: "Chef Story Block",
      fields: [
        { name: "heading", type: "text", label: "Heading" },
        { name: "bio", type: "richText", label: "Biography" },
        { name: "photo", type: "upload", relationTo: "media", label: "Chef Photo" },
      ],
    },
  },
}
```

---

### 6. Tab Insertion Shorthand (`tabs`)

Add new custom tabs to existing collections (or wrap flat collections into tabbed layouts) directly:

```typescript
pages: {
  tabs: {
    "Advanced Settings": {
      fields: [
        { name: "customScript", type: "textarea", label: "Header Scripts" },
        { name: "noIndex", type: "checkbox", label: "Hide from Search Engines" },
      ],
    },
  },
}
```

---

### 7. Top-Level Collection Config Merging

Override top-level collection properties (`labels`, `timestamps`, `versions`, `access`, `hooks`, `admin`) directly inside the override object:

```typescript
products: {
  labels: { singular: "Dish", plural: "Dishes" },
  timestamps: true,
  versions: { drafts: true, maxPerDoc: 20 },
  admin: {
    defaultColumns: ["title", "price", "status"],
    group: "Restaurant",
  },
  fields: {
    category: { admin: { hidden: true } },
    brand: { admin: { hidden: true } },
  },
}
```

---

### 8. Global Overrides (`admin.globalOverrides`)

Customize global settings (`site-settings`, `header-nav`, `footer-nav`, `access-settings`) using the exact same transparent field and block traversal:

```typescript
export default defineKyroConfig({
  admin: {
    globalOverrides: {
      "site-settings": {
        fields: {
          branding: {
            logo: { label: "Primary Brand Logo" },
          },
        },
      },
      "header-nav": {
        fields: {
          menuItems: {
            badge: { type: "text", label: "Menu Item Badge" },
          },
        },
      },
    },
  },
});
```

---

### 9. Collapsible Field Layouts (Groups & Accordion Tabs)

Keep complex edit forms compact and uncluttered by making container fields collapsible:

#### Collapsible Groups
```typescript
{
  name: "shippingAddress",
  type: "group",
  label: "Delivery Address",
  admin: {
    collapsible: true,     // Renders a clickable accordion header with chevron
    initCollapsed: true,   // Starts closed by default
  },
  fields: [
    { name: "line1", type: "text", label: "Street" },
    { name: "city", type: "text", label: "City" },
    { name: "postalCode", type: "text", label: "Zip" },
  ],
}
```

#### Vertical Accordion Tabs
By default, `type: "tabs"` renders as a horizontal tab strip. You can convert tabs into vertically stacked collapsible accordion panels:

```typescript
{
  type: "tabs",
  admin: {
    layout: "accordion",   // Renders vertical accordion drawers instead of horizontal buttons
    initCollapsed: true,   // All tab panels start closed for a 100% compact overview
  },
  tabs: [
    { label: "General Information", fields: [ /* ... */ ] },
    { label: "Customer & Delivery", fields: [ /* ... */ ] },
    { label: "Internal Notes", fields: [ /* ... */ ] },
  ],
}
```

---

### 10. Compact Pills Display for Arrays (`display: "pills"`)

When displaying multi-field line items (such as order items containing product reference, quantity, unit price, and customizations), set `admin.display: "pills"`:

```typescript
{
  name: "items",
  type: "array",
  label: "Order Items",
  admin: {
    readOnly: true,
    display: "pills", // Renders items as compact inline pill capsules with multipliers & totals
  },
  fields: [
    { name: "name", type: "text", label: "Item Name" },
    { name: "quantity", type: "number", label: "Qty" },
    { name: "total", type: "number", label: "Line Total" },
  ],
}
```

This presents each item cleanly formatted like:
`[ 2× Meat Pie · $8.00 ]`

---

### 11. Sidebar Navigation Icons (`lucide:*` & `hero:*`)

Kyro CMS supports namespaced icon prefixes so you can cleanly specify icons from either **[Lucide](https://lucide.dev/icons)** or **[Heroicons](https://heroicons.com/)**:

```typescript
export const foodMenuCollection: CollectionConfig = {
  slug: "food-menu",
  label: "Food Menu",
  admin: {
    group: "Restaurant Menu",

    // 1. Lucide Icons (supports "lucide:Name" or bare "Name")
    icon: "lucide:Utensils",     // or "lucide:shopping-bag", "Utensils", "Receipt"

    // 2. Heroicons Outline
    // icon: "hero:Sparkles",    // or "hero:sparkles", "hero-outline:fire"

    // 3. Heroicons Solid
    // icon: "hero-solid:Fire",  // or "hero-solid:star"
  },
  fields: [ /* ... */ ],
};
```

| Namespace Prefix | Library | Example |
| :--- | :--- | :--- |
| `lucide:<Icon>` | [Lucide Icons](https://lucide.dev/icons) | `"lucide:Utensils"`, `"lucide:ShoppingBag"` |
| `hero:<Icon>` | [Heroicons Outline](https://heroicons.com/) | `"hero:Sparkles"`, `"hero:ReceiptPercent"` |
| `hero-solid:<Icon>` | [Heroicons Solid](https://heroicons.com/) | `"hero-solid:Fire"`, `"hero-solid:Star"` |
| `<Icon>` (bare name) | Automatic Resolution (Lucide &rarr; Heroicons) | `"Utensils"`, `"Receipt"` |

---

## Interactive Button Fields (Use Cases & Gotchas)

Kyro CMS provides a built-in `"button"` field type that serves two very different functions depending on where and how you configure it. Because of this dual nature, it can sometimes be a source of confusion.

### Use Case 1: Custom API Triggers (Interactive Actions)

When configured in **Collection** or **Global** schemas, a `"button"` field acts as an interactive UI element that triggers an authenticated REST API request when clicked. This is ideal for tasks like sending test emails, initiating webhooks, or syncing external integrations directly from the Admin Panel.

#### Configuration Structure
To make the button interactive, you **must** supply an `action` endpoint URL and an optional `method` (defaults to `"POST"`) under the `admin` block or at the root of the field definition:

```typescript
{
  name: "triggerSync",
  type: "button",
  label: "Sync Now",
  admin: {
    action: "/api/sync/trigger",
    method: "POST"
  }
}
```

#### The Email-Sibling Gotcha (Row Actions)
If you place a `"button"` field inside a `"row"` type field alongside an `"email"` field, Kyro's form renderer (`AutoForm`) automatically binds them:
1. When the button is clicked, it scans the row for the sibling email input.
2. It fetches the email value and sends it inside a JSON payload: `{"email": "user@example.com"}`.
3. It displays automated `"Sending..."` states and fires toast success/error notifications.

#### Standalone Form Posting
If the button is placed standalone (outside of a row or without email siblings), clicking it serializes the **entire** current form's state (`formData`) as a JSON payload and sends it to the configured `action` URL.

> [!WARNING]
> **Gotcha:** If you define a field of type `"button"` but omit the `action` endpoint configuration, the button will be displayed but clicking it will do nothing.

> [!IMPORTANT]
> **Renderer Behavior:** Actions are only rendered inside dynamic form editors (`AutoForm`). General data-display views (like lists or read-only summary panels) will bypass or ignore `"button"` fields since they represent operational controls rather than static data properties.

---

### Use Case 2: Content CTA blocks (The Block Builder)

When used inside **content blocks** (for example, in your blocks editor or page layout builder), the `"button"` field serves as a standard data input to store user-defined call-to-actions.

In this context, the Admin Panel automatically renders two text inputs:
1. **Button text** (e.g. `"Learn More"`)
2. **Button URL** (e.g. `"https://example.com"`)

This writes a structured object directly to your document:
```json
{
  "text": "Learn More",
  "url": "https://example.com"
}
```
You can then retrieve this JSON in your frontend Astro templates to output a fully styled clickable hyperlink.

### Mobile Responsiveness

The admin dashboard is fully responsive. Key mobile features:
- **ActionBar**: Single-line toolbar with overflow menu (IconMoreVertical) on mobile. Status dot replaces badge.
- **FAB**: Floating action button (right-aligned, mobile-only) for quick command palette access.
- **SlidePanels**: Full-width on mobile (w-full sm:w-[size]).
- **PageHeader**: Collapsible breadcrumbs using `&lt;details&gt;` element.
- **AutoForm**: Settings sidebar is a collapsible accordion. Tab strip hidden on mobile.
- **Media Gallery**: Filter button opens a bottom sheet.
- **Theme variables**: All UI components use --kyro-* CSS variables for consistent theming.
