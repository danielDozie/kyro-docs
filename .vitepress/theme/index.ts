import DefaultTheme from "vitepress/theme";
import type { EnhanceAppContext } from "vitepress";
import { h } from "vue";
import "./style.css";
import DocsHome from "./components/DocsHome.vue";
import VersionBadge from "./components/VersionBadge.vue";
import CalloutBlock from "./components/CalloutBlock.vue";
import AnnouncementBanner from "./components/AnnouncementBanner.vue";

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => [
        h(AnnouncementBanner),
        h("div", { class: "kyro-noise", "aria-hidden": "true" }),
      ],
    });
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.component("DocsHomePage", DocsHome);
    app.component("VersionBadge", VersionBadge);
    app.component("Callout", CalloutBlock);
  },
};
