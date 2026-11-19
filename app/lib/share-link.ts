/**
 * The `?model=` and `?show=` values of the app's share links, written as the app writes them
 * (`serializeModel` and `encodeLayers` in the app's src/utils). Both formats are frozen by the app's
 * backward compatibility policy, so links written here open in every version of the app.
 */
import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  type LinearStaticSolver,
} from '@edubeam/fem'

/** The layer each `?show=` letter turns on: `show=MRL` is the moments, the reactions and the loads. */
export const LAYER_LETTERS = {
  N: 'showNormalForce',
  V: 'showShearForce',
  M: 'showBendingMoment',
  U: 'showDeformedShape',
  R: 'showReactions',
  L: 'showLoads',
  S: 'showSupports',
  n: 'showNodeLabels',
  e: 'showElementLabels',
} as const

export type LayerKey = (typeof LAYER_LETTERS)[keyof typeof LAYER_LETTERS]
export type Layers = Record<LayerKey, boolean>

/** The letters of the layers that are on, in the app's fixed order. */
export const encodeLayers = (layers: Readonly<Layers>): string =>
  (Object.entries(LAYER_LETTERS) as [string, LayerKey][])
    .filter(([, key]) => layers[key])
    .map(([letter]) => letter)
    .join('')

/** UTF-8 JSON in base64, so labels in any script survive (`btoa` alone takes only Latin-1). */
const toBase64 = (value: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

/** A model as the app's `?model=` reads it. The site's models have no dimension lines or section shapes. */
export const serializeModel = (solver: LinearStaticSolver): string => {
  const { domain } = solver
  const loads = solver.loadCases[0]
  const elementLoads = loads.elementLoadList

  const rows = {
    n: [...domain.nodes].map(([id, node]) => [
      id,
      node.coords,
      [...node.bcs.values()],
      node.hasLcs() ? [...node.lcs[0], ...node.lcs[1]] : null,
    ]),
    e: [...domain.elements].map(([id, element]) => [id, element.nodes, element.mat, element.cs, element.hinges]),
    m: [...domain.materials].map(([id, material]) => [id, material.d, material.e, material.g, material.alpha]),
    cs: [...domain.crossSections].map(([id, cs]) => [id, cs.a, cs.iy, cs.h, cs.k]),
    el: elementLoads
      .filter((load) => load instanceof BeamElementUniformEdgeLoad)
      .map((load) => [load.target, load.values, load.lcs]),
    ecl: elementLoads
      .filter((load) => load instanceof BeamConcentratedLoad)
      .map((load) => [load.target, load.values, load.lcs]),
    etl: elementLoads.filter((load) => load instanceof BeamTemperatureLoad).map((load) => [load.target, load.values]),
    etr: elementLoads
      .filter((load) => load instanceof BeamElementTrapezoidalEdgeLoad)
      .map((load) => [load.target, load.startValues, load.endValues, load.lcs]),
    // A third entry only for a load in the node's own axes, as the app writes it
    nl: loads.nodalLoadList.map((load) => (load.lcs ? [load.target, load.values, true] : [load.target, load.values])),
    pd: (loads.prescribedBC ?? []).map((bc) => [bc.target, bc.prescribedValues]),
  }

  // Empty lists are left out and the dimension lines always written, in the app's key order
  const model: Record<string, unknown[]> = {}
  for (const key of ['n', 'e', 'm', 'cs', 'el', 'ecl', 'etl', 'etr', 'nl', 'pd'] as const) {
    if (rows[key].length > 0) model[key] = rows[key]
  }
  model.d = []

  return toBase64(model)
}
