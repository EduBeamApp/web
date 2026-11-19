<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { LIBRARIES } from '~/data/products'

/** The header's menu of the libraries this site is home to, names from the product registry. */
defineProps<{ current: boolean }>()
const { t } = useI18n()
const { sitePath } = useSitePages()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <div ref="root" class="relative flex">
    <button
      type="button"
      class="-mb-px flex items-center gap-1 whitespace-nowrap border-b-2 text-[0.95rem] font-medium transition-colors"
      :class="current ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      {{ t('nav.libraries') }}
      <Icon name="lucide:chevron-down" class="size-3.5" />
    </button>
    <div v-if="open" role="menu" class="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-rule bg-paper p-1.5 shadow-xl">
      <NuxtLink v-for="lib in LIBRARIES" :key="lib.path" :to="sitePath(lib.path)" role="menuitem" class="block rounded-lg px-3 py-2.5 transition-colors hover:bg-mist">
        <span class="block font-mono text-sm font-medium text-ink">{{ lib.name }}</span>
        <span class="mt-0.5 block text-sm leading-snug text-muted">{{ t(`${lib.id}.tagline`) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
