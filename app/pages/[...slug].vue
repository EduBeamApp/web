<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { prev, next } = useDocsNav()
const sidebar = useTemplateRef<HTMLElement>('sidebar')
useActiveInView(sidebar)

/** The page at this path - `/guide/x` or `/cs/guide/x` - as the docs always served it. */
const path = computed(() => normalizePath(route.path))
const { data: page } = await useAsyncData(`doc:${path.value}`, () => queryCollection('docs').path(path.value).first(), {
  watch: [path],
})

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  title: () => `${page.value?.title} | EduBeam`,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
})
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-12 sm:px-6 md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
    <aside class="hidden md:block">
      <div ref="sidebar" class="side-scroll -ml-3">
        <DocsSidebar />
      </div>
    </aside>

    <main class="min-w-0">
      <article v-if="page" class="doc prose max-w-[44rem] dark:prose-invert">
        <ContentRenderer :value="page" />
      </article>

      <nav v-if="prev || next" class="mt-20 grid max-w-[44rem] gap-4 sm:grid-cols-2">
        <NuxtLink v-if="prev" :to="prev.link" class="group border-t-2 border-rule pt-4 transition-colors hover:border-brand">
          <span class="flex items-center gap-1 text-sm text-muted">
            <Icon name="lucide:chevron-left" class="size-4" />
            {{ t('docs.prev') }}
          </span>
          <span class="mt-1 block font-display text-lg font-semibold text-ink group-hover:text-brand">{{ prev.text }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="next" :to="next.link" class="group border-t-2 border-rule pt-4 text-right transition-colors hover:border-brand">
          <span class="flex items-center justify-end gap-1 text-sm text-muted">
            {{ t('docs.next') }}
            <Icon name="lucide:chevron-right" class="size-4" />
          </span>
          <span class="mt-1 block font-display text-lg font-semibold text-ink group-hover:text-brand">{{ next.text }}</span>
        </NuxtLink>
      </nav>
    </main>

    <aside class="hidden xl:block">
      <div class="side-scroll">
        <DocsToc v-if="page?.body?.toc?.links" :links="page.body.toc.links" />
      </div>
    </aside>
  </div>
</template>
