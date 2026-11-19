import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

/**
 * Shiki for the code samples the pages write themselves (Markdown code blocks are highlighted by
 * Nuxt Content, with the same themes). The fine-grained core with the JavaScript regex engine -
 * no WebAssembly - and just the languages the site shows, so a page that highlights in the
 * browser stays light. One highlighter, made once and shared.
 */
export type CodeLang = 'ts' | 'vue' | 'bash'

let highlighter: Promise<HighlighterCore> | undefined

export const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({
    themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
    langs: [import('@shikijs/langs/typescript'), import('@shikijs/langs/vue'), import('@shikijs/langs/bash')],
    engine: createJavaScriptRegexEngine(),
  }))

/** Code as HTML coloured for both themes; the page's CSS picks the light or the dark colours. */
export const highlight = async (code: string, lang: CodeLang) => {
  const h = await getHighlighter()
  return h.codeToHtml(code, {
    lang: lang === 'ts' ? 'typescript' : lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
}
