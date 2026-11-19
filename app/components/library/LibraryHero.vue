<script setup lang="ts">
import type { Product } from '~/data/products'

/** The top of a library's page: its name, what it is, how to install it and where to read on. */
const props = defineProps<{ product: Product; docs: string }>()
const { t } = useI18n()
const copied = ref(false)
const copy = async () => {
  await navigator.clipboard.writeText(props.product.install)
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <section class="relative -mt-16 overflow-hidden border-b border-rule">
    <div class="pointer-events-none absolute inset-0 blueprint-bg mask-fade-radial" aria-hidden="true" />
    <div class="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <p class="font-mono text-sm text-muted">{{ product.license }} · TypeScript</p>
      <h1 class="display mt-3 text-[clamp(2.6rem,1.6rem+3.6vw,4.5rem)] text-ink">{{ product.name }}</h1>
      <p class="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{{ t(`${product.id}.tagline`) }}</p>
      <i18n-t v-if="product.author" keypath="library.by" tag="p" scope="global" class="mt-3 text-sm text-muted">
        <template #author>
          <a :href="product.author.url" target="_blank" rel="noopener" class="font-medium text-ink hover:underline hover:underline-offset-4">{{ product.author.name }}</a>
        </template>
      </i18n-t>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <!-- An install line only where one works: published, or able to build from its repository -->
        <button v-if="product.published || product.installsFromRepo" type="button" class="btn btn-quiet bg-paper font-mono text-sm" @click="copy">
          <span class="text-muted">$</span> {{ product.install }}
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-4 text-muted" />
        </button>
        <NuxtLink :to="docs" class="btn btn-primary">{{ t('library.getStarted') }}</NuxtLink>
        <a v-if="product.repo" :href="product.repo" target="_blank" rel="noopener" class="btn btn-quiet bg-paper">
          <Icon name="lucide:github" class="size-4" />
          GitHub
        </a>
      </div>
      <p v-if="!product.published" class="mt-4 text-sm text-muted">{{ t(product.installsFromRepo ? 'library.fromRepo' : 'library.comingToNpm') }}</p>
    </div>
  </section>
</template>
