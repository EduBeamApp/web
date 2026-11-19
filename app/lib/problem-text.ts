import type { Problem, Text, TextParam } from './problems'

/**
 * A problem's words in one language: its messages (`problems.*` in the locale files) filled in with
 * its numbers, written as that language writes them (1.5 m in English, 1,5 m in Czech).
 */

/** vue-i18n's `t` in the language the text is shown in; `count` picks a plural form */
export type Translate = (key: string, params: Readonly<Record<string, string>>, count?: number) => string

export interface TextLanguage {
  readonly locale: string
  readonly t: Translate
}

/** The lengths and loads of a problem as typed in its statement: 1.5, never 1.50 or 1,000 */
const numberFormat = (locale: string) => new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 6 })
// British usage in English, as on the rest of the site: "H, J and L", without a serial comma
const listFormat = (locale: string) => new Intl.ListFormat(locale === 'en' ? 'en-GB' : locale, { type: 'conjunction' })

/** Chinese lists join Latin labels with a bare 和 ("F和H"); Chinese puts a space between Han and Latin ("F 和 H") */
const spaceAroundLatin = (text: string, locale: string) =>
  locale.startsWith('zh') ? text.replace(/([A-Za-z0-9])(和)/g, '$1 $2').replace(/(和)([A-Za-z0-9])/g, '$1 $2') : text

export const renderText = (text: Text, language: TextLanguage): string => {
  const numbers = numberFormat(language.locale)
  const param = (value: TextParam): string => {
    if (typeof value === 'number') return numbers.format(value)
    if (typeof value === 'string') return value
    if ('key' in value) return renderText(value, language)
    return spaceAroundLatin(listFormat(language.locale).format(value.map((v) => param(v))), language.locale)
  }
  const params = Object.fromEntries(Object.entries(text.params ?? {}).map(([name, value]) => [name, param(value)]))
  return language.t(text.key, params, text.count)
}

/** "q = 8 kN/m" and "6 m" never break across lines: no-break spaces around "=" and before a unit */
const keepTogether = (text: string) => text.replace(/ = /g, ' = ').replace(/(\d) (?=(?:kN\/m|kNm|kN|m)\b)/g, '$1 ')

/** Languages that write sentences one after another with no space: 「…4 m。梁の…」 */
const NO_SPACE_BETWEEN_SENTENCES = new Set(['ja', 'zh'])

/** What goes between two sentences of a paragraph in this language */
export const sentenceGap = (locale: string): string => (NO_SPACE_BETWEEN_SENTENCES.has(locale.split('-')[0]) ? '' : ' ')

/** The structure and its loads, its sentences in one paragraph */
export const renderStatement = (problem: Problem, language: TextLanguage): string =>
  keepTogether(problem.statement.map((s) => renderText(s, language)).join(sentenceGap(language.locale)))
