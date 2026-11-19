<script setup lang="ts">
import { LIBRARIES } from '~/data/products'

const { groups, appUrl } = useDocsNav()
const { t } = useI18n()
const localePath = useLocalePath()
const { sitePath } = useSitePages()
/**
 * One column per header section: the guide by its topics (each linking to its first page), the
 * tutorials and examples, and the theory manual page by page. A language without sections lists
 * its sidebar groups as they are.
 */
const columns = computed(() => {
  if (!groups.value.some((g) => g.section)) return groups.value.map((g) => ({ title: g.text, items: g.items }))
  const of = (section: string) => groups.value.filter((g) => g.section === section)
  return [
    { title: t('nav.guide'), items: of('guide').map((g) => ({ text: g.text, link: g.items[0].link })) },
    { title: t('nav.tutorials'), items: of('learn').flatMap((g) => g.items) },
    { title: t('nav.theory'), items: of('theory').flatMap((g) => g.items) },
  ]
})
// From EduBeam's first year to the year the site was built
const years = `2023–${new Date().getFullYear()}`
</script>

<template>
  <footer class="site-footer border-t border-rule bg-mist">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 pb-12 pt-16 sm:px-6 lg:grid-cols-[1fr_2.6fr]">
      <div>
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 text-ink">
          <BrandMark class="size-8" />
          <span class="edubeam text-[1.7rem] leading-none">EduBeam</span>
        </NuxtLink>
        <p class="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-muted">{{ t('meta.description') }}</p>
        <a :href="appUrl" target="_blank" rel="noopener" class="btn btn-primary mt-6 !py-2 text-sm">
          {{ t('nav.openApp') }}
          <Icon name="lucide:arrow-up-right" class="size-4" />
        </a>
      </div>

      <div class="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        <div>
          <h3 class="mb-3 font-display text-[0.95rem] font-semibold text-ink">{{ t('nav.libraries') }}</h3>
          <ul class="space-y-2">
            <li v-for="lib in LIBRARIES" :key="lib.path">
              <NuxtLink :to="sitePath(lib.path)" class="font-mono text-[0.85rem] text-muted transition hover:text-ink">{{ lib.name }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div v-for="column in columns" :key="column.title">
          <h3 class="mb-3 font-display text-[0.95rem] font-semibold text-ink">{{ column.title }}</h3>
          <ul class="space-y-2">
            <li v-for="item in column.items" :key="item.link">
              <NuxtLink :to="item.link" class="text-[0.9rem] text-muted transition hover:text-ink">{{ item.text }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-rule">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:px-6">
        <a href="https://github.com/janvorisek/edubeam/graphs/contributors" target="_blank" rel="noopener" class="hover:text-ink">© {{ years }} {{ t('footer.copyright') }}</a>
        <div class="flex items-center gap-1">
          <a href="https://github.com/janvorisek/edubeam" target="_blank" rel="noopener" class="inline-flex size-10 items-center justify-center hover:text-ink" aria-label="GitHub">
            <Icon name="lucide:github" class="size-5" />
          </a>
          <a href="https://twitter.com/EdubeamApp" target="_blank" rel="noopener" class="inline-flex size-10 items-center justify-center hover:text-ink" aria-label="X">
            <Icon name="lucide:twitter" class="size-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
