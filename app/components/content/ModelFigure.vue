<script setup lang="ts">
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot, type PlotLayer, type ResultLayer } from '@edubeam/plot'
import { createExampleLibrary } from '~/lib/examples'
import { applyNodeLcsAngle, supportTypes, type SupportType } from '~/lib/supports'

/**
 * A model written into a page and solved in the browser, drawn by @edubeam/plot:
 *
 * ```md
 * ::model-figure{caption="…"}
 * ---
 * nodes: { A: [0, 0], B: [6, 0] }   # [x, z] in m, z down: a column top is at z = -4
 * supports: { A: pin, B: roller }
 * members: [[A, B]]                  # or { nodes: [A, B], hinges: [false, true] }
 * loads:
 *   - { member: 1, qz: 12 }          # kN/m along +z (down); [start, end] for a trapezoid
 *   - { member: 1, pz: 20, at: 2 }   # kN at `at` m from the member's start
 *   - { node: B, fx: 5, fz: 10, my: 3 }  # kN, kNm
 *   - { node: B, settlement: { dz: 0.01 } }  # prescribed displacement: m, rad (B must be supported)
 * angles: { B: 30 }                  # a support turned by 30°, as the app's Nodal LCS angle
 * results: [M, V, N, w]              # the switch; the first is shown. One entry: no switch.
 * ---
 * ::
 * ```
 *
 * Members are labelled 1, 2, … in order. Loads are in global axes unless `local: true`. Without
 * `material`/`section` the app's example steel beam is used, so the numbers match the app's examples.
 */
type NodeId = string
/**
 * By node label. Labels that are numbers (`1: [0, 0]`, as the app numbers nodes) reach the
 * component as an array indexed by the number, with holes; both shapes are read the same way.
 */
type Keyed<T> = Readonly<Record<NodeId, T>> | readonly (T | null | undefined)[]
const entries = <T,>(keyed: Keyed<T>): [NodeId, T][] =>
  Array.isArray(keyed)
    ? keyed.flatMap((v, i) => (v === null || v === undefined ? [] : [[String(i), v] as [NodeId, T]]))
    : Object.entries(keyed as Record<NodeId, T>)
type MemberSpec = readonly [NodeId, NodeId] | { readonly nodes: readonly [NodeId, NodeId]; readonly hinges?: readonly [boolean, boolean] }
type LoadSpec =
  | { readonly node: NodeId; readonly fx?: number; readonly fz?: number; readonly my?: number }
  | { readonly node: NodeId; readonly settlement: { readonly dx?: number; readonly dz?: number; readonly ry?: number } }
  | { readonly member: number; readonly qx?: number | readonly [number, number]; readonly qz?: number | readonly [number, number]; readonly local?: boolean }
  | { readonly member: number; readonly px?: number; readonly pz?: number; readonly at: number; readonly local?: boolean }
  | { readonly member: number; readonly temperature: { readonly centre?: number; readonly bottom?: number; readonly top?: number } }

const props = withDefaults(
  defineProps<{
    nodes: Keyed<readonly [number, number]>
    supports?: Keyed<SupportType>
    /** Nodal LCS angles in degrees, for turned supports */
    angles?: Keyed<number>
    members: readonly MemberSpec[]
    loads?: readonly LoadSpec[]
    /** Results to switch between; the first is drawn. Empty: the model only (an exercise sheet). */
    results?: readonly ResultLayer[]
    /** Extra layers: `nodeLabels`, `dimensions`, `nodes`. */
    show?: readonly PlotLayer[]
    reactions?: boolean
    caption?: string
    /** Fixed height, px; by default the height follows the drawing */
    height?: number
    /** Values along the ordinate (`axis`, as the app) or upright. */
    labels?: 'axis' | 'horizontal'
    /** SI, as the app stores them: Pa, 1/K, m², m⁴, m; `k` the shear coefficient (the default section is rigid in shear) */
    material?: { e?: number; g?: number; alpha?: number }
    section?: { a?: number; iy?: number; h?: number; k?: number }
  }>(),
  {
    supports: () => ({}),
    angles: () => ({}),
    loads: () => [],
    results: () => ['M'],
    show: () => [],
    reactions: true,
    caption: undefined,
    height: undefined,
    labels: 'axis',
    material: undefined,
    section: undefined,
  }
)

const kN = 1000
const pair = (v: number | readonly [number, number] | undefined): readonly [number, number] =>
  typeof v === 'number' ? [v, v] : (v ?? [0, 0])

const build = () => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  if (props.material) Object.assign(s.domain.getMaterial(1), props.material)
  if (props.section) Object.assign(s.domain.getCS(1), props.section)

  const supports = new Map(entries(props.supports))
  for (const [id, [x, z]] of entries(props.nodes)) {
    const support = supports.get(id)
    s.domain.createNode(id, [x, 0, z], support ? [...supportTypes[support]] : [])
  }
  for (const [id, degrees] of entries(props.angles)) applyNodeLcsAngle(s.domain.getNode(id), degrees)
  props.members.forEach((member, i) => {
    const spec = Array.isArray(member) ? { nodes: member as readonly [NodeId, NodeId] } : (member as Exclude<MemberSpec, readonly unknown[]>)
    s.domain.createBeam2D(String(i + 1), spec.nodes.map(String), 1, 1, [...(spec.hinges ?? [false, false])] as [boolean, boolean])
  })

  const lc = s.loadCases[0]
  for (const load of props.loads) {
    if ('settlement' in load) {
      const { dx, dz, ry } = load.settlement
      lc.createPrescribedDisplacement(String(load.node), {
        ...(dx !== undefined && { [DofID.Dx]: dx }),
        ...(dz !== undefined && { [DofID.Dz]: dz }),
        ...(ry !== undefined && { [DofID.Ry]: ry }),
      })
    } else if ('node' in load) {
      lc.createNodalLoad(String(load.node), {
        [DofID.Dx]: (load.fx ?? 0) * kN,
        [DofID.Dz]: (load.fz ?? 0) * kN,
        [DofID.Ry]: (load.my ?? 0) * kN,
      })
    } else if ('temperature' in load) {
      const { centre = 0, bottom = 0, top = 0 } = load.temperature
      lc.createBeamTemperatureLoad(String(load.member), [centre, bottom, top])
    } else if ('at' in load) {
      lc.createBeamConcentratedLoad(String(load.member), [(load.px ?? 0) * kN, (load.pz ?? 0) * kN, 0, load.at], !!load.local)
    } else {
      const [qx0, qx1] = pair(load.qx)
      const [qz0, qz1] = pair(load.qz)
      const id = String(load.member)
      if (qx0 === qx1 && qz0 === qz1) lc.createBeamElementUniformEdgeLoad(id, [qx0 * kN, qz0 * kN], !!load.local)
      else lc.createBeamElementTrapezoidalEdgeLoad(id, [qx0 * kN, qz0 * kN], [qx1 * kN, qz1 * kN], !!load.local)
    }
  }
  s.solve()
  return s
}

// Solved during setup, so the server renders the figure and the page never jumps when it loads
const solver = shallowRef<LinearStaticSolver>(build())
watch(
  () => [props.nodes, props.members, props.loads, props.supports, props.angles, props.material, props.section],
  () => (solver.value = build()),
  { deep: true }
)

const result = ref<ResultLayer | undefined>(props.results[0])
const base: PlotLayer[] = ['members', 'supports', 'loads']
const layers = computed<PlotLayer[]>(() => [
  ...base,
  ...props.show,
  ...(result.value && props.reactions ? (['reactions'] as const) : []),
  ...(result.value ? [result.value] : []),
])
// Room for every result the switch offers, so switching never moves the drawing
const reserve = computed<PlotLayer[]>(() => [...base, ...props.show, ...(props.reactions ? (['reactions'] as const) : []), ...props.results])

const SWITCH = { N: 'normal', V: 'shear', M: 'moment', w: 'deformed' } as const satisfies Record<ResultLayer, Result>
const switchValue = computed({
  get: () => (result.value ? SWITCH[result.value] : 'moment'),
  set: (value: Result) => (result.value = (Object.keys(SWITCH) as ResultLayer[]).find((k) => SWITCH[k] === value)),
})

const { t } = useI18n()
const { openUrl, numberFormat, units } = useLiveModel()
const href = computed(() => openUrl(solver.value, result.value ? showOnly(result.value, props.show.includes('nodeLabels')) : undefined))
</script>

<script lang="ts">
import type { Result } from '../live/ResultSwitch.vue'
</script>

<template>
  <figure class="live model-figure not-prose">
    <div class="live-canvas">
      <div class="live-stage px-3 py-2">
        <StructurePlot
          :solver="solver"
          :layers="layers"
          :reserve="reserve"
          :height="height"
          :max-height="440"
          :width="680"
          :result-label-mode="labels"
          :number-format="numberFormat" :units="units"
          :title="caption"
          hover
          class="w-full"
        />
      </div>
      <div v-if="results.length > 1" class="live-controls">
        <LiveResultSwitch v-model="switchValue" :options="results.map((r) => SWITCH[r])" />
      </div>
    </div>
    <figcaption class="live-caption">
      <span>{{ caption }}</span>
      <a :href="href" target="_blank" rel="noopener" class="live-open">
        {{ t('components.openInApp') }}
        <Icon name="lucide:arrow-up-right" class="size-3.5" />
      </a>
    </figcaption>
  </figure>
</template>
