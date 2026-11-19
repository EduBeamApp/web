<script setup lang="ts">
/** The banner for Elementarium, EduBeam's 3D sibling, in the page's language. */
const props = withDefaults(defineProps<{ placement?: string }>(), { placement: 'docs' })
const { t } = useI18n()
const href = computed(
  () => `https://elementarium.app/?utm_source=edubeam&utm_medium=banner&utm_campaign=leaderboard&utm_content=${props.placement}`
)
</script>

<template>
  <aside class="not-prose my-8">
    <a
      :href="href"
      target="_blank"
      rel="noopener"
      class="group flex items-center gap-5 overflow-hidden rounded-2xl border border-[#1c2550] bg-[#070b24] px-5 py-4 text-white transition hover:border-[#3a4fb0]"
    >
      <img src="/elementarium/logo.png" width="31" height="37" alt="" class="shrink-0" />
      <div class="min-w-0 flex-1">
        <p class="font-display text-lg font-semibold">
          {{ t('components.promoTitle') }}
          <span class="text-[#6f8cff]">{{ t('components.promoAccent') }}</span>
        </p>
        <p class="text-sm text-white/70">{{ t('components.promoSubtitle') }}</p>
      </div>
      <img src="/elementarium/structure.png" width="175" height="86" alt="" loading="lazy" class="hidden sm:block" />
      <span class="shrink-0 rounded-lg bg-[#2f54eb] px-3.5 py-2 text-sm font-semibold transition group-hover:bg-[#4166ff]">
        {{ t('components.promoCta') }}
      </span>
    </a>
  </aside>
</template>
