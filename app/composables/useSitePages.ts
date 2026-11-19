import navigation from '~/data/navigation.json'
import { englishPath, localeOfPath, localizedPath, pageKey } from '~/lib/site-urls'

const CODES = Object.keys(navigation)

/** `/plot/functions#svg` → [`/plot/functions`, `#svg`] */
const splitPath = (link: string): [path: string, rest: string] => {
  const at = link.search(/[?#]/)
  return at < 0 ? [link, ''] : [link.slice(0, at), link.slice(at)]
}

/**
 * Which languages a page is in, and the links that follow from it. A page not translated into a
 * language has no URL in it that anything links to: the header, sidebars, footer, home page and
 * language switch send a reader of that language to the English page instead. The languages come
 * from `partialTranslations` (every page not in all languages: docs and library pages by the files
 * in `content/`, the Vue pages by `VUE_PAGES`).
 */
export const useSitePages = () => {
  const { locale } = useI18n()
  const partial = useRuntimeConfig().public.partialTranslations as Readonly<Record<string, readonly string[]>>
  const byKey = new Map(Object.entries(partial).map(([path, codes]) => [pageKey(path), codes]))

  /** The languages a page is in, by its English path */
  const localesOf = (english: string): readonly string[] => byKey.get(pageKey(english)) ?? CODES
  const isIn = (english: string, code: string): boolean => localesOf(english).includes(code)

  /** A page by its English path, in the reader's language (or `code`) where it is translated, else in English */
  const sitePath = (english: string, code: string = locale.value): string => {
    const [path, rest] = splitPath(english)
    return localizedPath(isIn(path, code) ? code : 'en', path) + rest
  }

  /** A link as a language's navigation writes it (`/cs/practice`), sent to English while that page is not in Czech */
  const resolveLink = (link: string): string => {
    const [path, rest] = splitPath(link)
    const code = localeOfPath(path, CODES)
    const english = englishPath(path, code)
    return (isIn(english, code) ? path : english) + rest
  }

  return { localesOf, isIn, sitePath, resolveLink }
}

/**
 * For a page that is not translated into the language of its URL (`/cs/solver` while the solver's
 * page is English only): no page at that URL, but a redirect to the English one, so the URL is
 * neither a 404 nor a copy of the English page. The prerendered file redirects with a script that
 * keeps the query and hash (`/cs/exam?e=4821…` opens the same exam), and a meta refresh without
 * JavaScript; its canonical URL is the English page (`useSiteHead`). Returns whether it redirects,
 * so the page can render nothing.
 */
export const useEnglishFallback = (): boolean => {
  const { locale } = useI18n()
  const route = useRoute()
  const { isIn } = useSitePages()
  const english = englishPath(route.path, locale.value)
  if (isIn(english, locale.value)) return false

  if (import.meta.server) {
    useHead({
      meta: [{ 'http-equiv': 'refresh', content: `0; url=${english}` }],
      script: [
        {
          innerHTML: `location.replace(${JSON.stringify(english).replace(/</g, '\\u003c')} + location.search + location.hash)`,
          tagPriority: 'critical',
        },
      ],
    })
  } else {
    navigateTo({ path: english, query: route.query, hash: route.hash }, { replace: true })
  }
  return true
}
