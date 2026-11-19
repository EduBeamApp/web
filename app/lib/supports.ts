/**
 * Supports and turned node axes for the models written into pages, as the app defines them (its
 * src/utils/supports.ts and nodalLcs.ts).
 */
import { DofID, type Node } from '@edubeam/fem'

/** The supports students name, each a fixed set of restrained DOFs in the node's axes. */
export const supportTypes = {
  free: [],
  pin: [DofID.Dx, DofID.Dz],
  roller: [DofID.Dz],
  verticalRoller: [DofID.Dx],
  fixed: [DofID.Dx, DofID.Dz, DofID.Ry],
  slider: [DofID.Dz, DofID.Ry],
  verticalSlider: [DofID.Dx, DofID.Ry],
  rotation: [DofID.Ry],
} as const satisfies Record<string, readonly DofID[]>

export type SupportType = keyof typeof supportTypes

/** Turns a node's axes to `degrees`; zero, or anything unreadable, removes them. */
export const applyNodeLcsAngle = (node: Node, degrees: number): void => {
  const radians = degrees * (Math.PI / 180)

  if (!Number.isFinite(radians) || Math.abs(radians) < 1e-8) {
    node.lcs = undefined
    return
  }

  node.updateLcs({ locx: [Math.cos(radians), 0, Math.sin(radians)], locy: [0, 1, 0] })
}
