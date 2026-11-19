<script setup lang="ts">
const { t } = useI18n()
/**
 * One element in its local axes, as the theory manual needs it: `::element-sketch{mode="dofs"}`.
 *
 * - `dofs`: the six degrees of freedom u, w, φ at both ends, all drawn positive;
 * - `end-forces`: the end forces X, Z, M in the same directions, as the Element results table signs them;
 * - `internal-forces`: a short piece cut out of the member, with positive N, V and M on both faces.
 *
 * Positive is the site's convention (conventions.md): x right, z down, rotations counter-clockwise on
 * screen; V turns a piece clockwise, M sags (tension on the dashed bottom fibres).
 */
const props = withDefaults(
  defineProps<{
    mode?: 'dofs' | 'end-forces' | 'internal-forces'
    /** End hinges, as `[start, end]` */
    hinges?: readonly [boolean, boolean]
    /** Off for a truss bar, whose end rotations are condensed out: only u and w (X and Z) */
    rotations?: boolean
    caption?: string
  }>(),
  { mode: 'dofs', hinges: () => [false, false], rotations: true, caption: undefined }
)

type Pt = readonly [number, number]
/** Two decimals: trigonometry differs in the last digit between server and browser */
const n = (v: number) => Math.round(v * 100) / 100
const Y = 100 // the member's axis
const X1 = 120
const X2 = 400
const R = 24 // moment arcs

/** An arrow's shaft and head, from `a` to `b`. */
const arrow = (a: Pt, b: Pt, head = 9) => {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const l = Math.hypot(dx, dy)
  const [ux, uy] = [dx / l, dy / l]
  const base: Pt = [b[0] - ux * head, b[1] - uy * head]
  const w = head * 0.45
  return {
    shaft: `M${n(a[0])} ${n(a[1])}L${n(base[0])} ${n(base[1])}`,
    head: `M${n(b[0])} ${n(b[1])}L${n(base[0] - uy * w)} ${n(base[1] + ux * w)}L${n(base[0] + uy * w)} ${n(base[1] - ux * w)}Z`,
  }
}

/**
 * An arc round `c` from angle `a0` to `a1` (degrees, counter-clockwise on screen as y points up
 * out of it), with the head at `a1`.
 */
const arc = (c: Pt, r: number, a0: number, a1: number, head = 9) => {
  const p = (a: number): Pt => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] - r * Math.sin((a * Math.PI) / 180)]
  const ccw = a1 > a0
  // Stop the line short of the head, along the circle
  const stop = a1 - (ccw ? 1 : -1) * ((head * 0.8) / r) * (180 / Math.PI)
  const [s, e] = [p(a0), p(stop)]
  const large = Math.abs(stop - a0) > 180 ? 1 : 0
  const tip = p(a1)
  const t = (a1 * Math.PI) / 180
  // Tangent on screen in the direction of travel
  const [ux, uy] = ccw ? [-Math.sin(t), -Math.cos(t)] : [Math.sin(t), Math.cos(t)]
  const base: Pt = [tip[0] - ux * head, tip[1] - uy * head]
  const w = head * 0.45
  return {
    shaft: `M${n(s[0])} ${n(s[1])}A${r} ${r} 0 ${large} ${ccw ? 0 : 1} ${n(e[0])} ${n(e[1])}`,
    head: `M${n(tip[0])} ${n(tip[1])}L${n(base[0] - uy * w)} ${n(base[1] + ux * w)}L${n(base[0] + uy * w)} ${n(base[1] - ux * w)}Z`,
  }
}

type Mark = { shaft: string; head: string; tone: string; label: string; sub?: string; at: Pt; anchor?: 'start' | 'middle' | 'end' }

const BRAND = 'var(--brand)'
const marks = computed((): Mark[] => {
  if (props.mode === 'internal-forces') {
    const [L, Rx] = [210, 310] // the piece's faces
    const N = 'var(--color-normal)'
    const V = 'var(--color-shear)'
    const M = 'var(--color-moment)'
    return [
      { ...arrow([L, Y], [L - 56, Y]), tone: N, label: 'N', at: [L - 60, Y - 8], anchor: 'end' },
      { ...arrow([Rx, Y], [Rx + 56, Y]), tone: N, label: 'N', at: [Rx + 60, Y - 8], anchor: 'start' },
      { ...arrow([L, Y + 52], [L, Y + 8]), tone: V, label: 'V', at: [L - 8, Y + 50], anchor: 'end' },
      { ...arrow([Rx, Y - 52], [Rx, Y - 8]), tone: V, label: 'V', at: [Rx + 8, Y - 40], anchor: 'start' },
      { ...arc([L, Y], R + 10, 235, 125), tone: M, label: 'M', at: [L - 40, Y - 30], anchor: 'end' },
      { ...arc([Rx, Y], R + 10, -55, 55), tone: M, label: 'M', at: [Rx + 40, Y - 30], anchor: 'start' },
    ]
  }
  const [u, w, r] = props.mode === 'dofs' ? ['u', 'w', 'φ'] : ['X', 'Z', 'M']
  const sub = (i: 1 | 2) => (props.mode === 'dofs' ? String(i) : i === 1 ? '12' : '21')
  return ([1, 2] as const).flatMap((i): Mark[] => {
    const x = i === 1 ? X1 : X2
    // u points right: into the start node from outside, out of the end node; never along the member
    const along = i === 1 ? arrow([x - 66, Y], [x - 10, Y]) : arrow([x + 10, Y], [x + 66, Y])
    return [
      { ...along, tone: BRAND, label: u, sub: sub(i), at: i === 1 ? [x - 40, Y - 10] : [x + 40, Y - 10], anchor: 'middle' },
      { ...arrow([x, Y + 10], [x, Y + 62]), tone: BRAND, label: w, sub: sub(i), at: [x + 9, Y + 54], anchor: 'start' },
      ...(props.rotations
        ? [
            {
              ...arc([x, Y], R, i === 1 ? 20 : 15, i === 1 ? 165 : 160),
              tone: BRAND,
              label: r,
              sub: sub(i),
              at: [x, Y - R - 10] as Pt,
              anchor: 'middle' as const,
            },
          ]
        : []),
    ]
  })
})

const piece = computed(() => props.mode === 'internal-forces')
const ends = computed(() => (piece.value ? [210, 310] : [X1, X2]))
</script>

<template>
  <figure class="element-sketch not-prose my-8">
    <svg
      viewBox="0 0 520 200"
      class="mx-auto block w-full max-w-[34rem] text-ink"
      role="img"
      :aria-label="caption ?? t('ui.elementSketch')"
    >
      <!-- Local axes, bottom left -->
      <g class="text-muted" stroke="currentColor" fill="currentColor">
        <path d="M22 168L58 168" stroke-width="1.5" fill="none" />
        <path d="M64 168L56 164.5L56 171.5Z" stroke="none" />
        <path d="M22 168L22 192" stroke-width="1.5" fill="none" />
        <path d="M22 198L18.5 190L25.5 190Z" stroke="none" />
        <text x="66" y="172" class="sym" stroke="none">x</text>
        <text x="30" y="198" class="sym" stroke="none">z</text>
      </g>

      <!-- The member (or the cut piece), with its bottom fibres dashed -->
      <path :d="`M${ends[0]} ${Y}L${ends[1]} ${Y}`" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <path
        :d="`M${ends[0] + 8} ${Y + 8}L${ends[1] - 8} ${Y + 8}`"
        stroke="currentColor"
        stroke-opacity="0.55"
        stroke-width="1.25"
        stroke-dasharray="5 4"
      />
      <template v-if="piece">
        <path v-for="x in ends" :key="x" :d="`M${x} ${Y - 14}L${x} ${Y + 14}`" stroke="currentColor" stroke-width="1.5" />
      </template>
      <template v-else>
        <circle
          v-for="(x, i) in ends"
          :key="x"
          :cx="x"
          :cy="Y"
          :r="hinges[i] ? 5 : 4"
          :fill="hinges[i] ? 'var(--paper)' : 'currentColor'"
          stroke="currentColor"
          stroke-width="2"
        />
        <text :x="X1 - 6" :y="Y + 26" text-anchor="end" class="node">1</text>
        <text :x="X2 + 6" :y="Y + 26" class="node">2</text>
      </template>

      <g v-for="(m, i) in marks" :key="i" :style="{ color: m.tone }">
        <path :d="m.shaft" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        <path :d="m.head" fill="currentColor" />
        <text :x="m.at[0]" :y="m.at[1]" :text-anchor="m.anchor ?? 'start'" class="sym" fill="currentColor">
          {{ m.label }}<tspan v-if="m.sub" class="sub" dy="4">{{ m.sub }}</tspan>
        </text>
      </g>
    </svg>
    <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.sym {
  font-family: KaTeX_Math, 'Latin Modern Math', Georgia, serif;
  font-style: italic;
  font-size: 17px;
}
.sub {
  font-family: KaTeX_Main, Georgia, serif;
  font-style: normal;
  font-size: 12px;
}
.node {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  fill: var(--muted);
}
</style>
