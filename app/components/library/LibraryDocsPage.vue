<script setup lang="ts">
import type { Product } from '~/data/products'
import { englishPath, localizedPath } from '~/lib/site-urls'

/**
 * A library's docs page: its own sidebar, the page, and the page's headings. A page is served in
 * each language it is written in (`content/libs/<code>/…`); its sidebar lists every page of the
 * library, a translated one in the page's language and the others in English, linking to the
 * English page.
 */
const props = defineProps<{ product: Product }>()
const route = useRoute()
const { locale } = useI18n()
const { sitePath } = useSitePages()
// A page not written in this URL's language redirects to its English page
const redirecting = useEnglishFallback()
const path = computed(() => normalizePath(route.path))

const { data: page } = await useAsyncData(
  `lib:${path.value}`,
  () => (redirecting ? Promise.resolve(null) : queryCollection('libs').path(path.value).first()),
  { watch: [path] }
)
if (!redirecting && !page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

// The same key is the same data on every page (prerendering shares it between pages): the sidebar
// of the library in this language, whether or not this page redirects
const { data: pages } = await useAsyncData(`lib-nav:${locale.value}:${props.product.path}`, async () => {
  const list = (root: string) =>
    queryCollection('libs').where('path', 'LIKE', `${root}/%`).select('path', 'title', 'order', 'group').order('order', 'ASC').all()
  // Both queries start before anything is awaited: on the server a query needs the request, which
  // is only known until the first await
  const [english, inLanguage] = await Promise.all([
    list(props.product.path),
    locale.value === 'en' ? Promise.resolve([]) : list(localizedPath(locale.value, props.product.path)),
  ])
  const translated = new Map(inLanguage.map((p) => [englishPath(p.path, locale.value), p]))
  return english.map((p) => translated.get(p.path) ?? p)
})

/** The pages under their group headings, in `order`: a page's `group` starts a new run. */
const groups = computed(() => {
  const out: { title?: string; pages: NonNullable<typeof pages.value> }[] = []
  for (const p of pages.value ?? []) {
    if (!out.length || (p.group && p.group !== out.at(-1)!.title)) out.push({ title: p.group, pages: [] })
    out.at(-1)!.pages.push(p)
  }
  return out
})
const sidebar = useTemplateRef<HTMLElement>('sidebar')
useActiveInView(sidebar)

useSeoMeta({
  title: () => `${page.value?.title} | ${props.product.name}`,
  description: () => page.value?.description,
  ogTitle: () => `${page.value?.title} | ${props.product.name}`,
  ogDescription: () => page.value?.description,
})
</script>

<template>
  <div v-if="!redirecting" class="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-12 sm:px-6 md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
    <aside class="hidden md:block">
      <nav ref="sidebar" class="side-scroll -ml-3 space-y-1 text-[0.9rem]">
        <NuxtLink :to="sitePath(product.path)" class="mb-3 block px-3 font-display text-lg font-semibold text-ink">{{ product.name }}</NuxtLink>
        <div v-for="(group, g) in groups" :key="g" :class="g ? 'pt-5' : ''">
          <p v-if="group.title" class="mb-1.5 px-3 text-sm font-semibold text-ink">{{ group.title }}</p>
          <NuxtLink
            v-for="p in group.pages"
            :key="p.path"
            :to="p.path"
            class="block rounded-md px-3 py-1.5 transition-colors"
            :class="p.path === path ? 'bg-lilac font-semibold text-ink' : 'text-muted hover:text-ink'"
          >
            {{ p.title }}
          </NuxtLink>
        </div>
      </nav>
    </aside>
    <main class="min-w-0">
      <article v-if="page" class="doc prose max-w-[44rem] dark:prose-invert">
        <ContentRenderer :value="page" />
      </article>
    </main>
    <aside class="hidden xl:block">
      <div class="side-scroll">
        <DocsToc v-if="page?.body?.toc?.links" :links="page.body.toc.links" />
      </div>
    </aside>
  </div>
</template>
