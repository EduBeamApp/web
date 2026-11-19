import navigation from '~/data/navigation.json'
import { localizedPath, SITE_URL, vuePages, type SitePage } from '~/lib/site-urls'

/**
 * `/sitemap.xml`: every page in every language it exists in, each with its translations as
 * alternates and English as the default for any other language (as the VitePress docs listed
 * them): the docs, then the Vue pages (the practice tools and the libraries' landing pages, in the
 * languages `VUE_PAGES` lists), then the libraries' docs. A URL that only redirects to the English
 * page is not listed. A docs page carries the date of its last commit. Prerendered.
 */
const LANG: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(navigation).map(([code, l]) => [code, l.lang])
)

const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const url = (loc: string, alternates: readonly { lang: string; href: string }[] = [], lastmod?: string): string =>
  [
    '  <url>',
    `    <loc>${escape(loc)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    ...alternates.map(
      (a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${escape(a.href)}"/>`
    ),
    '  </url>',
  ].join('\n')

const entries = (pages: readonly SitePage[]): string[] =>
  pages.flatMap((page) => {
    const href = (code: string) => SITE_URL + localizedPath(code, page.path)
    const alternates =
      page.locales.length > 1
        ? [
            ...page.locales.map((code) => ({ lang: LANG[code] ?? code, href: href(code) })),
            ...(page.locales.includes('en') ? [{ lang: 'x-default', href: href('en') }] : []),
          ]
        : []
    return page.locales.map((code) => url(href(code), alternates, page.lastmod?.[code]))
  })

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const docs = config.docsPages as readonly SitePage[]
  const libs = config.libsPages as readonly SitePage[]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries(docs),
    ...entries(vuePages()),
    ...entries(libs),
    '</urlset>',
    '',
  ].join('\n')
})
