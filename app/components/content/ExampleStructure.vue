<script setup lang="ts">
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { createExampleLibrary } from '~/lib/examples'
import { StructurePlot, type PlotLayer, type ResultLayer } from '@edubeam/plot'
import type { Result } from '../live/ResultSwitch.vue'

/** A simply supported beam under a uniform load to play with: span and load on sliders. */
const { t } = useI18n()

const span = ref(3) // m
const q = ref(10) // kN/m
const result = ref<Result>('moment')

const build = () => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  s.domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz])
  s.domain.createNode('b', [span.value, 0, 0], [DofID.Dz])
  s.domain.createBeam2D('1', ['a', 'b'], 1, 1)
  s.loadCases[0].createBeamElementUniformEdgeLoad('1', [0, q.value * 1000], true)
  s.solve()
  return s
}

const solver = shallowRef<LinearStaticSolver>()
onMounted(() => (solver.value = build()))
watch([span, q], () => (solver.value = build()))

const LAYER = { normal: 'N', shear: 'V', moment: 'M', deformed: 'w' } as const satisfies Record<Result, ResultLayer>
const base: PlotLayer[] = ['members', 'supports', 'loads', 'reactions']
const layers = computed<PlotLayer[]>(() => [...base, LAYER[result.value]])
const reserve: PlotLayer[] = [...base, 'N', 'V', 'M', 'w']
const { numberFormat } = useLiveModel()
</script>

<template>
  <LiveFrame :solver="solver" height="h-64" class="my-8">
    <StructurePlot
        v-if="solver"
        :solver="solver"
        :layers="layers"
        :reserve="reserve"
        :height="256"
        :number-format="numberFormat"
        hover
        class="w-full px-3"
      />
    <template #controls>
      <div class="live-controls">
        <LiveResultSwitch v-model="result" />
        <div class="live-ranges">
          <LiveRangeField v-model="span" symbol="L" unit="m" :label="t('components.spanLength')" :min="1" :max="10" :step="0.5" />
          <LiveRangeField v-model="q" symbol="q" unit="kN/m" :label="t('components.loadIntensity')" :min="1" :max="20" :step="1" />
        </div>
      </div>
    </template>
  </LiveFrame>
</template>
