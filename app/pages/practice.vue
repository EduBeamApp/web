<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import type { Result } from '~/components/live/ResultSwitch.vue'
import {
  FAMILIES,
  FAMILY_IDS,
  isCorrect,
  makeProblem,
  newSeed,
  problemFromCode,
  solveProblem,
  type Answer,
  type FamilyId,
  type Solved,
} from '~/lib/problems'
import { PLOT, SOLVER } from '~/data/products'
import { SITE_URL } from '~/lib/site-urls'

/**
 * Statics practice: a problem from a seed, drawn as an exercise sheet, the student's answers
 * checked against the exact solution, then the diagrams. The problem's code is in the URL
 * (`/practice?p=H2048`, `/cs/practice?p=H2048`), so a teacher can assign one and a student can
 * share the one they are stuck on. Its words are `practice.*` and `problems.*` in the locale files;
 * in a language they are not translated into, its URL redirects to the English page.
 */
const { t } = useI18n()
const { sitePath } = useSitePages()
const redirecting = useEnglishFallback()
const words = useProblemText()
useSeoMeta({
  title: () => t('practice.seo.title'),
  description: () => t('practice.seo.description'),
  ogTitle: () => t('practice.seo.ogTitle'),
  ogDescription: () => t('practice.seo.ogDescription'),
})

const route = useRoute()
const router = useRouter()
const { numberFormat, openUrl } = useLiveModel()

// Per-browser conveniences: the families picked and the problems solved. Storage may be off.
const store = {
  get: <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private window or blocked storage: the page works without it
    }
  },
}

const BASIC = FAMILY_IDS.filter((f) => FAMILIES[f].level === 'basic')
const ADVANCED = FAMILY_IDS.filter((f) => FAMILIES[f].level === 'advanced')
const picked = ref<FamilyId[]>([...BASIC])
const solvedCodes = ref<string[]>([])

const current = shallowRef<Solved>()
const typed = reactive<Record<string, string>>({})
const checked = ref(false)
const revealed = ref(false)
const showHint = ref(false)
const codeInput = ref('')
const codeError = ref(false)

/** Said to a screen reader when the problem changes while the focus stays where it was */
const announcement = ref('')
const load = (code: string, push = true) => {
  const problem = problemFromCode(code)
  if (!problem) return false
  current.value = solveProblem(problem)
  announcement.value = t('practice.announce', { structure: words.family(problem.family), code: problem.code })
  for (const key of Object.keys(typed)) delete typed[key]
  checked.value = revealed.value = showHint.value = false
  result.value = defaultResult(problem.family)
  if (push && route.query.p !== problem.code) router.replace({ query: { p: problem.code } })
  return true
}

const next = () => {
  codeError.value = false
  const pool = picked.value.length ? picked.value : BASIC
  // Never the same family twice in a row when there is a choice
  const others = pool.filter((f) => f !== current.value?.problem.family)
  const family = (others.length ? others : pool)[Math.floor(Math.random() * (others.length || pool.length))]
  load(makeProblem(family, newSeed()).code)
}

/** From the answers form, the next problem starts where it is read: at its title */
const heading = ref<HTMLElement | null>(null)
const nextFromForm = async () => {
  next()
  await nextTick()
  heading.value?.focus()
}

// The structures menu closes as a menu does: on a click outside it, or Escape
const structures = useTemplateRef<HTMLDetailsElement>('structures')
const closeStructures = () => {
  if (structures.value) structures.value.open = false
}
onClickOutside(structures, closeStructures)
onKeyStroke('Escape', () => {
  if (structures.value?.open) {
    closeStructures()
    structures.value.querySelector('summary')?.focus()
  }
})

const toggle = (family: FamilyId) => {
  picked.value = picked.value.includes(family) ? picked.value.filter((f) => f !== family) : [...picked.value, family]
  store.set('edubeam.practice.families', picked.value)
}

const openCode = () => {
  codeError.value = !load(codeInput.value)
  if (!codeError.value) codeInput.value = ''
}

onMounted(() => {
  const saved = store.get<string[]>('edubeam.practice.families', [])
  const valid = saved.filter((f): f is FamilyId => (FAMILY_IDS as string[]).includes(f))
  if (valid.length) picked.value = valid
  solvedCodes.value = store.get<string[]>('edubeam.practice.solved', [])
  const code = typeof route.query.p === 'string' ? route.query.p : ''
  if (!code || !load(code, false)) next()
})
// Back and forward between problems
watch(
  () => route.query.p,
  (code) => {
    if (typeof code === 'string' && code !== current.value?.problem.code) load(code, false)
  }
)

/** "12,5", "12.5", "−3.2" and "-3.2" are all numbers here, in every language */
const parse = (raw: string | undefined): number | null => {
  if (!raw) return null
  const v = Number(raw.trim().replace(/\s/g, '').replace(/[−–]/g, '-').replace(',', '.'))
  return Number.isFinite(v) ? v : null
}

type Verdict = 'right' | 'sign' | 'wrong' | 'empty'
const verdict = (a: Answer): Verdict => {
  const v = parse(typed[a.id])
  if (v === null) return 'empty'
  if (isCorrect(a, v)) return 'right'
  return a.positive && Math.abs(a.value) > 0.05 && isCorrect(a, -v) ? 'sign' : 'wrong'
}
const verdicts = computed(() => Object.fromEntries((current.value?.answers ?? []).map((a) => [a.id, verdict(a)])))
const score = computed(() => {
  const all = Object.values(verdicts.value)
  return { right: all.filter((v) => v === 'right').length, total: all.length }
})
const allRight = computed(() => score.value.total > 0 && score.value.right === score.value.total)

/** Check, which turns into Next problem once the answers are in */
const primary = ref<HTMLButtonElement | null>(null)
const check = async () => {
  const from = document.activeElement instanceof HTMLElement ? document.activeElement : null
  checked.value = true
  if (allRight.value && current.value && !solvedCodes.value.includes(current.value.problem.code)) {
    solvedCodes.value = [...solvedCodes.value, current.value.problem.code]
    store.set('edubeam.practice.solved', solvedCodes.value)
  }
  // Drawing the verdict re-orders the form's nodes, which drops the keyboard focus: put it back,
  // or on Next problem once everything is right
  await nextTick()
  if (showSolution.value) primary.value?.focus()
  else if (document.activeElement !== from) from?.focus()
}
// The button that was pressed goes away with the answers shown, so the focus moves to the next step
const reveal = async () => {
  checked.value = true
  revealed.value = true
  await nextTick()
  primary.value?.focus()
}
// Editing an answer after a check asks for a new check
watch(typed, () => {
  if (!revealed.value) checked.value = false
})

/** The way a reaction counts as positive, drawn as the arrows on the problem are */
const directionIcon = (positive: Answer['positive']): string =>
  positive === '→' ? 'lucide:arrow-right' : positive === '↑' ? 'lucide:arrow-up' : 'lucide:rotate-ccw'
/** A support reaction, as opposed to a moment or a bar force: drawn on the problem as a named arrow */
const isReaction = (a: Answer) => a.positive === '→' || a.positive === '↑' || a.positive === '↺'

// In the language of the problem's words: 2.5 in English, 2,5 in Czech
const fmt = (v: number) =>
  new Intl.NumberFormat(words.locale.value, { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(v).replace('-', '−')
const POSITIVE = {
  '→': 'practice.positive.right',
  '↑': 'practice.positive.up',
  '↺': 'practice.positive.counterClockwise',
  tension: 'practice.positive.tension',
} as const satisfies Record<NonNullable<Answer['positive']>, string>
const direction = (a: Answer): string => t(a.positive ? POSITIVE[a.positive] : 'practice.positive.magnitude')

const showSolution = computed(() => revealed.value || (checked.value && allRight.value))

// The drawings: the sheet asks, the solution answers; both lay out the same layers, so they line up
const isTruss = computed(() => current.value?.problem.family === 'truss')
const isFrame = computed(() => ['threeHinged', 'portal'].includes(current.value?.problem.family ?? ''))
const defaultResult = (family: FamilyId): Result => (family === 'truss' ? 'normal' : 'moment')
const result = ref<Result>('moment')
const resultOptions = computed<Result[]>(() =>
  isTruss.value ? ['normal'] : isFrame.value ? ['moment', 'shear', 'normal'] : ['moment', 'shear', 'deformed']
)
const LAYER = { normal: 'N', shear: 'V', moment: 'M', deformed: 'w' } as const satisfies Record<Result, PlotLayer>
// The problem draws its unknown reactions, named as the answer fields are and pointing the way they
// count as positive; the solution writes their values
const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const solution = computed<PlotLayer[]>(() => ['members', 'supports', 'loads', 'reactions', 'nodeLabels', LAYER[result.value]])
const reserve: PlotLayer[] = [...sheet, 'reactions', 'N', 'V', 'M', 'w']

const appLink = computed(() =>
  current.value ? openUrl(current.value.solver, showOnly(LAYER[result.value], true)) : undefined
)
const shareLink = computed(() => (current.value ? `${SITE_URL}${sitePath('/practice')}?p=${current.value.problem.code}` : ''))
const copied = ref(false)
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
  } catch {
    // No clipboard here: the address bar holds the same link
    return
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div v-if="!redirecting" class="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6">
    <header class="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div class="lg:col-span-7">
        <h1 class="section-title text-balance text-ink">{{ t('practice.title') }}</h1>
        <p class="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{{ t('practice.lede') }}</p>
      </div>
      <i18n-t keypath="practice.codes" tag="p" scope="global" class="text-sm leading-relaxed text-muted lg:col-span-5">
        <template #code><span class="font-mono text-ink">H2048</span></template>
      </i18n-t>
    </header>

    <!-- What to practise, a code to open and a new problem: one row, so the problem starts right under it -->
    <div class="toolbar mt-8 border-y border-rule py-4">
      <details ref="structures" class="structures">
        <summary class="btn btn-quiet h-10 px-3.5 text-sm">
          <Icon name="lucide:shapes" class="size-4" aria-hidden="true" />
          {{ t('practice.structures.title') }}
          <span class="structures-count">{{ t('practice.structures.count', { picked: picked.length, total: FAMILY_IDS.length }) }}</span>
          <Icon name="lucide:chevron-down" class="structures-chevron size-4" aria-hidden="true" />
        </summary>
        <fieldset class="structures-panel">
          <legend class="sr-only">{{ t('practice.structures.legend') }}</legend>
          <div
            v-for="group in [{ name: t('practice.structures.determinate'), ids: BASIC }, { name: t('practice.structures.indeterminate'), ids: ADVANCED }]"
            :key="group.name"
            role="group"
            :aria-label="group.name"
          >
            <p class="structures-group" aria-hidden="true">{{ group.name }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in group.ids"
                :key="f"
                type="button"
                class="chip"
                :aria-pressed="picked.includes(f)"
                :title="words.family(f, 'skill')"
                @click="toggle(f)"
              >
                <Icon v-if="picked.includes(f)" name="lucide:check" class="size-3.5" aria-hidden="true" />
                {{ words.family(f) }}
              </button>
            </div>
          </div>
          <p class="text-xs text-muted">{{ t('practice.structures.note') }}</p>
        </fieldset>
      </details>
      <div class="flex flex-wrap items-center gap-2 sm:ml-auto">
        <form class="flex items-center gap-2" @submit.prevent="openCode">
          <label for="code" class="sr-only">{{ t('practice.code.label') }}</label>
          <input
            id="code"
            v-model="codeInput"
            class="field w-28 font-mono uppercase"
            :class="codeError && 'field--error'"
            :aria-invalid="codeError"
            :aria-describedby="codeError ? 'code-error' : undefined"
            :placeholder="t('practice.code.placeholder')"
            autocomplete="off"
            spellcheck="false"
            @input="codeError = false"
          />
          <button type="submit" class="btn btn-quiet h-10 px-3.5 text-sm">{{ t('practice.code.open') }}</button>
        </form>
        <button type="button" class="btn btn-primary h-10 px-4 text-sm" @click="next">
          <Icon name="lucide:dices" class="size-4" />
          {{ t('practice.newProblem') }}
        </button>
      </div>
    </div>
    <p v-if="codeError" id="code-error" class="mt-2 text-sm text-[color:var(--color-moment)]" role="alert">
      {{ t('practice.code.error') }}
    </p>

    <ClientOnly>
      <p class="sr-only" role="status">{{ announcement }}</p>
      <section v-if="current" class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <!-- The problem -->
        <div>
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 ref="heading" tabindex="-1" class="font-display text-2xl font-semibold text-ink outline-none">{{ words.family(current.problem.family) }}</h2>
            <button type="button" class="inline-flex items-center gap-1.5 font-mono text-sm text-muted hover:text-ink" :title="shareLink" @click="copyLink">
              {{ current.problem.code }}
              <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-3.5" />
              <span class="font-sans" aria-live="polite">{{ t(copied ? 'practice.linkCopied' : 'practice.copyLink') }}</span>
            </button>
          </div>
          <p class="mt-2 text-pretty leading-relaxed text-ink-soft">{{ words.statement(current.problem) }}</p>
          <p class="mt-1 font-medium text-ink">{{ words.text(current.problem.task) }}</p>

          <figure class="live-canvas mt-5 px-3 py-3">
            <StructurePlot
              :key="current.problem.code"
              :solver="current.solver"
              :layers="showSolution ? solution : sheet"
              :reserve="reserve"
              :reaction-labels="showSolution ? 'values' : 'names'"
              :reserve-reaction-labels="['names', 'values']"
              :max-height="380"
              :number-format="numberFormat"
              :title="words.statement(current.problem)"
              :hover="showSolution"
              class="w-full"
            />
            <div v-if="showSolution" class="live-controls -mx-3 -mb-3 mt-3">
              <LiveResultSwitch v-if="resultOptions.length > 1" v-model="result" :options="resultOptions" />
              <span v-else class="text-sm text-muted">{{ t('practice.barForces') }}</span>
              <a :href="appLink" target="_blank" rel="noopener" class="live-open">
                {{ t('components.openInApp') }}
                <Icon name="lucide:arrow-up-right" class="size-3.5" />
              </a>
            </div>
          </figure>
        </div>

        <!-- The answers -->
        <form class="answers" @submit.prevent="showSolution ? nextFromForm() : check()">
          <h3 class="font-display text-lg font-semibold text-ink">{{ t('practice.answers.title') }}</h3>
          <p class="mt-1 text-sm text-muted">{{ t('practice.answers.note') }}</p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="a in current.answers" :key="a.id" class="answer" :data-verdict="checked ? verdicts[a.id] : undefined">
              <!-- A reaction looks as it does on the drawing: its name in the reactions' colour, its arrow beside it -->
              <label :for="`a-${a.id}`" class="answer-symbol" :class="isReaction(a) && 'answer-symbol--reaction'" :title="words.text(a.label)">
                <i>{{ a.symbol[0] }}</i><sub>{{ a.symbol[1] }}</sub>
              </label>
              <span class="answer-dir" :class="isReaction(a) && 'answer-dir--reaction'" :title="direction(a)">
                <Icon v-if="isReaction(a)" :name="directionIcon(a.positive)" class="size-[1.15rem]" aria-hidden="true" />
                <template v-else>{{ a.positive === 'tension' ? '+T' : '' }}</template>
              </span>
              <input
                :id="`a-${a.id}`"
                v-model="typed[a.id]"
                class="field answer-input"
                inputmode="decimal"
                autocomplete="off"
                :aria-label="t('practice.answers.field', { label: words.text(a.label), direction: direction(a), unit: a.unit })"
                :aria-describedby="`m-${a.id}`"
                :readonly="revealed"
              />
              <span class="text-sm text-muted">{{ a.unit }}</span>
              <!-- Read with its field; the summary under the fields is what is announced -->
              <span :id="`m-${a.id}`" class="answer-mark">
                <template v-if="checked && verdicts[a.id] === 'right'"><Icon name="lucide:check" class="size-4" /><span class="sr-only">{{ t('practice.mark.correct') }}</span></template>
                <template v-else-if="revealed"><span class="sr-only">{{ t('practice.mark.exact') }} </span>{{ fmt(a.value) }}</template>
                <template v-else-if="checked && verdicts[a.id] === 'sign'"><span aria-hidden="true">{{ t('practice.mark.sign') }}</span><span class="sr-only">{{ t('practice.mark.signLong') }}</span></template>
                <template v-else-if="checked && verdicts[a.id] === 'wrong'"><Icon name="lucide:x" class="size-4" /><span class="sr-only">{{ t('practice.mark.wrong') }}</span></template>
              </span>
            </li>
          </ul>

          <p v-if="checked && !revealed" class="verdict" :class="allRight && 'verdict--right'" role="status">
            <template v-if="allRight">{{ t('practice.verdict.allRight') }}</template>
            <template v-else-if="Object.values(verdicts).includes('sign')">
              {{ t('practice.verdict.sign', { right: score.right, total: score.total, sign: t('practice.mark.sign') }) }}
            </template>
            <template v-else>{{ t('practice.verdict.some', { right: score.right, total: score.total }) }}</template>
          </p>
          <p v-if="revealed" class="verdict" role="status">{{ t('practice.verdict.revealed') }}</p>

          <div class="mt-5 flex flex-wrap gap-2.5">
            <!-- One submit button that turns from Check into Next problem, so the keyboard focus stays on it -->
            <button ref="primary" type="submit" class="btn btn-primary h-10 px-4 text-sm">
              <template v-if="showSolution">
                <Icon name="lucide:dices" class="size-4" />
                {{ t('practice.nextProblem') }}
              </template>
              <template v-else>{{ t('practice.check') }}</template>
            </button>
            <button type="button" class="btn btn-quiet h-10 px-3.5 text-sm" :aria-expanded="showHint" aria-controls="hint" @click="showHint = !showHint">
              <Icon name="lucide:lightbulb" class="size-4" />
              {{ t('practice.hint') }}
            </button>
            <button v-if="!showSolution" type="button" class="btn btn-quiet h-10 px-3.5 text-sm" @click="reveal">{{ t('practice.showAnswers') }}</button>
          </div>
          <p v-if="showHint" id="hint" class="hint">{{ words.family(current.problem.family, 'hint') }}</p>

          <p v-if="solvedCodes.length" class="mt-6 border-t border-rule pt-4 text-sm text-muted">
            {{ t('practice.solved', { n: solvedCodes.length }, solvedCodes.length) }}
          </p>
        </form>
      </section>
      <template #fallback>
        <div class="mt-8 h-[28rem] rounded-2xl border border-rule bg-mist" aria-hidden="true" />
      </template>
    </ClientOnly>

    <section class="mt-20 grid gap-10 border-t border-rule pt-10 md:grid-cols-3">
      <div>
        <h2 class="font-display text-lg font-semibold text-ink">{{ t('practice.about.answers.title') }}</h2>
        <i18n-t keypath="practice.about.answers.body" tag="p" scope="global" class="mt-2 text-sm leading-relaxed text-muted">
          <template #solver>
            <NuxtLink :to="sitePath('/solver')" class="text-[color:var(--link)] hover:underline">{{ SOLVER.name }}</NuxtLink>
          </template>
          <template #plot>
            <NuxtLink :to="sitePath('/plot')" class="text-[color:var(--link)] hover:underline">{{ PLOT.name }}</NuxtLink>
          </template>
        </i18n-t>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold text-ink">{{ t('practice.about.signs.title') }}</h2>
        <i18n-t keypath="practice.about.signs.body" tag="p" scope="global" class="mt-2 text-sm leading-relaxed text-muted">
          <template #conventions>
            <NuxtLink :to="sitePath('/elements/conventions')" class="text-[color:var(--link)] hover:underline">{{ t('practice.about.signs.conventions') }}</NuxtLink>
          </template>
        </i18n-t>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold text-ink">{{ t('practice.about.teachers.title') }}</h2>
        <i18n-t keypath="practice.about.teachers.body" tag="p" scope="global" class="mt-2 text-sm leading-relaxed text-muted">
          <template #exam>
            <NuxtLink :to="sitePath('/exam')" class="text-[color:var(--link)] hover:underline">{{ t('practice.about.teachers.exam') }}</NuxtLink>
          </template>
        </i18n-t>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* One row: the structures menu on the left, the code and New problem on the right */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.structures {
  position: relative;
}
.structures > summary {
  list-style: none;
}
.structures > summary::-webkit-details-marker {
  display: none;
}
.structures-count {
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--brand), transparent 88%);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.structures-chevron {
  transition: transform 0.15s ease;
}
.structures[open] .structures-chevron {
  transform: rotate(180deg);
}
.structures-panel {
  display: grid;
  gap: 0.9rem;
  margin-top: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--rule);
  border-radius: 0.75rem;
  background: var(--paper);
  box-shadow: 0 12px 32px rgb(20 20 60 / 0.14);
}
/* On a wider screen the panel opens over the page, as a menu does; on a phone it pushes it down */
@media (min-width: 640px) {
  .structures-panel {
    position: absolute;
    z-index: 20;
    left: 0;
    width: min(34rem, calc(100vw - 3rem));
  }
}
.structures-group {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 2rem;
  padding: 0 0.8rem;
  border: 1px solid var(--rule);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--muted);
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}
.chip:hover {
  color: var(--ink);
}
.chip[aria-pressed='true'] {
  border-color: color-mix(in oklab, var(--brand), transparent 55%);
  background: color-mix(in oklab, var(--brand), transparent 88%);
  color: var(--ink);
}
.chip:focus-visible,
.field:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.field {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--rule);
  border-radius: 0.5rem;
  background: var(--paper);
  color: var(--ink);
}
.field::placeholder {
  color: var(--muted);
  text-transform: none;
}
.field--error {
  border-color: var(--color-moment);
}

.answers {
  align-self: start;
  padding: 1.25rem 1.25rem 1.5rem;
  border: 1px solid var(--rule);
  border-radius: 1rem;
  background: var(--mist);
}
.dark .answers {
  background: var(--sheet);
}

.answer {
  display: grid;
  grid-template-columns: 3.5rem 1.25rem minmax(0, 1fr) 2.25rem 3.75rem;
  align-items: center;
  gap: 0.5rem;
}
.answer-symbol {
  font-family: KaTeX_Main, Georgia, serif;
  font-size: 1.15rem;
  color: var(--ink);
  white-space: nowrap;
}
.answer-symbol i {
  font-family: KaTeX_Math, Georgia, serif;
}
/* As the drawing names it: semibold italic in the reactions' colour */
.answer-symbol--reaction,
.answer-symbol--reaction i {
  font-family: var(--font-sans);
  font-weight: 600;
  color: var(--color-reaction);
}
.answer-dir.answer-dir--reaction {
  display: inline-flex;
  justify-content: center;
  color: var(--color-reaction);
}
.answer-symbol sub {
  font-size: 0.7em;
  margin-left: 0.05em;
}
.answer-dir {
  text-align: center;
  font-size: 1rem;
  color: var(--muted);
}
.answer-input {
  width: 100%;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.answer-mark {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.answer[data-verdict='right'] .answer-input {
  border-color: var(--color-shear);
}
.answer[data-verdict='right'] .answer-mark {
  color: var(--color-shear);
}
.answer[data-verdict='wrong'] .answer-input,
.answer[data-verdict='sign'] .answer-input {
  border-color: var(--color-moment);
}
.answer[data-verdict='wrong'] .answer-mark,
.answer[data-verdict='sign'] .answer-mark {
  color: var(--color-moment);
}

.verdict {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--ink-soft, var(--ink));
}
.verdict--right {
  color: var(--color-shear);
  font-weight: 600;
}
.hint {
  margin-top: 1rem;
  padding: 0.75rem 0.9rem;
  border-left: 2px solid var(--brand);
  border-radius: 0 0.5rem 0.5rem 0;
  background: var(--paper);
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--ink-soft, var(--ink));
}
</style>
