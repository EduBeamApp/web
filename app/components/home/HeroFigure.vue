<script setup lang="ts">
const { t, locale } = useI18n()
const { units } = useLiveModel()
/** A unit's symbol as the page writes it: kN, or кН on Russian pages */
const unit = (kind: 'force' | 'moment' | 'distributed' | 'length' | 'displacement') => units.value[kind].symbol
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { createExampleLibrary } from '~/lib/examples'

/**
 * The figure every statics textbook draws - a loaded beam with its shear force, bending moment
 * and deflection stacked beneath it on one x axis - except this one is solved by EduBeam's solver
 * as the reader drags the point load. The beam overhangs its right support, so pushing the load
 * out past it turns the moment over the support to hogging and lifts the tip.
 *
 * Drawn here rather than by the app's viewer: the stacked figure is the textbook's, and it is set
 * at the page's own pixel size so its text never shrinks on a phone.
 */
const SPAN = 6 // m, pin A to roller B
const LENGTH = 8 // m, to the free end C
const Q = 4 // kN/m over the whole beam
const P = 20 // kN, the load the reader moves
const SAMPLES = 64 // per element

type Sample = { x: number; V: number; M: number }
type State = {
  at: number
  samples: Sample[]
  deflection: { x: number; w: number }[]
  ra: number
  rb: number
}

/** Solves the beam with P at `at` metres; forces in kN and kNm, deflection in mm (down positive). */
const solve = (at: number): State => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  s.domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  s.domain.createNode('B', [SPAN, 0, 0], [DofID.Dz])
  s.domain.createNode('C', [LENGTH, 0, 0], [])
  const elements = [s.domain.createBeam2D('1', ['A', 'B'], 1, 1), s.domain.createBeam2D('2', ['B', 'C'], 1, 1)] as Beam2D[]
  for (const label of ['1', '2']) s.loadCases[0].createBeamElementUniformEdgeLoad(label, [0, Q * 1000], true)
  const onFirst = at <= SPAN
  s.loadCases[0].createBeamConcentratedLoad(onFirst ? '1' : '2', [0, P * 1000, 0, onFirst ? at : at - SPAN], true)
  s.solve()

  const lc = s.loadCases[0]
  const samples: Sample[] = []
  const deflection: State['deflection'] = []
  elements.forEach((element, i) => {
    const start = i === 0 ? 0 : SPAN
    const length = i === 0 ? SPAN : LENGTH - SPAN
    /*
     * V is sampled either side of the point load but never at it: the solver counts the load from
     * its own point on, so a sample exactly there - as when the load sits on a node, at a member's
     * end - would already hold the step and the diagram would lean across the last interval.
     */
    const a = at - start
    const EPS = 1e-6
    const local = Array.from({ length: SAMPLES + 1 }, (_, k) => (k / SAMPLES) * length).filter((x) => Math.abs(x - a) > EPS / 2)
    if (a >= -EPS && a <= length + EPS) {
      if (a - EPS >= 0) local.push(a - EPS)
      if (a + EPS <= length) local.push(a + EPS)
    }
    local.sort((u, v) => u - v)
    for (const x of local) {
      samples.push({
        x: start + x,
        V: element.computeShearForceAt(lc, x) / 1000,
        M: element.computeBendingMomentAt(lc, x) / 1000,
      })
    }
    const defl = element.computeLocalDefl(lc, SAMPLES)
    defl.w.forEach((w, k) => deflection.push({ x: start + (k / SAMPLES) * length, w: w * 1000 }))
  })

  // Reactions from the shear steps at the supports, so they are the solver's numbers too
  const ra = samples[0].V
  const atB = samples.filter((p) => Math.abs(p.x - SPAN) < 1e-9)
  const rb = (atB.at(-1)?.V ?? 0) - (atB[0]?.V ?? 0)
  return { at, samples, deflection, ra, rb }
}

/** The largest values over every load position, so the diagrams grow and shrink as P moves. */
const envelope = (() => {
  const e = { vMax: 0, vMin: 0, mMax: 0, mMin: 0, wMax: 0, wMin: 0 }
  for (let at = 0; at <= LENGTH + 1e-9; at += 0.25) {
    const st = solve(at)
    for (const p of st.samples) {
      e.vMax = Math.max(e.vMax, p.V)
      e.vMin = Math.min(e.vMin, p.V)
      e.mMax = Math.max(e.mMax, p.M)
      e.mMin = Math.min(e.mMin, p.M)
    }
    for (const p of st.deflection) {
      e.wMax = Math.max(e.wMax, p.w)
      e.wMin = Math.min(e.wMin, p.w)
    }
  }
  return e
})()

const at = ref(3.2)
const state = computed(() => solve(at.value))

/* ── Layout, in real pixels of the figure's width ─────────────────────────────────────────── */
const box = ref<HTMLElement | null>(null)
const { width } = useElementSize(box)
const W = computed(() => Math.max(320, Math.round(width.value || 720)))
const narrow = computed(() => W.value < 560)

/*
 * Beside the headline the whole figure should fit the screen's height under the header, so on a
 * short laptop screen the diagrams are drawn lower. The load row and the text keep their size.
 */
const { height: windowHeight } = useWindowSize()
const k = computed(() => {
  if (narrow.value || !windowHeight.value) return 1
  const available = windowHeight.value - 64 - 72 - 30 // header, padding, the line under the figure
  return Math.min(1, Math.max(0.6, (available - 180) / 392))
})
const LEFT = computed(() => (narrow.value ? 52 : 60))
const RIGHT = 20
const sx = (x: number) => LEFT.value + (x / LENGTH) * (W.value - LEFT.value - RIGHT)
const xOf = (px: number) => ((px - LEFT.value) / (W.value - LEFT.value - RIGHT)) * LENGTH

/** Each row: where it starts, how tall, and where its zero line sits for the envelope's range. */
const rows = computed(() => {
  const gap = narrow.value ? 18 : Math.round(24 * k.value)
  const load = { top: 28, height: narrow.value ? 142 : 154 }
  const make = (top: number, height: number, max: number, min: number) => {
    const span = max - min || 1
    return { top, height, axis: top + (max / span) * height, scale: height / span }
  }
  // Sagging moment and downward deflection plot below the axis, as on the tension side
  const vH = narrow.value ? 96 : Math.round(116 * k.value)
  const mH = narrow.value ? 104 : Math.round(128 * k.value)
  const wH = narrow.value ? 64 : Math.round(76 * k.value)
  const vTop = load.top + load.height + gap
  const V = make(vTop, vH, envelope.vMax, envelope.vMin)
  const mTop = vTop + vH + gap
  const M = make(mTop, mH, -envelope.mMin, -envelope.mMax)
  const wTop = mTop + mH + gap
  const w = make(wTop, wH, -envelope.wMin, -envelope.wMax)
  return { load, V, M, w, height: wTop + wH + 12 }
})

const beamY = computed(() => rows.value.load.top + rows.value.load.height - 80)

const path = (points: { x: number; y: number }[], close: number | null) => {
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${p.y.toFixed(1)}`).join('')
  return close === null ? d : `M${sx(points[0].x).toFixed(1)},${close}` + d.replace(/^M/, 'L') + `L${sx(points.at(-1)!.x).toFixed(1)},${close}Z`
}

// V up for positive, as textbooks draw it; M and w on the tension side, down for sagging
const vPath = computed(() =>
  path(state.value.samples.map((p) => ({ x: p.x, y: rows.value.V.axis - p.V * rows.value.V.scale })), rows.value.V.axis)
)
const mPath = computed(() =>
  path(state.value.samples.map((p) => ({ x: p.x, y: rows.value.M.axis + p.M * rows.value.M.scale })), rows.value.M.axis)
)
const wPath = computed(() =>
  path(state.value.deflection.map((p) => ({ x: p.x, y: rows.value.w.axis + p.w * rows.value.w.scale })), null)
)

/** The extremes worth labelling: the largest sagging and hogging moment, the largest deflections. */
const peaks = computed(() => {
  const s = state.value.samples
  const byM = [...s].sort((a, b) => b.M - a.M)
  const d = state.value.deflection
  const byW = [...d].sort((a, b) => b.w - a.w)
  return {
    mSag: byM[0],
    mHog: byM.at(-1)!,
    wDown: byW[0],
    wUp: byW.at(-1)!,
  }
})

// A typographic minus, as the diagrams of the other figures write it
const fmt = (v: number, digits = 1) => {
  const r = Math.abs(v) < 0.05 ? 0 : v
  return r.toLocaleString(locale.value, { minimumFractionDigits: digits, maximumFractionDigits: digits }).replace('-', '−')
}

/** What the figure shows for this load position, in words, for a screen reader on the slider */
const valueText = computed(() => {
  const { mSag, mHog } = peaks.value
  const moments = [mSag.M > 0.5 && t('heroFigure.sagging', { m: fmt(mSag.M) }), mHog.M < -0.5 && t('heroFigure.hogging', { m: fmt(Math.abs(mHog.M)) })]
  return [
    t('heroFigure.fromA', { x: fmt(at.value, 2) }),
    t('heroFigure.reactions', { a: fmt(state.value.ra), b: fmt(state.value.rb) }),
    ...moments.filter((m): m is string => !!m),
  ].join(', ')
})

/* ── Reading values off the figure ────────────────────────────────────────────────────────── */
const cursor = ref<number | null>(null)
/**
 * Where the shear diagram steps: over the support B and under the point load. There V has two
 * values, just left and just right of the point; the cursor snaps to a step and shows both.
 */
const jumps = computed(() => (at.value > 1e-6 && at.value < LENGTH - 1e-6 && Math.abs(at.value - SPAN) > 1e-6 ? [SPAN, at.value] : [SPAN]))
const SNAP_PX = 8

const readout = computed(() => {
  if (cursor.value === null) return null
  const snapped = jumps.value.find((j) => Math.abs(sx(j) - sx(cursor.value!)) < SNAP_PX)
  const x = snapped ?? cursor.value
  const s = state.value.samples
  const d = state.value.deflection.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best))
  if (snapped !== undefined) {
    const at = s.filter((p) => Math.abs(p.x - x) < 1e-5).sort((a, b) => a.x - b.x)
    return { x, V: at[0].V, V2: at.at(-1)!.V, M: at[0].M, w: d.w }
  }
  const near = s.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best), s[0])
  return { x, V: near.V, V2: null, M: near.M, w: d.w }
})

/**
 * One value per diagram at the cursor, in a small pill above its point, on the side of the cursor
 * with more room. A pill rather than bare text: the diagram's own line runs right through the point.
 */
const cursorMarks = computed(() => {
  const r = readout.value
  if (!r) return []
  const right = r.x < LENGTH * 0.7
  const vText = r.V2 === null ? `${fmt(r.V)} ${unit('force')}` : `${fmt(r.V)} → ${fmt(r.V2)} ${unit('force')}`
  const vY = rows.value.V.axis - (r.V2 === null ? r.V : Math.max(r.V, r.V2)) * rows.value.V.scale
  return [
    { key: 'V', y: vY, color: 'var(--color-shear)', text: vText },
    { key: 'M', y: rows.value.M.axis + r.M * rows.value.M.scale, color: 'var(--color-moment)', text: `${fmt(r.M)} ${unit('moment')}` },
    { key: 'w', y: rows.value.w.axis + r.w * rows.value.w.scale, color: 'var(--ink)', text: `${fmt(r.w)} ${unit('displacement')}` },
  ].map((m) => {
    const width = m.text.length * 7.1 + 14
    return { ...m, width, left: right ? sx(r.x) + 8 : sx(r.x) - 8 - width, top: m.y - 30 }
  })
})

/* ── Moving the load ──────────────────────────────────────────────────────────────────────── */
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref(false)
const clamp = (x: number) => Math.min(LENGTH, Math.max(0, Math.round(x * 20) / 20))
const pointerX = (e: PointerEvent) => {
  const rect = svg.value!.getBoundingClientRect()
  return xOf(((e.clientX - rect.left) / rect.width) * W.value)
}

const onDown = (e: PointerEvent) => {
  // The load row moves the load; anywhere below reads values off the diagrams
  const rect = svg.value!.getBoundingClientRect()
  const y = ((e.clientY - rect.top) / rect.height) * rows.value.height
  if (y > rows.value.load.top + rows.value.load.height + 6) return
  dragging.value = true
  stopIntro()
  ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  at.value = clamp(pointerX(e))
}
const onMove = (e: PointerEvent) => {
  const x = pointerX(e)
  if (dragging.value) at.value = clamp(x)
  else cursor.value = x >= 0 && x <= LENGTH ? x : null
}
const onUp = () => (dragging.value = false)

const onKey = (e: KeyboardEvent) => {
  const step = { ArrowLeft: -0.1, ArrowDown: -0.1, ArrowRight: 0.1, ArrowUp: 0.1, PageDown: -1, PageUp: 1 }[e.key]
  if (step !== undefined) at.value = clamp(at.value + step)
  else if (e.key === 'Home') at.value = 0
  else if (e.key === 'End') at.value = LENGTH
  else return
  stopIntro()
  e.preventDefault()
}

/* One orchestrated moment: the load glides along once, so the figure shows it can be moved */
let frame = 0
const stopIntro = () => cancelAnimationFrame(frame)
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const from = 1.2
  const to = 3.2
  const start = performance.now() + 500
  const tick = (now: number) => {
    const t = Math.min(1, Math.max(0, (now - start) / 1600))
    const ease = 1 - Math.pow(1 - t, 3)
    at.value = Math.round((from + (to - from) * ease) * 100) / 100
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  at.value = from
  frame = requestAnimationFrame(tick)
})
onBeforeUnmount(stopIntro)

const reactions = computed(() => [
  { x: 0, value: state.value.ra },
  { x: SPAN, value: state.value.rb },
])

const udlArrows = computed(() => {
  const n = narrow.value ? 13 : 21
  return Array.from({ length: n }, (_, i) => (i / (n - 1)) * LENGTH)
})
</script>

<template>
  <div ref="box" class="hero-figure relative select-none">
    <svg
      ref="svg"
      :viewBox="`0 0 ${W} ${rows.height}`"
      :width="W"
      :height="rows.height"
      class="block h-auto w-full touch-pan-y"
      role="group"
      :aria-label="t('heroFigure.aria')"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="cursor = null"
    >
      <defs>
        <!-- Ordinates perpendicular to the beam, as EduBeam hatches a diagram -->
        <pattern id="hf-hatch-v" width="7" height="7" patternUnits="userSpaceOnUse">
          <line x1="0.5" x2="0.5" y2="7" stroke="var(--color-shear)" stroke-width="1" opacity=".6" />
        </pattern>
        <pattern id="hf-hatch-m" width="7" height="7" patternUnits="userSpaceOnUse">
          <line x1="0.5" x2="0.5" y2="7" stroke="var(--color-moment)" stroke-width="1" opacity=".6" />
        </pattern>
        <marker id="hf-reaction-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
          <path d="M0,0L10,5L0,10Z" fill="var(--color-reaction)" />
        </marker>
      </defs>

      <!-- Row labels, as the diagrams are named on a blackboard -->
      <g class="hf-label" font-size="14">
        <text :x="LEFT - 12" :y="rows.V.axis + 5" text-anchor="end" fill="var(--color-shear)"><tspan font-style="italic">V</tspan>(<tspan font-style="italic">x</tspan>)</text>
        <text :x="LEFT - 12" :y="rows.M.axis + 5" text-anchor="end" fill="var(--color-moment)"><tspan font-style="italic">M</tspan>(<tspan font-style="italic">x</tspan>)</text>
        <text :x="LEFT - 12" :y="rows.w.axis + 5" text-anchor="end" fill="currentColor" opacity=".7"><tspan font-style="italic">w</tspan>(<tspan font-style="italic">x</tspan>)</text>
      </g>
      <!-- Each diagram's unit, once, under its name; the values on the diagrams are plain numbers -->
      <g class="hf-num" font-size="12.5" fill="var(--muted)" text-anchor="end">
        <text :x="LEFT - 12" :y="rows.V.axis + 21">[{{ unit('force') }}]</text>
        <text :x="LEFT - 12" :y="rows.M.axis + 21">[{{ unit('moment') }}]</text>
        <text :x="LEFT - 12" :y="rows.w.axis + 21">[{{ unit('displacement') }}]</text>
      </g>

      <!-- The load row, loads in the app's load colour: uniform load, the movable point load, the beam -->
      <g :stroke="'var(--color-load)'" :fill="'var(--color-load)'">
        <line :x1="sx(0)" :x2="sx(LENGTH)" :y1="beamY - 34" :y2="beamY - 34" stroke-width="1.25" />
        <g v-for="x in udlArrows" :key="x">
          <line :x1="sx(x)" :x2="sx(x)" :y1="beamY - 34" :y2="beamY - 7" stroke-width="1.25" />
          <path :d="`M${sx(x) - 3},${beamY - 9}L${sx(x) + 3},${beamY - 9}L${sx(x)},${beamY - 3}Z`" stroke="none" />
        </g>
        <!-- At whichever end the point load is not near, so the two never collide -->
        <text
          :x="at > LENGTH / 2 ? sx(0) : sx(LENGTH)"
          :y="beamY - 41"
          :text-anchor="at > LENGTH / 2 ? 'start' : 'end'"
          stroke="none"
          font-size="12.5"
          class="hf-num"
        >q = {{ Q }} {{ unit('distributed') }}</text>
      </g>

      <!-- Dashed guide from the load down through every diagram -->
      <line :x1="sx(at)" :x2="sx(at)" :y1="beamY" :y2="rows.w.top + rows.w.height" stroke="var(--color-load)" stroke-dasharray="3 4" opacity=".5" />

      <g class="text-figure" stroke="currentColor">
        <line :x1="sx(0)" :x2="sx(LENGTH)" :y1="beamY" :y2="beamY" stroke-width="3.5" stroke-linecap="round" />
        <!-- Pin at A, roller at B, as the app draws them: a bare triangle, and one with its track -->
        <path :d="`M${sx(0)},${beamY + 1.75}L${sx(0) - 15},${beamY + 20}h30Z`" fill="var(--paper)" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <path :d="`M${sx(SPAN)},${beamY + 1.75}L${sx(SPAN) - 15},${beamY + 20}h30Z`" fill="var(--paper)" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <line :x1="sx(SPAN) - 15" :x2="sx(SPAN) + 15" :y1="beamY + 25" :y2="beamY + 25" stroke-width="1.8" vector-effect="non-scaling-stroke" />
      </g>
      <!-- Reactions, pointing the way they act on the beam, in the app's colour -->
      <g v-for="r in reactions" :key="r.x">
        <line
          :x1="sx(r.x)"
          :x2="sx(r.x)"
          :y1="r.value >= 0 ? beamY + 74 : beamY + 28"
          :y2="r.value >= 0 ? beamY + 28 : beamY + 74"
          stroke="var(--color-reaction)"
          stroke-width="1.75"
          marker-end="url(#hf-reaction-tip)"
        />
        <text :x="sx(r.x) + 8" :y="beamY + 70" class="hf-num" font-size="12.5" fill="var(--color-reaction)">{{ fmt(Math.abs(r.value)) }} {{ unit('force') }}</text>
      </g>

      <!-- The point load: grab it anywhere on the load row, or focus it and use the arrow keys -->
      <g
        class="hf-load"
        :class="{ 'is-dragging': dragging }"
        tabindex="0"
        role="slider"
        :aria-label="t('heroFigure.slider')"
        :aria-valuemin="0"
        :aria-valuemax="LENGTH"
        :aria-valuenow="at"
        :aria-valuetext="valueText"
        @keydown="onKey"
      >
        <rect :x="sx(at) - 22" :y="beamY - 86" width="44" height="80" fill="transparent" />
        <line :x1="sx(at)" :x2="sx(at)" :y1="beamY - 74" :y2="beamY - 9" stroke="var(--color-load)" stroke-width="3" />
        <path :d="`M${sx(at) - 7},${beamY - 14}L${sx(at) + 7},${beamY - 14}L${sx(at)},${beamY - 2}Z`" fill="var(--color-load)" />
        <circle class="hf-grip" :cx="sx(at)" :cy="beamY - 80" r="9" fill="var(--color-load)" />
        <!-- The keyboard focus ring, around the grip -->
        <circle class="hf-focus" :cx="sx(at)" :cy="beamY - 80" r="16" fill="none" stroke="var(--brand)" stroke-width="2" />
        <text :x="sx(at) + (at > LENGTH - 1.2 ? -16 : 16)" :y="beamY - 76" :text-anchor="at > LENGTH - 1.2 ? 'end' : 'start'" font-size="12.5" class="hf-num" fill="var(--color-load)" font-weight="600">P = {{ P }} {{ unit('force') }}</text>
      </g>

      <!-- V(x) -->
      <line :x1="sx(0)" :x2="sx(LENGTH)" :y1="rows.V.axis" :y2="rows.V.axis" stroke="currentColor" class="text-rule" />
      <path :d="vPath" fill="url(#hf-hatch-v)" stroke="var(--color-shear)" stroke-width="1.75" stroke-linejoin="round" />

      <!-- M(x) -->
      <line :x1="sx(0)" :x2="sx(LENGTH)" :y1="rows.M.axis" :y2="rows.M.axis" stroke="currentColor" class="text-rule" />
      <path :d="mPath" fill="url(#hf-hatch-m)" stroke="var(--color-moment)" stroke-width="1.75" stroke-linejoin="round" />
      <g class="hf-num" font-size="12.5" fill="var(--color-moment)">
        <text v-if="peaks.mSag.M > 0.5" :x="sx(peaks.mSag.x)" :y="rows.M.axis + peaks.mSag.M * rows.M.scale + 15" text-anchor="middle">{{ fmt(peaks.mSag.M) }}</text>
        <text v-if="peaks.mHog.M < -0.5" :x="sx(peaks.mHog.x)" :y="rows.M.axis + peaks.mHog.M * rows.M.scale - 7" text-anchor="middle">{{ fmt(peaks.mHog.M) }}</text>
      </g>

      <!-- w(x): the deflected beam over its original line -->
      <line :x1="sx(0)" :x2="sx(LENGTH)" :y1="rows.w.axis" :y2="rows.w.axis" stroke="currentColor" class="text-rule" stroke-dasharray="4 4" />
      <path :d="wPath" fill="none" stroke="currentColor" class="text-figure" stroke-width="2.25" stroke-linecap="round" />
      <g class="hf-num text-muted" font-size="12.5" fill="currentColor">
        <text v-if="peaks.wDown.w > 0.05" :x="sx(peaks.wDown.x)" :y="rows.w.axis + peaks.wDown.w * rows.w.scale + 16" text-anchor="middle">{{ fmt(peaks.wDown.w) }}</text>
        <text v-if="peaks.wUp.w < -0.05" :x="sx(peaks.wUp.x)" :y="rows.w.axis + peaks.wUp.w * rows.w.scale - 8" text-anchor="end">{{ fmt(peaks.wUp.w) }}</text>
      </g>

      <!-- The reading cursor: the value of each diagram written beside its point -->
      <g v-if="readout && !dragging" pointer-events="none" class="hf-num" font-size="12.5" font-weight="600">
        <line :x1="sx(readout.x)" :x2="sx(readout.x)" :y1="rows.V.top - 14" :y2="rows.w.top + rows.w.height" stroke="currentColor" class="text-figure" opacity=".3" />
        <text :x="sx(readout.x)" :y="rows.V.top - 20" text-anchor="middle" class="hf-halo text-ink" fill="currentColor"><tspan font-style="italic" class="hf-math">x</tspan> = {{ fmt(readout.x, 2) }} {{ unit('length') }}</text>
        <circle :cx="sx(readout.x)" :cy="rows.V.axis - readout.V * rows.V.scale" r="4" fill="var(--color-shear)" stroke="var(--paper)" stroke-width="1.5" />
        <circle v-if="readout.V2 !== null" :cx="sx(readout.x)" :cy="rows.V.axis - readout.V2 * rows.V.scale" r="4" fill="var(--color-shear)" stroke="var(--paper)" stroke-width="1.5" />
        <circle :cx="sx(readout.x)" :cy="rows.M.axis + readout.M * rows.M.scale" r="4" fill="var(--color-moment)" stroke="var(--paper)" stroke-width="1.5" />
        <circle :cx="sx(readout.x)" :cy="rows.w.axis + readout.w * rows.w.scale" r="4" fill="var(--figure-ink)" stroke="var(--paper)" stroke-width="1.5" />
        <g v-for="mark in cursorMarks" :key="mark.key">
          <rect :x="mark.left" :y="mark.top" :width="mark.width" height="21" rx="5" fill="var(--paper)" :stroke="mark.color" stroke-opacity=".5" />
          <text :x="mark.left + 7" :y="mark.top + 15" :fill="mark.color">{{ mark.text }}</text>
        </g>
      </g>
    </svg>

    <p class="hf-readout">
      <span class="hf-num text-[var(--color-load)]"><i>P</i> {{ t('heroFigure.loadAt', { x: fmt(at, 2) }) }}</span>
      <span class="text-muted">{{ t('heroFigure.hint') }}</span>
    </p>
  </div>
</template>

<style scoped>
.hf-num {
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
}
.hf-label {
  font-family: 'KaTeX_Main', Georgia, serif;
}
.hf-label tspan[font-style='italic'],
.hf-readout i {
  font-family: 'KaTeX_Math', Georgia, serif;
}
.hf-load {
  cursor: grab;
  outline: none;
}
.hf-load.is-dragging {
  cursor: grabbing;
}
.hf-grip {
  transition: r 0.15s;
}
.hf-load:hover .hf-grip,
.hf-load:focus-visible .hf-grip,
.hf-load.is-dragging .hf-grip {
  r: 11;
}
.hf-focus {
  opacity: 0;
}
.hf-load:focus-visible .hf-focus {
  opacity: 1;
}
.hf-math {
  font-family: 'KaTeX_Math', Georgia, serif;
}
/* A halo in the page colour, so a value stays legible over hatching and lines */
.hf-halo {
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
}
.hf-readout {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  min-height: 1.5rem;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--ink);
}
.text-shear {
  color: var(--color-shear);
}
.text-moment {
  color: var(--color-moment);
}
</style>
