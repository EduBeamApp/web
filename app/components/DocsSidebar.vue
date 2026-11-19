<script setup lang="ts">
const { t } = useI18n()
/**
 * The guide's sidebar: each group under its icon and name, its pages on a rail that marks the
 * current one. Only the current section's groups (the guide, the tutorials, or the theory manual), or all of
 * them in the phone menu.
 */
const props = defineProps<{ /** Every section's groups, for the phone menu, which has no header links */ all?: boolean }>()
const { groups, sidebar, isActive } = useDocsNav()
const shown = computed(() => (props.all ? groups.value : sidebar.value))
defineEmits<{ navigate: [] }>()
</script>

<template>
  <nav class="space-y-7 text-[0.9rem]" :aria-label="t('ui.guideNav')">
    <section v-for="group in shown" :key="group.text">
      <h3 class="mb-2 flex items-center gap-2 font-display text-[0.95rem] font-semibold text-ink">
        <Icon v-if="group.icon" :name="group.icon" class="size-4 shrink-0 text-brand" />
        {{ group.text }}
      </h3>
      <ul class="ml-2 border-l border-rule">
        <li v-for="item in group.items" :key="item.link">
          <NuxtLink
            :to="item.link"
            class="-ml-px block border-l-2 py-1.5 pl-4 pr-2 transition-colors"
            :class="isActive(item.link) ? 'border-brand font-semibold text-brand' : 'border-transparent text-muted hover:border-strong-rule hover:text-ink'"
            :aria-current="isActive(item.link) ? 'page' : undefined"
            @click="$emit('navigate')"
          >
            {{ item.text }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>
