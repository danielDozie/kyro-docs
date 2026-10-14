<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import pkg from "../../../package.json";

const { page, theme } = useData();
const section = computed(() => {
  const normalize = (path: string) =>
    path
      .replace(/\.(md|html)$/, "")
      .replace(/\/$/, "")
      .replace(/\/index$/, "");
  const current = normalize("/" + page.value.relativePath);
  const groups = theme.value.sidebar?.["/"] ?? [];
  return (
    groups.find((group: { items?: { link?: string }[] }) =>
      group.items?.some(
        (item) => item.link && normalize(item.link) === current,
      ),
    )?.text ?? "Documentation"
  );
});
</script>

<template>
  <div class="docs-page-meta">
    <nav aria-label="Breadcrumb">
      <a href="/">Kyro</a><span aria-hidden="true">/</span
      ><span>{{ section }}</span>
    </nav>
    <a href="/changelog" class="docs-version">v{{ pkg.version }}</a>
  </div>
</template>
