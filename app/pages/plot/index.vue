<script setup lang="ts">
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'
import { createExampleLibrary } from '~/lib/examples'
import { PLOT } from '~/data/products'
import type { Result } from '~/components/live/ResultSwitch.vue'

/**
 * The drawing library's page: a live portal frame to switch between results and label styles,
 * with the code that draws it, kept in step. Its words are `plot.*` in the locale files; in a
 * language they are not translated into, its URL redirects to the English page.
 */
const { t } = useI18n()
// Values on the figure as the page's language writes them (12,5 in Czech)
const { numberFormat, units } = useLiveModel()
const { sitePath } = useSitePages()
const redirecting = useEnglishFallback()
useProductSeo(PLOT)

// The frame from the home page's four steps: 6 x 4 m, pinned feet, 10 kN/m and a 15 kN push
const solver = shallowRef<LinearStaticSolver>()
onMounted(() => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  const nodes = { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] } as const
  for (const [label, [x, z]] of Object.entries(nodes)) {
    s.domain.createNode(label, [x, 0, z], label === 'A' || label === 'D' ? [DofID.Dx, DofID.Dz] : [])
  }
  s.domain.createBeam2D('1', ['A', 'B'], 1, 1)
  s.domain.createBeam2D('2', ['B', 'C'], 1, 1)
  s.domain.createBeam2D('3', ['C', 'D'], 1, 1)
  s.loadCases[0].createBeamElementUniformEdgeLoad('2', [0, 10000], true)
  s.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15000 })
  s.solve()
  solver.value = s
})

const result = ref<Result>('moment')
const mode = ref<'horizontal' | 'axis'>('horizontal')
const LAYER = { normal: 'N', shear: 'V', moment: 'M', deformed: 'w' } as const satisfies Record<Result, string>
const layers = computed(() => ['members', 'supports', 'loads', 'reactions', LAYER[result.value]])

const code = computed(
  () => `<StructurePlot
  :solver="solver"
  :layers="[
    ${layers.value.map((l) => `'${l}'`).join(', ')},
  ]"${mode.value === 'axis' ? `\n  result-label-mode="axis"` : ''}
/>`
)

const USES = [
  { id: 'exercises', icon: 'lucide:dices', to: '/plot/exercises' },
  { id: 'slides', icon: 'lucide:presentation', to: '/plot/slides' },
  { id: 'embedding', icon: 'lucide:layout-template', to: '/plot/embedding' },
  { id: 'print', icon: 'lucide:file-image', to: '/plot/functions#a-standalone-svg-file' },
] as const

const FEATURES = ['style', 'readable', 'exact', 'fits'] as const
</script>

<template>
  <main v-if="!redirecting">
    <LibraryHero :product="PLOT" :docs="sitePath('/plot/getting-started')" />

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h2 class="section-title text-ink">{{ t('plot.try.title') }}</h2>
      <p class="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">{{ t('plot.try.lede') }}</p>
      <div class="mt-10 grid gap-8 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <div class="rounded-xl border border-rule bg-paper p-4">
            <ClientOnly>
              <StructurePlot v-if="solver" :solver="solver" :number-format="numberFormat" :units="units" :layers="layers" :reserve="['members', 'supports', 'loads', 'reactions', 'N', 'V', 'M', 'w']" :result-label-mode="mode" :reserve-label-modes="['horizontal', 'axis']" :height="380" />
            </ClientOnly>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <LiveResultSwitch v-model="result" />
            <div class="result-switch" role="radiogroup" :aria-label="t('plot.try.labelStyle')">
              <button v-for="m in ['horizontal', 'axis'] as const" :key="m" type="button" role="radio" :aria-checked="mode === m" style="font-family: var(--font-sans)" @click="mode = m">
                {{ t(`plot.try.${m}`) }}
              </button>
            </div>
          </div>
        </div>
        <CodeBlock :code="code" lang="vue" caption="Frame.vue" class="self-start lg:col-span-5" />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h2 class="section-title text-ink">{{ t('plot.teaching.title') }}</h2>
      <i18n-t keypath="plot.teaching.lede" tag="p" scope="global" class="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
        <template #practice>
          <NuxtLink :to="sitePath('/practice')" class="text-[color:var(--link)] hover:underline">{{ t('plot.teaching.practice') }}</NuxtLink>
        </template>
        <template #exam>
          <NuxtLink :to="sitePath('/exam')" class="text-[color:var(--link)] hover:underline">{{ t('plot.teaching.exam') }}</NuxtLink>
        </template>
      </i18n-t>
      <div class="mt-10 grid gap-10 lg:grid-cols-12">
        <ExerciseGenerator class="!my-0 lg:col-span-8" />
        <ul class="flex flex-col divide-y divide-rule self-start rounded-xl border border-rule lg:col-span-4">
          <li v-for="u in USES" :key="u.to">
            <NuxtLink :to="sitePath(u.to)" class="group flex gap-3 p-4 transition-colors hover:bg-mist">
              <Icon :name="u.icon" class="mt-0.5 size-5 shrink-0 text-brand" />
              <span class="min-w-0">
                <span class="flex items-center gap-1.5 font-display font-semibold text-ink group-hover:text-brand">
                  {{ t(`plot.uses.${u.id}.title`) }}
                  <Icon name="lucide:arrow-right" class="size-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span class="mt-0.5 block text-sm leading-relaxed text-muted">{{ t(`plot.uses.${u.id}.body`) }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="band-light border-t border-rule bg-mist py-14 lg:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="section-title text-ink">{{ t('plot.features.title') }}</h2>
        <ul class="sheet mt-10 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="f in FEATURES" :key="f" class="p-6">
            <h3 class="font-display text-xl font-semibold text-ink">{{ t(`plot.features.${f}.title`) }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-muted">{{ t(`plot.features.${f}.body`) }}</p>
          </li>
        </ul>
        <NuxtLink :to="sitePath('/plot/components')" class="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline hover:underline-offset-4">
          {{ t('plot.features.components') }}
          <Icon name="lucide:arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
