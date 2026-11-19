<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { appUrl } = useDocsNav()
const { sitePath } = useSitePages()

const links = computed(() => [
  { text: t('nav.guide'), to: localePath('/guide/introduction'), match: ['/guide', '/essentials', '/reference', '/faq'] },
  { text: t('nav.tutorials'), to: localePath('/tutorials/three-hinged-frame'), match: ['/tutorials'] },
  { text: t('nav.examples'), to: localePath('/examples/'), match: ['/examples'] },
  // In every language: the practice page in the reader's language once it is translated, in English until then
  // Shown from xl up, where the header has room; below, the sidebar and the phone menu list it
  { text: t('nav.practice'), to: sitePath('/practice'), match: ['/practice', '/exam'], wide: true },
  { text: t('nav.theory'), to: localePath('/elements/conventions'), match: ['/elements'] },
])

const route = useRoute()
/** The section a page belongs to, read from its path without the language prefix. */
const section = computed(() => route.path.replace(new RegExp(`^/${locale.value}(?=/|$)`), '') || '/')
const isCurrent = (match: string[]) => match.some((m) => section.value.startsWith(m))

const open = defineModel<boolean>('menu', { default: false })

/* On the home page the header is clear until the page scrolls, so the hero's grid shows through */
const isHome = computed(() => normalizePath(route.path) === normalizePath(localePath('/')))
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
const clear = computed(() => isHome.value && !scrolled.value && !open.value)
const searching = ref(false)
/**
 * How much the header gives up when its links don't fit: 0 none, 1 the search box's label, 2 also the
 * language's name (its flag stays), 3 also some space between the nav links, 4 the nav links move
 * into the menu, as on a phone (the layout's drawer reads the same state). Measured, not set per language, so a translation with longer nav
 * labels compacts itself and English, which fits from lg up, never does. Resetting and remeasuring
 * runs in microtasks, before the browser paints.
 */
// A plain ref, not useTemplateRef('bar'): with the variable named as the ref, a production build
// defines the property twice and the server render fails ("Cannot redefine property: bar")
const bar = ref<HTMLElement>()
const squeeze = useState('header-squeeze', () => 0)
const fits = () => !bar.value || bar.value.scrollWidth <= bar.value.clientWidth
const fit = async () => {
  squeeze.value = 0
  await nextTick()
  while (!fits() && squeeze.value < 4) {
    squeeze.value++
    await nextTick()
  }
}
onMounted(fit)
useResizeObserver(bar, fit)
watch(locale, fit, { flush: 'post' })
</script>

<template>
  <header class="site-header sticky top-0 z-40 border-b transition-colors duration-200" :class="clear ? 'border-transparent bg-transparent' : 'border-rule bg-paper/85 backdrop-blur-md'">
    <div ref="bar" class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 md:gap-6 xl:gap-8">
      <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center gap-2.5 text-ink" aria-label="EduBeam">
        <BrandMark class="size-8" />
        <span class="edubeam text-[1.5rem] leading-none sm:text-[1.7rem]">EduBeam</span>
      </NuxtLink>

      <nav class="hidden h-full items-stretch" :class="[squeeze > 2 ? 'gap-3.5' : 'gap-5 xl:gap-6', squeeze > 3 ? '' : 'lg:flex']">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="-mb-px items-center whitespace-nowrap border-b-2 text-[0.95rem] font-medium transition-colors"
          :class="[
            isCurrent(link.match) ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink',
            'wide' in link ? 'hidden xl:flex' : 'flex',
          ]"
        >
          {{ link.text }}
        </NuxtLink>
        <LibrariesMenu :current="isCurrent(['/solver', '/plot'])" />
      </nav>

      <div class="ml-auto flex items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          class="inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-2.5 sm:mr-1 sm:border sm:border-rule sm:bg-paper text-sm text-muted transition hover:border-ink/40 hover:text-ink"
          :class="squeeze ? '' : 'xl:min-w-52'"
          :aria-label="t('search.label')"
          @click="searching = true"
        >
          <Icon name="lucide:search" class="size-4 shrink-0" />
          <span class="hidden" :class="squeeze ? '' : 'xl:inline'">{{ t('search.placeholder') }}</span>
          <kbd class="ml-auto hidden rounded border border-rule px-1.5 font-sans text-xs xl:inline">Ctrl K</kbd>
        </button>
        <SearchDialog v-model:open="searching" />
        <LocaleSwitch :compact="squeeze > 1" />
        <ColorModeToggle />
        <a :href="appUrl" target="_blank" rel="noopener" class="btn btn-primary ml-2 hidden shrink-0 whitespace-nowrap !py-2 text-sm sm:inline-flex">
          {{ t('nav.openApp') }}
          <Icon name="lucide:arrow-up-right" class="size-4" />
        </a>
        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-md text-ink"
          :class="squeeze > 3 ? '' : 'lg:hidden'"
          :aria-expanded="open"
          :aria-label="t('ui.menu')"
          @click="open = !open"
        >
          <Icon :name="open ? 'lucide:x' : 'lucide:menu'" class="size-5" />
        </button>
      </div>
    </div>
  </header>
</template>
