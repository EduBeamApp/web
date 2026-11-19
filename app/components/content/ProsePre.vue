<script setup lang="ts">
const { t } = useI18n()
/**
 * A fenced code block in a page: its file name as a caption (```ts [beams.ts]), and a button that
 * copies the code. Without a file name the language stands in the caption's place.
 */
const props = withDefaults(
  defineProps<{
    code?: string
    language?: string | null
    filename?: string | null
    highlights?: number[]
    meta?: string | null
    class?: string | null
  }>(),
  { code: '', language: null, filename: null, highlights: () => [], meta: null, class: null }
)

const LANGUAGES: Record<string, string> = { ts: 'TypeScript', js: 'JavaScript', vue: 'Vue', bash: 'Terminal', json: 'JSON' }
const label = computed(() => props.filename ?? (props.language ? (LANGUAGES[props.language] ?? props.language) : null))

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code.trimEnd())
  } catch {
    // The browser refused the clipboard: the code stays on screen to copy by hand
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="code-panel not-prose my-6">
    <div class="code-caption flex items-center justify-between gap-3 !py-1.5 !pr-1.5">
      <span class="truncate">{{ label }}</span>
      <button
        type="button"
        class="inline-flex h-7 items-center gap-1.5 rounded-md px-2 font-sans text-xs text-muted transition-colors hover:bg-paper hover:text-ink"
        :aria-label="copied ? t('ui.copied') : t('ui.copyCode')"
        @click="copy"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-3.5" />
        {{ copied ? t('ui.copied') : t('ui.copy') }}
      </button>
    </div>
    <pre class="md-code" :class="props.class"><slot /></pre>
  </div>
</template>
