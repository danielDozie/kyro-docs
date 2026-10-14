<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useData } from "vitepress";
import {
  PhArrowRight,
  PhArrowUpRight,
  PhCopy,
  PhCheck,
  PhGithubLogo,
  PhCode,
  PhDatabase,
  PhBracketsCurly,
  PhLightning,
  PhImage,
  PhShieldCheck,
  PhPlus,
  PhMinus,
  PhSun,
  PhMoon,
} from "@phosphor-icons/vue";
import pkg from "../../../package.json";
import BackgroundArtwork from "./BackgroundArtwork.vue";

const { isDark } = useData();

const technologies = [
  { name: "TypeScript", slug: "typescript" },
  { name: "Astro", slug: "astro" },
  { name: "SQLite", slug: "sqlite" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MongoDB", slug: "mongodb" },
];

const command = "pnpm create @kyro-cms@latest";
const copyState = ref("idle");
const activeApi = ref("REST");
const root = ref(null);
const mobileMenu = ref(null);
const backgroundMotion = ref(true);
let copyTimer;
let observer;

async function copyCommand() {
  clearTimeout(copyTimer);
  copyState.value = "copying";
  let timeout;
  try {
    await Promise.race([
      navigator.clipboard.writeText(command),
      new Promise((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Clipboard unavailable")),
          2000,
        );
      }),
    ]);
    copyState.value = "copied";
  } catch {
    copyState.value = "error";
  } finally {
    clearTimeout(timeout);
  }
  copyTimer = setTimeout(() => {
    copyState.value = "idle";
  }, 5000);
}

const protocols = [
  {
    label: "REST",
    icon: PhCode,
    description: "Familiar HTTP endpoints",
    file: "api-client.ts",
    code: `// Read your published content\nconst response = await fetch(\n  '/api/posts?status=published'\n)\n\nconst { data, meta } = await response.json()`,
  },
  {
    label: "GraphQL",
    logo: "/assets/logos/graphql.svg",
    description: "Ask for exactly what you need",
    file: "query.graphql",
    code: `query GetPosts {\n  posts {\n    docs {\n      id\n      title\n    }\n    totalDocs\n  }\n}`,
  },
  {
    label: "tRPC",
    logo: "/assets/logos/trpc.svg",
    description: "Types from schema to client",
    file: "client.ts",
    code: `// Query with inferred collection types\nconst posts = await trpc.posts.find.query({\n  where: {\n    status: { equals: 'published' }\n  },\n  limit: 10\n})`,
  },
  {
    label: "WebSocket",
    icon: PhLightning,
    description: "Content updates in real time",
    file: "realtime.ts",
    code: `const ws = new WebSocket(\n  'ws://localhost:4321/api/ws'\n)\n\nws.onopen = () => {\n  ws.send(JSON.stringify({\n    type: 'subscribe', channel: 'posts'\n  }))\n}`,
  },
];
const features = [
  {
    icon: PhBracketsCurly,
    title: "Model content in TypeScript.",
    text: "Collections, fields, and relationships live in your config. Keep your content model alongside your code.",
    link: "/guides/configuration",
    label: "Explore schemas",
  },
  {
    icon: PhImage,
    title: "Give editors room to create.",
    text: "Rich text, reusable blocks, and a media library. A visual workspace built from the fields you define.",
    link: "/guides/blocks-builder",
    label: "Explore the editor",
  },
  {
    icon: PhDatabase,
    title: "Choose your database.",
    text: "Start locally with SQLite or connect PostgreSQL or MongoDB. Choose the adapter that fits your project.",
    link: "/guides/database-adapters",
    label: "Explore adapters",
  },
  {
    icon: PhShieldCheck,
    title: "Keep access in your hands.",
    text: "Authentication, roles, and collection permissions. Decide who can see, create, and change your content.",
    link: "/guides/access-control",
    label: "Explore access control",
  },
];
const faqs = [
  {
    q: "What is Kyro CMS?",
    a: "Kyro is an open source headless CMS built for Astro. Define your content in TypeScript to generate an admin dashboard and REST, GraphQL, tRPC, and WebSocket APIs.",
  },
  {
    q: "Is Kyro ready for production?",
    a: "Kyro is in active development and has not reached a stable v1.0 release. Explore it, try it in development, and read the development status before considering a production project.",
    link: "/development-status",
    label: "Read the development status",
  },
  {
    q: "Can I use it with an existing Astro project?",
    a: "Yes. Install the core and admin packages, add a kyro.config.ts file, and register the Astro integration. The getting started guide covers both new projects and existing apps.",
    link: "/getting-started",
    label: "Read the setup guide",
  },
  {
    q: "Which databases does it support?",
    a: "Kyro supports SQLite, PostgreSQL, and MongoDB through database adapters. Your configuration selects the adapter and connection settings.",
    link: "/guides/database-adapters",
    label: "Compare database adapters",
  },
  {
    q: "Can other frontends use my content?",
    a: "Yes. Astro hosts the CMS, and its APIs let other frontends and services read and write content. Use REST, GraphQL, tRPC, or WebSocket depending on your client.",
  },
  {
    q: "Is it free to use?",
    a: "Kyro CMS is open source under the MIT license. You can inspect the source, self host it, and contribute on GitHub.",
    link: "https://github.com/danielDozie/kyro-cms",
    label: "View the source",
  },
];
const schema = `{
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richtext' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
  ],
}`;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  root.value
    ?.querySelectorAll(".reveal-word")
    .forEach((word) => observer.observe(word));
});
onBeforeUnmount(() => {
  clearTimeout(copyTimer);
  observer?.disconnect();
});
</script>

<template>
  <div ref="root" class="kh" :class="{ 'kh-dark': isDark }">
    <a class="kh-skip" href="#main-content">Skip to content</a>
    <header class="kh-header shell">
      <a class="brand" href="/" aria-label="Kyro CMS home"
        ><img src="/logo-accent.svg" width="32" height="28" alt="" /><span
          >Kyro CMS</span
        ></a
      >
      <a class="status" href="/development-status"
        ><span aria-hidden="true"></span>In active development</a
      >
      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="/getting-started">Docs</a><a href="#features">Features</a>
        <a href="https://github.com/danielDozie/kyro-cms"
          ><PhGithubLogo :size="20" weight="fill" />GitHub</a
        >
      </nav>
      <a class="button header-cta" href="/getting-started"
        >Get started <PhArrowUpRight :size="18"
      /></a>
      <button
        class="theme-toggle"
        type="button"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :aria-pressed="isDark"
        @click="isDark = !isDark"
      >
        <PhSun v-if="isDark" :size="20" aria-hidden="true" />
        <PhMoon v-else :size="20" aria-hidden="true" />
      </button>
      <details
        ref="mobileMenu"
        class="mobile-nav"
        @keydown.esc="mobileMenu.open = false"
      >
        <summary aria-label="Open navigation">
          <PhPlus :size="24" class="menu-open" /><PhMinus
            :size="24"
            class="menu-close"
          />
        </summary>
        <nav aria-label="Mobile navigation" @click="mobileMenu.open = false">
          <a href="/getting-started">Docs</a><a href="#features">Features</a
          ><a href="https://github.com/danielDozie/kyro-cms">GitHub</a
          ><a href="/development-status">Development status</a>
        </nav>
      </details>
    </header>

    <main id="main-content">
      <section class="hero shell" aria-labelledby="hero-title">
        <BackgroundArtwork variant="hero" :paused="!backgroundMotion" />
        <div class="hero-copy">
          <a class="version" href="/changelog"
            >v{{ pkg.version.replace(/^v/, "") }} is here
            <span>See what’s new <PhArrowUpRight :size="14" /></span
          ></a>
          <h1 id="hero-title">
            Your schema.<br />Your content.<br />Your entire backend.
          </h1>
          <p class="hero-description">
            Turn your TypeScript schema into an admin dashboard and four APIs.
            Built for Astro.
          </p>
          <a
            class="button hero-cta"
            id="hero-cta-primary"
            href="/getting-started"
            >Get started <PhArrowRight :size="20"
          /></a>
          <div class="command-wrap">
            <button
              class="command"
              @click="copyCommand"
              :disabled="copyState === 'copying'"
              :aria-busy="copyState === 'copying'"
              :aria-label="
                copyState === 'copied'
                  ? 'Command copied'
                  : 'Copy install command'
              "
            >
              <span class="prompt" aria-hidden="true">$</span
              ><code>{{ command }}</code
              ><PhCheck v-if="copyState === 'copied'" :size="18" /><PhCopy
                v-else
                :size="18"
              />
            </button>
            <span class="copy-feedback" role="status">{{
              copyState === "copying"
                ? "Copying command…"
                : copyState === "copied"
                  ? "Copied to clipboard"
                  : copyState === "error"
                    ? "Could not copy. Select the command to copy it manually."
                    : ""
            }}</span>
          </div>
          <p class="hero-footnote">
            Open source. Self hosted. Yours to build with.
          </p>
        </div>
        <figure class="hero-product">
          <div class="product-label">
            <span>THE WORKSPACE BEHIND YOUR WEBSITE</span
            ><span aria-hidden="true">↗</span>
          </div>
          <div class="product-window">
            <div class="window-bar">
              <span class="window-dots" aria-hidden="true"
                ><i></i><i></i><i></i></span
              ><span>Kyro / Content editor</span
              ><span class="window-live">Admin preview</span>
            </div>
            <img
              :src="
                isDark
                  ? '/assets/pagescreen-dark.png'
                  : '/assets/pagescreen-light.png'
              "
              width="3502"
              height="1986"
              fetchpriority="high"
              alt="Kyro admin content editor showing a page with reusable blocks and an insert block panel"
            />
          </div>
          <figcaption>
            <span>From your config to a complete admin.</span
            ><a href="/guides/admin-customization"
              >Make it yours <PhArrowUpRight :size="16"
            /></a>
          </figcaption>
          <div class="product-tag">
            <PhBracketsCurly :size="20" /><span
              >Defined in code.<br /><strong>Ready for content.</strong></span
            >
          </div>
        </figure>
      </section>

      <section class="stack-band shell" aria-label="Supported technologies">
        <p>Fits right into<br />your stack.</p>
        <ul>
          <li v-for="technology in technologies" :key="technology.slug">
            <img
              :src="`/assets/logos/${technology.slug}.svg`"
              width="28"
              height="28"
              alt=""
            />
            <span>{{ technology.name }}</span>
          </li>
        </ul>
      </section>

      <section class="api-section shell" aria-labelledby="api-title">
        <BackgroundArtwork variant="schema" :paused="!backgroundMotion" />
        <div class="section-copy">
          <span class="eyebrow">LESS PLUMBING. MORE BUILDING.</span>
          <h2 id="api-title">One schema.<br />Four APIs.</h2>
          <p>
            Define your content once. Kyro creates the APIs, so you can get back
            to the part you actually want to build.
          </p>
          <a class="text-link" href="/reference/api-overview"
            >Explore the APIs <PhArrowUpRight :size="18"
          /></a>
        </div>
        <div
          class="schema-flow"
          aria-label="One TypeScript schema generates four API protocols"
        >
          <div class="schema-card">
            <div class="code-header">
              <span>kyro.config.ts</span><span>TypeScript</span>
            </div>
            <pre><code>{{ schema }}</code></pre>
            <div class="schema-output">
              <PhArrowRight :size="18" /><span>Generated from your schema</span>
            </div>
          </div>
          <div class="protocol-list">
            <a
              v-for="protocol in protocols"
              :key="protocol.label"
              href="/reference/api-overview"
              class="protocol"
              ><img
                v-if="protocol.logo"
                :src="protocol.logo"
                width="24"
                height="24"
                alt="" />
              <component v-else :is="protocol.icon" :size="24" /><span
                ><strong>{{ protocol.label }}</strong
                ><small>{{ protocol.description }}</small></span
              ><PhArrowUpRight :size="16"
            /></a>
          </div>
        </div>
      </section>

      <section
        id="features"
        class="feature-section shell"
        aria-labelledby="feature-title"
      >
        <div class="section-heading">
          <span class="eyebrow">CONTENT WITHOUT THE COMPROMISE</span>
          <h2 id="feature-title">For the way<br />you want to build.</h2>
          <p>A developer’s workflow.<br />An editor’s workspace.</p>
        </div>
        <div class="feature-grid">
          <article v-for="feature in features" :key="feature.title">
            <component :is="feature.icon" :size="28" />
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
            <a class="text-link" :href="feature.link"
              >{{ feature.label }} <PhArrowUpRight :size="16"
            /></a>
          </article>
        </div>
      </section>

      <section class="editor-section" aria-labelledby="editor-title">
        <div class="shell editor-layout">
          <div class="editor-copy">
            <span class="eyebrow">THE HUMAN SIDE OF HEADLESS</span>
            <h2 id="editor-title">Built in code.<br />Made for people.</h2>
            <p>
              Your schema becomes a workspace for creating, organizing, and
              publishing content. No separate admin project to wire up.
            </p>
            <a class="text-link" href="/guides/field-types"
              >Meet your content toolkit <PhArrowUpRight :size="18"
            /></a>
            <div class="editor-tags">
              <span>Reusable blocks</span><span>Media library</span
              ><span>Drafts &amp; versions</span>
            </div>
          </div>
          <figure>
            <img
              :src="
                isDark
                  ? '/assets/media-library-dark.png'
                  : '/assets/media-library.png'
              "
              width="3584"
              height="2096"
              loading="lazy"
              alt="Kyro CMS media library with image thumbnails and file management tools"
            />
            <figcaption>
              Your content and assets, together in one workspace.
            </figcaption>
          </figure>
        </div>
      </section>

      <section class="code-section shell" aria-labelledby="code-title">
        <div class="section-copy">
          <span class="eyebrow">YOUR FRONTEND. YOUR CHOICE.</span>
          <h2 id="code-title">Content wherever<br />you need it.</h2>
          <p>
            Use the protocol that fits your application. Fetch content, query
            relationships, or subscribe to changes.
          </p>
          <a class="text-link" href="/packages/kyro-connect"
            >Explore the client SDK <PhArrowUpRight :size="18"
          /></a>
        </div>
        <div class="api-code">
          <div class="api-tabs" role="group" aria-label="API code examples">
            <button
              v-for="protocol in protocols"
              :key="protocol.label"
              :aria-pressed="activeApi === protocol.label"
              :class="{ active: activeApi === protocol.label }"
              @click="activeApi = protocol.label"
            >
              {{ protocol.label }}
            </button>
          </div>
          <template v-for="protocol in protocols" :key="protocol.label"
            ><div
              v-if="activeApi === protocol.label"
              class="code-example"
              role="region"
              :aria-label="`${protocol.label} code example`"
            >
              <div class="code-header">
                <span>{{ protocol.file }}</span
                ><PhCode :size="18" />
              </div>
              <pre><code>{{ protocol.code }}</code></pre>
            </div></template
          >
          <div class="code-footer">Four ways in. One content model.</div>
        </div>
      </section>

      <section class="manifesto shell" aria-label="Kyro philosophy">
        <p>
          <span
            v-for="(word, i) in [
              'Less',
              'time',
              'connecting',
              'the',
              'pieces.',
              'More',
              'time',
              'making',
              'something',
              'yours.',
            ]"
            :key="i"
            :style="{ transitionDelay: `${i * 50}ms` }"
            class="reveal-word"
            :class="{ 'new-line': i === 5 }"
            >{{ word }}{{ " " }}</span
          >
        </p>
        <a class="text-link" href="/architecture"
          >See how Kyro fits together <PhArrowUpRight :size="18"
        /></a>
      </section>

      <section class="getting-started shell" aria-labelledby="start-title">
        <div class="section-heading">
          <span class="eyebrow">FROM CONFIG TO CONTENT</span>
          <h2 id="start-title">Start with a schema.<br />Make it your own.</h2>
        </div>
        <ol class="steps">
          <li>
            <span>01</span>
            <h3>Create your project.</h3>
            <p>Run the CLI and choose your database and starting template.</p>
            <code>{{ command }}</code>
          </li>
          <li>
            <span>02</span>
            <h3>Define your content.</h3>
            <p>
              Add collections, fields, and relationships to your TypeScript
              config.
            </p>
            <code>kyro.config.ts</code>
          </li>
          <li>
            <span>03</span>
            <h3>Build what’s next.</h3>
            <p>
              Open the admin, add content, and connect your frontend through the
              APIs.
            </p>
            <code>localhost:4321/admin</code>
          </li>
        </ol>
      </section>

      <section class="faq-section shell" aria-labelledby="faq-title">
        <div class="section-copy">
          <span class="eyebrow">A FEW THINGS TO KNOW</span>
          <h2 id="faq-title">Good questions.<br />Straight answers.</h2>
          <a class="text-link" href="/getting-started"
            >Go to the docs <PhArrowUpRight :size="18"
          /></a>
        </div>
        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.q">
            <summary>
              {{ faq.q }}<PhPlus class="faq-plus" :size="20" /><PhMinus
                class="faq-minus"
                :size="20"
              />
            </summary>
            <div class="faq-answer">
              <p>{{ faq.a }}</p>
              <a v-if="faq.link" class="text-link" :href="faq.link"
                >{{ faq.label }} <PhArrowUpRight :size="16"
              /></a>
            </div>
          </details>
        </div>
      </section>

      <section class="closing shell" aria-labelledby="closing-title">
        <BackgroundArtwork variant="closing" :paused="!backgroundMotion" />
        <div>
          <span class="eyebrow">YOUR NEXT PROJECT STARTS HERE</span>
          <h2 id="closing-title">Make room<br />for the good stuff.</h2>
          <p>One config. A whole new starting point.</p>
        </div>
        <div class="closing-action">
          <a
            class="button button-black"
            id="cta-start-building"
            href="/getting-started"
            >Get started <PhArrowRight :size="20" /></a
          ><a href="https://github.com/danielDozie/kyro-cms"
            >Open source on GitHub <PhArrowUpRight :size="16"
          /></a>
        </div>
      </section>
      <aside class="development shell">
        <span class="status-dot" aria-hidden="true"></span>
        <p>
          Kyro is in active development and has not reached a stable v1.0
          release. It is not yet fully ready for production use.
          <a href="/development-status"
            >Read the development status <span aria-hidden="true">↗</span></a
          >
        </p>
      </aside>
    </main>

    <footer class="kh-footer shell">
      <div class="footer-main">
        <div>
          <a class="brand" href="/"
            ><img src="/logo-accent.svg" width="32" height="28" alt="" /><span
              >Kyro CMS</span
            ></a
          >
          <p>
            The CMS that starts with your schema.<br />Built for Astro. Open to
            possibilities.
          </p>
        </div>
        <nav aria-label="Product links">
          <strong>Build</strong><a href="/getting-started">Getting started</a
          ><a href="/guides/configuration">Configuration</a
          ><a href="/reference/api-overview">API reference</a>
        </nav>
        <nav aria-label="Resources">
          <strong>Explore</strong><a href="/architecture">Architecture</a
          ><a href="/changelog">Changelog</a><a href="/roadmap">Roadmap</a>
        </nav>
        <nav aria-label="Community">
          <strong>Connect</strong
          ><a href="https://github.com/danielDozie/kyro-cms"
            >GitHub <PhArrowUpRight :size="14" /></a
          ><a href="https://github.com/danielDozie/kyro-cms/issues"
            >Report an issue <PhArrowUpRight :size="14" /></a
          ><a
            href="https://github.com/danielDozie/kyro-cms/blob/main/CONTRIBUTING.md"
            >Contribute <PhArrowUpRight :size="14"
          /></a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Kyro CMS</span
        ><span>Released under the MIT license.</span
        ><button
          class="motion-control"
          type="button"
          :aria-pressed="backgroundMotion"
          @click="backgroundMotion = !backgroundMotion"
        >
          {{
            backgroundMotion
              ? "Pause background motion"
              : "Resume background motion"
          }}</button
        ><a href="#main-content">Back to top ↑</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.kh {
  --orange: #ff570a;
  --orange-ink: #ab3500;
  --ink: #181818;
  --muted: #5b5b60;
  --line: #e4e4e7;
  --paper: #fafafa;
  --art-line: #d4d4d8;
  --surface: #ffffff;
  --soft: #f0f0f2;
  --frame-line: #d4d4d8;
  --orange-soft: #fff1e9;
  --on-orange: #181818;
  --native-scheme: light;
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
  background: var(--paper);
  color: var(--ink);
  color-scheme: var(--native-scheme);
  font-family: "Geist Variable", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  overflow: clip;
}
.kh *,
.kh *::before,
.kh *::after {
  box-sizing: border-box;
}
.kh :is(h1, h2, h3, p, figure, ul, ol) {
  margin: 0;
}
.kh :is(h1, h2, h3) {
  text-wrap: balance;
}
.kh p {
  text-wrap: pretty;
}
.kh a {
  color: inherit;
  text-decoration: none;
}
.kh button {
  font: inherit;
  cursor: pointer;
}
.kh svg {
  flex-shrink: 0;
}
.kh :is(a, button, summary):focus-visible {
  outline: 3px solid var(--orange-ink);
  outline-offset: 5px;
}
.shell {
  width: min(100% - 96px, 1400px);
  margin-inline: auto;
}
.kh-skip {
  position: absolute;
  z-index: 20;
  top: 8px;
  left: 8px;
  padding: 12px 16px;
  background: var(--surface);
  transform: translateY(-150%);
}
.kh-skip:focus {
  transform: none;
}
.kh-header {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 104px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.05em;
}
.brand img {
  object-fit: contain;
  flex-shrink: 0;
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--muted) !important;
}
.status span,
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--orange);
  flex-shrink: 0;
}
.desktop-nav {
  margin-left: auto;
  display: flex;
  gap: 32px;
  align-items: center;
}
.desktop-nav a {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  min-height: 44px;
}
.desktop-nav a:hover,
.text-link:hover {
  color: var(--orange-ink);
}
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: var(--orange);
  color: var(--on-orange) !important;
  padding: 12px 24px;
  min-height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition:
    transform 0.25s var(--ease),
    background 0.25s var(--ease);
}
.button:hover {
  background: #f04c00;
  transform: translateY(-2px);
}
.button:active {
  transform: scale(0.98);
}
.header-cta {
  font-size: 14px;
  gap: 12px;
}
.mobile-nav {
  display: none;
}
.hero {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 48px;
  align-items: center;
  padding-block: 48px 64px;
}
.version {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  margin-bottom: 24px;
}
.version > span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--muted);
}
.hero h1 {
  font-size: 60px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.065em;
  max-width: 680px;
}
.hero-description {
  color: var(--muted);
  font-size: 20px;
  line-height: 28px;
  max-width: 480px;
  margin-top: 24px !important;
}
.hero-cta {
  margin-top: 32px;
}
.command-wrap {
  margin-top: 16px;
  max-width: 400px;
  position: relative;
}
.command {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px;
  border: 1px solid #313131;
  border-radius: 8px;
  background: #181818;
  color: white;
  text-align: left;
  min-height: 56px;
  transition: background 0.25s var(--ease);
}
.command:hover {
  background: #272727;
}
.command code {
  font:
    14px/20px ui-monospace,
    monospace;
  white-space: nowrap;
  user-select: text;
}
.command svg {
  margin-left: auto;
  color: #b1b1b6;
}
.prompt {
  color: #b1b1b6;
  font:
    14px ui-monospace,
    monospace;
}
.copy-feedback {
  position: absolute;
  top: 100%;
  left: 0;
  font-size: 12px;
  color: var(--orange-ink);
  padding-top: 4px;
}
.hero-footnote {
  font-size: 12px;
  color: var(--muted);
  margin-top: 32px !important;
}
.hero-product {
  position: relative;
  background: var(--orange);
  border-radius: 16px;
  padding: 24px 32px;
  margin-right: -48px !important;
}
.product-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0;
  margin-bottom: 24px;
  font:
    12px/16px ui-monospace,
    monospace;
  letter-spacing: 0.04em;
}
.product-label > span:last-child {
  font-size: 24px;
}
.product-window {
  width: 100%;
  border: 1px solid var(--frame-line);
  border-radius: 12px;
  background: var(--surface);
  overflow: hidden;
  box-shadow: 0 24px 48px -24px #a23a08;
}
.window-bar {
  padding: 12px 16px;
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}
.window-dots {
  display: flex;
  gap: 4px;
}
.window-dots i {
  width: 8px;
  height: 8px;
  border: 1px solid var(--frame-line);
  border-radius: 50%;
}
.window-live {
  margin-left: auto;
}
.product-window img {
  display: block;
  width: 100%;
  height: auto;
}
.hero-product figcaption {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0 0;
  font-size: 12px;
}
.hero-product figcaption a {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  font-weight: 600;
}
.product-tag {
  position: absolute;
  left: -24px;
  bottom: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #181818;
  color: white;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: 0 12px 24px -12px #7e2c08;
}
.product-tag svg {
  color: var(--orange);
}
.product-tag strong {
  font-weight: 500;
}
.stack-band {
  display: flex;
  align-items: center;
  gap: 64px;
  padding-block: 32px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.stack-band p {
  font-size: 12px;
  color: var(--muted);
}
.stack-band ul {
  list-style: none;
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding: 0;
  gap: 24px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.stack-band li {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}
.stack-band li img {
  flex-shrink: 0;
  object-fit: contain;
}
.protocol > img {
  flex-shrink: 0;
}
.api-section,
.code-section,
.faq-section {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 80px;
  align-items: center;
  padding-block: 96px;
}
.eyebrow {
  display: block;
  font:
    12px/16px ui-monospace,
    monospace;
  letter-spacing: 0.05em;
  color: var(--orange-ink);
  margin-bottom: 24px;
}
.kh h2 {
  font-size: 60px;
  line-height: 1;
  letter-spacing: -0.055em;
  font-weight: 600;
}
.section-copy p,
.editor-copy p {
  color: var(--muted);
  margin-top: 24px;
  max-width: 400px;
  font-size: 18px;
  line-height: 28px;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  min-height: 44px;
  margin-top: 16px;
  transition: color 0.25s var(--ease);
}
.schema-flow {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 24px;
  align-items: center;
}
.schema-card {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  min-width: 0;
}
.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--line);
  font:
    12px/16px ui-monospace,
    monospace;
}
.code-header > :last-child {
  color: var(--muted);
}
.kh pre {
  padding: 24px 16px;
  margin: 0;
  overflow-x: auto;
  tab-size: 2;
}
.kh pre code {
  font:
    12px/24px ui-monospace,
    monospace;
}
.schema-output {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  background: var(--orange-soft);
  border-radius: 0 0 12px 12px;
  color: var(--orange-ink);
}
.protocol-list {
  display: grid;
  gap: 12px;
}
.protocol {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  transition:
    border-color 0.25s var(--ease),
    transform 0.25s var(--ease);
}
.protocol:hover {
  border-color: var(--orange);
  transform: translateX(4px);
}
.protocol > svg:first-child {
  color: var(--orange-ink);
}
.protocol > svg:last-child {
  margin-left: auto;
}
.protocol strong {
  font-size: 14px;
  font-weight: 600;
  display: block;
}
.protocol small {
  font-size: 12px;
  color: var(--muted);
  display: block;
}
.feature-section {
  padding-block: 64px 96px;
  border-top: 1px solid var(--line);
  scroll-margin-top: 24px;
}
.section-heading {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  column-gap: 48px;
  margin-bottom: 48px;
}
.section-heading .eyebrow {
  grid-column: 1/-1;
}
.section-heading > p {
  color: var(--muted);
  font-size: 20px;
  line-height: 28px;
  padding-bottom: 8px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.feature-grid article > svg {
  color: var(--orange-ink);
  margin-bottom: 24px;
}
.kh h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.feature-grid article > p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 16px;
  line-height: 24px;
}
.editor-section {
  background: var(--soft);
  padding-block: 80px;
}
.editor-layout {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: 64px;
}
.editor-layout figure {
  min-width: 0;
}
.editor-layout img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--frame-line);
  border-radius: 12px;
}
.editor-layout figcaption {
  margin-top: 16px;
  color: var(--muted);
  font-size: 12px;
}
.editor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.editor-tags span {
  border: 1px solid var(--frame-line);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.api-code {
  border-radius: 12px;
  background: #181818;
  color: #fff;
  overflow: hidden;
  min-width: 0;
}
.api-tabs {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #313131;
}
.api-tabs button {
  color: #b1b1b6;
  border: 0;
  background: transparent;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  min-height: 44px;
  transition:
    background 0.25s var(--ease),
    color 0.25s var(--ease);
}
.api-tabs button:hover {
  background: #272727;
  color: white;
}
.api-tabs button.active {
  background: var(--orange);
  color: var(--on-orange);
}
.api-code .code-header {
  border-color: #313131;
  color: #b1b1b6;
}
.api-code .code-header > :last-child {
  color: #b1b1b6;
}
.api-code pre {
  min-height: 272px;
  padding: 24px;
}
.api-code pre code {
  font-size: 14px;
}
.code-footer {
  padding: 12px 24px;
  color: #b1b1b6;
  border-top: 1px solid #313131;
  font-size: 12px;
}
.manifesto {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding-block: 80px;
}
.manifesto p {
  max-width: 960px;
  font-size: 60px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.05em;
}
.reveal-word {
  color: #99999e;
  transition: color 0.8s var(--ease);
}
.reveal-word.is-visible {
  color: var(--ink);
}
.new-line::before {
  content: "";
  display: block;
  margin-top: 8px;
}
.getting-started {
  padding-block: 96px;
}
.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding: 0;
}
.steps li > span {
  display: block;
  color: var(--orange-ink);
  font:
    14px ui-monospace,
    monospace;
  margin-bottom: 24px;
}
.steps li p {
  margin-top: 12px;
  color: var(--muted);
}
.steps code {
  display: block;
  padding: 12px;
  margin-top: 24px;
  background: var(--soft);
  border-radius: 4px;
  font:
    12px/20px ui-monospace,
    monospace;
  overflow-wrap: anywhere;
}
.faq-section {
  border-top: 1px solid var(--line);
  align-items: start;
}
.faq-list details {
  border-bottom: 1px solid var(--line);
}
.faq-list summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  list-style: none;
}
.faq-list summary::-webkit-details-marker,
.mobile-nav summary::-webkit-details-marker {
  display: none;
}
.faq-minus,
details[open] .faq-plus {
  display: none;
}
.faq-list details[open] .faq-minus {
  display: block;
}
.faq-answer {
  padding: 0 32px 24px 0;
  color: var(--muted);
}
.faq-answer .text-link {
  color: var(--ink);
}
.closing {
  padding: 64px;
  border-radius: 16px;
  background: var(--orange);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}
.closing .eyebrow {
  color: var(--on-orange);
}
.closing p {
  margin-top: 24px;
  font-size: 18px;
}
.closing-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.button-black {
  background: #181818;
  color: white !important;
}
.button-black:hover {
  background: #313131;
}
.closing-action > a:last-child {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  min-height: 44px;
}
.development {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-block: 32px;
  color: var(--muted);
  font-size: 12px;
}
.development .status-dot {
  margin-top: 4px;
}
.development a {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.kh-footer {
  padding-top: 48px;
  border-top: 1px solid var(--line);
}
.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 64px;
}
.footer-main p {
  color: var(--muted);
  font-size: 14px;
  margin-top: 16px;
}
.footer-main nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
}
.footer-main nav strong {
  margin-bottom: 4px;
  font-weight: 600;
}
.footer-main nav a {
  color: var(--muted);
  min-height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.footer-main nav a:hover {
  color: var(--orange-ink);
}
.footer-bottom {
  border-top: 1px solid var(--line);
  padding-block: 24px;
  display: flex;
  gap: 24px;
  color: var(--muted);
  font-size: 12px;
}
.footer-bottom a {
  margin-left: auto;
}
@media (min-width: 1536px) {
  .hero h1 {
    font-size: 72px;
  }
  .desktop-break {
    display: none;
  }
  .hero {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 1279px) {
  .shell {
    width: calc(100% - 64px);
  }
  .hero {
    gap: 32px;
  }
  .hero h1 {
    font-size: 60px;
  }
  .hero-product {
    margin-right: -32px !important;
    padding-left: 24px;
  }
  .api-section,
  .code-section,
  .faq-section {
    gap: 48px;
  }
  .schema-flow {
    grid-template-columns: 1fr;
  }
  .protocol-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .protocol {
    padding: 12px;
  }
  .protocol small {
    display: none;
  }
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
  }
  .kh h2,
  .manifesto p {
    font-size: 48px;
  }
  .editor-layout {
    gap: 32px;
  }
  .status {
    display: none;
  }
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .hero h1 {
    font-size: 48px;
  }
}
@media (max-width: 1023px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 32px;
  }
  .hero h1 {
    font-size: 72px;
  }
  .desktop-break {
    display: none;
  }
  .hero-product {
    margin-right: 0 !important;
    padding: 24px 32px;
  }
  .product-window {
    width: 100%;
  }
  .product-label {
    padding-right: 0;
  }
  .hero-product figcaption {
    padding-right: 0;
  }
  .product-tag {
    left: -16px;
    bottom: 64px;
  }
  .hero-description {
    max-width: 560px;
  }
  .stack-band {
    gap: 32px;
  }
  .stack-band ul {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 16px 32px;
    font-size: 18px;
  }
  .api-section,
  .code-section {
    grid-template-columns: 1fr;
  }
  .schema-flow {
    grid-template-columns: 1.15fr 1fr;
  }
  .protocol-list {
    grid-template-columns: 1fr;
  }
  .protocol small {
    display: block;
  }
  .section-copy p {
    max-width: 560px;
  }
  .editor-layout {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .faq-section {
    grid-template-columns: 1fr;
  }
  .closing {
    padding: 48px;
  }
  .footer-main {
    gap: 24px;
  }
}
@media (max-width: 767px) {
  .shell {
    width: calc(100% - 40px);
  }
  .kh-header {
    min-height: 80px;
    gap: 12px;
  }
  .brand {
    font-size: 20px;
  }
  .brand img {
    width: 24px;
    height: 24px;
  }
  .desktop-nav {
    display: none;
  }
  .header-cta {
    margin-left: auto;
    padding: 8px 12px;
    min-height: 44px;
  }
  .header-cta svg {
    display: none;
  }
  .mobile-nav {
    display: block;
    position: relative;
  }
  .mobile-nav summary {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    cursor: pointer;
    list-style: none;
    border: 1px solid var(--line);
    border-radius: 8px;
  }
  .menu-close,
  .mobile-nav[open] .menu-open {
    display: none;
  }
  .mobile-nav[open] .menu-close {
    display: block;
  }
  .mobile-nav nav {
    position: absolute;
    right: 0;
    top: 56px;
    width: 240px;
    background: var(--surface);
    z-index: 10;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 12px 24px #18181812;
    display: grid;
  }
  .mobile-nav nav a {
    padding: 12px;
    min-height: 44px;
    font-size: 14px;
  }
  .hero {
    padding-block: 32px 48px;
    gap: 40px;
  }
  .hero h1 {
    font-size: 48px;
    letter-spacing: -0.06em;
  }
  .hero-description {
    font-size: 18px;
    line-height: 28px;
  }
  .version {
    margin-bottom: 24px;
  }
  .hero-product {
    padding: 16px;
  }
  .product-label {
    font-size: 12px;
    letter-spacing: 0;
    gap: 16px;
    margin-bottom: 16px;
  }
  .product-label > span:first-child {
    max-width: 200px;
  }
  .window-bar {
    padding: 8px;
    gap: 8px;
  }
  .window-live {
    display: none;
  }
  .product-tag {
    display: none;
  }
  .hero-product figcaption {
    padding-top: 16px;
    align-items: start;
  }
  .hero-product figcaption > span {
    max-width: 160px;
  }
  .command {
    gap: 12px;
    padding: 12px;
  }
  .command code {
    font-size: 12px;
  }
  .stack-band {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding-block: 24px;
  }
  .stack-band p br {
    display: none;
  }
  .stack-band ul {
    font-size: 16px;
    gap: 12px 24px;
  }
  .api-section,
  .code-section,
  .faq-section {
    padding-block: 64px;
    gap: 32px;
  }
  .kh h2,
  .manifesto p {
    font-size: 36px;
    line-height: 40px;
  }
  .schema-flow {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .protocol-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .protocol {
    gap: 8px;
  }
  .protocol small,
  .protocol > svg:last-child {
    display: none;
  }
  .schema-card pre {
    padding: 16px;
  }
  .section-heading {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }
  .section-heading .eyebrow {
    margin-bottom: 0;
  }
  .section-heading > p {
    font-size: 18px;
  }
  .feature-section {
    padding-block: 48px 64px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .feature-grid article {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 0 16px;
  }
  .feature-grid article > svg {
    grid-row: 1/4;
    margin: 0;
  }
  .feature-grid article p,
  .feature-grid article a {
    grid-column: 2;
  }
  .editor-section {
    padding-block: 48px;
  }
  .editor-tags {
    gap: 8px;
  }
  .api-tabs {
    gap: 0;
    padding: 8px;
    justify-content: space-between;
  }
  .api-tabs button {
    padding: 8px;
    font-size: 12px;
  }
  .api-code pre {
    padding: 16px;
    min-height: 272px;
  }
  .api-code pre code {
    font-size: 12px;
  }
  .manifesto {
    padding-block: 48px;
  }
  .getting-started {
    padding-block: 64px;
  }
  .steps {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .steps li > span {
    margin-bottom: 12px;
  }
  .steps code {
    margin-top: 16px;
  }
  .faq-list summary {
    font-size: 16px;
    padding-block: 16px;
  }
  .closing {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 24px;
    gap: 32px;
  }
  .closing-action {
    align-items: flex-start;
    gap: 8px;
  }
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    padding-bottom: 40px;
  }
  .footer-main > div {
    grid-column: 1/-1;
  }
  .footer-main nav a {
    min-height: 32px;
  }
  .footer-bottom {
    flex-wrap: wrap;
    gap: 12px 24px;
  }
  .footer-bottom a {
    margin-left: 0;
  }
  .development {
    padding-block: 24px;
  }
}
@media (max-width: 399px) {
  .hero h1 {
    font-size: 36px;
    line-height: 40px;
  }
}
.theme-toggle {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  transition:
    border-color 0.25s var(--ease),
    background 0.25s var(--ease);
}
.theme-toggle:hover {
  border-color: var(--orange);
  background: var(--soft);
}
.theme-toggle:active {
  transform: scale(0.98);
}
.kh.kh-dark {
  --orange-ink: #ff9b6b;
  --ink: #f4f4f5;
  --muted: #b1b1b8;
  --line: #313131;
  --paper: #181818;
  --art-line: #45454b;
  --surface: #1f1f1f;
  --soft: #272727;
  --frame-line: #505055;
  --orange-soft: #35271f;
  --native-scheme: dark;
}
.hero-product,
.closing {
  color: var(--on-orange);
}
.kh-dark :is(.stack-band li img, .protocol > img) {
  filter: brightness(0) invert(1);
}
.kh-dark .product-window {
  box-shadow: 0 24px 48px -24px #131209;
}
.kh-dark .mobile-nav nav {
  box-shadow: 0 12px 24px #131209;
}
.kh-dark .api-code {
  border: 1px solid var(--line);
}
.kh-dark .editor-layout img {
  border-color: var(--frame-line);
}
@media (max-width: 767px) {
  .kh-header {
    gap: 8px;
  }
  .theme-toggle {
    width: 44px;
    height: 44px;
  }
}
@media (max-width: 399px) {
  .kh-header .brand {
    font-size: 18px;
    gap: 4px;
  }
  .kh-header .brand img {
    width: 20px;
    height: 20px;
  }
  .header-cta {
    font-size: 12px;
  }
}
.hero,
.api-section,
.closing {
  position: relative;
  isolation: isolate;
}
.hero > :not(.background-artwork),
.api-section > :not(.background-artwork),
.closing > :not(.background-artwork) {
  position: relative;
  z-index: 1;
}
.hero > .background-artwork {
  inset: -24px -48px;
}
.api-section > .background-artwork {
  inset: 0 -48px;
}
.closing {
  overflow: clip;
}
.motion-control {
  padding: 0 8px;
  min-height: 32px;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
}
.motion-control:hover {
  color: var(--orange-ink);
}
@media (max-width: 767px) {
  .hero > .background-artwork {
    inset-inline: -20px;
  }
  .api-section > .background-artwork {
    inset-inline: -20px;
  }
  .motion-control {
    min-height: 44px;
    padding-inline: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .kh *,
  .kh *::before,
  .kh *::after {
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .reveal-word {
    color: var(--ink);
  }
}
</style>
