<script setup lang="ts">
import type { Product } from '~/data/products'

/**
 * The top of a library's page: its name, what it is, how to install it and where to read on. The
 * default slot, when given, is a figure set beside the text on a wide screen and below it on a phone.
 */
const props = defineProps<{ product: Product; docs: string }>()
const { t } = useI18n()
const slots = useSlots()
const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.product.install)
  } catch {
    // The browser refused the clipboard: the command stays on screen to copy by hand
    return
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <section class="relative -mt-16 overflow-hidden border-b border-rule">
    <div class="pointer-events-none absolute inset-0 blueprint-bg mask-fade-radial" aria-hidden="true" />
    <div class="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pt-32" :class="slots.default && 'grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-10 lg:pt-24'">
      <div :class="slots.default && 'min-w-0 lg:col-span-5'">
        <p class="font-mono text-sm text-muted">{{ product.license }} · TypeScript</p>
        <!-- Beside a figure, the name takes a narrower column and a smaller size so it stays on one line -->
        <h1 class="display mt-3 text-ink" :class="slots.default ? 'text-[clamp(2.6rem,1rem+3.4vw,4.5rem)]' : 'text-[clamp(2.6rem,1.6rem+3.6vw,4.5rem)]'">{{ product.name }}</h1>
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
      <div v-if="slots.default" class="min-w-0 lg:col-span-7">
        <slot />
      </div>
    </div>
  </section>
</template>
