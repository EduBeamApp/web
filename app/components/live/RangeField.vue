<script setup lang="ts">
/** A slider for one input of a live model: its symbol, its value with the unit, and the track. */
defineProps<{ symbol: string; unit: string; label: string; min: number; max: number; step: number }>()
const model = defineModel<number>({ required: true })
const { numberFormat } = useLiveModel()
</script>

<template>
  <label class="range-field">
    <span class="range-value"
      ><i>{{ symbol }}</i> = {{ numberFormat.format(model) }} {{ unit }}</span
    >
    <input v-model.number="model" type="range" :min="min" :max="max" :step="step" :aria-label="label" />
  </label>
</template>
