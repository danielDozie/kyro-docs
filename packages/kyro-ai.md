---
title: Kyro AI
description: Enhance your CMS with AI-powered SEO generation, Vision AI accessibility alt-text, semantic vector embeddings, and assistant capabilities.
---

# `@kyro-cms/ai`

The `@kyro-cms/ai` package provides a unified AI and machine learning extension suite for Kyro CMS, powered by the Vercel AI SDK. It enables automated SEO metadata generation, Vision AI alt-text generation for uploaded media, natural language collection schema synthesis, conversational administrative assistants, and vector embeddings pipelines for semantic similarity search.

## Installation

```bash
pnpm add @kyro-cms/ai ai
```

Depending on your model provider, install the corresponding provider SDK:

```bash
# Groq (Recommended for rapid inference)
pnpm add @ai-sdk/groq

# OpenAI (For GPT-4o, GPT-4o-mini, text-embedding-3)
pnpm add @ai-sdk/openai

# Anthropic (For Claude 3.5 Sonnet)
pnpm add @ai-sdk/anthropic
```

## Available Plugins & Capabilities

### 1. `AiAutoSeoPlugin`

Listens to document creation and mutation lifecycle events. When target collections contain empty SEO fields (such as `metaTitle` and `metaDescription`), the plugin extracts plain text from document content (including rich-text blocks) and synthesizes optimal meta descriptions and titles.

#### Configuration Example

```typescript
import { defineKyroConfig } from "@kyro-cms/core";
import { AiAutoSeoPlugin } from "@kyro-cms/ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export default defineKyroConfig({
  plugins: [
    new AiAutoSeoPlugin({
      collections: ["posts", "pages", "products"],
      provider: groq,
      modelName: "llama-3.1-8b-instant",
      titleField: "title",
      contentField: "content",
      seoFieldPrefix: "seo", // Targets seo.metaTitle and seo.metaDescription
    }),
  ],
});
```

---

### 2. Vision AI Alt-Text Generator

The Media Gallery includes native integration with Vision AI models. When media assets are uploaded, editors can click the **Generate with AI** button to automatically generate descriptive alt-text and accessibility tags.

#### Programmatic Usage

```typescript
import { generateImageAltText } from "@kyro-cms/ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const result = await generateImageAltText({
  imageUrl: "https://example.com/uploads/product-hero.webp",
  provider: openai,
  modelName: "gpt-4o-mini",
  context: "E-commerce product catalog thumbnail",
});

console.log(result.altText);
// Output: "Top-down view of ceramic pour-over coffee dripper on wooden countertop"
```

---

### 3. `AiVectorPlugin` & Semantic Search

Automatically converts text fields into dense vector embeddings upon document creation or update, enabling natural language semantic search across your content collections.

#### Configuration Example

```typescript
import { defineKyroConfig } from "@kyro-cms/core";
import { AiVectorPlugin } from "@kyro-cms/ai";

export default defineKyroConfig({
  collections: [
    {
      slug: "articles",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "richtext", required: true },
        {
          name: "embedding",
          type: "embedding",
          dimensions: 1536,
          provider: "openai",
          sourceField: "body",
        },
      ],
    },
  ],
  plugins: [
    new AiVectorPlugin({
      collections: ["articles"],
      targetField: "embedding",
      sourceField: "body",
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    }),
  ],
});
```

#### Querying Semantic Search API

Once configured, Kyro exposes a dedicated cosine similarity search endpoint:

```bash
# Search articles semantically
curl -X POST "http://localhost:4321/api/articles/semantic-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "how to improve web vitals and initial page load",
    "limit": 5,
    "threshold": 0.75
  }'
```

**Response Format:**

```json
{
  "results": [
    {
      "id": "104",
      "title": "Optimizing Astro Island Hydration for LCP",
      "similarity": 0.892,
      "document": { ... }
    }
  ]
}
```

---

### 4. `AiAssistantPlugin`

Mounts a contextual editorial assistant drawer inside the Kyro Admin Dashboard. Content editors can request content outlines, summaries, or copy refinement directly while editing documents.

#### Configuration Example

```typescript
import { defineKyroConfig } from "@kyro-cms/core";
import { AiAssistantPlugin } from "@kyro-cms/ai";
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export default defineKyroConfig({
  plugins: [
    new AiAssistantPlugin({
      provider: groq,
      modelName: "llama-3.3-70b-versatile",
      systemPrompt: "You are an expert editorial assistant for technical blogs.",
    }),
  ],
});
```

---

### 5. Prompt-to-Schema Synthesis

Generate complete `kyro.config.ts` collection schemas from natural language requirements.

```typescript
import { generateKyroSchemaFromPrompt } from "@kyro-cms/ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const schemaCode = await generateKyroSchemaFromPrompt({
  prompt: "Create a restaurant menu schema with categories, allergen badges, price, and dietary tags.",
  provider: openai,
  modelName: "gpt-4o",
});

console.log(schemaCode);
```
