<script setup lang="ts">
/**
 * Which result a live model draws: N(x), V(x), M(x) or w(x), the way the diagrams are written on
 * a blackboard, with the app's full name for each as its accessible label and tooltip.
 */
export type Result = 'deformed' | 'normal' | 'shear' | 'moment'

const props = withDefaults(defineProps<{ options?: Result[]; tone?: 'light' | 'appbar' }>(), {
  options: () => ['moment', 'shear', 'normal', 'deformed'],
  tone: 'light',
})
const model = defineModel<Result>({ required: true })
const { t } = useI18n()

const RESULT = {
  normal: { symbol: 'N', name: 'common.normalForce', color: 'var(--color-normal)' },
  shear: { symbol: 'V', name: 'common.shearForce', color: 'var(--color-shear)' },
  moment: { symbol: 'M', name: 'common.bendingMoment', color: 'var(--color-moment)' },
  deformed: { symbol: 'w', name: 'common.deformedShape', color: 'var(--color-deformed)' },
} as const satisfies Record<Result, { symbol: string; name: string; color: string }>

const items = computed(() => props.options.map((value) => ({ value, ...RESULT[value], name: t(RESULT[value].name) })))
</script>

<template>
  <div class="result-switch" :class="`result-switch--${tone}`" role="radiogroup">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="radio"
      :aria-checked="model === item.value"
      :aria-label="item.name"
      :title="item.name"
      :style="{ '--dot': item.color }"
      @click="model = item.value"
    >
      <i>{{ item.symbol }}</i>(<i>x</i>)
    </button>
  </div>
</template>
