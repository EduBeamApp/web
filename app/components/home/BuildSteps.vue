<script setup lang="ts">
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'
import { useIntersectionObserver } from '@vueuse/core'
import { createExampleLibrary } from '~/lib/examples'

/**
 * Modelling in EduBeam, in the order it is done, on one portal frame drawn in the hero's hand:
 * the nodes, then the members, then supports and loads, then the moment diagram EduBeam's solver
 * gives for it. A real sequence, so the steps are numbered; the drawing builds up step by step.
 * It plays through once when it comes into view, and stops as soon as the reader picks a step or
 * moves the keyboard focus into the steps, so a selection never moves away from the focused step.
 */
const STEPS = ['nodes', 'elements', 'loads', 'results'] as const

const { t, locale } = useI18n()
const { units } = useLiveModel()
/** A unit's symbol as the page writes it: kN, or кН on Russian pages */
const unit = (kind: 'force' | 'moment' | 'distributed' | 'length' | 'displacement') => units.value[kind].symbol
const active = ref(0)

/* ── The frame: 6 m wide, 4 m high, pinned at both feet (model axes: x right, z down) ─────── */
const NODES = { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] } as const
const MEMBERS = [
  ['1', 'A', 'B'],
  ['2', 'B', 'C'],
  ['3', 'C', 'D'],
] as const
const Q = 10 // kN/m on the beam
const H = 15 // kN to the right at B

const solved = (() => {
  const s = new LinearStaticSolver()
  createExampleLibrary(s)
  for (const [label, [x, z]] of Object.entries(NODES)) {
    s.domain.createNode(label, [x, 0, z], label === 'A' || label === 'D' ? [DofID.Dx, DofID.Dz] : [])
  }
  const elements = MEMBERS.map(([label, a, b]) => s.domain.createBeam2D(label, [a, b], 1, 1) as Beam2D)
  s.loadCases[0].createBeamElementUniformEdgeLoad('2', [0, Q * 1000], true)
  s.loadCases[0].createNodalLoad('B', { [DofID.Dx]: H * 1000 })
  s.solve()
  const lc = s.loadCases[0]

  // Moments along each member, in kNm, at its local x
  const moments = elements.map((element, i) => {
    const [, a, b] = MEMBERS[i]
    const [x1, z1] = NODES[a]
    const [x2, z2] = NODES[b]
    const length = Math.hypot(x2 - x1, z2 - z1)
    return Array.from({ length: 41 }, (_, k) => {
      const x = (k / 40) * length
      return { x, M: element.computeBendingMomentAt(lc, x) / 1000 }
    })
  })
  // Reactions at the feet, as forces on the frame in global axes (z down), in kN
  const reactions = (['A', 'D'] as const).map((label) => {
    const r = s.domain.nodes.get(label)!.getReactions(lc, true)
    const values: unknown = r.values
    const at = (dof: DofID) => {
      const i = r.dofs.indexOf(dof)
      if (i === -1) return 0
      // The solver hands back a math.js matrix or a plain array, depending on the path it took
      return values && typeof values === 'object' && 'get' in values
        ? (values as { get: (index: number[]) => number }).get([i])
        : (values as number[])[i]
    }
    return { label, rx: at(DofID.Dx) / 1000, rz: at(DofID.Dz) / 1000 }
  })
  return { moments, reactions }
})()

/* ── Drawing: 60 px per metre ─────────────────────────────────────────────────────────────── */
const S = 60
const X0 = 150
const Y0 = 380
const px = (x: number, z: number) => [X0 + x * S, Y0 + z * S] as const

const mMax = Math.max(...solved.moments.flat().map((p) => Math.abs(p.M)))
const M_PX = 64 / mMax

/** A member's moment diagram, offset to its tension side: along the local z axis, x turned +90°. */
const momentShapes = computed(() =>
  MEMBERS.map(([, a, b], i) => {
    const [x1, z1] = NODES[a]
    const [x2, z2] = NODES[b]
    const length = Math.hypot(x2 - x1, z2 - z1)
    const [cx, cz] = [(x2 - x1) / length, (z2 - z1) / length]
    const [nx, nz] = [-cz, cx]
    const pts = solved.moments[i].map(({ x, M }) => {
      const [bx, by] = px(x1 + cx * x, z1 + cz * x)
      return { base: [bx, by], tip: [bx + nx * M * M_PX, by + nz * M * M_PX], M }
    })
    const outline = pts.map((p) => p.tip.join(',')).join(' ')
    const [sx1, sy1] = px(x1, z1)
    const [sx2, sy2] = px(x2, z2)
    // Ordinates perpendicular to the member, as EduBeam hatches a diagram
    const ordinates = pts.filter((_, k) => k % 2 === 0)
    return { polygon: `${sx1},${sy1} ${outline} ${sx2},${sy2}`, ordinates, n: [nx, nz] as const }
  })
)

/**
 * A rigid corner carries one moment, the same at the end of both members: it is written once, at
 * the tip of one member's ordinate - the one with room around it - just beyond it along the same
 * ordinate, so the number reads as the ordinate's end. At C that is the column, outside the frame;
 * at B the beam, below it.
 */
const cornerLabels = computed(() => {
  const corners = [
    { node: NODES.B, M: solved.moments[1][0].M, n: momentShapes.value[1].n },
    { node: NODES.C, M: solved.moments[2][0].M, n: momentShapes.value[2].n },
  ]
  return corners.map(({ node, M, n }) => {
    const [bx, by] = px(node[0], node[1])
    const reach = M * M_PX
    const tip = [bx + n[0] * reach, by + n[1] * reach]
    const out = [n[0] * Math.sign(M), n[1] * Math.sign(M)]
    const horizontal = Math.abs(out[0]) > 0.5
    return {
      x: tip[0] + (horizontal ? out[0] * 7 : 7),
      y: tip[1] + (horizontal ? 5 : out[1] * 16),
      anchor: horizontal ? (out[0] > 0 ? 'start' : 'end') : 'start',
      text: fmt(M),
    }
  })
})
const sagging = computed(() => {
  const pts = solved.moments[1]
  const best = pts.reduce((a, b) => (b.M > a.M ? b : a))
  const [bx, by] = px(best.x, -4)
  return { x: bx, y: by + best.M * M_PX + 20, text: fmt(best.M) }
})

const fmt = (v: number) => v.toLocaleString(locale.value, { maximumFractionDigits: 1, minimumFractionDigits: 1 }).replace('-', '−')

const nodeList = Object.entries(NODES).map(([label, [x, z]]) => ({ label, x, z, p: px(x, z) }))
const memberLines = MEMBERS.map(([label, a, b]) => ({ label, from: px(...NODES[a]), to: px(...NODES[b]) }))
const udlArrows = Array.from({ length: 13 }, (_, i) => (i / 12) * 6)

/* ── Playing through once ─────────────────────────────────────────────────────────────────── */
const root = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
let played = false
const stop = () => {
  clearInterval(timer)
  played = true
}
const pick = (i: number) => {
  stop()
  active.value = i
}
useIntersectionObserver(
  root,
  ([entry]) => {
    if (!entry?.isIntersecting || played) return
    played = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.value = STEPS.length - 1
      return
    }
    active.value = 0
    timer = setInterval(() => {
      if (active.value >= STEPS.length - 1) return stop()
      active.value++
    }, 1900)
  },
  { threshold: 0.5 }
)
onBeforeUnmount(stop)

const onKey = (e: KeyboardEvent) => {
  const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
  if (move === undefined) return
  e.preventDefault()
  pick((active.value + move + STEPS.length) % STEPS.length)
  ;(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role=tab]')[active.value]?.focus()
}
</script>

<template>
  <div ref="root" class="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
    <ol role="tablist" aria-orientation="vertical" :aria-label="t('home.steps.title')" class="lg:col-span-5" @keydown="onKey" @focusin="stop">
      <li v-for="(step, i) in STEPS" :key="step">
        <button
          type="button"
          role="tab"
          :aria-selected="active === i"
          :tabindex="active === i ? 0 : -1"
          class="group grid w-full grid-cols-[2.5rem_1fr] gap-x-3 border-l-2 py-3 pl-5 text-left transition-colors"
          :class="active === i ? 'border-brand' : 'border-rule hover:border-ink/30'"
          @click="pick(i)"
        >
          <span class="font-display text-3xl font-bold leading-none" :class="active === i ? 'text-brand' : 'text-muted/60'">{{ i + 1 }}</span>
          <span>
            <span class="block font-display text-xl font-semibold leading-tight" :class="active === i ? 'text-ink' : 'text-muted group-hover:text-ink'">
              {{ t(`home.steps.items.${step}.title`) }}
            </span>
            <span class="grid transition-[grid-template-rows] duration-300" :class="active === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
              <span class="overflow-hidden">
                <span class="block pt-2 text-pretty leading-relaxed text-muted">{{ t(`home.steps.items.${step}.body`) }}</span>
              </span>
            </span>
          </span>
        </button>
      </li>
    </ol>

    <!-- On a phone the drawing comes first, so it builds up above the step being read -->
    <div class="order-first lg:order-none lg:col-span-7">
      <div class="relative overflow-hidden rounded-xl border border-rule bg-paper">
        <div class="pointer-events-none absolute inset-0 blueprint-bg opacity-70" aria-hidden="true" />
        <svg viewBox="50 40 590 430" class="relative block h-auto w-full" role="img" :aria-label="t(`home.steps.items.${STEPS[active]}.title`)">
          <defs>
            <marker id="bs-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M0,0L10,5L0,10Z" fill="var(--color-reaction)" />
            </marker>
            <marker id="bs-load" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0L10,5L0,10Z" fill="var(--color-load)" />
            </marker>
          </defs>

          <!-- 4: the moment diagram, on the tension side, and the reactions -->
          <g class="bs-layer" :class="{ on: active >= 3 }">
            <g v-for="(shape, i) in momentShapes" :key="i">
              <line
                v-for="(o, k) in shape.ordinates"
                :key="k"
                :x1="o.base[0]"
                :y1="o.base[1]"
                :x2="o.tip[0]"
                :y2="o.tip[1]"
                stroke="var(--color-moment)"
                stroke-width="1"
                opacity=".55"
              />
              <polygon :points="shape.polygon" fill="none" stroke="var(--color-moment)" stroke-width="1.75" stroke-linejoin="round" />
            </g>
            <text v-for="(c, i) in cornerLabels" :key="`c${i}`" :x="c.x" :y="c.y" :text-anchor="c.anchor" class="bs-num bs-halo" fill="var(--color-moment)">{{ c.text }}</text>
            <text :x="sagging.x" :y="sagging.y" text-anchor="middle" class="bs-num bs-halo" fill="var(--color-moment)">{{ sagging.text }}</text>
            <g v-for="r in solved.reactions" :key="r.label">
              <line
                :x1="px(...NODES[r.label])[0]"
                :y1="px(...NODES[r.label])[1] + (r.rz < 0 ? 76 : 28)"
                :x2="px(...NODES[r.label])[0]"
                :y2="px(...NODES[r.label])[1] + (r.rz < 0 ? 28 : 76)"
                stroke="var(--color-reaction)"
                stroke-width="1.75"
                marker-end="url(#bs-tip)"
              />
              <text :x="px(...NODES[r.label])[0] + 8" :y="px(...NODES[r.label])[1] + 74" class="bs-num" fill="var(--color-reaction)">{{ fmt(Math.abs(r.rz)) }}</text>
              <line
                v-if="Math.abs(r.rx) > 0.05"
                :x1="px(...NODES[r.label])[0] + (r.rx < 0 ? 58 : -58)"
                :y1="px(...NODES[r.label])[1] + 26"
                :x2="px(...NODES[r.label])[0] + (r.rx < 0 ? 14 : -14)"
                :y2="px(...NODES[r.label])[1] + 26"
                stroke="var(--color-reaction)"
                stroke-width="1.75"
                marker-end="url(#bs-tip)"
              />
              <text
                v-if="Math.abs(r.rx) > 0.05"
                :x="px(...NODES[r.label])[0] + (r.rx < 0 ? 62 : -62)"
                :y="px(...NODES[r.label])[1] + 30"
                :text-anchor="r.rx < 0 ? 'start' : 'end'"
                class="bs-num"
                fill="var(--color-reaction)"
              >
                {{ fmt(Math.abs(r.rx)) }}
              </text>
            </g>
            <!-- The units, once, now that the values on the drawing are plain numbers -->
            <text x="62" y="62" class="bs-num" fill="var(--muted)">M [{{ unit('moment') }}], R [{{ unit('force') }}]</text>
          </g>

          <!-- 3: supports and loads -->
          <g class="bs-layer" :class="{ on: active >= 2 }">
            <!-- Pinned feet, as the app draws a pin: a bare triangle -->
            <g v-for="label in ['A', 'D'] as const" :key="label" class="text-figure" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
              <path :d="`M${px(...NODES[label])[0]},${px(...NODES[label])[1] + 1.75}l-15,18.25h30Z`" fill="var(--paper)" vector-effect="non-scaling-stroke" />
            </g>
            <g stroke="var(--color-load)" fill="var(--color-load)">
              <line :x1="px(0, -4)[0]" :x2="px(6, -4)[0]" :y1="px(0, -4)[1] - 40" :y2="px(0, -4)[1] - 40" stroke-width="1.25" />
              <g v-for="x in udlArrows" :key="x">
                <line :x1="px(x, -4)[0]" :x2="px(x, -4)[0]" :y1="px(0, -4)[1] - 40" :y2="px(0, -4)[1] - 8" stroke-width="1.25" />
                <path :d="`M${px(x, -4)[0] - 3},${px(0, -4)[1] - 10}l6,0l-3,6Z`" stroke="none" />
              </g>
              <text :x="px(0, -4)[0]" :y="px(0, -4)[1] - 48" text-anchor="start" stroke="none" class="bs-num">q = {{ Q }} {{ unit('distributed') }}</text>
            </g>
            <line :x1="px(0, -4)[0] - 78" :x2="px(0, -4)[0] - 6" :y1="px(0, -4)[1]" :y2="px(0, -4)[1]" stroke="var(--color-load)" stroke-width="3" marker-end="url(#bs-load)" />
            <text :x="px(0, -4)[0] - 82" :y="px(0, -4)[1] - 10" text-anchor="start" class="bs-num" font-weight="600" fill="var(--color-load)">{{ H }} {{ unit('force') }}</text>
          </g>

          <!-- 2: members -->
          <g class="text-figure" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
            <line
              v-for="(m, i) in memberLines"
              :key="m.label"
              class="bs-member"
              :class="{ on: active >= 1 }"
              :style="{ transitionDelay: `${i * 140}ms` }"
              :x1="m.from[0]"
              :y1="m.from[1]"
              :x2="m.to[0]"
              :y2="m.to[1]"
              pathLength="1"
            />
          </g>

          <!-- 1: nodes, with the frame's dimensions -->
          <g>
            <g v-for="n in nodeList" :key="n.label">
              <circle :cx="n.p[0]" :cy="n.p[1]" r="5" fill="var(--paper)" stroke="var(--brand)" stroke-width="2" />
              <text
                :x="n.p[0] + (n.x === 0 ? -12 : 12)"
                :y="n.p[1] + (n.z === 0 ? -8 : -10)"
                :text-anchor="n.x === 0 ? 'end' : 'start'"
                class="bs-num"
                font-weight="600"
                fill="var(--ink)"
              >
                {{ n.label }}
              </text>
            </g>
            <g class="bs-layer text-muted" :class="{ on: active === 0 }" stroke="currentColor" fill="currentColor">
              <line :x1="px(0, 0)[0]" :x2="px(6, 0)[0]" :y1="Y0 + 52" :y2="Y0 + 52" stroke-width="1" />
              <line v-for="x in [0, 6]" :key="x" :x1="px(x, 0)[0]" :x2="px(x, 0)[0]" :y1="Y0 + 44" :y2="Y0 + 60" stroke-width="1" />
              <text :x="px(3, 0)[0]" :y="Y0 + 46" text-anchor="middle" stroke="none" class="bs-num">6 {{ unit('length') }}</text>
              <line :x1="px(6, 0)[0] + 58" :x2="px(6, 0)[0] + 58" :y1="px(6, -4)[1]" :y2="px(6, 0)[1]" stroke-width="1" />
              <line v-for="z in [0, -4]" :key="z" :x1="px(6, 0)[0] + 50" :x2="px(6, 0)[0] + 66" :y1="px(6, z)[1]" :y2="px(6, z)[1]" stroke-width="1" />
              <text :x="px(6, 0)[0] + 66" :y="px(6, -2)[1] + 4" stroke="none" class="bs-num">4 {{ unit('length') }}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bs-num {
  font-family: var(--font-sans);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.bs-halo {
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
}
.bs-layer {
  opacity: 0;
  transition: opacity 0.45s ease;
}
.bs-layer.on {
  opacity: 1;
}
/* Members draw themselves from end to end */
.bs-member {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.bs-member.on {
  stroke-dashoffset: 0;
}
@media (prefers-reduced-motion: reduce) {
  .bs-layer,
  .bs-member {
    transition: none;
  }
}
</style>
