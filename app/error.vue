<script setup lang="ts">
import type { NuxtError } from '#app'
import navigation from '~/data/navigation.json'

/**
 * Any page that does not exist, or failed to render, in the site's own frame. A missing page is
 * drawn as what it is in EduBeam's terms: a beam whose second support is gone, swinging about the
 * one it has, with the message the app shows for it. Never indexed; prerendered as `404.html`,
 * which Cloudflare Pages serves with a 404 status for every unknown URL.
 */
const props = defineProps<{ error: NuxtError }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => t(notFound.value ? 'error.notFoundTitle' : 'error.otherTitle'))
useSeoMeta({ title: () => `${title.value} | EduBeam`, robots: 'noindex' })

/** The pages most people come for, named as this language's sidebar names them */
const POPULAR = ['/guide/quick-start', '/examples/', '/elements/conventions', '/reference/troubleshooting']
const popular = computed(() => {
  const items = (navigation[locale.value as keyof typeof navigation] ?? navigation.en).sidebar.flatMap((g) => g.items)
  return POPULAR.flatMap((link) => {
    const item = items.find((i) => i.link === link)
    return item ? [{ to: localePath(link), text: item.text }] : []
  })
})

// The beam: 340 px long from the pin at (90, 110); it settles turned 16° about the pin
const PIN = { x: 90, y: 110 }
const END = { x: 430, y: 110 }
</script>

<template>
  <NuxtLayout>
    <main
      class="mx-auto grid max-w-6xl items-center gap-x-14 gap-y-10 px-4 pb-28 pt-14 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:pt-24"
    >
      <div class="md:order-2">
        <figure class="error-canvas live-canvas">
          <p class="error-message">
            <span class="error-dot" aria-hidden="true" />
            {{ t('error.message') }}
          </p>
          <svg viewBox="50 34 432 206" class="block w-full" role="img" :aria-label="t('error.figure')">
            <!-- Where the beam should be, on the support it lacks -->
            <g class="ghost" fill="none" stroke="currentColor" stroke-dasharray="6 5" stroke-width="1.5">
              <path :d="`M${PIN.x} ${PIN.y}H${END.x}`" stroke-width="2" />
              <path :d="`M${END.x} ${END.y + 3}l-15 20h30z`" />
              <path :d="`M${END.x - 15} ${END.y + 28}h30`" />
            </g>

            <!-- The pin it still has, as the app draws one: a bare triangle -->
            <g stroke="var(--ink)" fill="none" stroke-width="1.8" stroke-linejoin="round">
              <path :d="`M${PIN.x} ${PIN.y + 3}l-15 20h30z`" fill="var(--canvas)" vector-effect="non-scaling-stroke" />
            </g>

            <!-- The beam, swinging about the pin; its load counter-turns so it keeps pointing down -->
            <g class="swing">
              <path :d="`M${PIN.x} ${PIN.y}H${END.x}`" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" />
              <circle :cx="END.x" :cy="END.y" r="4.5" fill="var(--ink)" />
              <g class="unswing">
                <path :d="`M${END.x} ${END.y - 62}V${END.y - 14}`" stroke="var(--color-load)" stroke-width="2.25" />
                <path :d="`M${END.x} ${END.y - 5}l-6 -11h12z`" fill="var(--color-load)" />
                <text :x="END.x - 10" :y="END.y - 46" text-anchor="end" class="load-label">P</text>
                <text :x="END.x + 17" :y="END.y + 25" class="node-label">{{ error.statusCode }}</text>
              </g>
            </g>
            <circle :cx="PIN.x" :cy="PIN.y" r="4.5" fill="var(--canvas)" stroke="var(--ink)" stroke-width="2" />

            <!-- The rotation it is free to make, from where it was to where it went -->
            <g class="turn" fill="none" stroke="var(--brand)" stroke-width="1.75">
              <path :d="`M${PIN.x + 90} ${PIN.y}A90 90 0 0 1 ${PIN.x + 88.63} ${PIN.y + 15.63}`" />
              <path :d="`M${PIN.x + 86.93} ${PIN.y + 23.29}l6.94 -8.5l-8.7 -2.32z`" fill="var(--brand)" stroke="none" />
              <text :x="PIN.x + 101" :y="PIN.y + 21" class="phi" stroke="none" fill="var(--brand)">φ</text>
            </g>
          </svg>
        </figure>
      </div>

      <div class="md:order-1">
        <h1 class="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{{ title }}</h1>
        <p class="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted">
          {{ t(notFound ? 'error.notFound' : 'error.other') }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/guide/introduction')" class="btn btn-primary">{{ t('error.guide') }}</NuxtLink>
          <NuxtLink :to="localePath('/')" class="btn btn-quiet">{{ t('error.home') }}</NuxtLink>
        </div>
        <ul v-if="popular.length" class="mt-10 grid gap-x-6 sm:grid-cols-2">
          <li v-for="p in popular" :key="p.to">
            <NuxtLink :to="p.to" class="popular group">
              {{ p.text }}
              <Icon
                name="lucide:chevron-right"
                class="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped>
.error-canvas {
  margin: 0;
  padding: 3rem 1rem 1rem;
}

/* The app's red message, top left of its viewer */
.error-message {
  position: absolute;
  top: 0.85rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--color-moment);
}
.error-dot {
  flex: none;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: currentColor;
}

.ghost {
  color: var(--muted);
  opacity: 0.6;
}

.node-label {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  fill: var(--ink);
}
.load-label,
.phi {
  font-family: KaTeX_Math, Georgia, serif;
  font-style: italic;
  font-size: 17px;
}
.load-label {
  fill: var(--color-load);
}

/*
 * One motion, once: the beam falls about its pin as gravity would take it, overshoots a little and
 * settles; then the free rotation is marked.
 */
.swing {
  transform-origin: 90px 110px;
  transform: rotate(16deg);
  animation: swing 1.5s 0.35s both;
}
.unswing {
  transform-origin: 430px 110px;
  transform: rotate(-16deg);
  animation: unswing 1.5s 0.35s both;
}
.turn {
  animation: appear 0.5s 1.7s both ease-out;
}
@keyframes swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.35);
  }
  62% {
    transform: rotate(17.5deg);
    animation-timing-function: ease-in-out;
  }
  82% {
    transform: rotate(15.4deg);
    animation-timing-function: ease-in-out;
  }
  100% {
    transform: rotate(16deg);
  }
}
@keyframes unswing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.35);
  }
  62% {
    transform: rotate(-17.5deg);
    animation-timing-function: ease-in-out;
  }
  82% {
    transform: rotate(-15.4deg);
    animation-timing-function: ease-in-out;
  }
  100% {
    transform: rotate(-16deg);
  }
}
@keyframes appear {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .swing,
  .unswing,
  .turn {
    animation: none;
  }
}

.popular {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--rule);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ink);
  transition: color 0.18s ease;
}
.popular:hover {
  color: var(--brand);
}
.popular:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>
