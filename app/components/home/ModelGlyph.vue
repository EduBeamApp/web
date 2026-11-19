<script setup lang="ts">
/**
 * One small drawing of something EduBeam models - a support, a load, a cross section or a result
 * diagram - in the same symbols and colours as the larger figures on the page.
 */
export type GlyphKind =
  | 'pin'
  | 'roller'
  | 'fixed'
  | 'slider'
  | 'angled'
  | 'point'
  | 'uniform'
  | 'trapezoidal'
  | 'moment'
  | 'temperature'
  | 'i'
  | 'hollow'
  | 'solid'
  | 'tube'
  | 'polygon'
  | 'N'
  | 'V'
  | 'M'
  | 'w'

defineProps<{ kind: GlyphKind }>()

const udl = [14, 22, 30, 38, 46, 54, 62]

/*
 * The result glyphs' ordinates, computed from the very curves drawn, every 7 px as the figures
 * hatch: N a constant 11 px, V a line from +14 to -14, M the parabola of 'M10,28 Q38,64 66,28'
 * (a quadratic Bezier, so its depth at t is 72 t(1 - t)).
 */
const HATCH_X = [17, 24, 31, 38, 45, 52, 59]
const ordinate = (x: number, depth: number) => `M${x},28V${(28 + depth).toFixed(2)}`
const nHatch = HATCH_X.map((x) => ordinate(x, -11)).join('')
const vHatch = HATCH_X.map((x) => ordinate(x, -14 + ((x - 10) / 56) * 28)).join('')
const mHatch = HATCH_X.map((x) => {
  const t = (x - 10) / 56
  return ordinate(x, 72 * t * (1 - t))
}).join('')
// The trapezoid rises from 6 px of load at the left to 22 px at the right
const trap = [14, 24, 34, 44, 54, 62].map((x) => ({ x, top: 30 - (6 + ((x - 14) / 48) * 16) }))
</script>

<template>
  <svg viewBox="0 0 76 56" class="h-14 w-[4.75rem] text-figure" aria-hidden="true">
    <defs>
      <marker :id="`g-head-${kind}`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
        <path d="M0,0L10,5L0,10Z" fill="var(--color-load)" />
      </marker>
    </defs>
    <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
      <!-- Supports: a member end on its support -->
      <!-- The app's pin, a bare triangle, and its roller, the triangle on a track -->
      <template v-if="kind === 'pin'">
        <line x1="14" y1="20" x2="38" y2="20" stroke-width="3" />
        <path d="M38,21l-11.25,15h22.5Z" fill="var(--paper)" stroke-width="1.8" />
      </template>
      <template v-else-if="kind === 'roller'">
        <line x1="14" y1="20" x2="38" y2="20" stroke-width="3" />
        <path d="M38,21l-11.25,15h22.5Z" fill="var(--paper)" stroke-width="1.8" />
        <line x1="26.75" y1="40" x2="49.25" y2="40" stroke-width="1.8" />
      </template>
      <template v-else-if="kind === 'fixed'">
        <line x1="24" y1="24" x2="60" y2="24" stroke-width="3" />
        <line x1="24" y1="10" x2="24" y2="38" stroke-width="2.4" />
        <path d="M24,12l-5,5M24,19l-5,5M24,26l-5,5M24,33l-5,5" stroke-width="1.2" />
      </template>
      <!-- A slider, as the app draws it: the member held between two rails, free to slide along
           them but not to turn - unlike a roller, it takes a moment -->
      <template v-else-if="kind === 'slider'">
        <line x1="10" y1="28" x2="38" y2="28" stroke-width="3" />
        <line x1="26" y1="21" x2="54" y2="21" stroke-width="1.8" />
        <line x1="26" y1="35" x2="54" y2="35" stroke-width="1.8" />
        <path d="M30,21l-4,-5M36,21l-4,-5M42,21l-4,-5M48,21l-4,-5M54,21l-4,-5" stroke-width="1.2" />
        <path d="M30,35l-4,5M36,35l-4,5M42,35l-4,5M48,35l-4,5M54,35l-4,5" stroke-width="1.2" />
        <circle cx="38" cy="28" r="2.4" fill="currentColor" stroke="none" />
      </template>
      <template v-else-if="kind === 'angled'">
        <line x1="12" y1="20" x2="38" y2="20" stroke-width="3" />
        <g transform="rotate(-30 38 21)">
          <path d="M38,21l-11.25,15h22.5Z" fill="var(--paper)" stroke-width="1.8" />
          <line x1="26.75" y1="40" x2="49.25" y2="40" stroke-width="1.8" />
        </g>
      </template>

      <!-- Loads, on a member -->
      <template v-else-if="kind === 'point'">
        <line x1="8" y1="36" x2="68" y2="36" stroke-width="3" />
        <line x1="38" y1="8" x2="38" y2="33" stroke="var(--color-load)" stroke-width="2.4" :marker-end="`url(#g-head-${kind})`" />
      </template>
      <template v-else-if="kind === 'uniform'">
        <line x1="8" y1="36" x2="68" y2="36" stroke-width="3" />
        <line x1="14" y1="14" x2="62" y2="14" stroke="var(--color-load)" stroke-width="1.2" />
        <line v-for="x in udl" :key="x" :x1="x" y1="14" :x2="x" y2="33" stroke="var(--color-load)" stroke-width="1.2" :marker-end="`url(#g-head-${kind})`" />
      </template>
      <template v-else-if="kind === 'trapezoidal'">
        <line x1="8" y1="36" x2="68" y2="36" stroke-width="3" />
        <line x1="14" :y1="trap[0].top" x2="62" :y2="trap.at(-1)!.top" stroke="var(--color-load)" stroke-width="1.2" />
        <line v-for="p in trap" :key="p.x" :x1="p.x" :y1="p.top" :x2="p.x" y2="33" stroke="var(--color-load)" stroke-width="1.2" :marker-end="`url(#g-head-${kind})`" />
      </template>
      <template v-else-if="kind === 'moment'">
        <line x1="8" y1="36" x2="68" y2="36" stroke-width="3" />
        <path d="M27,40A12,12 0 1 1 49,40" stroke="var(--color-load)" stroke-width="2" :marker-end="`url(#g-head-${kind})`" />
      </template>
      <template v-else-if="kind === 'temperature'">
        <line x1="8" y1="30" x2="68" y2="30" stroke-width="3" />
        <text x="38" y="20" text-anchor="middle" stroke="none" fill="var(--color-load)" class="g-text">+ΔT</text>
        <text x="38" y="50" text-anchor="middle" stroke="none" fill="var(--color-load)" class="g-text">−ΔT</text>
      </template>

      <!-- Cross sections -->
      <template v-else-if="kind === 'i'">
        <path d="M22,8h32v6h-13v28h13v6h-32v-6h13v-28h-13Z" fill="var(--mist)" />
      </template>
      <template v-else-if="kind === 'hollow'">
        <rect x="24" y="8" width="28" height="40" rx="2" fill="var(--mist)" />
        <rect x="28.5" y="12.5" width="19" height="31" rx="1" fill="var(--paper)" />
      </template>
      <template v-else-if="kind === 'solid'">
        <rect x="27" y="8" width="22" height="40" fill="var(--mist)" />
      </template>
      <template v-else-if="kind === 'tube'">
        <circle cx="38" cy="28" r="19" fill="var(--mist)" />
        <circle cx="38" cy="28" r="14.5" fill="var(--paper)" />
      </template>
      <template v-else-if="kind === 'polygon'">
        <path d="M20,46L26,10L44,14L56,30L46,46Z" fill="var(--mist)" />
        <circle v-for="(p, i) in [[20, 46], [26, 10], [44, 14], [56, 30], [46, 46]]" :key="i" :cx="p[0]" :cy="p[1]" r="2.2" fill="var(--brand)" stroke="none" />
      </template>

      <!-- Result diagrams over a member, hatched with ordinates as the figures are -->
      <template v-else>
        <line v-if="kind !== 'w'" x1="10" y1="28" x2="66" y2="28" stroke-width="3" />
        <g v-if="kind === 'N'" stroke="var(--color-normal)">
          <path d="M10,28V17H66V28" stroke-width="1.5" />
          <path :d="nHatch" stroke-width="1" opacity=".55" />
        </g>
        <g v-else-if="kind === 'V'" stroke="var(--color-shear)">
          <path d="M10,28V14L66,42V28" stroke-width="1.5" />
          <path :d="vHatch" stroke-width="1" opacity=".55" />
        </g>
        <g v-else-if="kind === 'M'" stroke="var(--color-moment)">
          <path d="M10,28Q38,64 66,28" stroke-width="1.5" />
          <path :d="mHatch" stroke-width="1" opacity=".55" />
        </g>
        <g v-else-if="kind === 'w'">
          <line x1="10" y1="28" x2="66" y2="28" stroke-width="1" stroke-dasharray="3 3" class="text-muted" />
          <path d="M10,28Q38,50 66,28" stroke-width="2" />
        </g>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.g-text {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
}
</style>
