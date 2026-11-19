import { PLOT_TEXTS, type PlotLayer, type PlotTexts } from '@edubeam/plot'

/** What a figure says to a screen reader, in the page's language: the plot library's own words are English. */
const NAMED: readonly PlotLayer[] = ['N', 'V', 'M', 'w', 'reactions', 'loads']

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n
  const texts = computed(
    (): PlotTexts => ({
      structure: (shown) => {
        const parts = shown.filter((l) => NAMED.includes(l)).map((l) => i18n.t(`plotTexts.layers.${l}`))
        return parts.length > 0 ? i18n.t('plotTexts.structureWith', { parts: parts.join(', ') }) : i18n.t('plotTexts.structure')
      },
      stack: (rows) =>
        rows.length > 0
          ? i18n.t('plotTexts.stackWith', { rows: rows.map((r) => i18n.t(`plotTexts.rows.${r}`)).join(', ') })
          : i18n.t('plotTexts.stack'),
      temperature: { uniform: i18n.t('plotTexts.temperatureUniform'), gradient: i18n.t('plotTexts.temperatureGradient') },
      loadHandle: (load) => i18n.t('plotTexts.loadHandle', { load }),
      loadPosition: (metres) => i18n.t('plotTexts.loadPosition', { metres }),
    })
  )
  nuxtApp.vueApp.provide(PLOT_TEXTS, texts)
})
