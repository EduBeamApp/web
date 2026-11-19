/**
 * The site's public URLs, for the page head, the sitemap and llms.txt. Safe in the browser: the
 * build-time scan of `content/` that produces the page list is in `site-pages.ts`, which reads files.
 */
export const SITE_URL = 'https://www.edubeam.app'

export interface SitePage {
  /** The English path, which names the page in every language */
  readonly path: string
  /** Language codes it exists in, English first */
  readonly locales: readonly string[]
}

/** A page's path in one language: `/cs/guide/intro`, and `/cs` for the home page */
export const localizedPath = (code: string, path: string): string =>
  code === 'en' ? path : path === '/' ? `/${code}` : `/${code}${path}`

/**
 * The pages that are Vue, not Markdown, and the languages their strings are translated into
 * (`practice.*`, `exam.*`, `solver.*`, `plot.*` in `i18n/locales/<code>.json`; the problems of the
 * practice page and the exam builder are `problems.*`). Add a code once its strings are in: the
 * page then gets its URL in that language (`/cs/practice`), the links, the sitemap and the page head
 * name it, and the English page stops standing in for it. In the sitemap's order.
 */
export const VUE_PAGES = {
  '/practice': ['en', 'de', 'es', 'fr', 'pt', 'it', 'pl', 'ru', 'uk', 'ja', 'cs'],
  '/exam': ['en', 'de', 'es', 'fr', 'pt', 'it', 'pl', 'ru', 'uk', 'ja', 'cs'],
  '/solver': ['en', 'de', 'es', 'fr', 'pt', 'it', 'pl', 'ru', 'uk', 'ja', 'cs'],
  '/plot': ['en', 'de', 'es', 'fr', 'pt', 'it', 'pl', 'ru', 'uk', 'ja', 'cs'],
} as const satisfies Readonly<Record<string, readonly string[]>>

/** The pages above as the page list has them */
export const vuePages = (): SitePage[] => Object.entries(VUE_PAGES).map(([path, locales]) => ({ path, locales }))

/** The language code a path starts with, `en` for none: `/cs/guide/x` → `cs` */
export const localeOfPath = (path: string, codes: readonly string[]): string => {
  const first = /^\/([a-z]{2})(?=[/?#]|$)/.exec(path)?.[1]
  return first && codes.includes(first) ? first : 'en'
}

/** A path without its language prefix, the English path that names the page: `/cs/guide/x` → `/guide/x` */
export const englishPath = (path: string, code: string): string =>
  code === 'en' ? path : path.replace(new RegExp(`^/${code}(?=[/?#]|$)`), '') || '/'

/**
 * The whole page at a URL whose page is not translated into its language: it redirects to the
 * English page, keeping the query and hash (`/cs/exam?e=4821…` opens the same exam), with a meta
 * refresh where scripts do not run, and names the English page as canonical. What the static site
 * serves there; in the running app `useEnglishFallback` redirects the same way.
 */
export const redirectPage = (english: string): string => {
  const href = english.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return [
    '<!DOCTYPE html>',
    '<html><head><meta charset="utf-8">',
    `<link rel="canonical" href="${SITE_URL}${href}">`,
    `<meta http-equiv="refresh" content="0; url=${href}">`,
    `<script>location.replace(${JSON.stringify(english).replace(/</g, '\\u003c')} + location.search + location.hash)</script>`,
    `</head><body><a href="${href}">${SITE_URL}${href}</a></body></html>`,
    '',
  ].join('\n')
}

/** `/examples/` and `/examples` are one page */
export const pageKey = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)
