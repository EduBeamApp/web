<script setup lang="ts">
/**
 * A note set apart from the text: `::callout{type="tip" title="…"}`. `details` folds away behind
 * its title, as VitePress's `::: details` did.
 */
const props = withDefaults(defineProps<{ type?: 'tip' | 'warning' | 'info' | 'danger' | 'details'; title?: string }>(), {
  type: 'tip',
  title: undefined,
})

const STYLE = {
  tip: { icon: 'lucide:lightbulb', accent: 'var(--brand)' },
  info: { icon: 'lucide:info', accent: '#2f6bff' },
  warning: { icon: 'lucide:triangle-alert', accent: '#d97706' },
  danger: { icon: 'lucide:octagon-alert', accent: '#e11d48' },
  details: { icon: 'lucide:chevron-right', accent: 'var(--muted)' },
} as const

const style = computed(() => STYLE[props.type] ?? STYLE.tip)
</script>

<template>
  <details v-if="type === 'details'" class="callout group not-prose my-7 rounded-xl border border-rule">
    <summary class="flex cursor-pointer list-none items-center gap-2 px-5 py-3.5 font-semibold text-ink">
      <Icon :name="style.icon" class="h-4 w-4 text-muted transition-transform group-open:rotate-90" />
      {{ title }}
    </summary>
    <div class="doc prose max-w-none border-t border-rule px-5 pb-1 dark:prose-invert">
      <slot />
    </div>
  </details>

  <aside
    v-else
    class="callout not-prose my-7 rounded-xl px-5 py-4"
    :style="{ background: `color-mix(in oklab, ${style.accent}, var(--paper) 92%)`, boxShadow: `inset 3px 0 0 ${style.accent}` }"
  >
    <p v-if="title" class="mb-1.5 flex items-center gap-2 font-display font-semibold text-ink">
      <Icon :name="style.icon" class="h-4 w-4" :style="{ color: style.accent }" />
      {{ title }}
    </p>
    <div class="doc prose prose-sm max-w-none dark:prose-invert [&>*]:my-0 [&>*+*]:mt-3">
      <slot />
    </div>
  </aside>
</template>
