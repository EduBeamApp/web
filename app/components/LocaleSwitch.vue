<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { englishPath } from '~/lib/site-urls'

/**
 * The page in another language: the same path under that language's prefix, or the English page
 * where the page is not translated into that language yet (never a URL that is not there). Each language shows
 * its flag from circle-flags' language set (flags for languages, not countries: English is the
 * Union Jack and the Stars and Stripes halved), and is listed under its own name, so a reader who
 * landed in a language they cannot read finds theirs.
 */
/** `compact`: the header has no room for the language's name */
defineProps<{ compact?: boolean }>()
const { t, locale, locales } = useI18n()
/** The site's Portuguese is Brazilian; every other code is the flag's own */
const flag = (code: string): string => `circle-flags:lang-${code === 'pt' ? 'pt-br' : code}`
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { isIn } = useSitePages()
const to = (code: string) => {
  const english = englishPath(route.path, locale.value)
  return isIn(english, code) ? switchLocalePath(code) : { path: english, query: route.query, hash: route.hash }
}

const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))

const current = computed(() => locales.value.find((l) => l.code === locale.value))
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 text-sm font-medium text-muted transition hover:text-ink"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-label="t('ui.language', { name: current?.name ?? '' })"
      @click="open = !open"
    >
      <!--
        The language's name where it fits, its flag in its place where it does not (a phone, or a
        compact header): the flag beside the name would only repeat it. The list shows both.
      -->
      <Icon v-if="current" :name="flag(current.code)" class="size-5 shrink-0" :class="compact ? '' : 'sm:hidden'" />
      <Icon v-else name="lucide:languages" class="h-4 w-4" />
      <span class="hidden" :class="compact ? '' : 'sm:inline'" :lang="current?.language">{{ current?.name }}</span>
      <Icon name="lucide:chevron-down" class="hidden h-3.5 w-3.5 sm:block" />
    </button>
    <ul
      v-if="open"
      role="listbox"
      class="absolute right-0 mt-2 max-h-[70vh] w-52 overflow-auto rounded-xl border border-rule bg-sheet p-1.5 shadow-xl"
    >
      <li v-for="l in locales" :key="l.code">
        <NuxtLink
          :to="to(l.code)"
          :lang="l.language"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-mist"
          :class="l.code === locale ? 'font-semibold text-ink' : 'text-ink-soft'"
          @click="open = false"
        >
          <Icon :name="flag(l.code)" class="size-5 shrink-0" />
          <span class="flex-1">{{ l.name }}</span>
          <Icon v-if="l.code === locale" name="lucide:check" class="size-4 text-brand" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
