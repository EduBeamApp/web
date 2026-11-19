<script setup lang="ts">
import navigation from '~/data/navigation.json'
import { LIBRARIES } from '~/data/products'
import { SITE_URL } from '~/lib/site-urls'

/**
 * The landing page. Its copy lives in the locale files (`home.*`), written in English first;
 * the page's Markdown (`content/<lang>/index.md`) still provides the language's SEO description.
 */
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { appUrl } = useDocsNav()
const { sitePath } = useSitePages()
/** The app in this page's language, shot by `npm run screenshots home-hero` */
const heroShot = computed(() => (locale.value === 'en' ? '/screenshots/home-hero.webp' : `/screenshots/${locale.value}/home-hero.webp`))

const path = computed(() => normalizePath(route.path))
const { data: page } = await useAsyncData(`home:${path.value}`, () => queryCollection('docs').path(path.value).first(), {
  watch: [path],
})
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => page.value?.description ?? t('home.seo.description'),
  ogTitle: () => t('home.seo.title'),
  ogDescription: () => page.value?.description ?? t('home.seo.description'),
})

// The app and the site, for search engines: free, in the browser, in this language
useHead(() => {
  const inLanguage = navigation[locale.value as keyof typeof navigation]?.lang ?? 'en'
  const description = page.value?.description ?? t('home.seo.description')
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'EduBeam',
            url: appUrl.value,
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Any (web browser)',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            inLanguage,
            description,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'EduBeam',
            url: SITE_URL + (locale.value === 'en' ? '/' : `/${locale.value}`),
            inLanguage,
          },
        ]),
      },
    ],
  }
})

const teaching = ['share', 'embed', 'mechanism', 'languages'] as const
const paths = [
  { id: 'quickStart', to: '/guide/quick-start' },
  { id: 'examples', to: '/examples/' },
  { id: 'teaching', to: '/guide/teaching' },
] as const
const teachingIcons = {
  share: 'lucide:link',
  embed: 'lucide:presentation',
  mechanism: 'lucide:move-diagonal',
  languages: 'lucide:languages',
} as const
</script>

<template>
  <main>
    <!-- Hero: what the product says and what it looks like -->
    <!-- Slides up under the header, which is clear at the top of this page, so the grid runs to the top -->
    <section class="relative -mt-16 overflow-hidden border-b border-rule">
      <div class="pointer-events-none absolute inset-0 blueprint-bg mask-fade-radial" aria-hidden="true" />
      <div class="bloom pointer-events-none absolute -right-48 top-16 hidden h-[620px] w-[920px] lg:block" aria-hidden="true" />
      <div class="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-26 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pb-10 lg:pt-24">
        <div class="lg:col-span-5">
          <h1 class="display text-balance text-[clamp(2.9rem,1.6rem+4.4vw,5.25rem)] text-ink">{{ t('home.hero.title') }}</h1>
          <p class="mt-6 max-w-md text-pretty text-[1.05rem] leading-relaxed text-muted">{{ t('home.hero.lede') }}</p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a :href="appUrl" target="_blank" rel="noopener" class="btn btn-primary">
              {{ t('home.hero.launch') }}
              <Icon name="lucide:arrow-up-right" class="size-4" />
            </a>
            <NuxtLink :to="localePath('/guide/introduction')" class="btn btn-quiet">{{ t('home.hero.guide') }}</NuxtLink>
          </div>
          <p class="mt-5 text-sm text-muted">{{ t('home.hero.note') }}</p>
        </div>
        <!-- The app itself, shot in a narrow window so its labels stay legible at the column's width; on a
             phone the frame keeps the canvas and crops the rest -->
        <div class="lg:col-span-7">
          <div class="app-shot aspect-[3/2] overflow-hidden lg:aspect-auto">
            <img
              :src="heroShot"
              :alt="t('meta.imageAlt')"
              width="2080"
              height="1300"
              fetchpriority="high"
              class="block h-auto w-[165%] max-w-none -translate-x-[24%] lg:w-full lg:translate-x-0"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How a model is built -->
    <section id="start-here" class="band-light border-b border-rule bg-mist">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div v-reveal class="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 class="section-title text-balance text-ink lg:col-span-7">{{ t('home.steps.title') }}</h2>
        <div class="lg:col-span-5">
          <p class="text-pretty leading-relaxed text-muted">{{ t('home.steps.lede') }}</p>
          <NuxtLink :to="localePath('/guide/quick-start')" class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
            {{ t('home.steps.link') }}
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
        </div>
      </div>
      <HomeBuildSteps class="mt-10" v-reveal="100" />
      </div>
    </section>

    <!-- What it models, drawn -->
    <section id="what-you-can-model" class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div v-reveal class="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 class="section-title text-balance text-ink lg:col-span-7">{{ t('home.model.title') }}</h2>
        <p class="text-pretty leading-relaxed text-muted lg:col-span-5">{{ t('home.model.lede') }}</p>
      </div>
      <HomeWhatYouModel class="mt-10" v-reveal="100" />
    </section>

    <!-- The examples, live -->
    <section class="band-light border-y border-rule bg-mist py-14 lg:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div v-reveal class="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 class="section-title text-balance text-ink lg:col-span-7">{{ t('home.examples.title') }}</h2>
          <div class="lg:col-span-5">
            <p class="text-pretty leading-relaxed text-muted">{{ t('home.examples.lede') }}</p>
            <NuxtLink :to="localePath('/examples/')" class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
              {{ t('home.examples.link') }}
              <Icon name="lucide:arrow-right" class="size-4" />
            </NuxtLink>
          </div>
        </div>
        <FeatureStructures v-reveal="100" />
        <ElementariumPromo placement="home" />
      </div>
    </section>

    <!-- Checked against closed-form answers: a calc sheet on the app bar's navy -->
    <section class="on-navy relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 blueprint-bg [mask-image:radial-gradient(ellipse_70%_90%_at_20%_0%,black_30%,transparent_100%)]" aria-hidden="true" />
      <div class="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div class="lg:col-span-4">
          <h2 class="section-title text-balance text-ink">{{ t('home.verify.title') }}</h2>
          <p class="mt-6 text-pretty leading-relaxed text-muted">{{ t('home.verify.lede') }}</p>
          <NuxtLink :to="localePath('/guide/verification')" class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--link)] hover:underline hover:underline-offset-4">
            {{ t('home.verify.link') }}
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
        </div>
        <HomeVerification v-reveal="100" class="min-w-0 lg:col-span-8 lg:pt-2" />
      </div>
    </section>

    <!-- For teachers -->
    <section class="py-14 lg:py-20">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div class="min-w-0 lg:col-span-5">
          <h2 class="section-title text-balance text-ink">{{ t('home.teaching.title') }}</h2>
          <p class="mt-6 text-pretty leading-relaxed text-muted">{{ t('home.teaching.lede') }}</p>
          <ul class="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <li v-for="item in teaching" :key="item">
              <Icon :name="teachingIcons[item]" class="size-5 text-brand" />
              <h3 class="mt-3 font-medium text-ink">{{ t(`home.teaching.items.${item}.title`) }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ t(`home.teaching.items.${item}.body`) }}</p>
            </li>
          </ul>
          <NuxtLink :to="localePath('/guide/teaching')" class="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
            {{ t('home.teaching.link') }}
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
        </div>
        <!-- min-w-0: the slide's share link must not widen the one column a phone has -->
        <div class="min-w-0 lg:col-span-7">
          <HomeLectureSlide v-reveal="100" />
        </div>
      </div>
    </section>

    <!-- Who stands behind it, and the libraries anyone can build on -->
    <section class="band-light border-t border-rule bg-mist">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div class="lg:col-span-5">
          <h2 class="section-title text-balance text-ink">{{ t('home.heritage.title') }}</h2>
          <p class="mt-5 max-w-xl text-pretty leading-relaxed text-ink-soft">{{ t('home.heritage.body') }}</p>
          <NuxtLink :to="`${localePath('/guide/introduction')}#authors-credits`" class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
            {{ t('home.heritage.team') }}
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
        </div>
        <ul class="sheet self-start lg:col-span-7">
          <li v-for="lib in LIBRARIES" :key="lib.path" class="p-6">
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <NuxtLink :to="sitePath(lib.path)" class="font-mono text-lg font-medium text-ink hover:text-brand">{{ lib.name }}</NuxtLink>
              <span class="text-xs text-muted">{{ lib.license }}</span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-muted">{{ t(`${lib.id}.tagline`) }}</p>
            <code class="mt-4 block overflow-x-auto rounded-md border border-rule bg-mist px-3 py-2 font-mono text-[0.8rem] text-ink-soft"><span class="select-none text-muted">$ </span>{{ lib.install }}</code>
            <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              <NuxtLink :to="sitePath(lib.path)" class="inline-flex items-center gap-1.5 text-brand hover:underline hover:underline-offset-4">
                {{ t('ui.docs') }}<span class="sr-only">: {{ lib.name }}</span>
                <Icon name="lucide:arrow-right" class="size-4" />
              </NuxtLink>
              <a v-if="lib.repo" :href="lib.repo" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-muted hover:text-ink">
                <Icon name="lucide:github" class="size-4" />
                GitHub<span class="sr-only">: {{ lib.name }}</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- The way in -->
    <section class="on-navy">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div class="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="section-title !text-[clamp(2rem,1.5rem+2vw,3rem)]">{{ t('home.final.title') }}</p>
            <p class="mt-5 max-w-lg text-pretty text-white/70">{{ t('home.final.lede') }}</p>
          </div>
          <a :href="appUrl" target="_blank" rel="noopener" class="btn bg-white text-appbar hover:bg-white/90">
            {{ t('home.hero.launch') }}
            <Icon name="lucide:arrow-up-right" class="size-4" />
          </a>
        </div>
        <ul class="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
          <li v-for="p in paths" :key="p.id" class="bg-paper">
            <NuxtLink :to="localePath(p.to)" class="group flex h-full items-start justify-between gap-4 p-6 transition-colors hover:bg-white/5">
              <span>
                <span class="block font-display text-xl font-semibold">{{ t(`home.final.paths.${p.id}.title`) }}</span>
                <span class="mt-1.5 block text-sm leading-relaxed text-white/60">{{ t(`home.final.paths.${p.id}.body`) }}</span>
              </span>
              <Icon name="lucide:arrow-right" class="mt-1 size-4 shrink-0 text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
