/**
 * Statics problems from a seed: a structure with nice numbers, solved by @edubeam/fem, with the
 * answers a student is asked for read exactly from the solution. The practice page checks a
 * student's answers against them; the exam builder prints them as a key.
 *
 * A problem is named by a short code, its family's letter and its seed (`H2048`): the same code is
 * the same problem on every device and forever, so it can be assigned, shared and marked. Changing
 * a family's generator changes what its codes mean, so families are added, never reworked; a
 * generator that has to change becomes a new family with a new letter.
 *
 * Units: lengths in m, forces in kN, moments in kNm in everything a person reads; SI in the solver.
 *
 * Every word a person reads is an i18n message under `problems.*` (`i18n/locales/en.json`): a
 * problem holds its text as message keys and the numbers that go into them (see `Text`), and the
 * page renders it in its language with `renderText` (`problem-text.ts`). The draws never depend on
 * the language, so a code is the same problem in every language.
 */
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'
import { createExampleLibrary } from '~/lib/examples'

export type Level = 'basic' | 'advanced'

/**
 * Text for a person to read: an i18n message and what goes into its placeholders. Numbers are
 * written the way the language writes them, a list is joined as the language joins one ("H, J and
 * L"), and `count` picks the plural form.
 */
export interface Text {
  readonly key: string
  readonly params?: Readonly<Record<string, TextParam>>
  readonly count?: number
}
export type TextParam = string | number | Text | readonly (string | Text)[]

const text = (key: string, params?: Text['params'], count?: number): Text => ({
  key: `problems.${key}`,
  ...(params ? { params } : {}),
  ...(count === undefined ? {} : { count }),
})

/**
 * A family's name, the skill it practises (in a few words) and how to start for a student who is
 * stuck: `problems.families.<id>.name`, `.skill` and `.hint`.
 */
export interface Family {
  readonly letter: string
  readonly level: Level
}
export const familyText = (family: FamilyId, field: 'name' | 'skill' | 'hint'): Text => text(`families.${family}.${field}`)

/** Every family, in the order they are offered. Letters are part of every code: never reuse one. */
export const FAMILIES = {
  simple: { letter: 'S', level: 'basic' },
  cantilever: { letter: 'C', level: 'basic' },
  overhang: { letter: 'O', level: 'basic' },
  gerber: { letter: 'G', level: 'basic' },
  threeHinged: { letter: 'H', level: 'basic' },
  truss: { letter: 'T', level: 'basic' },
  continuous: { letter: 'K', level: 'advanced' },
  portal: { letter: 'P', level: 'advanced' },
} as const satisfies Record<string, Family>

export type FamilyId = keyof typeof FAMILIES
export const FAMILY_IDS = Object.keys(FAMILIES) as FamilyId[]

/** One number the student works out. Signs are the textbook's, given with each answer's arrow. */
export interface Answer {
  readonly id: string
  /** As written beside the field, with a subscript: A + z, M + A, |M| + max, N + C–G */
  readonly symbol: readonly [base: string, sub: string]
  /** What it is, in words */
  readonly label: Text
  /** Positive direction: right, up, counter-clockwise, tension; none for a magnitude */
  readonly positive?: '→' | '↑' | '↺' | 'tension'
  readonly unit: 'kN' | 'kNm'
  readonly value: number
}

export interface Problem {
  readonly code: string
  readonly family: FamilyId
  readonly seed: number
  /** The structure and its loads in words, for the sheet and for screen readers: sentences, joined by a space */
  readonly statement: readonly Text[]
  /** What to find */
  readonly task: Text
  readonly build: (solver: LinearStaticSolver) => void
  /** The bar whose force is asked for, a truss's */
  readonly bar?: { readonly id: string; readonly name: string }
}

export interface Solved {
  readonly problem: Problem
  readonly solver: LinearStaticSolver
  readonly model: PlotModel
  readonly answers: readonly Answer[]
}

/** mulberry32: a tiny seeded generator, so a seed names one problem for good */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = seed
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const kN = 1000
/** The restrained DOFs of each support, as the app's `supportTypes` has them */
const SUPPORTS = {
  pin: [DofID.Dx, DofID.Dz],
  roller: [DofID.Dz],
  fixed: [DofID.Dx, DofID.Dz, DofID.Ry],
} as const
const node = (s: LinearStaticSolver, id: string, x: number, z: number, support?: keyof typeof SUPPORTS) =>
  s.domain.createNode(id, [x, 0, z], support ? [...SUPPORTS[support]] : [])
const member = (s: LinearStaticSolver, id: string, a: string, b: string, hinges: [boolean, boolean] = [false, false]) =>
  s.domain.createBeam2D(id, [a, b], 1, 1, hinges)
const udl = (s: LinearStaticSolver, id: string, q: number) =>
  s.loadCases[0].createBeamElementUniformEdgeLoad(id, [0, q * kN], false)
const point = (s: LinearStaticSolver, id: string, F: number, at: number) =>
  s.loadCases[0].createBeamConcentratedLoad(id, [0, F * kN, 0, at], false)
const nodal = (s: LinearStaticSolver, id: string, { fx = 0, fz = 0, my = 0 }) =>
  s.loadCases[0].createNodalLoad(id, { [DofID.Dx]: fx * kN, [DofID.Dz]: fz * kN, [DofID.Ry]: my * kN })

const ADVANCED_NOTE = text('statement.advancedNote')
const BEAM_TASK = text('task.beam')

type Draw = { pick: <T>(xs: readonly T[]) => T; int: (lo: number, hi: number) => number; chance: (p: number) => boolean }
type Spec = Omit<Problem, 'code' | 'family' | 'seed'>

const GENERATORS: Record<FamilyId, (d: Draw) => Spec> = {
  simple: ({ pick, int, chance }) => {
    const L = pick([4, 5, 6, 8])
    const q = chance(0.75) ? int(4, 16) : 0
    const a = int(1, L - 1)
    const F = q && chance(0.35) ? 0 : int(2, 8) * 5
    const M = chance(0.25) ? int(1, 4) * 5 : 0
    const parts = [q && text('load.udlSpan', { q }), F && text('load.pointFromA', { F, a }), M && text('load.momentAtB', { M })]
    return {
      statement: [text('statement.simple', { L, loads: parts.filter((x): x is Text => !!x) })],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', L, 0, 'roller')
        member(s, '1', 'A', 'B')
        if (q) udl(s, '1', q)
        if (F) point(s, '1', F, a)
        if (M) nodal(s, 'B', { my: M })
      },
    }
  },
  cantilever: ({ pick, int, chance }) => {
    const L = pick([2, 3, 4])
    const q = int(4, 12)
    const F = int(1, 6) * 5
    const M = chance(0.4) ? int(1, 3) * 5 : 0
    return {
      statement: [text(M ? 'statement.cantileverMoment' : 'statement.cantilever', { L, q, F, M })],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'fixed')
        node(s, 'B', L, 0)
        member(s, '1', 'A', 'B')
        udl(s, '1', q)
        nodal(s, 'B', { fz: F, my: M })
      },
    }
  },
  overhang: ({ pick, int, chance }) => {
    const L = pick([4, 5, 6])
    const c = pick([1, 1.5, 2])
    const q = int(4, 14)
    const F = int(2, 6) * 5
    const all = chance(0.4)
    return {
      statement: [text(all ? 'statement.overhangAll' : 'statement.overhang', { L, c, q, F })],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', L, 0, 'roller')
        node(s, 'C', L + c, 0)
        member(s, '1', 'A', 'B')
        member(s, '2', 'B', 'C')
        udl(s, '1', q)
        if (all) udl(s, '2', q)
        nodal(s, 'C', { fz: F })
      },
    }
  },
  gerber: ({ pick, int, chance }) => {
    const L1 = pick([4, 5, 6])
    const g = pick([1, 1.5, 2])
    const L3 = pick([3, 4])
    const q = int(4, 12)
    const F = chance(0.5) ? int(2, 6) * 5 : 0
    return {
      statement: [text('statement.gerber', { g, L1, L3 }), text(F ? 'statement.gerberLoadForce' : 'statement.gerberLoad', { q, F })],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', L1, 0, 'roller')
        node(s, 'G', L1 + g, 0)
        node(s, 'C', L1 + g + L3, 0, 'roller')
        member(s, '1', 'A', 'B')
        member(s, '2', 'B', 'G', [false, true])
        member(s, '3', 'G', 'C')
        for (const id of ['1', '2', '3']) udl(s, id, q)
        if (F) point(s, '1', F, L1 / 2)
      },
    }
  },
  threeHinged: ({ pick, int, chance }) => {
    const L = pick([6, 8])
    const H = pick([3, 4])
    const q = int(4, 12)
    const both = chance(0.6)
    const F = chance(0.5) ? int(1, 4) * 5 : 0
    return {
      statement: [
        text('statement.threeHinged', { L, H }),
        text(`statement.threeHinged${both ? 'Whole' : 'Half'}${F ? 'Force' : ''}`, { q, F }),
      ],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', 0, -H)
        node(s, 'C', L / 2, -H)
        node(s, 'D', L, -H)
        node(s, 'E', L, 0, 'pin')
        member(s, '1', 'A', 'B')
        member(s, '2', 'B', 'C', [false, true])
        member(s, '3', 'C', 'D')
        member(s, '4', 'D', 'E')
        udl(s, '2', q)
        if (both) udl(s, '3', q)
        if (F) nodal(s, 'B', { fx: F })
      },
    }
  },
  truss: ({ pick, int, chance }) => {
    // Panel and height in 3-4-5 proportion, so every diagonal is a whole or half metre
    const [d, h] = pick([
      [3, 2],
      [4, 1.5],
      [6, 4],
    ] as const)
    const n = pick([4, 6])
    const F = int(2, 6) * 5
    const bottom = Array.from({ length: n + 1 }, (_, i) => String.fromCharCode(65 + i))
    const top = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + n + 1 + i))
    // Loads on the top joints, as a roof's purlins put them there: all of them, or every other one
    const everyOther = chance(0.35)
    const loaded = top.filter((_, i) => !everyOther || i % 2 === 0)
    // The bar to find: a top chord, bottom chord or diagonal near the middle, by a section
    const mid = Math.floor(n / 2) - (chance(0.5) ? 1 : 0)
    const bar = pick([
      { a: top[mid], b: top[mid + 1] ?? top[mid - 1] },
      { a: bottom[mid], b: bottom[mid + 1] },
      { a: bottom[mid], b: top[mid] },
      { a: top[mid], b: bottom[mid + 1] },
    ])
    const [a, b] = [bar.a, bar.b].sort()
    return {
      statement: [
        text('statement.truss', { panels: text('statement.panels', { n }, n), d, h, end: bottom[n] ?? '' }),
        loaded.length === n ? text('statement.trussLoadAll', { F }) : text('statement.trussLoad', { F, joints: loaded }),
      ],
      task: text('task.bar', { bar: `${a}–${b}` }),
      bar: { id: `${a}-${b}`, name: `${a}–${b}` },
      build: (s) => {
        bottom.forEach((id, i) => node(s, id, i * d, 0, i === 0 ? 'pin' : i === n ? 'roller' : undefined))
        top.forEach((id, i) => node(s, id, (i + 0.5) * d, -h))
        const bars: [string, string][] = [
          ...bottom.slice(1).map((id, i): [string, string] => [bottom[i], id]),
          ...top.slice(1).map((id, i): [string, string] => [top[i], id]),
          ...top.flatMap((id, i): [string, string][] => [
            [bottom[i], id],
            [id, bottom[i + 1]],
          ]),
        ]
        for (const [p, q] of bars) member(s, [p, q].sort().join('-'), p, q, [true, true])
        for (const id of loaded) nodal(s, id, { fz: F })
      },
    }
  },
  continuous: ({ pick, int, chance }) => {
    const L1 = pick([3, 4, 5, 6])
    const L2 = pick([3, 4, 5, 6])
    const q = int(5, 15)
    const both = chance(0.6)
    return {
      statement: [text(both ? 'statement.continuousBoth' : 'statement.continuous', { L1, L2, q }), ADVANCED_NOTE],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', L1, 0, 'roller')
        node(s, 'C', L1 + L2, 0, 'roller')
        member(s, '1', 'A', 'B')
        member(s, '2', 'B', 'C')
        udl(s, '1', q)
        if (both) udl(s, '2', q)
      },
    }
  },
  portal: ({ pick, int, chance }) => {
    const L = pick([4, 5, 6])
    const H = pick([3, 4])
    const q = int(4, 12)
    const F = chance(0.6) ? int(1, 4) * 5 : 0
    return {
      statement: [text(F ? 'statement.portalForce' : 'statement.portal', { L, H, q, F }), ADVANCED_NOTE],
      task: BEAM_TASK,
      build: (s) => {
        node(s, 'A', 0, 0, 'pin')
        node(s, 'B', 0, -H)
        node(s, 'C', L, -H)
        node(s, 'D', L, 0, 'pin')
        member(s, '1', 'A', 'B')
        member(s, '2', 'B', 'C')
        member(s, '3', 'C', 'D')
        udl(s, '2', q)
        if (F) nodal(s, 'B', { fx: F })
      },
    }
  },
}

/** The problem a family and seed name */
export const makeProblem = (family: FamilyId, seed: number): Problem => {
  const r = random(seed)
  const draw: Draw = {
    pick: (xs) => xs[Math.floor(r() * xs.length)],
    int: (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)),
    chance: (p) => r() < p,
  }
  const spec = GENERATORS[family](draw)
  return { ...spec, code: `${FAMILIES[family].letter}${seed}`, family, seed }
}

/** `H2048` → the three-hinged frame of seed 2048; `undefined` for anything else */
export const problemFromCode = (code: string): Problem | undefined => {
  const match = /^([A-Z])(\d{1,6})$/.exec(code.trim().toUpperCase())
  const family = match && FAMILY_IDS.find((f) => FAMILIES[f].letter === match[1])
  return family ? makeProblem(family, Number(match[2])) : undefined
}

/** A fresh seed, four or five digits, for a new problem */
export const newSeed = (): number => 1000 + Math.floor(Math.random() * 99000)

/** A seed for problem `index` of version `version` of an exam: the same exam seed, the same papers */
export const examSeed = (exam: number, version: number, index: number): number =>
  1000 + ((exam * 7919 + version * 104729 + index * 1299709) % 99000)

const ROUND = (v: number) => Math.round(v * 1e6) / 1e6

export const solveProblem = (problem: Problem): Solved => {
  const solver = new LinearStaticSolver()
  // The app's example steel and section: its area of 1 m² makes shear and axial deformation
  // negligible, so an indeterminate problem's answers are the hand calculation's (force method)
  createExampleLibrary(solver)
  problem.build(solver)
  solver.solve()
  const model = modelFromSolver(solver)
  const results = model.results
  if (!results) throw new Error(`Problem ${problem.code} did not solve`)

  const answers: Answer[] = []
  for (const r of results.reactions) {
    if (Math.abs(r.value) < 1e-6 && r.dof === 'ry') continue
    const v = r.value / kN
    if (r.dof === 'dx')
      answers.push({ id: `${r.node}x`, symbol: [r.node, 'x'], label: text('answer.horizontal', { node: r.node }), positive: '→', unit: 'kN', value: ROUND(v) })
    if (r.dof === 'dz')
      answers.push({ id: `${r.node}z`, symbol: [r.node, 'z'], label: text('answer.vertical', { node: r.node }), positive: '↑', unit: 'kN', value: ROUND(-v) })
    if (r.dof === 'ry')
      answers.push({ id: `M${r.node}`, symbol: ['M', r.node], label: text('answer.fixingMoment', { node: r.node }), positive: '↺', unit: 'kNm', value: ROUND(v) })
  }

  if (problem.bar) {
    const N = results.members[problem.bar.id]?.N
    const e = N && extremes(N)
    const value = e ? (Math.abs(e.max.value) >= Math.abs(e.min.value) ? e.max.value : e.min.value) / kN : 0
    answers.push({
      id: 'N',
      symbol: ['N', problem.bar.name],
      label: text('answer.bar', { bar: problem.bar.name }),
      positive: 'tension',
      unit: 'kN',
      value: ROUND(value),
    })
  } else {
    let largest = 0
    for (const r of Object.values(results.members)) {
      const e = extremes(r.M)
      if (e) largest = Math.max(largest, Math.abs(e.max.value), Math.abs(e.min.value))
    }
    answers.push({ id: 'Mmax', symbol: ['|M|', 'max'], label: text('answer.largestMoment'), unit: 'kNm', value: ROUND(largest / kN) })
  }
  return { problem, solver, model, answers }
}

/**
 * Whether a typed answer is right: within 1 % of the exact value, or 0.05 of a unit for values near
 * zero (answers are read off to two decimals). The sign must match unless the answer is a magnitude.
 */
export const isCorrect = (answer: Answer, typed: number): boolean => {
  const exact = answer.value
  return Math.abs(typed - exact) <= Math.max(0.01 * Math.abs(exact), 0.05)
}
