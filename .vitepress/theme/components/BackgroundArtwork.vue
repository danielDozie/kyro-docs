<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = withDefaults(
  defineProps<{ variant?: "hero" | "schema" | "closing"; paused?: boolean }>(),
  { variant: "hero", paused: false },
);
const element = ref<HTMLElement | null>(null);
const inView = ref(false);
const pageVisible = ref(true);
const running = computed(
  () => inView.value && pageVisible.value && !props.paused,
);
let observer: IntersectionObserver | undefined;
function updateVisibility() {
  pageVisible.value = !document.hidden;
}
onMounted(() => {
  updateVisibility();
  document.addEventListener("visibilitychange", updateVisibility);
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting;
    },
    { threshold: 0.05 },
  );
  if (element.value) observer.observe(element.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  document.removeEventListener("visibilitychange", updateVisibility);
});
</script>

<template>
  <div
    ref="element"
    class="background-artwork"
    :class="[`artwork-${variant}`, { 'is-running': running }]"
    aria-hidden="true"
  >
    <svg
      v-if="variant === 'hero'"
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <!-- Quiet contour lines echo the shape of the product workspace. -->
      <g class="contours">
        <rect
          x="590"
          y="48"
          width="790"
          height="540"
          rx="112"
          transform="rotate(-14 985 318)"
        />
        <rect
          x="554"
          y="12"
          width="862"
          height="612"
          rx="144"
          transform="rotate(-14 985 318)"
        />
        <rect
          x="518"
          y="-24"
          width="934"
          height="684"
          rx="176"
          transform="rotate(-14 985 318)"
        />
        <rect
          x="482"
          y="-60"
          width="1006"
          height="756"
          rx="208"
          transform="rotate(-14 985 318)"
        />
        <rect
          x="446"
          y="-96"
          width="1078"
          height="828"
          rx="240"
          transform="rotate(-14 985 318)"
        />
      </g>
      <g class="guides">
        <path d="M0 636H360Q384 636 384 612V564Q384 540 408 540H628" />
        <path d="M256 0V104Q256 128 280 128H542" />
        <path d="M1054 32H1372M1340 0V92" />
        <path d="M20 672h16m-8-8v16M556 64h16m-8-8v16M1240 688h16m-8-8v16" />
      </g>
      <g class="accent-route">
        <path d="M18 636H348" />
        <circle cx="18" cy="636" r="3" />
        <circle cx="348" cy="636" r="3" />
      </g>
      <g class="hero-packet"><circle cx="28" cy="636" r="3" /></g>
      <g class="quiet-node">
        <circle cx="564" cy="128" r="18" />
        <circle cx="564" cy="128" r="4" />
      </g>
    </svg>

    <svg
      v-else-if="variant === 'schema'"
      viewBox="0 0 1440 520"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <!-- A single route branches into four lanes, like the generated APIs. -->
      <g class="guides">
        <path d="M16 344H468Q492 344 492 320V260Q492 236 516 236H612" />
        <path d="M612 236H660Q684 236 684 212V96Q684 72 708 72H1408" />
        <path d="M612 236H660Q708 236 708 188V160Q708 136 732 136H1408" />
        <path d="M612 236H1408" />
        <path d="M612 236H660Q684 236 684 260V376Q684 400 708 400H1408" />
        <circle cx="612" cy="236" r="24" />
        <circle cx="612" cy="236" r="44" />
        <path d="M128 72h16m-8-8v16M1296 464h16m-8-8v16M496 448h16m-8-8v16" />
      </g>
      <g class="accent-route">
        <circle cx="612" cy="236" r="5" />
        <path d="M708 72H1004M740 400H1040" />
      </g>
      <g class="packet packet-one">
        <rect x="728" y="68" width="8" height="8" rx="2" />
      </g>
      <g class="packet packet-two">
        <rect x="740" y="232" width="8" height="8" rx="2" />
      </g>
      <g class="packet packet-three">
        <rect x="728" y="396" width="8" height="8" rx="2" />
      </g>
    </svg>

    <svg
      v-else
      viewBox="0 0 1400 420"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <g class="closing-orbit">
        <circle cx="1080" cy="210" r="128" />
        <circle cx="1080" cy="210" r="164" />
        <circle cx="1080" cy="210" r="200" />
        <circle cx="1080" cy="210" r="236" />
        <circle cx="1080" cy="210" r="272" />
        <path d="M808 210H1352M1080-62V482M888 18l384 384M888 402l384-384" />
        <rect
          x="1068"
          y="34"
          width="24"
          height="24"
          rx="4"
          transform="rotate(45 1080 46)"
        />
        <circle cx="1244" cy="210" r="8" />
        <circle cx="1080" cy="374" r="5" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.background-artwork {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: clip;
}
.background-artwork svg {
  display: block;
  width: 100%;
  height: 100%;
}
.contours,
.guides,
.quiet-node {
  stroke: var(--art-line, #dddde1);
  stroke-width: 1;
}
.contours {
  opacity: 0.7;
  transform-origin: 68% 44%;
  animation: contour-drift 24s var(--ease) infinite alternate;
}
.guides {
  opacity: 0.65;
}
.accent-route {
  stroke: var(--orange);
  stroke-width: 1;
  opacity: 0.22;
}
.hero-packet,
.packet {
  fill: var(--orange);
  opacity: 0.5;
}
.hero-packet {
  animation: hero-packet 14s linear infinite;
}
.quiet-node {
  animation: node-breathe 8s var(--ease) infinite alternate;
}
.packet {
  animation: schema-packet 16s linear infinite;
}
.packet-two {
  animation-delay: -5s;
}
.packet-three {
  animation-delay: -10s;
}
.closing-orbit {
  stroke: var(--on-orange);
  stroke-width: 1;
  opacity: 0.13;
  transform-origin: 1080px 210px;
  animation: orbit-turn 48s linear infinite;
}
.background-artwork
  :is(.contours, .hero-packet, .quiet-node, .packet, .closing-orbit) {
  animation-play-state: paused;
}
.is-running :is(.contours, .hero-packet, .quiet-node, .packet, .closing-orbit) {
  animation-play-state: running;
}
@keyframes contour-drift {
  from {
    transform: translate(0, -8px) rotate(-2deg);
  }
  to {
    transform: translate(-12px, 8px) rotate(2deg);
  }
}
@keyframes hero-packet {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  8%,
  85% {
    opacity: 0.6;
  }
  100% {
    transform: translateX(310px);
    opacity: 0;
  }
}
@keyframes schema-packet {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  10%,
  85% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(600px);
    opacity: 0;
  }
}
@keyframes node-breathe {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 0.65;
  }
}
@keyframes orbit-turn {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 1023px) {
  .artwork-hero {
    opacity: 0.65;
  }
  .artwork-schema {
    opacity: 0.6;
  }
}
@media (max-width: 767px) {
  .artwork-hero svg {
    width: 160%;
    margin-left: -35%;
  }
  .artwork-schema {
    opacity: 0.4;
  }
  .closing-orbit {
    opacity: 0.1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .background-artwork
    :is(.contours, .hero-packet, .quiet-node, .packet, .closing-orbit) {
    animation: none !important;
  }
  .hero-packet,
  .packet {
    opacity: 0.2;
  }
}
</style>
