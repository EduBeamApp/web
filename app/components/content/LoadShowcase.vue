<script setup lang="ts">
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'
import { createExampleLibrary } from '~/lib/examples'

/**
 * The common load types on one beam, each solved live: two 4 m spans on a pin and a roller, with
 * a uniform, trapezoidal, point, nodal or temperature load. Names as the app shows them.
 */
type Sample = {
  id: string
  title: string
  blurb: string
  result: 'M' | 'w'
  load: (s: LinearStaticSolver) => void
}

const SAMPLES: Sample[] = [
  {
    id: 'udl',
    title: 'loadType.udl',
    blurb: 'components.udlBlurb',
    result: 'M',
    load: (s) => s.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 12000], true),
  },
  {
    id: 'trapezoidal',
    title: 'loadType.trapezoidal',
    blurb: 'components.trapezoidalBlurb',
    result: 'M',
    load: (s) => s.loadCases[0].createBeamElementTrapezoidalEdgeLoad('E2', [0, 4000], [0, 14000], true),
  },
  {
    id: 'concentrated',
    title: 'loadType.concentrated',
    blurb: 'components.concentratedBlurb',
    result: 'M',
    load: (s) => s.loadCases[0].createBeamConcentratedLoad('E1', [0, 18000, 0, 2], true),
  },
  {
    id: 'nodal',
    title: 'loads.nodalLoad',
    blurb: 'components.nodalBlurb',
    result: 'M',
    load: (s) => s.loadCases[0].createNodalLoad('B', { [DofID.Dz]: 20000 }),
  },
  {
    id: 'temperature',
    title: 'loadType.temperature',
    blurb: 'components.temperatureBlurb',
    result: 'w',
    load: (s) => s.loadCases[0].createBeamTemperatureLoad('E2', [20, -10, 0]),
  },
]

const build = (sample: Sample) => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  s.domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  s.domain.createNode('B', [4, 0, 0], [])
  s.domain.createNode('C', [8, 0, 0], [DofID.Dz])
  s.domain.createBeam2D('E1', ['A', 'B'], 1, 1)
  s.domain.createBeam2D('E2', ['B', 'C'], 1, 1)
  sample.load(s)
  s.solve()
  return s
}

const { t } = useI18n()
const { openUrl, numberFormat, units } = useLiveModel()
const solvers = shallowRef<LinearStaticSolver[]>([])
onMounted(() => (solvers.value = SAMPLES.map(build)))
</script>

<template>
  <section class="not-prose my-10">
    <h3 class="font-display text-xl font-semibold text-ink">{{ t('components.loadsTitle') }}</h3>
    <p class="mt-1 max-w-prose text-muted">{{ t('components.loadsLede') }}</p>

    <div class="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2">
      <article v-for="(sample, i) in SAMPLES" :key="sample.id" class="gallery-item">
        <div class="live-canvas flex h-44 items-center">
          <ClientOnly>
            <StructurePlot
                v-if="solvers[i]"
                :solver="solvers[i]"
                :layers="['members', 'supports', 'loads', 'reactions', sample.result]"
                :height="170"
                :number-format="numberFormat" :units="units"
                compact
                class="w-full px-2"
              />
          </ClientOnly>
        </div>
        <h4 class="mt-3 font-display font-semibold text-ink">{{ t(sample.title) }}</h4>
        <p class="mt-1 text-sm leading-relaxed text-muted">{{ t(sample.blurb) }}</p>
        <a v-if="solvers[i]" :href="openUrl(solvers[i], showOnly(sample.result))" target="_blank" rel="noopener" class="live-open mt-2">
          {{ t('components.openInApp') }}
          <Icon name="lucide:arrow-up-right" class="size-3.5" />
        </a>
      </article>
    </div>
  </section>
</template>
