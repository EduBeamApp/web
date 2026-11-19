<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{ links: TocLink[] }>()
const { t } = useI18n()

/** The headings in reading order, the second level indented under the first. */
const flat = computed(() => props.links.flatMap((l) => [l, ...(l.children ?? [])]))

/** The heading last scrolled past, highlighted as the reader moves down the page. */
const active = ref<string | null>(null)
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )
  for (const l of flat.value) {
    const el = document.getElementById(l.id)
    if (el) observer.observe(el)
  }
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <nav v-if="flat.length" class="text-sm">
    <p class="mb-3 font-display text-[0.95rem] font-semibold text-ink">{{ t('docs.onThisPage') }}</p>
    <ul class="space-y-1.5 border-l border-rule">
      <li v-for="l in flat" :key="l.id">
        <a
          :href="`#${l.id}`"
          class="-ml-px block border-l-2 py-0.5 transition-colors"
          :class="[l.depth > 2 ? 'pl-7' : 'pl-4', active === l.id ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink']"
        >
          {{ l.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
