import navigation from '~/data/navigation.json'
import { englishPath, localizedPath, SITE_URL } from '~/lib/site-urls'

/**
 * What every page tells search engines and link previews, besides its own title and description:
 * its language, its canonical URL, the translations that exist (and only those: a link to a missing
 * one is a 404 to a crawler), and the site's Open Graph card.
 *
 * A URL in a language the page is not translated into (`/cs/solver` while the solver's page is
 * English only) only redirects to the English page (`useEnglishFallback`), and names it as canonical.
 */
const LANG: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(navigation).map(([code, l]) => [code, l.lang])
)

export const useSiteHead = (): void => {
  const route = useRoute()
  const { locale } = useI18n()
  const { localesOf } = useSitePages()

  useHead(() => {
    const code = locale.value
    const path = route.path
    // The English path names the page in every language
    const english = englishPath(path, code)
    const codes = localesOf(english)
    const lang = LANG[code] ?? 'en'
    const url = SITE_URL + (codes.includes(code) ? path : english)

    const alternates =
      codes.length > 1
        ? [
            ...codes.map((c) => ({ rel: 'alternate', hreflang: LANG[c], href: SITE_URL + localizedPath(c, english) })),
            ...(codes.includes('en') ? [{ rel: 'alternate', hreflang: 'x-default', href: SITE_URL + english }] : []),
          ]
        : []

    return {
      htmlAttrs: { lang },
      link: [{ rel: 'canonical', href: url }, ...alternates],
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'EduBeam' },
        { property: 'og:url', content: url },
        { property: 'og:locale', content: lang.replace('-', '_') },
        ...codes
          .filter((c) => c !== code)
          .map((c) => ({ property: 'og:locale:alternate', content: LANG[c].replace('-', '_') })),
        { property: 'og:image', content: `${SITE_URL}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'EduBeam, free 2D structural analysis online: the app with a frame and its bending moment diagram' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@EdubeamApp' },
      ],
    }
  })
}
