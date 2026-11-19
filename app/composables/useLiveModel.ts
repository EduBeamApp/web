import type { LinearStaticSolver } from '@edubeam/fem'
import type { ResultLayer } from '@edubeam/plot'
import { encodeLayers, LAYER_LETTERS, serializeModel, type Layers } from '~/lib/share-link'

/** The app's view layer for each of the plot's result diagrams. */
const RESULT_LAYER = {
  N: 'showNormalForce',
  V: 'showShearForce',
  M: 'showBendingMoment',
  w: 'showDeformedShape',
} as const satisfies Record<ResultLayer, Layers[keyof Layers]>

/**
 * The app's `?show=` for a figure showing one result: that diagram with the supports, loads and
 * reactions, and nothing else, so the model opens looking as it does on the page; `labels` adds the
 * node and element numbers.
 */
export const showOnly = (result: ResultLayer, labels = false) => {
  const layers = Object.fromEntries(Object.values(LAYER_LETTERS).map((key) => [key, false])) as Layers
  for (const key of [RESULT_LAYER[result], 'showReactions', 'showLoads', 'showSupports'] as const) layers[key] = true
  // A figure that names its nodes opens with the app's node and element numbers on, as the text uses them
  if (labels) layers.showNodeLabels = layers.showElementLabels = true
  return encodeLayers(layers)
}

/**
 * What every live model on the site shares: numbers written the way the page's language writes
 * them (12,5 in Czech, 12.5 in English), and a link that opens the model in the app as it stands.
 */
export const useLiveModel = () => {
  const { locale } = useI18n()
  const { appLocale } = useDocsNav()

  // Hindi pages read results in Western digits, as the app shows them
  // Four significant digits, but never rounding off whole units (12 345 stays 12 345): solver noise
  // such as 39.998 reads 40, and a symmetric pair 25.3125 reads 25.31 on both sides
  const numberFormat = computed(
    () =>
      new Intl.NumberFormat(locale.value === 'hi' ? 'en' : locale.value, {
        maximumSignificantDigits: 4,
        maximumFractionDigits: 0,
        roundingPriority: 'morePrecision',
      })
  )

  /** The `?model=` share link the app reads, in the page's language; `show` picks what it displays. */
  const openUrl = (solver: LinearStaticSolver, show?: string) => {
    const model = encodeURIComponent(serializeModel(solver))
    return `https://run.edubeam.app/?model=${model}&lang=${appLocale.value}${show ? `&show=${show}` : ''}`
  }

  return { numberFormat, openUrl }
}
