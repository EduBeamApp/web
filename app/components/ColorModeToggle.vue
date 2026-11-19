<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()
const dark = computed(() => colorMode.value === 'dark')
const toggle = () => (colorMode.preference = dark.value ? 'light' : 'dark')
</script>

<template>
  <button
    type="button"
    class="inline-flex size-10 items-center justify-center rounded-md text-muted transition hover:text-ink"
    :aria-label="dark ? t('ui.lightMode') : t('ui.darkMode')"
    @click="toggle"
  >
    <ClientOnly>
      <Icon :name="dark ? 'lucide:sun' : 'lucide:moon'" class="h-4.5 w-4.5" />
      <template #fallback><span class="h-4.5 w-4.5" /></template>
    </ClientOnly>
  </button>
</template>
