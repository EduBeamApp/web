<script setup lang="ts">
import { StructurePlot, type PlotLayer, type ResultLayer } from '@edubeam/plot'
import { FAMILY_IDS, makeProblem, solveProblem } from '~/lib/problems'
import type { Result } from '../live/ResultSwitch.vue'

/**
 * What @edubeam/plot is for besides the app: a random, solvable exercise from a seed, drawn as the
 * assignment (dimensions, labels, loads) and as its solution (reactions and diagrams). The same
 * seed always makes the same exercise, so a test can be printed per student and marked from the key.
 * The problems are the practice page's and the exam builder's (`~/lib/problems`). Its words are
 * `exerciseGenerator.*` and `problems.*` in the locale files, in English where not yet translated.
 */
const { t } = useI18n()
const { sitePath } = useSitePages()
const words = useProblemText()
const seed = ref(4820)
const solved = computed(() => solveProblem(makeProblem(FAMILY_IDS[seed.value % FAMILY_IDS.length], seed.value)))
const isTruss = computed(() => solved.value.problem.family === 'truss')

const next = () => (seed.value = 1000 + Math.floor(Math.random() * 9000))

const result = ref<Result>('moment')
watch(isTruss, (truss) => (result.value = truss ? 'normal' : 'moment'))
const LAYER = { normal: 'N', shear: 'V', moment: 'M', deformed: 'w' } as const satisfies Record<Result, ResultLayer>
// The exercise names its unknown reactions; the key writes their values
const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
// The key answers the question: reactions and the diagram, the loads being on the sheet beside it
const key = computed<PlotLayer[]>(() => ['members', 'supports', 'reactions', 'nodeLabels', LAYER[result.value]])
// Both sides lay out the same layers, so the sheet and its key draw the structure at one scale, in line
const reserve: PlotLayer[] = [...sheet, 'reactions', 'N', 'V', 'M']

const { numberFormat, units } = useLiveModel()
</script>

<template>
  <figure class="exercise not-prose @container my-10 text-left">
    <div class="grid overflow-hidden rounded-2xl border border-rule bg-paper @3xl:grid-cols-2">
      <section class="flex flex-col p-5">
        <header class="flex items-baseline justify-between gap-3">
          <h4 class="font-display text-lg font-semibold text-ink">{{ words.family(solved.problem.family) }}</h4>
          <NuxtLink :to="`${sitePath('/practice')}?p=${solved.problem.code}`" class="font-mono text-xs text-muted hover:text-ink" :title="t('exerciseGenerator.solveIt')">{{ solved.problem.code }}</NuxtLink>
        </header>
        <p class="mt-1 text-sm leading-relaxed text-ink-soft">{{ words.statement(solved.problem) + words.gap() + words.text(solved.problem.task) }}</p>
        <div class="mt-auto pt-3">
          <ClientOnly>
            <StructurePlot :solver="solved.solver" :layers="sheet" :reserve="reserve" reaction-labels="names" :reserve-reaction-labels="['names', 'values']" :max-height="320" :number-format="numberFormat" :units="units" :title="t('exerciseGenerator.exercise')" class="w-full" />
          </ClientOnly>
        </div>
      </section>
      <section class="flex flex-col border-t border-rule bg-mist p-5 @3xl:border-l @3xl:border-t-0">
        <header class="flex items-center justify-between gap-3">
          <h4 class="font-display text-lg font-semibold text-ink">{{ t('exerciseGenerator.key') }}</h4>
          <LiveResultSwitch v-if="!isTruss" v-model="result" :options="['moment', 'shear', 'normal']" />
        </header>
        <div class="mt-auto pt-3">
          <ClientOnly>
            <StructurePlot
              :solver="solved.solver"
              :layers="key"
              :reserve-reaction-labels="['names', 'values']"
              :reserve="reserve"
              :max-height="320"
              :number-format="numberFormat" :units="units"
              :title="t('exerciseGenerator.solution')"
              class="w-full"
            />
          </ClientOnly>
        </div>
      </section>
    </div>
    <figcaption class="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <i18n-t keypath="exerciseGenerator.caption" tag="span" scope="global">
        <template #exam>
          <NuxtLink :to="sitePath('/exam')" class="underline">{{ t('exerciseGenerator.exam') }}</NuxtLink>
        </template>
      </i18n-t>
      <button type="button" class="btn btn-quiet h-9 px-3.5 text-sm" @click="next">
        <Icon name="lucide:dices" class="size-4" />
        {{ t('exerciseGenerator.newExercise') }}
      </button>
    </figcaption>
  </figure>
</template>
