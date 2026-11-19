<script setup lang="ts">
import katex from 'katex'
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

/**
 * Classic cases with closed-form answers, next to what EduBeam's solver gives for them - computed
 * in the reader's browser as the page loads, not typed in. A steel IPE 200 section,
 * stiff in shear so the solver's beam is the textbook's Euler-Bernoulli beam.
 */
const E = 210e9 // Pa
const I = 1943e-8 // m^4

type Case = {
  id: string
  sketch: 'simple' | 'cantilever' | 'fixed' | 'propped'
  tex: string
  hand: number
  unit: string
  /** The solver's value, in the same unit as `hand` */
  solve: () => number
}

const beam = (supportA: DofID[], supportB: DofID[], length: number) => {
  const s = new LinearStaticSolver()
  s.domain.createMaterial(1, { e: E, g: E / 2.6, alpha: 1.2e-5, d: 7850 })
  s.domain.createCrossSection(1, { a: 28.5e-4, iy: I, iz: 1, dyz: 1, h: 0.2, k: 1e32, j: 1 })
  s.domain.createNode('a', [0, 0, 0], supportA)
  s.domain.createNode('b', [length, 0, 0], supportB)
  const element = s.domain.createBeam2D('1', ['a', 'b'], 1, 1) as Beam2D
  return { s, element, lc: s.loadCases[0] }
}

const pin = [DofID.Dx, DofID.Dz]
const roller = [DofID.Dz]
const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]

const CASES: Case[] = [
  {
    id: 'ssMoment',
    sketch: 'simple',
    tex: 'M_{\\max} = \\dfrac{qL^2}{8}',
    hand: (12 * 6 ** 2) / 8,
    unit: 'kNm',
    solve: () => {
      const { s, element, lc } = beam(pin, roller, 6)
      lc.createBeamElementUniformEdgeLoad('1', [0, 12000], true)
      s.solve()
      return element.computeBendingMomentAt(lc, 3) / 1000
    },
  },
  {
    id: 'ssDeflection',
    sketch: 'simple',
    tex: 'w_{\\max} = \\dfrac{5qL^4}{384EI}',
    hand: ((5 * 12000 * 6 ** 4) / (384 * E * I)) * 1000,
    unit: 'mm',
    solve: () => {
      const { s, element, lc } = beam(pin, roller, 6)
      lc.createBeamElementUniformEdgeLoad('1', [0, 12000], true)
      s.solve()
      return element.computeLocalDefl(lc, 2).w[1] * 1000
    },
  },
  {
    id: 'cantilever',
    sketch: 'cantilever',
    tex: 'M_A = -PL',
    hand: -18 * 4,
    unit: 'kNm',
    solve: () => {
      const { s, element, lc } = beam(fixed, [], 4)
      lc.createNodalLoad('b', { [DofID.Dz]: 18000 })
      s.solve()
      return element.computeBendingMomentAt(lc, 0) / 1000
    },
  },
  {
    id: 'fixed',
    sketch: 'fixed',
    tex: 'M_A = -\\dfrac{qL^2}{12}',
    hand: -(10 * 6 ** 2) / 12,
    unit: 'kNm',
    solve: () => {
      const { s, element, lc } = beam(fixed, fixed, 6)
      lc.createBeamElementUniformEdgeLoad('1', [0, 10000], true)
      s.solve()
      return element.computeBendingMomentAt(lc, 0) / 1000
    },
  },
  {
    id: 'propped',
    sketch: 'propped',
    tex: 'R_B = \\dfrac{3qL}{8}',
    hand: (3 * 10 * 6) / 8,
    unit: 'kN',
    solve: () => {
      const { s, element, lc } = beam(fixed, roller, 6)
      lc.createBeamElementUniformEdgeLoad('1', [0, 10000], true)
      s.solve()
      // The prop's reaction is the shear just left of it, turned to point up
      return -element.computeShearForceAt(lc, 6) / 1000
    },
  },
]

const { t, locale } = useI18n()
const { units } = useLiveModel()
/** A unit's symbol as the page writes it: kN, or кН on Russian pages */
const unit = (kind: 'force' | 'moment' | 'distributed' | 'length' | 'displacement') => units.value[kind].symbol
const KIND = { kN: 'force', kNm: 'moment', mm: 'displacement' } as const
const unitOf = (u: string) => (u in KIND ? unit(KIND[u as keyof typeof KIND]) : u)
const formula = (tex: string) => katex.renderToString(tex, { throwOnError: false })
const fmt = (v: number) => v.toLocaleString(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('-', '−')

// Five one-element models: milliseconds of work, done as the page loads in the reader's browser
const solved = ref<number[] | null>(null)
onMounted(() => (solved.value = CASES.map((c) => c.solve())))

const matches = (i: number) => solved.value !== null && Math.abs(solved.value[i] - CASES[i].hand) <= 1e-6 * Math.max(1, Math.abs(CASES[i].hand))
</script>

<template>
  <div>
    <!-- On a phone the closed form moves under the case, so the whole table fits without scrolling -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm sm:min-w-[40rem]">
        <thead>
          <tr class="border-b border-rule text-muted">
            <th class="pb-3 pr-4 font-medium">{{ t('home.verify.case') }}</th>
            <th class="hidden pb-3 pr-4 font-medium sm:table-cell">{{ t('home.verify.formula') }}</th>
            <th class="pb-3 pr-4 text-right font-medium">{{ t('home.verify.hand') }}</th>
            <th class="pb-3 text-right font-medium">{{ t('home.verify.edubeam') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in CASES" :key="c.id" class="border-b border-rule">
            <td class="py-3 pr-4 text-ink">
              <span class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <HomeCaseSketch :kind="c.sketch" />
                <span>
                  {{ t(`home.verify.cases.${c.id}`) }}
                  <!-- eslint-disable-next-line vue/no-v-html -- KaTeX's markup of our own formula -->
                  <span class="mt-1.5 block sm:hidden" v-html="formula(c.tex)" />
                </span>
              </span>
            </td>
            <!-- eslint-disable-next-line vue/no-v-html -- KaTeX's markup of our own formula -->
            <td class="hidden py-3 pr-4 text-ink sm:table-cell" v-html="formula(c.tex)" />
            <td class="whitespace-nowrap py-3 pr-4 text-right tabular-nums text-muted">{{ fmt(c.hand) }} {{ unitOf(c.unit) }}</td>
            <td class="whitespace-nowrap py-3 text-right tabular-nums">
              <span v-if="solved" class="inline-flex items-center gap-2 font-medium text-ink">
                {{ fmt(solved[i]) }} {{ unitOf(c.unit) }}
                <Icon v-if="matches(i)" name="lucide:check" class="size-4 text-[var(--color-shear)]" />
              </span>
              <span v-else class="text-muted">…</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-xs text-muted">{{ t('home.verify.steel') }}</p>
  </div>
</template>
