<script setup lang="ts">
import type { LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'
import { useIntersectionObserver } from '@vueuse/core'
import { buildExampleSolver, examples } from '~/lib/examples'

/**
 * Two lecture slides with a live EduBeam model on them - the app's Warren truss example, solved
 * here: the question, then the answer with the member forces. The truss keeps its place and the
 * forces fade in, as on a projector. Under the slides, the link that opens the very same model.
 */
const { t } = useI18n()
const { openUrl, numberFormat, units } = useLiveModel()
const pratt = examples.find((e) => e.id === 'pratt')!

/* The slide is white as a projector shows it, in either theme, so its drawing keeps the day colours */
const SLIDE_COLORS = { ink: '#0f1030', deformed: '#0f1030', paper: '#ffffff', muted: '#585d7c', normal: '#2222ff' }

const solver = shallowRef<LinearStaticSolver>()
onMounted(() => (solver.value = buildExampleSolver(pratt)))
/* The deck: the question, then the answer */
const slide = ref<0 | 1>(0)
const SLIDES = [
  { title: 'home.teaching.slideTitle', body: 'home.teaching.slideBody' },
  { title: 'home.teaching.answerTitle', body: 'home.teaching.answerBody' },
] as const
const QUESTION = ['members', 'supports', 'loads', 'reactions'] as const
const ANSWER = [...QUESTION, 'N'] as const
/*
 * The deck runs itself while it is on screen - question, answer, question - pausing while the
 * pointer or focus is on it, and handing over for good once the reader turns a slide themselves.
 */
const CYCLE_MS = 4500
const deck = ref<HTMLElement | null>(null)
const visible = ref(false)
const paused = ref(false)
const manual = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
useIntersectionObserver(deck, ([entry]) => (visible.value = !!entry?.isIntersecting), { threshold: 0.6 })
watchEffect(() => {
  clearInterval(timer)
  const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!visible.value || paused.value || manual.value || reduced) return
  timer = setInterval(() => (slide.value = slide.value === 0 ? 1 : 0), CYCLE_MS)
})
onBeforeUnmount(() => clearInterval(timer))

const go = (to: 0 | 1) => {
  manual.value = true
  slide.value = to
}
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') go(1)
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(0)
  else return
  e.preventDefault()
}

// Opens as the answer slide shows it: the normal forces, with supports, loads and reactions
const link = computed(() => (solver.value ? openUrl(solver.value, showOnly('N')) : 'https://run.edubeam.app/?model=…'))

const copied = ref(false)
const input = ref<HTMLInputElement | null>(null)
let reset: ReturnType<typeof setTimeout> | undefined
const copy = async () => {
  try {
    await navigator.clipboard.writeText(link.value)
  } catch {
    // No clipboard (an insecure page, or permission refused): select the link for Ctrl+C instead
    input.value?.focus()
    input.value?.select()
    return
  }
  copied.value = true
  clearTimeout(reset)
  reset = setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <figure>
    <!-- The slides: 16:9, white as a projector shows them in either theme. On a phone the question
         goes above the drawing and the slide is as tall as both, so neither is cut off -->
    <div
      class="relative overflow-hidden sm:aspect-video rounded-xl border border-rule bg-white text-[#0f1030] shadow-2xl shadow-ink/15 outline-none focus-visible:ring-2 focus-visible:ring-brand dark:shadow-black/50"
      tabindex="0"
      role="group"
      aria-roledescription="slides"
      :aria-label="t(SLIDES[slide].title)"
      ref="deck"
      @keydown="onKey"
      @click="go(slide === 0 ? 1 : 0)"
      @pointerenter="paused = true"
      @pointerleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <!-- Both slides side by side on one track, which glides to the slide being shown -->
      <div
        class="flex h-full w-[200%] transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        :style="{ transform: `translateX(${slide === 0 ? 0 : -50}%)` }"
      >
        <section
          v-for="(s, i) in SLIDES"
          :key="i"
          class="flex h-full w-1/2 flex-col p-[4.5%]"
          :aria-hidden="slide !== i"
          :inert="slide !== i"
        >
          <p class="text-[clamp(0.6rem,1.3vw,0.8rem)] font-medium text-[#585d7c]">{{ t('home.teaching.slideCourse') }}</p>
          <p class="mt-1 font-display text-[clamp(1.1rem,2.6vw,1.9rem)] font-bold leading-tight">{{ t(s.title) }}</p>
          <div class="mt-[2.5%] grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-[3%] sm:grid-cols-[1fr_2.7fr] sm:grid-rows-1">
            <p class="text-pretty text-[clamp(0.65rem,1.4vw,0.95rem)] leading-snug text-[#2c2f52]">{{ t(s.body) }}</p>
            <div class="flex h-full min-h-0 items-center">
              <ClientOnly>
                <StructurePlot
                  v-if="solver"
                  :solver="solver"
                  :layers="i === 0 ? [...QUESTION] : [...ANSWER]"
                  :reserve="[...ANSWER]"
                  :colors="SLIDE_COLORS"
                  :animate="false"
                  :number-format="numberFormat" :units="units"
                  class="max-h-full w-full"
                />
              </ClientOnly>
            </div>
          </div>
        </section>
      </div>

      <!-- The slide's own controls, in its empty top right corner -->
      <div class="absolute right-[3%] top-[4%] flex items-center gap-1 text-[#585d7c]" @click.stop>
        <button type="button" class="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#f3f4fb] disabled:opacity-30" :disabled="slide === 0" :aria-label="t('home.teaching.prevSlide')" @click="go(0)">
          <Icon name="lucide:chevron-left" class="size-4" />
        </button>
        <span class="min-w-8 text-center text-xs tabular-nums">{{ slide + 1 }} / 2</span>
        <button type="button" class="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#f3f4fb] disabled:opacity-30" :disabled="slide === 1" :aria-label="t('home.teaching.nextSlide')" @click="go(1)">
          <Icon name="lucide:chevron-right" class="size-4" />
        </button>
      </div>
    </div>

    <!-- The share link, as the app gives it -->
    <figcaption class="mt-4 flex items-center gap-2 rounded-lg border border-rule bg-paper p-1.5 pl-3">
      <Icon name="lucide:link" class="size-4 shrink-0 text-muted" />
      <label class="sr-only" for="lecture-link">{{ t('home.teaching.shareLabel') }}</label>
      <input
        id="lecture-link"
        ref="input"
        :value="link"
        readonly
        class="min-w-0 flex-1 truncate bg-transparent font-mono text-xs text-muted outline-none"
        @focus="($event.target as HTMLInputElement).select()"
      />
      <button type="button" class="btn btn-quiet !h-8 !px-3 text-xs" @click="copy">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-3.5" />
        <span aria-live="polite">{{ copied ? t('home.teaching.copied') : t('home.teaching.copy') }}</span>
      </button>
      <a :href="link" target="_blank" rel="noopener" class="btn btn-primary !h-8 !px-3 text-xs">
        {{ t('components.openInApp') }}
        <Icon name="lucide:arrow-up-right" class="size-3.5" />
      </a>
    </figcaption>
  </figure>
</template>
