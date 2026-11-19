<script setup lang="ts">
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'
import { PLOT, SOLVER } from '~/data/products'

/**
 * The solver's page: what it is, then the getting-started code beside what that very code gives
 * when this page runs it, and what the solver provides. Its words are `solver.*` in the locale
 * files; in a language they are not translated into, its URL redirects to the English page.
 */
const { t, locale } = useI18n()
// Values on the figure as the page's language writes them (12,5 in Czech)
const { numberFormat, units } = useLiveModel()
const { sitePath } = useSitePages()
const redirecting = useEnglishFallback()
useProductSeo(SOLVER)

const CODE = `import { DofID, LinearStaticSolver } from '${SOLVER.importFrom}'

const solver = new LinearStaticSolver()
const { domain } = solver

// SI units throughout: m, N, Pa. Steel and an IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m, down
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()`

/** The same model, solved here in the reader's browser. */
const solver = shallowRef<LinearStaticSolver>()
const results = shallowRef<{ label: string; value: string; check: string }[]>([])
onMounted(() => {
  const s = new LinearStaticSolver()
  const { domain } = s
  domain.createMaterial('steel', { e: 210e9, g: 81e9 })
  domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [6, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')
  const lc = s.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
  s.solve()
  const f = (v: number) => v.toLocaleString(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  results.value = [
    { label: 'beam.computeBendingMomentAt(lc, 3)', value: `${f(beam.computeBendingMomentAt(lc, 3) / 1000)} ${units.value.moment.symbol}`, check: `qL²/8 = ${f(54)}` },
    { label: 'beam.computeShearForceAt(lc, 0)', value: `${f(beam.computeShearForceAt(lc, 0) / 1000)} ${units.value.force.symbol}`, check: `qL/2 = ${f(36)}` },
    {
      label: 'beam.computeLocalDefl(lc, 2).w[1]',
      value: `${f(beam.computeLocalDefl(lc, 2).w[1] * 1000)} ${units.value.displacement.symbol}`,
      check: t('solver.run.plusShear', { formula: `5qL⁴/384EI = ${f(49.63)}` }),
    },
  ]
  solver.value = s
})

const FEATURES = ['analyses', 'elements', 'loads', 'results'] as const
</script>

<template>
  <main v-if="!redirecting">
    <LibraryHero :product="SOLVER" :docs="sitePath('/solver/getting-started')" />

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h2 class="section-title text-ink">{{ t('solver.run.title') }}</h2>
      <i18n-t keypath="solver.run.lede" tag="p" scope="global" class="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
        <template #plot>
          <NuxtLink :to="sitePath('/solver/drawing')" class="font-medium text-brand hover:underline hover:underline-offset-4">{{ PLOT.name }}</NuxtLink>
        </template>
      </i18n-t>
      <div class="mt-10 grid gap-8 lg:grid-cols-12">
        <CodeBlock :code="CODE" lang="ts" caption="beam.ts" class="self-start lg:col-span-7" />
        <div class="flex flex-col gap-6 lg:col-span-5">
          <div class="rounded-xl border border-rule bg-paper p-4">
            <ClientOnly>
              <StructurePlot v-if="solver" :solver="solver" :number-format="numberFormat" :units="units" :layers="['members', 'supports', 'loads', 'reactions', 'M']" :height="170" />
            </ClientOnly>
          </div>
          <dl class="sheet">
            <div v-for="r in results" :key="r.label" class="grid gap-1 px-4 py-3">
              <dt class="font-mono text-xs text-muted">{{ r.label }}</dt>
              <dd class="flex items-baseline justify-between gap-4">
                <span class="font-semibold tabular-nums text-ink">{{ r.value }}</span>
                <span class="text-xs text-muted">{{ r.check }}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="band-light border-y border-rule bg-mist py-14 lg:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="section-title text-ink">{{ t('solver.features.title') }}</h2>
        <ul class="sheet mt-10 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="f in FEATURES" :key="f" class="p-6">
            <h3 class="font-display text-xl font-semibold text-ink">{{ t(`solver.features.${f}.title`) }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{{ t(`solver.features.${f}.body`) }}</p>
          </li>
        </ul>
        <NuxtLink :to="sitePath('/solver/reference')" class="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
          {{ t('solver.features.reference') }}
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h2 class="section-title text-ink">{{ t('solver.behind.title') }}</h2>
      <p class="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">{{ t('solver.behind.body', { name: SOLVER.name }) }}</p>
      <NuxtLink :to="sitePath('/')" class="btn btn-quiet mt-6">{{ t('solver.behind.link') }}</NuxtLink>
    </section>
  </main>
</template>
