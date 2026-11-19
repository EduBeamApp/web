<script setup lang="ts">
import { PRINT_COLORS, structureSvg, type PlotLayer } from '@edubeam/plot'
import { strToU8, zipSync } from 'fflate'
import {
  examSeed,
  FAMILIES,
  FAMILY_IDS,
  makeProblem,
  newSeed,
  solveProblem,
  type Answer,
  type FamilyId,
  type Solved,
} from '~/lib/problems'

/**
 * The exam builder: test papers of generated problems, a different version for each student, and
 * an answer key, printed from the browser or saved as PDF. Every version has the same kinds of
 * structure in the same order, with its own numbers, so the papers are equally hard.
 *
 * The settings are the URL (`/exam?e=4821&n=3&v=20&f=SOH`, the same under `/cs/exam`): bookmark
 * it, and the same papers and key come back. Its words are `exam.*` and `problems.*` in the locale
 * files; in a language they are not translated into, its URL redirects to the English page.
 */
const { t } = useI18n()
const { sitePath } = useSitePages()
const redirecting = useEnglishFallback()
const words = useProblemText()
useSeoMeta({
  title: () => t('exam.seo.title'),
  description: () => t('exam.seo.description'),
  ogTitle: () => t('exam.seo.ogTitle'),
  ogDescription: () => t('exam.seo.ogDescription'),
})

const route = useRoute()
const router = useRouter()

const LETTER = Object.fromEntries(FAMILY_IDS.map((f) => [FAMILIES[f].letter, f])) as Record<string, FamilyId>
const DEFAULT_SLOTS: FamilyId[] = ['simple', 'overhang', 'threeHinged']
const MAX_PROBLEMS = 6

const settings = reactive({
  title: t('exam.defaultTitle'),
  subtitle: '',
  seed: 0,
  versions: 1,
  /** The kind of structure of each problem, in order: every version has these, with its own numbers */
  slots: [...DEFAULT_SLOTS] as FamilyId[],
  key: true,
  codes: false,
  working: true,
  name: true,
})

const clamp = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback
}
const flag = (v: unknown, fallback: boolean) => (v === '1' ? true : v === '0' ? false : fallback)

onMounted(() => {
  const q = route.query
  if (typeof q.t === 'string') settings.title = q.t
  if (typeof q.s === 'string') settings.subtitle = q.s
  settings.seed = clamp(q.e, 1, 999999, newSeed())
  settings.versions = clamp(q.v, 1, 40, 1)
  // `f` is the kinds in order, `n` the number of problems. A link from before the problems were
  // listed one by one may give fewer kinds than problems: they repeat in order, the papers it made.
  const kinds = typeof q.f === 'string' ? [...q.f.toUpperCase()].map((l) => LETTER[l]).filter((f): f is FamilyId => !!f) : []
  if (kinds.length) {
    const n = clamp(q.n, 1, MAX_PROBLEMS, Math.min(kinds.length, MAX_PROBLEMS))
    settings.slots = Array.from({ length: n }, (_, i) => kinds[i % kinds.length])
  }
  settings.key = flag(q.k, true)
  settings.codes = flag(q.c, false)
  settings.working = flag(q.w, true)
  settings.name = flag(q.m, true)
  ready.value = true
})
const ready = ref(false)

// The URL follows the settings, so the page can be bookmarked or sent to a colleague
watch(
  settings,
  () => {
    if (!ready.value) return
    router.replace({
      query: {
        t: settings.title,
        ...(settings.subtitle ? { s: settings.subtitle } : {}),
        e: String(settings.seed),
        n: String(settings.slots.length),
        v: String(settings.versions),
        f: settings.slots.map((f) => FAMILIES[f].letter).join(''),
        k: settings.key ? '1' : '0',
        c: settings.codes ? '1' : '0',
        w: settings.working ? '1' : '0',
        m: settings.name ? '1' : '0',
      },
    })
  },
  { deep: true }
)

/*
 * What the number fields hold while being typed - empty, 0, 400 - is not what is built: the papers
 * use the value within range, and the field is set to it once the teacher leaves it.
 */
const versionCount = computed(() => clamp(settings.versions, 1, 40, 1))
const examNumber = computed(() => clamp(settings.seed, 1, 999999, 1))
const settle = () => {
  settings.versions = versionCount.value
  settings.seed = examNumber.value
}

const BASIC = FAMILY_IDS.filter((f) => FAMILIES[f].level === 'basic')
const ADVANCED = FAMILY_IDS.filter((f) => FAMILIES[f].level === 'advanced')

/** A new problem takes the first kind not on the paper yet, so a test covers more ground */
const addProblem = () => {
  if (settings.slots.length >= MAX_PROBLEMS) return
  settings.slots.push(FAMILY_IDS.find((f) => !settings.slots.includes(f)) ?? FAMILY_IDS[0])
  nextTick(() => document.getElementById(`slot-${settings.slots.length - 1}`)?.focus())
}
const removeProblem = (i: number) => {
  if (settings.slots.length <= 1) return
  settings.slots.splice(i, 1)
  nextTick(() => document.getElementById(`slot-${Math.min(i, settings.slots.length - 1)}`)?.focus())
}

interface Paper {
  readonly version: number
  readonly problems: readonly { solved: Solved; sheet: string; key: string }[]
}

// The paper draws the unknown reactions, named and pointing the way they count as positive
const SHEET: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const keyLayers = (s: Solved): PlotLayer[] => ['members', 'supports', 'reactions', 'nodeLabels', s.problem.family === 'truss' ? 'N' : 'M']
const { units } = useLiveModel()
// In the language of the problems' words: 2.5 in English, 2,5 in Czech
const numberFormat = computed(
  () => new Intl.NumberFormat(words.locale.value, { maximumSignificantDigits: 4, maximumFractionDigits: 0, roundingPriority: 'morePrecision' })
)
// Each drawing makes room for its own layers only: the paper and its key are on different pages
const svgOptions = (title: string, layers: PlotLayer[], reactionLabels: 'values' | 'names' = 'values') => ({
  layers,
  reactionLabels,
  width: 640,
  maxHeight: 280,
  numberFormat: numberFormat.value,
  units: units.value,
  colors: PRINT_COLORS,
  background: false,
  fontFamily: "'IBM Plex Sans', Arial, sans-serif",
  title,
})

/** Slot i of every version is the same kind of structure, so the versions are equally hard */
const papers = computed<Paper[]>(() => {
  if (!ready.value) return []
  return Array.from({ length: versionCount.value }, (_, v) => ({
    version: v + 1,
    problems: settings.slots.map((family, i) => {
      const solved = solveProblem(makeProblem(family, examSeed(examNumber.value, v + 1, i)))
      const name = `${words.family(family)}, ${solved.problem.code}`
      return {
        solved,
        sheet: structureSvg(solved.model, svgOptions(name, SHEET, 'names')),
        key: structureSvg(solved.model, svgOptions(t('exam.solutionFigure', { name }), keyLayers(solved))),
      }
    }),
  }))
})

const fmt = (v: number) => numberFormat.value.format(Math.abs(v) < 5e-7 ? 0 : v).replace('-', '−')
const positive = (p: NonNullable<Answer['positive']>): string => (p === 'tension' ? t('exam.tension') : p)

/** What will print, in a line */
const summary = computed(() => {
  const n = settings.slots.length
  const papers = t('exam.summary.papers', { n: versionCount.value }, versionCount.value)
  const problems = t('exam.summary.problems', { n }, n)
  const key = settings.key ? (versionCount.value === 1 ? 'withKey' : 'withKeys') : 'plain'
  return t(`exam.summary.${key}`, { papers, problems })
})

const print = () => window.print()

/** With 20 or 40 papers, the one a student asks about is a pick away instead of a long scroll */
const jumpTo = (event: Event) => {
  const select = event.target
  if (!(select instanceof HTMLSelectElement) || !select.value) return
  const paper = document.getElementById(select.value)
  const toolbar = select.closest('.toolbar')
  select.value = ''
  if (!paper || !toolbar) return
  // The paper goes just under the toolbar where it sticks, one or two rows high depending on the width
  const under = parseFloat(getComputedStyle(toolbar).top) + toolbar.getBoundingClientRect().height + 16
  window.scrollTo({ top: window.scrollY + paper.getBoundingClientRect().top - under, behavior: 'instant' })
}

const download = () => {
  const files: Record<string, Uint8Array> = {}
  const rows = [['version', 'problem', 'code', 'structure', 'quantity', 'positive', 'value', 'unit']]
  for (const paper of papers.value) {
    const dir = `version-${String(paper.version).padStart(2, '0')}`
    paper.problems.forEach(({ solved, sheet, key }, i) => {
      files[`${dir}/problem-${i + 1}-${solved.problem.code}.svg`] = strToU8(sheet)
      files[`${dir}/problem-${i + 1}-${solved.problem.code}-key.svg`] = strToU8(key)
      for (const a of solved.answers) {
        rows.push([
          String(paper.version),
          String(i + 1),
          solved.problem.code,
          words.family(solved.problem.family),
          `${a.symbol[0]}${a.symbol[1]}`,
          a.positive ?? 'magnitude',
          String(a.value),
          a.unit,
        ])
      }
    })
  }
  files['answers.csv'] = strToU8(rows.map((r) => r.map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n') + '\n')
  const blob = new Blob([zipSync(files)], { type: 'application/zip' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  // Accents dropped, so a Czech title makes a plain file name too
  const name = settings.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  a.download = `${name.replace(/[^\w-]+/g, '-').toLowerCase() || 'exam'}-${examNumber.value}.zip`
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <main v-if="!redirecting" class="exam-page mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6">
    <header class="no-print max-w-3xl">
      <h1 class="section-title text-balance text-ink">{{ t('exam.title') }}</h1>
      <p class="mt-3 text-pretty leading-relaxed text-muted">{{ t('exam.lede') }}</p>
    </header>

    <div class="mt-8 grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-10">
      <!-- Settings -->
      <aside class="no-print min-w-0">
        <!-- From lg up the panel fits the window and its settings scroll on their own -->
        <div class="panel">
          <form class="settings" @submit.prevent>
            <label class="setting">
              <span>{{ t('exam.settings.title') }}</span>
              <input v-model="settings.title" class="field" maxlength="80" />
            </label>
            <label class="setting">
              <span>{{ t('exam.settings.subtitle') }}</span>
              <input v-model="settings.subtitle" class="field" :placeholder="t('exam.settings.subtitlePlaceholder')" maxlength="120" />
            </label>

            <fieldset class="setting">
              <legend>{{ t('exam.settings.problems') }}</legend>
              <ol class="slots">
                <li v-for="(f, i) in settings.slots" :key="i" class="slot">
                  <span class="slot-no" aria-hidden="true">{{ i + 1 }}</span>
                  <label :for="`slot-${i}`" class="sr-only">{{ t('exam.settings.problem', { n: i + 1 }) }}</label>
                  <select :id="`slot-${i}`" v-model="settings.slots[i]" class="field slot-select text-sm">
                    <optgroup :label="t('exam.settings.determinate')">
                      <option v-for="k in BASIC" :key="k" :value="k">{{ words.family(k) }}</option>
                    </optgroup>
                    <optgroup :label="t('exam.settings.indeterminate')">
                      <option v-for="k in ADVANCED" :key="k" :value="k">{{ words.family(k) }}</option>
                    </optgroup>
                  </select>
                  <button
                    type="button"
                    class="slot-remove"
                    :disabled="settings.slots.length === 1"
                    :aria-label="t('exam.settings.remove', { n: i + 1 })"
                    :title="t('exam.settings.remove', { n: i + 1 })"
                    @click="removeProblem(i)"
                  >
                    <Icon name="lucide:x" class="size-4" />
                  </button>
                </li>
              </ol>
              <button type="button" class="btn btn-quiet mt-1 h-9 justify-start px-3 text-sm" :disabled="settings.slots.length >= MAX_PROBLEMS" @click="addProblem">
                <Icon name="lucide:plus" class="size-4" />
                {{ t('exam.settings.add') }}
              </button>
              <small>{{ t('exam.settings.problemsNote', { max: MAX_PROBLEMS }) }}</small>
            </fieldset>

            <label class="setting">
              <span>{{ t('exam.settings.versions') }}</span>
              <input v-model.number="settings.versions" class="field w-28" type="number" min="1" max="40" @change="settle" />
              <small>{{ t('exam.settings.versionsNote', { max: 40 }) }}</small>
            </label>

            <div class="setting">
              <label for="exam-number" class="setting-label">{{ t('exam.settings.number') }}</label>
              <div class="flex gap-2">
                <input
                  id="exam-number"
                  v-model.number="settings.seed"
                  class="field min-w-0 flex-1 font-mono"
                  type="number"
                  min="1"
                  max="999999"
                  aria-describedby="exam-number-note"
                  @change="settle"
                />
                <button type="button" class="btn btn-quiet h-10 px-3 text-sm" :title="t('exam.settings.newNumberTitle')" @click="settings.seed = newSeed()">
                  <Icon name="lucide:dices" class="size-4" />
                  {{ t('exam.settings.newNumber') }}
                </button>
              </div>
              <small id="exam-number-note">{{ t('exam.settings.numberNote') }}</small>
            </div>

            <fieldset class="setting space-y-2">
              <legend>{{ t('exam.settings.onPapers') }}</legend>
              <label class="check"><input v-model="settings.name" type="checkbox" /> {{ t('exam.settings.nameLine') }}</label>
              <label class="check"><input v-model="settings.working" type="checkbox" /> {{ t('exam.settings.working') }}</label>
              <label class="check"><input v-model="settings.key" type="checkbox" /> {{ t('exam.settings.key') }}</label>
              <label class="check">
                <input v-model="settings.codes" type="checkbox" />
                <span>
                  {{ t('exam.settings.codes') }}
                  <i18n-t keypath="exam.settings.codesNote" tag="small" scope="global" class="block">
                    <template #practice>
                      <NuxtLink :to="sitePath('/practice')" class="underline">{{ t('exam.settings.practicePage') }}</NuxtLink>
                    </template>
                  </i18n-t>
                </span>
              </label>
            </fieldset>

            <small>{{ t('exam.zipNote') }}</small>
          </form>
        </div>
      </aside>

      <!-- The papers, as they print -->
      <div class="min-w-0">
        <!-- What will print and the two ways out, on top of the papers whatever is scrolled -->
        <div class="toolbar no-print">
          <p class="summary" aria-live="polite">{{ summary }}</p>
          <!-- One row on a phone too, so the toolbar does not cover a quarter of the screen -->
          <div class="flex w-full gap-2 sm:w-auto">
            <ClientOnly>
              <select v-if="versionCount > 1" class="field jump min-w-0 flex-1 text-sm sm:flex-none" :aria-label="t('exam.jump.label')" @change="jumpTo">
                <option value="" selected>{{ t('exam.jump.placeholder') }}</option>
                <optgroup :label="t('exam.jump.papers')">
                  <option v-for="paper in papers" :key="paper.version" :value="`version-${paper.version}`">{{ t('exam.version', { n: paper.version }) }}</option>
                </optgroup>
                <optgroup v-if="settings.key" :label="t('exam.jump.keys')">
                  <option v-for="paper in papers" :key="paper.version" :value="`key-${paper.version}`">{{ t('exam.jump.key', { n: paper.version }) }}</option>
                </optgroup>
              </select>
            </ClientOnly>
            <button type="button" class="btn btn-quiet h-10 px-3.5 text-sm" :title="t('exam.downloadTitle')" @click="download">
              <Icon name="lucide:download" class="size-4" />
              <span class="max-sm:sr-only">{{ t('exam.download') }}</span>
            </button>
            <button type="button" class="btn btn-primary h-10 px-4 text-sm" @click="print">
              <Icon name="lucide:printer" class="size-4" />
              <span class="sm:hidden">{{ t('exam.print') }}</span>
              <span class="max-sm:hidden">{{ t('exam.printLong') }}</span>
            </button>
          </div>
        </div>
        <div id="papers">
          <ClientOnly>
            <template v-for="paper in papers" :key="paper.version">
              <article :id="`version-${paper.version}`" class="paper">
                <header class="paper-head">
                  <div>
                    <h2 class="paper-title">{{ settings.title }}</h2>
                    <p v-if="settings.subtitle" class="paper-sub">{{ settings.subtitle }}</p>
                  </div>
                  <div class="paper-meta">
                    <p v-if="versionCount > 1">{{ t('exam.version', { n: paper.version }) }}</p>
                    <p v-if="settings.name" class="paper-name">{{ t('exam.paper.name') }} <span /></p>
                  </div>
                </header>
                <p class="paper-rules">{{ t('exam.paper.rules') }}</p>

                <section v-for="(p, i) in paper.problems" :key="p.solved.problem.code" class="problem">
                  <h3>
                    <span class="problem-no">{{ i + 1 }}</span>
                    {{ words.family(p.solved.problem.family) }}
                    <span v-if="settings.codes" class="problem-code">{{ p.solved.problem.code }}</span>
                  </h3>
                  <p>{{ words.statement(p.solved.problem) + words.gap() }}<strong>{{ words.text(p.solved.problem.task) }}</strong></p>
                  <!-- eslint-disable-next-line vue/no-v-html -- our own SVG, made by structureSvg from numbers -->
                  <div class="problem-figure" v-html="p.sheet" />
                  <div v-if="settings.working" class="problem-working" aria-hidden="true" />
                  <ul class="problem-answers">
                    <li v-for="a in p.solved.answers" :key="a.id">
                      <span class="sym"><i>{{ a.symbol[0] }}</i><sub>{{ a.symbol[1] }}</sub></span>
                      <span v-if="a.positive" class="dir">{{ positive(a.positive) }}</span>
                      <span class="blank" />
                      <span class="unit">{{ t(`problems.unit.${a.unit}`) }}</span>
                    </li>
                  </ul>
                  <p v-if="settings.codes" class="problem-check">
                    {{ t('exam.paper.check', { url: `edubeam.app${sitePath('/practice')}?p=${p.solved.problem.code}` }) }}
                  </p>
                </section>
              </article>
            </template>

            <template v-if="settings.key">
              <article v-for="paper in papers" :id="`key-${paper.version}`" :key="`key-${paper.version}`" class="paper paper--key">
                <header class="paper-head">
                  <div>
                    <h2 class="paper-title">{{ t('exam.key.title') }}</h2>
                    <p class="paper-sub">{{ versionCount > 1 ? t('exam.key.version', { title: settings.title, n: paper.version }) : settings.title }}</p>
                  </div>
                  <div class="paper-meta"><p>{{ t('exam.key.exam', { n: examNumber }) }}</p></div>
                </header>
                <section v-for="(p, i) in paper.problems" :key="p.solved.problem.code" class="problem problem--key">
                  <h3>
                    <span class="problem-no">{{ i + 1 }}</span>
                    {{ words.family(p.solved.problem.family) }}
                    <span class="problem-code">{{ p.solved.problem.code }}</span>
                  </h3>
                  <div class="key-grid">
                    <table class="key-table">
                      <tbody>
                        <tr v-for="a in p.solved.answers" :key="a.id">
                          <th><i>{{ a.symbol[0] }}</i><sub>{{ a.symbol[1] }}</sub></th>
                          <td class="num">{{ fmt(a.value) }}</td>
                          <td>{{ t(`problems.unit.${a.unit}`) }}</td>
                          <td class="dir">{{ a.positive ? positive(a.positive) : '' }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- eslint-disable-next-line vue/no-v-html -- our own SVG, made by structureSvg from numbers -->
                    <div class="problem-figure" v-html="p.key" />
                  </div>
                </section>
              </article>
            </template>
            <template #fallback>
              <div class="paper h-[60rem]" aria-hidden="true" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--rule);
  border-radius: 1rem;
  background: var(--mist);
}
.dark .panel {
  background: var(--sheet);
}
@media (min-width: 1024px) {
  .panel {
    position: sticky;
    top: 6rem;
    max-height: calc(100dvh - 7rem);
  }
}
.settings {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.25rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}
/* Under the site header, over the papers as they scroll by */
.toolbar {
  position: sticky;
  top: 4rem;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin: 0 auto 1.5rem;
  max-width: 210mm;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
}
.summary {
  font-size: 0.85rem;
  color: var(--muted);
}
.setting {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}
.setting > span,
.setting > .setting-label,
.setting > legend {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink);
}
.settings small {
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--muted);
}
.check {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.9rem;
  color: var(--ink);
}
.check input {
  margin-top: 0.2rem;
  accent-color: var(--brand);
}
.field {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--rule);
  border-radius: 0.5rem;
  background: var(--paper);
  color: var(--ink);
}
.slots {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.slot {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.slot-no {
  width: 1.1rem;
  flex: none;
  text-align: right;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
}
.slot-select {
  flex: 1;
  min-width: 0;
  padding: 0 0.25rem 0 0.6rem;
}
.slot-remove {
  display: grid;
  place-items: center;
  flex: none;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  color: var(--muted);
}
.slot-remove:hover:not(:disabled) {
  background: color-mix(in oklab, var(--ink), transparent 92%);
  color: var(--ink);
}
.slot-remove:disabled {
  opacity: 0.35;
}
.jump {
  height: 2.5rem;
  padding-right: 0.5rem;
}
.slot-remove:focus-visible,
.field:focus-visible,
.check input:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

/*
 * The paper: A4 proportions on screen, real A4 in print, always black on white whatever the
 * site's theme.
 */
.paper {
  --ink: #16162a;
  --muted: #5b5b6e;
  --rule: #cfd0da;
  color: var(--ink);
  max-width: 210mm;
  margin: 0 auto 2rem;
  padding: 16mm 16mm 18mm;
  background: #fff;
  border-radius: 0.25rem;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.08),
    0 8px 28px rgb(20 20 60 / 0.1);
  font-family: 'IBM Plex Sans', Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.45;
}
.paper-head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 4mm;
  border-bottom: 1.5px solid var(--ink);
}
.paper-title {
  font-family: Barlow, 'IBM Plex Sans', Arial, sans-serif;
  font-size: 19pt;
  font-weight: 700;
  line-height: 1.1;
}
.paper-sub {
  margin-top: 1mm;
  color: var(--muted);
}
.paper-meta {
  text-align: right;
  white-space: nowrap;
}
.paper-name {
  display: flex;
  align-items: flex-end;
  gap: 2mm;
  margin-top: 3mm;
}
.paper-name span {
  display: inline-block;
  width: 60mm;
  border-bottom: 1px solid var(--ink);
}
.paper-rules {
  margin-top: 3mm;
  font-size: 9pt;
  color: var(--muted);
}

.problem {
  margin-top: 6mm;
  break-inside: avoid;
}
.problem h3 {
  display: flex;
  align-items: baseline;
  gap: 2.5mm;
  font-weight: 700;
  font-size: 11.5pt;
}
.problem-no {
  display: inline-grid;
  place-items: center;
  min-width: 6mm;
  height: 6mm;
  border: 1.25px solid var(--ink);
  border-radius: 999px;
  font-size: 9pt;
}
.problem-code {
  margin-left: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9pt;
  font-weight: 500;
  color: var(--muted);
}
.problem p {
  margin-top: 1.5mm;
}
.problem-figure {
  margin: 2mm auto 0;
  max-width: 140mm;
}
.problem-figure :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}
.problem-working {
  height: 34mm;
  margin-top: 3mm;
  border: 1px solid var(--rule);
  border-radius: 1.5mm;
  background-image: radial-gradient(circle, #c8c9d4 0.6px, transparent 0.7px);
  background-size: 5mm 5mm;
  background-position: 2.5mm 2.5mm;
}
.problem-answers {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm 7mm;
  margin-top: 3mm;
}
.problem-answers li {
  display: flex;
  align-items: flex-end;
  gap: 1.5mm;
}
.sym,
.key-table th {
  font-family: KaTeX_Main, 'Times New Roman', serif;
  font-size: 11.5pt;
  font-weight: 400;
  white-space: nowrap;
}
.sym i,
.key-table th i {
  font-family: KaTeX_Math, 'Times New Roman', serif;
}
.sym sub,
.key-table sub {
  font-size: 0.7em;
}
.dir {
  font-size: 9pt;
  color: var(--muted);
}
.blank {
  display: inline-block;
  width: 20mm;
  border-bottom: 1px solid var(--ink);
}
.unit {
  font-size: 9pt;
}
.problem-check {
  font-size: 8.5pt;
  color: var(--muted);
}

.key-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 6mm;
  margin-top: 2mm;
}
.key-table td,
.key-table th {
  padding: 0.6mm 2mm 0.6mm 0;
  text-align: left;
}
.key-table .num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  padding-left: 3mm;
}
.problem--key .problem-figure {
  margin: 0;
}

/* On a phone the paper is a preview: narrower margins, and the header and key stack */
@media screen and (max-width: 640px) {
  .paper {
    padding: 7mm 5mm 8mm;
    font-size: 9.5pt;
  }
  .paper-head {
    flex-wrap: wrap;
    gap: 3mm;
  }
  .paper-meta {
    text-align: left;
  }
  .paper-name span {
    width: 40mm;
  }
  .key-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media print {
  .exam-page {
    max-width: none;
    padding: 0;
  }
  .exam-page > div {
    display: block;
    margin: 0;
  }
  .paper {
    max-width: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
    break-after: page;
  }
  .paper:last-child {
    break-after: auto;
  }
}
</style>

<style>
@page {
  size: A4;
  margin: 15mm 16mm;
}
</style>
