import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import type { EnhanceAppContext } from "vitepress";
import { h } from "vue";
import "@fontsource-variable/geist";
import "./style.css";
import "./docs.css";
import DocsHome from "./components/DocsHome.vue";
import VersionBadge from "./components/VersionBadge.vue";
import CalloutBlock from "./components/CalloutBlock.vue";
import DocsPageMeta from "./components/DocsPageMeta.vue";
import AnnouncementBanner from "./components/AnnouncementBanner.vue";

export default {
  extends: DefaultTheme,
  Layout() {
    const { frontmatter } = useData();
    if (frontmatter.value.pageClass === "custom-homepage") return h(DocsHome);
    return h(
      DefaultTheme.Layout,
      { class: "kyro-docs" },
      {
        "layout-top": () => h(AnnouncementBanner),
        "nav-bar-title-after": () =>
          h("span", { class: "docs-nav-label" }, "Docs"),
        "doc-before": () => h(DocsPageMeta),
        "sidebar-nav-after": () =>
          h("div", { class: "docs-sidebar-help" }, [
            h("p", "New to Kyro?"),
            h("a", { href: "/getting-started" }, "Build your first project ↗"),
          ]),
        "aside-outline-after": () =>
          h("div", { class: "docs-aside-help" }, [
            h("p", "Something missing or unclear?"),
            h(
              "a",
              { href: "https://github.com/danielDozie/kyro-cms/issues" },
              "Let us know ↗",
            ),
          ]),
      },
    );
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.component("DocsHomePage", DocsHome);
    app.component("VersionBadge", VersionBadge);
    app.component("Callout", CalloutBlock);
  },
};
