<script setup lang="ts">
/** A thumbnail of a reference case's beam, its supports and its load, in the figures' own symbols. */
defineProps<{ kind: 'simple' | 'cantilever' | 'fixed' | 'propped' }>()
const arrows = [14, 26, 38, 50, 62, 74]
</script>

<template>
  <svg viewBox="0 0 88 44" class="h-9 w-[4.5rem] shrink-0 text-figure" aria-hidden="true">
    <g stroke="currentColor" fill="none" stroke-width="1.4" stroke-linejoin="round">
      <!-- Load: a point load at the tip of the cantilever, a uniform load on the rest -->
      <template v-if="kind === 'cantilever'">
        <line x1="76" y1="6" x2="76" y2="18" stroke="var(--color-load)" stroke-width="1.8" />
        <path d="M72.5,15L79.5,15L76,21Z" fill="var(--color-load)" stroke="none" />
      </template>
      <template v-else>
        <line x1="12" y1="8" x2="76" y2="8" stroke="var(--color-load)" stroke-width="1" />
        <g v-for="x in arrows" :key="x">
          <line :x1="x" y1="8" :x2="x" y2="16" stroke="var(--color-load)" stroke-width="1" />
          <path :d="`M${x - 2.5},15.5L${x + 2.5},15.5L${x},20.5Z`" fill="var(--color-load)" stroke="none" />
        </g>
      </template>
      <line x1="12" y1="22" x2="76" y2="22" stroke-width="2.6" />
      <!-- Left end: a pin, or a wall -->
      <template v-if="kind === 'simple'">
        <path d="M12,23l-7.5,10h15Z" stroke-width="1.8" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else>
        <line x1="12" y1="12" x2="12" y2="32" stroke-width="2.4" vector-effect="non-scaling-stroke" />
        <path d="M12,13l-5,5M12,19l-5,5M12,25l-5,5" stroke-width="1.2" vector-effect="non-scaling-stroke" />
      </template>
      <!-- Right end: a roller, a wall, or free -->
      <template v-if="kind === 'simple' || kind === 'propped'">
        <path d="M76,23l-7.5,10h15Z" stroke-width="1.8" vector-effect="non-scaling-stroke" />
        <line x1="68.5" y1="36.5" x2="83.5" y2="36.5" stroke-width="1.8" vector-effect="non-scaling-stroke" />
      </template>
      <template v-else-if="kind === 'fixed'">
        <line x1="76" y1="12" x2="76" y2="32" stroke-width="2.4" vector-effect="non-scaling-stroke" />
        <path d="M76,13l5,5M76,19l5,5M76,25l5,5" stroke-width="1.2" vector-effect="non-scaling-stroke" />
      </template>
    </g>
  </svg>
</template>
