<script setup lang="ts">
import type { LinearStaticSolver } from '@edubeam/fem'


/**
 * The canvas a live model sits on: the app's grid, a fixed height so the page doesn't jump while
 * the model is built in the browser, and a link that opens the very model in EduBeam.
 */
const props = withDefaults(
  defineProps<{
    solver?: LinearStaticSolver
    caption?: string
    /** The canvas's height classes; the page needs it before the model exists */
    height?: string
  }>(),
  { caption: undefined, solver: undefined, height: 'h-56' }
)
const { t } = useI18n()
const { openUrl } = useLiveModel()
const href = computed(() => (props.solver ? openUrl(props.solver) : undefined))
</script>

<template>
  <figure class="live not-prose">
    <div class="live-canvas">
      <div class="live-stage" :class="height">
        <ClientOnly>
          <slot />
        </ClientOnly>
      </div>
      <slot name="controls" />
    </div>
    <figcaption class="live-caption">
      <span>{{ caption }}</span>
      <a v-if="href" :href="href" target="_blank" rel="noopener" class="live-open">
        {{ t('components.openInApp') }}
        <Icon name="lucide:arrow-up-right" class="size-3.5" />
      </a>
    </figcaption>
  </figure>
</template>
