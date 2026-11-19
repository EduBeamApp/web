<script setup lang="ts">
import { LinearStaticSolver, type DofID } from '@edubeam/fem'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { createExampleLibrary } from '~/lib/examples'

/**
 * A small solved model written into a page: `::structure{:nodes='[…]' :elements='[…]' show-moment}`.
 * Nodal loads are in N and Nm, z down, as the app stores them.
 */
const props = defineProps<{
  nodes: { label: string; coords: number[]; dofs: DofID[] }[]
  elements: { label: string; nodes: string[] }[]
  nodalLoads?: { target: string; values: Partial<Record<DofID, number>> }[]
  showLoads?: boolean
  showNormalForce?: boolean
  showShearForce?: boolean
  showMoment?: boolean
  showDeformedShape?: boolean
  showReactions?: boolean
}>()

const solver = shallowRef<LinearStaticSolver>()
onMounted(() => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  for (const node of props.nodes) s.domain.createNode(node.label, node.coords, node.dofs)
  for (const element of props.elements) s.domain.createBeam2D(element.label, element.nodes, 1, 1)
  for (const load of props.nodalLoads ?? []) s.loadCases[0].createNodalLoad(load.target, load.values)
  s.solve()
  solver.value = s
})

const { numberFormat, units } = useLiveModel()
const layers = computed<PlotLayer[]>(() => [
  'members',
  'supports',
  'nodeLabels',
  ...(props.showLoads ? (['loads'] as const) : []),
  ...(props.showReactions ? (['reactions'] as const) : []),
  ...(props.showNormalForce ? (['N'] as const) : []),
  ...(props.showShearForce ? (['V'] as const) : []),
  ...(props.showMoment ? (['M'] as const) : []),
  ...(props.showDeformedShape ? (['w'] as const) : []),
])
</script>

<template>
  <LiveFrame :solver="solver" height="h-56" class="my-8">
    <StructurePlot v-if="solver" :solver="solver" :layers="layers" :number-format="numberFormat" :units="units" class="w-full" />
  </LiveFrame>
</template>
