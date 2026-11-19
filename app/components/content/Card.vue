<script setup lang="ts">
/**
 * One card in a `::card-grid`: a title, its text from the Markdown inside, and optionally an icon,
 * a number (for a real sequence), a screenshot, and a link that makes the whole card clickable.
 */
const props = defineProps<{ title: string; icon?: string; number?: number | string; image?: string; to?: string }>()
const external = computed(() => !!props.to && /^https?:\/\//.test(props.to))
// Resolved here: inside the template's :is it would render as an unknown <NuxtLink> tag, not a link
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? (external ? 'a' : NuxtLink) : 'div'"
    v-bind="to ? (external ? { href: to, target: '_blank', rel: 'noopener' } : { to }) : {}"
    class="card group flex flex-col p-5"
    :class="to ? 'transition-colors hover:bg-mist' : ''"
  >
    <img v-if="image" :src="image" alt="" loading="lazy" class="mb-4 aspect-[16/9] w-full rounded-md border border-rule object-cover object-top" />
    <div class="flex items-start gap-3">
      <span v-if="number !== undefined" class="font-display text-2xl font-bold leading-none text-brand">{{ number }}</span>
      <Icon v-else-if="icon" :name="icon" class="mt-0.5 size-5 shrink-0 text-brand" />
      <div class="min-w-0 flex-1">
        <h3 class="flex items-center gap-1.5 font-display text-lg font-semibold leading-snug text-ink" :class="to ? 'group-hover:text-brand' : ''">
          {{ title }}
          <Icon v-if="to" :name="external ? 'lucide:arrow-up-right' : 'lucide:arrow-right'" class="size-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </h3>
        <div class="card-body mt-1.5 text-sm leading-relaxed text-muted">
          <slot />
        </div>
      </div>
    </div>
  </component>
</template>

<style scoped>
.card-body :deep(p) {
  margin: 0;
}
.card-body :deep(p + p) {
  margin-top: 0.5rem;
}
.card-body :deep(strong) {
  color: var(--ink);
  font-weight: 600;
}
.card-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
}
</style>
