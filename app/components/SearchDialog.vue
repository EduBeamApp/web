<script setup lang="ts">
import MiniSearch from 'minisearch'
import { useEventListener } from '@vueuse/core'

/**
 * Search across the docs in the page's language. The index (`/search/<lang>.json`) loads the first
 * time the box opens; words are split with `Intl.Segmenter`, so Chinese, Japanese and Thai - written
 * without spaces - are searchable too. Ctrl+K, ⌘K or / opens it; arrows and Enter pick a result.
 */
interface Section {
  id: string
  title: string
  titles: string[]
  content: string
}

const open = defineModel<boolean>('open', { default: false })
const { t, locale } = useI18n()
const router = useRouter()

const query = ref('')
const selected = ref(0)
const input = ref<HTMLInputElement | null>(null)
const index = shallowRef<MiniSearch<Section> | null>(null)
/** The sections as loaded: MiniSearch stores fields as indexed, which flattens `titles` to a string */
const byId = new Map<string, Section>()
let loadedFor = ''

const segmenter = computed(() => new Intl.Segmenter(locale.value, { granularity: 'word' }))
const tokenize = (text: string) =>
  [...segmenter.value.segment(text)].filter((s) => s.isWordLike).map((s) => s.segment.toLowerCase())

const load = async () => {
  if (loadedFor === locale.value) return
  loadedFor = locale.value
  const sections = await $fetch<Section[]>(`/search/${locale.value}.json`)
  const search = new MiniSearch<Section>({
    fields: ['title', 'titles', 'content'],
    extractField: (doc, field) => (field === 'titles' ? doc.titles.join(' ') : String(doc[field as keyof Section] ?? '')),
    tokenize,
    processTerm: (term) => term.normalize('NFKD').replace(/[̀-ͯ]/g, ''),
    searchOptions: { prefix: true, fuzzy: 0.15, boost: { title: 3, titles: 1.5 }, combineWith: 'AND' },
  })
  byId.clear()
  for (const section of sections) byId.set(section.id, section)
  search.addAll(sections)
  index.value = search
}

type Result = Section & { snippet: string }

/** A line of the section's text around the first word searched for. */
const snippet = (content: string, terms: string[]) => {
  const lower = content.toLowerCase()
  const at = Math.max(0, Math.min(...terms.map((term) => lower.indexOf(term)).filter((i) => i >= 0), 0) - 40)
  return (at > 0 ? '…' : '') + content.slice(at, at + 160).trim() + (content.length > at + 160 ? '…' : '')
}

const results = computed<Result[]>(() => {
  if (!index.value || !query.value.trim()) return []
  return index.value
    .search(query.value)
    .slice(0, 12)
    .flatMap((hit) => {
      const section = byId.get(String(hit.id))
      return section ? [{ ...section, snippet: snippet(section.content, hit.terms) }] : []
    })
})
watch(results, () => (selected.value = 0))

const go = (result?: Result) => {
  if (!result) return
  open.value = false
  router.push(result.id)
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') selected.value = Math.min(selected.value + 1, results.value.length - 1)
  else if (e.key === 'ArrowUp') selected.value = Math.max(selected.value - 1, 0)
  else if (e.key === 'Enter') go(results.value[selected.value])
  else return
  e.preventDefault()
}

watch(open, async (isOpen) => {
  if (!isOpen) return
  query.value = ''
  await nextTick()
  input.value?.focus()
  await load()
})

// Ctrl+K / ⌘K anywhere, or / when not typing in a field
useEventListener('keydown', (e: KeyboardEvent) => {
  const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]')
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
    e.preventDefault()
    open.value = true
  } else if (e.key === 'Escape') open.value = false
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm" @mousedown.self="open = false">
      <div role="dialog" aria-modal="true" :aria-label="t('search.label')" class="w-full max-w-2xl overflow-hidden rounded-2xl border border-rule bg-paper shadow-2xl">
        <div class="flex items-center gap-3 border-b border-rule px-4">
          <Icon name="lucide:search" class="size-5 shrink-0 text-muted" />
          <input
            ref="input"
            v-model="query"
            type="text"
            role="searchbox"
            enterkeyhint="search"
            autocomplete="off"
            spellcheck="false"
            data-no-focus-ring
            :placeholder="t('search.placeholder')"
            :aria-label="t('search.placeholder')"
            class="h-14 w-full bg-transparent text-lg text-ink outline-none placeholder:text-muted"
            @keydown="onKey"
          />
          <kbd class="hidden rounded border border-rule px-1.5 text-xs text-muted sm:block">Esc</kbd>
        </div>

        <ul v-if="results.length" class="max-h-[60vh] overflow-y-auto p-2" role="listbox">
          <li v-for="(result, i) in results" :key="result.id" role="option" :aria-selected="i === selected">
            <NuxtLink
              :to="result.id"
              class="block rounded-lg px-3 py-2.5"
              :class="i === selected ? 'bg-lilac' : ''"
              @mouseenter="selected = i"
              @click="open = false"
            >
              <span v-if="result.titles.length" class="block text-xs text-muted">{{ result.titles.join(' › ') }}</span>
              <span class="block font-semibold text-ink">{{ result.title }}</span>
              <span class="mt-0.5 line-clamp-2 block text-sm text-muted">{{ result.snippet }}</span>
            </NuxtLink>
          </li>
        </ul>
        <p v-else-if="query.trim() && index" class="px-5 py-8 text-center text-muted">
          {{ t('search.noResults', { query }) }}
        </p>
      </div>
    </div>
  </Teleport>
</template>
