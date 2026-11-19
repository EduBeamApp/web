<script setup lang="ts">
import type { GlyphKind } from './ModelGlyph.vue'

/**
 * What EduBeam models, shown rather than listed: its supports, loads, cross sections and result
 * diagrams drawn in the figures' own symbols, with the facts that don't draw well underneath.
 * Every symbol opens the guide where it is explained. The anchors are the headings' ids, which
 * every language's pages keep.
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()

/**
 * Sections only the English guide has so far, with the nearest heading every language has.
 * TODO: drop an entry once its section is translated.
 */
const ENGLISH_ONLY: Readonly<Record<string, string>> = {
  '#roller-or-slider': '#supports',
  '#timoshenko-or-euler-bernoulli': '',
}
const docs = (to: string): string => {
  const hash = to.slice(to.indexOf('#'))
  const fallback = to.includes('#') && locale.value !== 'en' ? ENGLISH_ONLY[hash] : undefined
  return localePath(fallback === undefined ? to : to.replace(hash, fallback))
}

type Group = {
  id: 'supports' | 'loads' | 'sections'
  page: string
  items: readonly { kind: GlyphKind; to: string }[]
}

const SUPPORTS = '/essentials/nodes-supports'
const LOADS = '/essentials/loads'
const SECTIONS = '/essentials/elements'
const RESULTS_PAGE = '/essentials/results'

const GROUPS: readonly Group[] = [
  {
    id: 'supports',
    page: `${SUPPORTS}#supports`,
    items: [
      { kind: 'pin', to: `${SUPPORTS}#supports` },
      { kind: 'roller', to: `${SUPPORTS}#roller-or-slider` },
      { kind: 'fixed', to: `${SUPPORTS}#supports` },
      { kind: 'slider', to: `${SUPPORTS}#roller-or-slider` },
      { kind: 'angled', to: `${SUPPORTS}#inclined-skewed-supports` },
    ],
  },
  {
    id: 'loads',
    page: LOADS,
    items: [
      { kind: 'point', to: `${LOADS}#concentrated-load` },
      { kind: 'uniform', to: `${LOADS}#uniformly-distributed-load` },
      { kind: 'trapezoidal', to: `${LOADS}#trapezoidal-load` },
      { kind: 'moment', to: `${LOADS}#nodal-loads` },
      { kind: 'temperature', to: `${LOADS}#temperature-load` },
    ],
  },
  {
    id: 'sections',
    page: `${SECTIONS}#cross-sections`,
    items: [
      { kind: 'i', to: `${SECTIONS}#cross-sections` },
      { kind: 'hollow', to: `${SECTIONS}#cross-sections` },
      { kind: 'solid', to: `${SECTIONS}#cross-sections` },
      { kind: 'tube', to: `${SECTIONS}#cross-sections` },
      { kind: 'polygon', to: `${SECTIONS}#polygonal-sections` },
    ],
  },
]
/** Each diagram's symbol, and its name for a screen reader, which would read "N(x)" letter by letter */
const RESULTS: readonly { kind: GlyphKind; symbol: string; name: string }[] = [
  { kind: 'N', symbol: 'N', name: 'common.normalForce' },
  { kind: 'V', symbol: 'V', name: 'common.shearForce' },
  { kind: 'M', symbol: 'M', name: 'common.bendingMoment' },
  { kind: 'w', symbol: 'w', name: 'common.deformedShape' },
]
/** Notes with a section of their own; the others stay plain text */
const NOTE_LINKS: Partial<Record<Group['id'], string>> = {
  supports: `${LOADS}#prescribed-displacements-support-settlements`,
}
const FACTS = [
  { id: 'structures', to: '/examples/' },
  { id: 'elements', to: '/elements/beam#timoshenko-or-euler-bernoulli' },
  { id: 'sharing', to: '/essentials/import-export' },
  { id: 'settings', to: '/essentials/units-settings#language-locale' },
] as const
</script>

<template>
  <div>
    <div class="sheet md:grid-cols-2">
      <section v-for="group in GROUPS" :key="group.id" class="p-6 sm:px-8 sm:py-6">
        <h3>
          <NuxtLink :to="docs(group.page)" class="model-title">
            {{ t(`home.model.${group.id}.title`) }}
            <Icon name="lucide:chevron-right" class="model-chevron" />
          </NuxtLink>
        </h3>
        <ul class="-mx-2 mt-3 grid grid-cols-3 gap-1 sm:grid-cols-5">
          <li v-for="item in group.items" :key="item.kind">
            <NuxtLink :to="docs(item.to)" class="model-tile">
              <HomeModelGlyph :kind="item.kind" />
              <span class="model-label text-xs leading-tight">{{ t(`home.model.${group.id}.items.${item.kind}`) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p class="mt-3 text-sm leading-relaxed text-muted">
          <NuxtLink v-if="NOTE_LINKS[group.id]" :to="docs(NOTE_LINKS[group.id] ?? '')" class="model-note-link">
            {{ t(`home.model.${group.id}.note`) }}
          </NuxtLink>
          <template v-else>{{ t(`home.model.${group.id}.note`) }}</template>
        </p>
      </section>
      <section class="p-6 sm:px-8 sm:py-6">
        <h3>
          <NuxtLink :to="docs(RESULTS_PAGE)" class="model-title">
            {{ t('home.model.results.title') }}
            <Icon name="lucide:chevron-right" class="model-chevron" />
          </NuxtLink>
        </h3>
        <ul class="-mx-2 mt-3 grid grid-cols-4 gap-1">
          <li v-for="r in RESULTS" :key="r.kind">
            <NuxtLink :to="docs(RESULTS_PAGE)" class="model-tile" :aria-label="t(r.name)" :title="t(r.name)">
              <HomeModelGlyph :kind="r.kind" />
              <span class="model-math model-label text-sm"><i>{{ r.symbol }}</i>(<i>x</i>)</span>
            </NuxtLink>
          </li>
        </ul>
        <p class="mt-3 text-sm leading-relaxed text-muted">{{ t('home.model.results.note') }}</p>
      </section>
    </div>

    <ul class="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="fact in FACTS" :key="fact.id">
        <NuxtLink :to="docs(fact.to)" class="model-fact">
          <h3 class="flex items-center gap-1 font-medium text-ink">
            {{ t(`home.model.facts.${fact.id}.title`) }}
            <Icon name="lucide:chevron-right" class="model-chevron" />
          </h3>
          <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ t(`home.model.facts.${fact.id}.body`) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.model-math {
  font-family: 'KaTeX_Main', Georgia, serif;
}
.model-math i {
  font-family: 'KaTeX_Math', Georgia, serif;
}

.model-title {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  color: var(--ink);
  border-radius: 0.375rem;
  transition: color 0.18s ease;
}
.model-title:hover {
  color: var(--brand);
}

/* The chevron says "this goes somewhere"; it steps forward when the link is pointed at */
.model-chevron {
  flex: none;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--muted);
  transition:
    transform 0.18s ease,
    color 0.18s ease;
}
.model-fact .model-chevron {
  width: 1rem;
  height: 1rem;
}
.model-title:hover .model-chevron,
.model-fact:hover .model-chevron {
  color: var(--brand);
  transform: translateX(2px);
}

/* A symbol and its name, one link: a quiet plate behind it on hover, the name turning to ink */
.model-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  padding: 0.5rem 0.25rem 0.6rem;
  border-radius: 0.625rem;
  text-align: center;
  transition: background-color 0.18s ease;
}
.model-tile :deep(svg) {
  transition: transform 0.18s ease;
}
.model-label {
  color: var(--muted);
  transition: color 0.18s ease;
}
.model-math.model-label {
  color: var(--ink);
}
.model-tile:hover {
  background: color-mix(in oklab, var(--brand), transparent 91%);
}
:global(.dark) .model-tile:hover {
  background: color-mix(in oklab, var(--brand), transparent 82%);
}
.model-tile:hover :deep(svg) {
  transform: translateY(-2px);
}
.model-tile:hover .model-label {
  color: var(--ink);
}

.model-note-link {
  text-decoration: underline;
  text-decoration-color: color-mix(in oklab, var(--muted), transparent 55%);
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition:
    color 0.18s ease,
    text-decoration-color 0.18s ease;
}
.model-note-link:hover {
  color: var(--ink);
  text-decoration-color: var(--brand);
}

/* A fact is one link as a whole; its rule turns to the brand colour */
.model-fact {
  display: block;
  height: 100%;
  padding-top: 1rem;
  border-top: 2px solid var(--strong-rule);
  transition: border-color 0.18s ease;
}
.model-fact:hover {
  border-top-color: var(--brand);
}

.model-title:focus-visible,
.model-tile:focus-visible,
.model-note-link:focus-visible,
.model-fact:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .model-tile:hover :deep(svg),
  .model-title:hover .model-chevron,
  .model-fact:hover .model-chevron {
    transform: none;
  }
}
</style>
