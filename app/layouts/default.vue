<script setup lang="ts">
import { LIBRARIES } from '~/data/products'

/** The phone menu: every section of the docs and the libraries in a drawer, closed on every navigation. */
const { t } = useI18n()
const { sitePath } = useSitePages()
const menu = useState('menu', () => false)
/** The header's links moved into the menu (`AppHeader`'s squeeze 4): the drawer then serves wide windows too */
const squeeze = useState('header-squeeze', () => 0)
const route = useRoute()
watch(() => route.fullPath, () => (menu.value = false))
</script>

<template>
  <div class="min-h-dvh bg-paper text-ink">
    <AppHeader v-model:menu="menu" />

    <div v-if="menu" class="fixed inset-0 top-16 z-30 overflow-y-auto bg-paper px-6 py-6" :class="squeeze > 3 ? '' : 'lg:hidden'">
      <DocsSidebar all @navigate="menu = false" />
      <section class="mt-7 text-[0.9rem]">
        <p class="mb-2 flex items-center gap-2 font-display text-[0.95rem] font-semibold text-ink">
          <Icon name="lucide:package" class="size-4 shrink-0 text-brand" />
          {{ t('nav.libraries') }}
        </p>
        <ul class="ml-2 border-l border-rule">
          <li v-for="lib in LIBRARIES" :key="lib.path">
            <NuxtLink :to="sitePath(lib.path)" class="-ml-px block border-l-2 border-transparent py-1.5 pl-4 font-mono text-[0.82rem] text-muted">
              {{ lib.name }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <slot />
    <AppFooter />
  </div>
</template>
