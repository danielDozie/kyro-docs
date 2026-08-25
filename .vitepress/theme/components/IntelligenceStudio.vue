<script setup>
import { ref, computed } from 'vue'

/* ── Active Module State ── */
const activeTab = ref('mcp')
const copied = ref(false)

/* ── Interactive State per Module ── */
// MCP Simulator
const mcpSelectedTool = ref('scaffold_astro_component')
const mcpRunning = ref(false)

// Vision AI Simulator
const visionFocal = ref({ x: 54, y: 38 })
const visionPalette = ['#09090b', '#7c3aed', '#38bdf8', '#fafafa']

// Vector Search Simulator
const vectorQuery = ref('SSR caching strategies for Astro')
const sampleQueries = [
  'SSR caching strategies for Astro',
  'Zod validation on nested relations',
  'Multi-tenant database tenancy'
]

// Design Tokens Simulator
const tokenRadius = ref(8)
const tokenPrimary = ref('#7c3aed')

// Health Audit Simulator
const auditScanning = ref(false)
const auditScore = ref(98)

function triggerAuditScan() {
  auditScanning.value = true
  auditScore.value = 0
  setTimeout(() => {
    auditScore.value = 98
    auditScanning.value = false
  }, 600)
}

function copyCode(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1600)
    })
  }
}

/* ── Canonical Documentation Modules ── */
const modules = {
  mcp: {
    id: 'mcp',
    number: '01',
    label: 'MCP Server',
    badge: 'Agent Runtime',
    title: 'Model Context Protocol Server',
    headline: 'Direct agentic runtime for Cursor, Claude & Copilot',
    desc: 'Expose your entire content graph to AI coding assistants over stdio or SSE. Let agents introspect schemas, query entries, and generate type-safe Astro components in real time.',
    codeFile: '.cursor/mcp.json',
    lang: 'JSON',
    docLink: '/packages/kyro-mcp',
    code: `{\n  "mcpServers": {\n    "kyro-cms": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@kyro-cms/mcp",\n        "--config", "./kyro.config.ts"\n      ]\n    }\n  }\n}`
  },
  vision: {
    id: 'vision',
    number: '02',
    label: 'Vision AI',
    badge: 'Multimodal',
    title: 'Multimodal Asset Pipeline',
    headline: 'Automated accessibility, focal crops & palette extraction',
    desc: 'Deep-analyze every uploaded asset at the edge. Auto-generates WCAG 2.1 AAA alt captions, determines responsive focal coordinates, and computes design token color swatches.',
    codeFile: 'media-pipeline.ts',
    lang: 'TypeScript',
    docLink: '/packages/kyro-ai',
    code: `import { generateImageAltText } from "@kyro-cms/ai";\nimport { createOpenAI } from "@ai-sdk/openai";\n\nconst openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });\n\n// Programmatic Vision AI alt-text generation\nconst result = await generateImageAltText({\n  imageUrl: "https://example.com/uploads/hero.webp",\n  provider: openai,\n  modelName: "gpt-4o-mini",\n  context: "E-commerce product catalog thumbnail"\n});\n\nconsole.log(result.altText);\n// "Top-down view of ceramic coffee dripper on wooden countertop"`
  },
  vectors: {
    id: 'vectors',
    number: '03',
    label: 'Vector Search',
    badge: 'Semantic Embeddings',
    title: 'Native Vector Embeddings',
    headline: 'Cosine similarity search directly inside your database',
    desc: 'Store 1536-dimensional embeddings alongside your content. Query pgvector or SQLite with natural language queries without configuring third-party vector databases.',
    codeFile: 'kyro.config.ts',
    lang: 'TypeScript',
    docLink: '/packages/kyro-ai',
    code: `import { defineKyroConfig } from "@kyro-cms/core";\nimport { AiVectorPlugin } from "@kyro-cms/ai";\n\nexport default defineKyroConfig({\n  plugins: [\n    new AiVectorPlugin({\n      collections: ["articles"],\n      targetField: "embedding",\n      sourceField: "body",\n      apiKey: process.env.OPENAI_API_KEY,\n      modelName: "text-embedding-3-small"\n    })\n  ]\n});\n\n// Query endpoint: POST /api/articles/semantic-search\n// Body: { "query": "Astro SSR performance", "threshold": 0.75 }`
  },
  tokens: {
    id: 'tokens',
    number: '04',
    label: 'Design Tokens',
    badge: 'Design Engine',
    title: 'Live Design Token Stream',
    headline: 'Real-time CSS & Tailwind tokens streamed to frontends',
    desc: 'Define typography, radii, and color palettes in your schema. Consume them directly in Astro or Tailwind via /api/tokens.css with zero build overhead.',
    codeFile: 'kyro.config.ts',
    lang: 'TypeScript',
    docLink: '/guides/design-tokens',
    code: `import { defineKyroConfig } from "@kyro-cms/core";\n\nexport default defineKyroConfig({\n  theme: {\n    tokens: {\n      colors: {\n        primary: "#7c3aed",\n        surface: "#09090b",\n        accent: "#38bdf8"\n      },\n      radii: {\n        sm: "4px", md: "8px", lg: "12px"\n      },\n      fonts: {\n        sans: "'Inter', system-ui, sans-serif"\n      }\n    }\n  }\n});\n\n// Consumed in Astro: <link rel="stylesheet" href="/api/tokens.css" />`
  },
  health: {
    id: 'health',
    number: '05',
    label: 'Quality Auditor',
    badge: 'Content Health',
    title: 'Content Health & Quality Auditor',
    headline: 'Automated schema conformity & SEO accessibility scans',
    desc: 'Continuous auditing engine inspects all collections for missing alt tags, dead relations, broken URLs, and strict Zod validation with programmable CI/CD gates.',
    codeFile: 'health-audit.ts',
    lang: 'TypeScript',
    docLink: '/guides/content-health',
    code: `import { auditContentHealth } from "@kyro-cms/core";\nimport config from "./kyro.config";\n\n// Programmatic auditing for CI/CD pipelines\nconst auditResult = await auditContentHealth({\n  collections: config.collections,\n  fetchDocuments: async (slug) =>\n    databaseAdapter.find(slug)\n});\n\nconsole.log(\`Health Score: \${auditResult.score}%\`);\nconsole.log(\`Issues: \${auditResult.issues.length}\`);\n\nif (auditResult.score < 80) {\n  process.exit(1); // Enforce quality gates\n}`
  }
}

/* ── Minimal Syntax Highlighting Engine ── */
function highlightCode(codeStr) {
  if (!codeStr) return ''
  let code = codeStr
  code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  code = code.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>')
  code = code.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="tok-str">$1</span>')
  code = code.replace(/\b(import|from|export|default|const|let|var|await|async|new|if|return|type|interface|process|exit)\b/g, '<span class="tok-kw">$1</span>')
  code = code.replace(/\b(auditContentHealth|generateImageAltText|createOpenAI|defineKyroConfig|find|log|warn)\b/g, '<span class="tok-fn">$1</span>')
  code = code.replace(/\b(true|false|null|undefined|\d+)\b/g, '<span class="tok-num">$1</span>')
  return code
}
</script>

<template>
  <section class="kyro-intelligence-root">
    <!-- Header: Compact & Focused -->
    <header class="section-intro">
      <div class="intro-pill">
        <span class="pulse-dot"></span>
        <span>INTELLIGENCE &amp; TOOLING</span>
      </div>
      <h2 class="intro-title">Autonomous intelligence, native to your schema</h2>
      <p class="intro-desc">
        Built directly into the core engine — from native Model Context Protocol to automated accessibility auditing and vector embeddings.
      </p>
    </header>

    <!-- The Intelligence Console: Unified Monolithic Workbench -->
    <div class="workbench-console">
      <!-- Top Navigation & Status Horizon -->
      <div class="console-nav-bar">
        <div class="nav-segmented" role="tablist">
          <button
            v-for="(mod, key) in modules"
            :key="key"
            class="nav-tab"
            :class="{ active: activeTab === key }"
            role="tab"
            :aria-selected="activeTab === key"
            @click="activeTab = key"
          >
            <span class="tab-index">{{ mod.number }}</span>
            <span class="tab-label">{{ mod.label }}</span>
          </button>
        </div>

        <div class="nav-meta">
          <span class="engine-indicator">
            <span class="live-dot"></span>
            <span>Kyro Engine Active</span>
          </span>
        </div>
      </div>

      <!-- Main Deck: Split Visual Playground + Code Inspector -->
      <div class="console-deck">
        <!-- Left Pane: Interactive Capability Visualizer -->
        <div class="deck-pane visualizer-pane">
          <div class="pane-header">
            <div class="pane-title-group">
              <span class="pane-badge">{{ modules[activeTab].badge }}</span>
              <h3 class="pane-title">{{ modules[activeTab].title }}</h3>
            </div>
            <p class="pane-desc">{{ modules[activeTab].desc }}</p>
          </div>

          <!-- Dynamic Visual Stage per Module -->
          <div class="interactive-stage">
            <!-- 01. MCP Visual Stage -->
            <div v-if="activeTab === 'mcp'" class="stage-mcp">
              <div class="stage-card stage-box">
                <div class="mcp-client-header">
                  <div class="mcp-client-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <span>stdio://kyro-cms</span>
                  </div>
                  <span class="tag-status">JSON-RPC 2.0</span>
                </div>

                <div class="mcp-tools-list">
                  <div class="tools-label">Available Schema Tools</div>
                  <div class="tool-chips">
                    <button 
                      class="tool-chip" 
                      :class="{ active: mcpSelectedTool === 'get_schema' }"
                      @click="mcpSelectedTool = 'get_schema'"
                    >
                      get_schema
                    </button>
                    <button 
                      class="tool-chip" 
                      :class="{ active: mcpSelectedTool === 'query_collection' }"
                      @click="mcpSelectedTool = 'query_collection'"
                    >
                      query_collection
                    </button>
                    <button 
                      class="tool-chip" 
                      :class="{ active: mcpSelectedTool === 'scaffold_astro_component' }"
                      @click="mcpSelectedTool = 'scaffold_astro_component'"
                    >
                      scaffold_astro_component
                    </button>
                  </div>
                </div>

                <div class="mcp-payload-preview">
                  <div class="payload-row">
                    <span class="p-key">Target Collection:</span>
                    <span class="p-val">articles (12 fields, Zod validated)</span>
                  </div>
                  <div class="payload-row">
                    <span class="p-key">Inference Latency:</span>
                    <span class="p-val highlight">0.3ms (In-memory AST)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 02. Vision AI Visual Stage -->
            <div v-else-if="activeTab === 'vision'" class="stage-vision">
              <div class="stage-card stage-box">
                <div class="vision-canvas">
                  <div class="canvas-grid-bg"></div>
                  <div class="canvas-focal-reticle" :style="{ left: visionFocal.x + '%', top: visionFocal.y + '%' }">
                    <div class="reticle-ring"></div>
                    <span class="reticle-coords">({{ visionFocal.x }}%, {{ visionFocal.y }}%)</span>
                  </div>
                  <div class="canvas-overlay-info">
                    <span class="overlay-tag">Focal Point Detection</span>
                    <span class="overlay-res">2400 × 1600 · WebP</span>
                  </div>
                </div>

                <div class="vision-metadata-row">
                  <div class="alt-caption-box">
                    <span class="caption-label">Generated Alt Text:</span>
                    <p class="caption-text">"Top-down view of ceramic coffee dripper on wooden countertop"</p>
                  </div>
                  <div class="palette-swatches">
                    <span 
                      v-for="(hex, hIdx) in visionPalette" 
                      :key="hIdx" 
                      class="swatch-dot" 
                      :style="{ background: hex }"
                      :title="hex"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 03. Vector Search Visual Stage -->
            <div v-else-if="activeTab === 'vectors'" class="stage-vectors">
              <div class="stage-card stage-box">
                <div class="query-selector">
                  <span class="query-prompt-label">Sample Semantic Query:</span>
                  <div class="query-pills">
                    <button 
                      v-for="q in sampleQueries" 
                      :key="q"
                      class="query-pill"
                      :class="{ active: vectorQuery === q }"
                      @click="vectorQuery = q"
                    >
                      {{ q }}
                    </button>
                  </div>
                </div>

                <div class="vector-results">
                  <div class="result-row">
                    <div class="result-info">
                      <span class="result-title">Astro SSR Performance Optimization Guide</span>
                      <span class="result-path">articles/astro-ssr-guide.md</span>
                    </div>
                    <div class="similarity-badge">
                      <div class="sim-bar"><div class="sim-fill" style="width: 98.4%"></div></div>
                      <span class="sim-pct">0.984</span>
                    </div>
                  </div>
                  <div class="result-row">
                    <div class="result-info">
                      <span class="result-title">Edge Caching &amp; Fastly Compute Patterns</span>
                      <span class="result-path">articles/edge-caching.md</span>
                    </div>
                    <div class="similarity-badge">
                      <div class="sim-bar"><div class="sim-fill" style="width: 89.2%"></div></div>
                      <span class="sim-pct">0.892</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 04. Design Tokens Visual Stage -->
            <div v-else-if="activeTab === 'tokens'" class="stage-tokens">
              <div class="stage-card stage-box">
                <div class="token-controls">
                  <div class="control-row">
                    <label class="ctrl-label">Primary Color Token:</label>
                    <div class="color-options">
                      <button 
                        v-for="c in ['#7c3aed', '#0284c7', '#059669', '#d97706', '#fafafa']" 
                        :key="c"
                        class="color-btn"
                        :class="{ active: tokenPrimary === c }"
                        :style="{ background: c }"
                        @click="tokenPrimary = c"
                      ></button>
                    </div>
                  </div>

                  <div class="control-row">
                    <label class="ctrl-label">Border Radius Token: {{ tokenRadius }}px</label>
                    <input type="range" min="2" max="16" v-model="tokenRadius" class="range-slider" />
                  </div>
                </div>

                <!-- Live Reacting Astro Component Card -->
                <div 
                  class="token-preview-card"
                  :style="{
                    borderRadius: tokenRadius + 'px',
                    borderColor: 'var(--k-border)'
                  }"
                >
                  <div class="preview-header">
                    <span class="preview-badge" :style="{ background: tokenPrimary, color: tokenPrimary === '#fafafa' ? '#000' : '#fff' }">Astro Dynamic Island</span>
                    <span class="preview-token-tag">/api/tokens.css</span>
                  </div>
                  <div class="preview-content">
                    <p class="preview-text">Tokens stream directly into CSS variables without compilation or build step.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 05. Health Audit Visual Stage -->
            <div v-else-if="activeTab === 'health'" class="stage-health">
              <div class="stage-card stage-box">
                <div class="audit-top-bar">
                  <div class="score-display">
                    <div class="circular-score-mini">
                      <svg class="svg-score" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="25" class="bg-track" />
                        <circle cx="30" cy="30" r="25" class="val-track" stroke-dasharray="157" :stroke-dashoffset="157 - (157 * auditScore / 100)" />
                      </svg>
                      <span class="score-text">{{ auditScore }}</span>
                    </div>
                    <div class="score-meta">
                      <span class="score-title">Health Score: Optimal</span>
                      <span class="score-sub">100% Schema conformity</span>
                    </div>
                  </div>

                  <button class="btn-rescan" @click="triggerAuditScan" :disabled="auditScanning">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spin-anim': auditScanning }"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    <span>{{ auditScanning ? 'Auditing...' : 'Run Audit' }}</span>
                  </button>
                </div>

                <div class="audit-checklist">
                  <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span class="check-label">Alt-Text Coverage</span>
                    <span class="check-stat">28/28 assets</span>
                  </div>
                  <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span class="check-label">Broken Relations</span>
                    <span class="check-stat">0 dead links</span>
                  </div>
                  <div class="check-item">
                    <span class="check-icon">✓</span>
                    <span class="check-label">Strict Zod Schema</span>
                    <span class="check-stat">Passes CI Gate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Pane: Canonical Code & Config Inspector -->
        <div class="deck-pane inspector-pane">
          <div class="pane-code-header">
            <div class="file-crumb">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>{{ modules[activeTab].codeFile }}</span>
            </div>

            <div class="pane-code-actions">
              <span class="lang-tag">{{ modules[activeTab].lang }}</span>
              <button 
                class="btn-copy" 
                @click="copyCode(modules[activeTab].code)"
                :title="copied ? 'Copied' : 'Copy code snippet'"
              >
                <svg v-if="!copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <div class="pane-code-body">
            <pre class="code-pre"><code><span v-html="highlightCode(modules[activeTab].code)"></span></code></pre>
          </div>

          <div class="pane-code-footer">
            <a :href="modules[activeTab].docLink" class="link-doc">
              <span>Read {{ modules[activeTab].label }} documentation</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Integrated Horizon Telemetry Base -->
      <div class="console-telemetry-horizon">
        <div class="telemetry-cell">
          <span class="cell-val">0ms</span>
          <span class="cell-label">Access Control Latency</span>
          <span class="cell-sub">In-memory compiled permissions</span>
        </div>
        <div class="telemetry-cell">
          <span class="cell-val">1536d</span>
          <span class="cell-label">Vector Embeddings</span>
          <span class="cell-sub">Native pgvector &amp; SQLite search</span>
        </div>
        <div class="telemetry-cell">
          <span class="cell-val">4</span>
          <span class="cell-label">Auto-Generated Protocols</span>
          <span class="cell-sub">REST, GraphQL, tRPC &amp; WebSockets</span>
        </div>
        <div class="telemetry-cell">
          <span class="cell-val">100%</span>
          <span class="cell-label">TypeScript Type Safety</span>
          <span class="cell-sub">End-to-end inferred schema types</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ════════════════════════════════════════
   1. ROOT CONTAINER & HEADER
   ════════════════════════════════════════ */
.kyro-intelligence-root {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 24px 4rem;
  box-sizing: border-box;
  overflow: hidden;
}

/* ═══ Animated Background: Grid + Gradient Sweep (::before) ═══ */
.kyro-intelligence-root::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 40%, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 40%, black 30%, transparent 70%);
}


/* Ensure all content sits above the background */
.section-intro,
.workbench-console {
  position: relative;
  z-index: 1;
}

.section-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 26px;
  gap: 8px;
}

.intro-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  background: var(--k-bg-soft, #ffffff);
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 999px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--k-text-3, #71717a);
}

.pulse-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

.intro-title {
  font-size: clamp(1.75rem, 3.2vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--k-text-1, #09090b);
  max-width: 820px;
  margin: 0;
}

.intro-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--k-text-3, #71717a);
  max-width: 580px;
  margin: 0;
}

/* ════════════════════════════════════════
   2. UNIFIED WORKBENCH CONSOLE
   ════════════════════════════════════════ */
.workbench-console {
  background: var(--k-bg-soft, #ffffff);
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

/* Navigation Segmented Bar */
.console-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  background: var(--k-bg-soft, #ffffff);
  gap: 12px;
}

.nav-segmented {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--k-text-3, #71717a);
  transition: all 0.15s ease;
  white-space: nowrap;
}

.nav-tab:hover {
  color: var(--k-text-1, #09090b);
  background: var(--k-bg-mute, #f4f4f5);
}

.nav-tab.active {
  color: var(--k-text-1, #09090b);
  background: var(--k-bg-mute, #f4f4f5);
  border-color: var(--k-border, rgba(0, 0, 0, 0.08));
  font-weight: 600;
}

.tab-index {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.65rem;
  color: var(--k-text-3, #71717a);
  opacity: 0.7;
}

.nav-meta {
  display: flex;
  align-items: center;
}

.engine-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.66rem;
  color: var(--k-text-3, #71717a);
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

/* ════════════════════════════════════════
   3. CONSOLE DECK (SPLIT PANE)
   ════════════════════════════════════════ */
.console-deck {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  min-height: 380px;
}

.deck-pane {
  padding: 22px;
  box-sizing: border-box;
}

.visualizer-pane {
  border-right: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--k-bg-soft, #ffffff);
}

.pane-header {
  margin-bottom: 18px;
}

.pane-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.pane-badge {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--k-text-2, #52525b);
}

.pane-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--k-text-1, #09090b);
  margin: 0;
  letter-spacing: -0.015em;
}

.pane-desc {
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--k-text-3, #71717a);
  margin: 0;
}

/* Stage Box */
.stage-card {
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.07));
  border-radius: 8px;
  background: var(--k-bg-mute, #fafafa);
  padding: 14px;
}

/* 01. MCP Visuals */
.mcp-client-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.06));
}

.mcp-client-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.7rem;
  color: var(--k-text-2, #52525b);
}

.tag-status {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.62rem;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
}

.tools-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--k-text-3, #71717a);
  margin-bottom: 6px;
}

.tool-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tool-chip {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  padding: 4px 8px;
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 5px;
  background: var(--k-bg-soft, #ffffff);
  color: var(--k-text-2, #52525b);
  cursor: pointer;
  transition: all 0.12s ease;
}

.tool-chip.active {
  border-color: var(--k-text-1, #09090b);
  color: var(--k-text-1, #09090b);
  background: var(--k-bg-soft, #ffffff);
  font-weight: 600;
}

.mcp-payload-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--k-border, rgba(0, 0, 0, 0.06));
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.67rem;
}

.payload-row {
  display: flex;
  justify-content: space-between;
}

.p-key { color: var(--k-text-3, #71717a); }
.p-val { color: var(--k-text-1, #09090b); }
.p-val.highlight { color: #10b981; font-weight: 600; }

/* 02. Vision Visuals */
.vision-canvas {
  position: relative;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.07));
  margin-bottom: 10px;
  background: #18181b;
}

.canvas-grid-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-focal-reticle {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reticle-ring {
  width: 22px;
  height: 22px;
  border: 1.5px solid #38bdf8;
  border-radius: 50%;
  animation: reticlePulse 2s infinite ease-in-out;
}

@keyframes reticlePulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.15); opacity: 0.5; }
}

.reticle-coords {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.58rem;
  color: #38bdf8;
  margin-top: 2px;
}

.canvas-overlay-info {
  position: absolute;
  bottom: 6px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
}

.vision-metadata-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.alt-caption-box {
  flex: 1;
}

.caption-label {
  font-size: 0.64rem;
  font-weight: 600;
  color: var(--k-text-3, #71717a);
}

.caption-text {
  font-size: 0.72rem;
  color: var(--k-text-1, #09090b);
  margin: 1px 0 0;
  line-height: 1.35;
}

.palette-swatches {
  display: flex;
  gap: 4px;
}

.swatch-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 03. Vector Visuals */
.query-prompt-label {
  font-size: 0.67rem;
  font-weight: 600;
  color: var(--k-text-3, #71717a);
  display: block;
  margin-bottom: 6px;
}

.query-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.query-pill {
  text-align: left;
  font-size: 0.7rem;
  padding: 5px 8px;
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 5px;
  background: var(--k-bg-soft, #ffffff);
  color: var(--k-text-2, #52525b);
  cursor: pointer;
  transition: all 0.12s ease;
}

.query-pill.active {
  border-color: var(--k-text-1, #09090b);
  color: var(--k-text-1, #09090b);
  font-weight: 600;
}

.vector-results {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: var(--k-bg-soft, #ffffff);
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.06));
  border-radius: 5px;
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--k-text-1, #09090b);
}

.result-path {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.6rem;
  color: var(--k-text-3, #71717a);
}

.similarity-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sim-bar {
  width: 40px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.sim-fill {
  height: 100%;
  background: #0284c7;
}

.sim-pct {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.66rem;
  font-weight: 600;
  color: #0284c7;
}

/* 04. Design Tokens Visuals */
.token-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ctrl-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--k-text-2, #52525b);
}

.color-options {
  display: flex;
  gap: 4px;
}

.color-btn {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  cursor: pointer;
}

.color-btn.active {
  border-color: var(--k-text-1, #09090b);
}

.range-slider {
  width: 100px;
  accent-color: var(--k-text-1, #09090b);
}

.token-preview-card {
  padding: 12px;
  background: var(--k-bg-soft, #ffffff);
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  transition: all 0.2s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.preview-badge {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.preview-token-tag {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.62rem;
  color: var(--k-text-3, #71717a);
}

.preview-text {
  font-size: 0.7rem;
  color: var(--k-text-2, #52525b);
  margin: 0;
  line-height: 1.35;
}

/* 05. Health Audit Visuals */
.audit-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.circular-score-mini {
  position: relative;
  width: 42px;
  height: 42px;
}

.svg-score {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.bg-track { fill: none; stroke: rgba(0, 0, 0, 0.08); stroke-width: 4; }
.val-track { fill: none; stroke: #10b981; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }

.score-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--k-text-1, #09090b);
}

.score-meta {
  display: flex;
  flex-direction: column;
}

.score-title {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--k-text-1, #09090b);
}

.score-sub {
  font-size: 0.64rem;
  color: var(--k-text-3, #71717a);
}

.btn-rescan {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  font-size: 0.68rem;
  font-weight: 500;
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 5px;
  background: var(--k-bg-soft, #ffffff);
  color: var(--k-text-2, #52525b);
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-rescan:hover {
  background: var(--k-bg-mute, #f4f4f5);
  color: var(--k-text-1, #09090b);
}

.spin-anim {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.audit-checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.check-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  font-size: 0.68rem;
}

.check-icon { color: #10b981; font-weight: 700; margin-right: 6px; }
.check-label { flex: 1; color: var(--k-text-2, #52525b); }
.check-stat { font-family: var(--vp-font-family-mono, monospace); color: var(--k-text-3, #71717a); font-size: 0.64rem; }

/* ════════════════════════════════════════
   4. CODE INSPECTOR PANE (RIGHT)
   ════════════════════════════════════════ */
.inspector-pane {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--k-bg-soft, #ffffff);
}

.pane-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.07));
}

.file-crumb {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--k-text-2, #52525b);
}

.pane-code-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lang-tag {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.62rem;
  color: var(--k-text-3, #71717a);
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  border-radius: 5px;
  background: var(--k-bg-soft, #ffffff);
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--k-text-2, #52525b);
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-copy:hover {
  background: var(--k-bg-mute, #f4f4f5);
  color: var(--k-text-1, #09090b);
}

.pane-code-body {
  padding: 14px 0;
  flex: 1;
  overflow-x: auto;
}

.code-pre {
  margin: 0;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  line-height: 1.55;
  color: var(--k-text-1, #18181b);
  white-space: pre-wrap;
}

/* Minimalist Syntax Token Palette */
:deep(.tok-cmt) { color: #8a8a93; font-style: italic; }
:deep(.tok-str) { color: #2e7d32; }
:deep(.tok-kw) { color: #6b21a8; font-weight: 600; }
:deep(.tok-fn) { color: #1e40af; }
:deep(.tok-num) { color: #9a3412; }

.pane-code-footer {
  padding-top: 10px;
  border-top: 1px solid var(--k-border, rgba(0, 0, 0, 0.07));
}

.link-doc {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--k-text-2, #52525b);
  text-decoration: none;
  transition: color 0.15s ease;
}

.link-doc:hover {
  color: var(--k-text-1, #09090b);
}

/* ════════════════════════════════════════
   5. CONSOLE TELEMETRY HORIZON (BASE)
   ════════════════════════════════════════ */
.console-telemetry-horizon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  background: var(--k-bg-soft, #ffffff);
}

.telemetry-cell {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
}

.telemetry-cell:last-child {
  border-right: none;
}

.cell-val {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--k-text-1, #09090b);
  letter-spacing: -0.025em;
  font-feature-settings: 'tnum', 'cv02';
  line-height: 1.1;
}

.cell-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--k-text-1, #09090b);
  margin: 2px 0 1px;
}

.cell-sub {
  font-size: 0.64rem;
  color: var(--k-text-3, #71717a);
}

/* ════════════════════════════════════════
   6. DARK MODE TUNING
   ════════════════════════════════════════ */
:root.dark .kyro-intelligence-root::before {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
}



:root.dark .workbench-console,
:root.dark .console-nav-bar,
:root.dark .visualizer-pane,
:root.dark .inspector-pane,
:root.dark .console-telemetry-horizon {
  background: #121215;
  border-color: rgba(255, 255, 255, 0.08);
}

:root.dark .stage-card,
:root.dark .tool-chip,
:root.dark .query-pill,
:root.dark .result-row,
:root.dark .token-preview-card,
:root.dark .btn-rescan,
:root.dark .btn-copy {
  background: #18181b;
  border-color: rgba(255, 255, 255, 0.07);
}

:root.dark .nav-tab:hover,
:root.dark .nav-tab.active {
  background: #18181b;
  border-color: rgba(255, 255, 255, 0.08);
  color: #fafafa;
}

:root.dark .pane-badge,
:root.dark .lang-tag {
  background: rgba(255, 255, 255, 0.06);
  color: #a1a1aa;
}

:root.dark .intro-title,
:root.dark .pane-title,
:root.dark .cell-val,
:root.dark .cell-label,
:root.dark .score-text,
:root.dark .score-title,
:root.dark .caption-text,
:root.dark .result-title,
:root.dark .code-pre {
  color: #fafafa;
}

:root.dark .intro-desc,
:root.dark .pane-desc,
:root.dark .cell-sub,
:root.dark .score-sub,
:root.dark .check-label,
:root.dark .check-stat,
:root.dark .ctrl-label,
:root.dark .preview-text,
:root.dark .file-crumb,
:root.dark .link-doc,
:root.dark .btn-copy,
:root.dark .btn-rescan {
  color: #a1a1aa;
}

:root.dark .link-doc:hover,
:root.dark .btn-copy:hover,
:root.dark .btn-rescan:hover {
  color: #fafafa;
}

:root.dark :deep(.tok-cmt) { color: #71717a; }
:root.dark :deep(.tok-str) { color: #86efac; }
:root.dark :deep(.tok-kw) { color: #c084fc; }
:root.dark :deep(.tok-fn) { color: #93c5fd; }
:root.dark :deep(.tok-num) { color: #fcd34d; }

:root.dark .bg-track { stroke: rgba(255, 255, 255, 0.08); }

/* ════════════════════════════════════════
   7. RESPONSIVE
   ════════════════════════════════════════ */
@media (max-width: 960px) {
  .console-deck {
    grid-template-columns: 1fr;
  }

  .visualizer-pane {
    border-right: none;
    border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  }

  .console-telemetry-horizon {
    grid-template-columns: repeat(2, 1fr);
  }

  .telemetry-cell:nth-child(2) {
    border-right: none;
  }

  .telemetry-cell:nth-child(-n+2) {
    border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  }
}

@media (max-width: 640px) {
  .kyro-intelligence-root {
    padding: 2.5rem 16px;
  }

  .console-nav-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .console-telemetry-horizon {
    grid-template-columns: 1fr;
  }

  .telemetry-cell {
    border-right: none;
    border-bottom: 1px solid var(--k-border, rgba(0, 0, 0, 0.08));
  }

  .telemetry-cell:last-child {
    border-bottom: none;
  }
}
</style>
