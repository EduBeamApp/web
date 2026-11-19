import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import navigation from './app/data/navigation.json'
import { scanDocs, scanLibs } from './app/lib/site-pages'
import { englishPath, localeOfPath, localizedPath, redirectPage, vuePages } from './app/lib/site-urls'

/** Every language of the docs, in the order the switcher lists them. English is served from the root. */
const LOCALES = Object.entries(navigation).map(([code, l]) => ({
  code,
  name: l.label,
  language: l.lang,
  file: `${code}.json`,
}))

/**
 * While @edubeam/plot is being changed beside this site, dev uses its build straight from its own
 * repository: a file outside node_modules is served fresh and reloads when it changes, whereas
 * node_modules files go out tagged as cacheable for good, so a browser kept an old build after
 * every copy. Production builds use the published package as always.
 */
const PLOT_BUILD = fileURLToPath(new URL('../plot/dist/index.js', import.meta.url))

const CODES = LOCALES.map((l) => l.code)
const CONTENT_DIR = fileURLToPath(new URL('./content', import.meta.url))
const DOCS_PAGES = scanDocs(CONTENT_DIR, CODES)
const LIBS_PAGES = scanLibs(CONTENT_DIR, CODES)
/** The practice page, the exam builder and the libraries' landing pages, in the languages `VUE_PAGES` lists */
const VUE_PAGES = vuePages()
/**
 * The URLs of the libraries' pages and the Vue pages in the languages they are not translated
 * into yet. Nothing links to them, but each is prerendered as a small page that redirects to the
 * English one (`redirectPage`), so `/cs/solver` or `/cs/exam?e=…` typed or shared is never a 404.
 */
const FALLBACK_ROUTES = [...VUE_PAGES, ...LIBS_PAGES].flatMap((page) =>
  CODES.filter((code) => !page.locales.includes(code)).map((code) => localizedPath(code, page.path))
)
const FALLBACK = new Set(FALLBACK_ROUTES)

/**
 * Google Analytics and AdSense, as the VitePress docs had them, but on the production site only:
 * the deploy builds main with `GOOGLE_TAGS=true`, so previews and local builds load neither and
 * their visits stay out of the statistics, as in the app. The tag is the website's own GA stream,
 * the one the docs reported to (the app reports to another).
 */
const GOOGLE_TAGS = process.env.GOOGLE_TAGS === 'true'
const GA_TAG_ID = 'G-FGX9PYDV0G'
const ADSENSE_CLIENT = 'ca-pub-3761845630657739'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxt/fonts', '@nuxt/icon', '@nuxtjs/color-mode'],

  css: ['~/assets/main.css', 'katex/dist/katex.min.css'],

  app: {
    head: {
      titleTemplate: '%s',
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
      // In every page's prerendered head, so the first page view is sent before the app hydrates.
      // Later pages are counted by GA's enhanced measurement, which sends a page_view on each
      // history change, as it did for the VitePress router.
      script: GOOGLE_TAGS
        ? [
            { src: `https://www.googletagmanager.com/gtag/js?id=${GA_TAG_ID}`, async: true },
            {
              innerHTML: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${GA_TAG_ID}');`,
            },
          ]
        : [],
    },
  },

  /**
   * Formulas are TeX, typeset by KaTeX at build time, so pages ship finished HTML. `{#id}` after a
   * heading sets its id: the translated pages keep the English ids, which the app's help links and
   * old lecture notes point to.
   */
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {},
          [fileURLToPath(new URL('./app/lib/remark-heading-ids.mjs', import.meta.url))]: {},
          [fileURLToPath(new URL('./app/lib/remark-image-size.mjs', import.meta.url))]: {},
        },
        rehypePlugins: { 'rehype-katex': { options: { output: 'html', strict: false } } },
        toc: { depth: 3 },
        // The same Shiki themes as the pages' own code samples, light and dark
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['ts', 'js', 'vue', 'bash', 'json'],
        },
      },
    },
    experimental: { sqliteConnector: 'native' },
  },

  /**
   * The URLs the VitePress docs had, unchanged: English at `/guide/…`, every other language under
   * its code (`/cs/guide/…`). A link keeps the language it names; nothing redirects by browser.
   */
  i18n: {
    locales: LOCALES,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    baseUrl: 'https://www.edubeam.app',
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  fonts: {
    families: [
      { name: 'Barlow', provider: 'google', weights: [600, 700] },
      { name: 'IBM Plex Sans', provider: 'google', weights: [400, 500, 600] },
      { name: 'IBM Plex Mono', provider: 'google', weights: [400, 500] },
      { name: 'Lobster', provider: 'google', weights: [400] },
    ],
  },

  icon: {
    mode: 'css',
    cssLayer: 'base',
    // Icons named in the Markdown (cards in the docs) and in data (the sidebar, lists in pages) are not
    // found by the scan of components
    clientBundle: {
      scan: true,
      icons: [
        'circle-flags:lang-cs',
        'circle-flags:lang-de',
        'circle-flags:lang-en',
        'circle-flags:lang-es',
        'circle-flags:lang-fr',
        'circle-flags:lang-hi',
        'circle-flags:lang-id',
        'circle-flags:lang-it',
        'circle-flags:lang-ja',
        'circle-flags:lang-ko',
        'circle-flags:lang-pl',
        'circle-flags:lang-pt-br',
        'circle-flags:lang-ru',
        'circle-flags:lang-th',
        'circle-flags:lang-tr',
        'circle-flags:lang-uk',
        'circle-flags:lang-vi',
        'circle-flags:lang-zh',
        'lucide:anchor',
        'lucide:arrow-down-to-line',
        'lucide:arrow-right',
        'lucide:arrow-up',
        'lucide:arrow-up-right',
        'lucide:book-open',
        'lucide:bug',
        'lucide:calculator',
        'lucide:chart-spline',
        'lucide:check',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:circle-dashed',
        'lucide:circle-x',
        'lucide:clipboard-check',
        'lucide:code-xml',
        'lucide:compass',
        'lucide:copy',
        'lucide:dices',
        'lucide:download',
        'lucide:file-archive',
        'lucide:file-check',
        'lucide:file-image',
        'lucide:file-json',
        'lucide:flag',
        'lucide:folder-open',
        'lucide:frame',
        'lucide:git-fork',
        'lucide:github',
        'lucide:graduation-cap',
        'lucide:hard-hat',
        'lucide:image',
        'lucide:keyboard',
        'lucide:languages',
        'lucide:layout-template',
        'lucide:library',
        'lucide:life-buoy',
        'lucide:lightbulb',
        'lucide:link',
        'lucide:list-checks',
        'lucide:list-tree',
        'lucide:move-diagonal',
        'lucide:package',
        'lucide:pencil-ruler',
        'lucide:plus',
        'lucide:presentation',
        'lucide:printer',
        'lucide:rotate-ccw',
        'lucide:rows-3',
        'lucide:ruler',
        'lucide:scale',
        'lucide:shapes',
        'lucide:share-2',
        'lucide:sigma',
        'lucide:spline',
        'lucide:triangle',
        'lucide:triangle-alert',
        'lucide:x',
      ],
    },
    fallbackToApi: false,
  },

  $development: existsSync(PLOT_BUILD) ? { alias: { '@edubeam/plot': PLOT_BUILD } } : {},

  runtimeConfig: {
    /** For the sitemap and llms.txt, on the server only */
    docsPages: DOCS_PAGES,
    libsPages: LIBS_PAGES,
    public: {
      /** AdSense auto ads (`plugins/adsense.client.ts`), empty where they are off */
      adsenseClient: GOOGLE_TAGS ? ADSENSE_CLIENT : '',
      /**
       * The pages not yet in every language (docs, library docs and Vue pages), with the languages
       * they are in: a page's head names a translation only where one exists, and links in another
       * language go to the English page. Every other page is in all of them.
       */
      partialTranslations: Object.fromEntries(
        [...DOCS_PAGES, ...LIBS_PAGES, ...VUE_PAGES].filter((p) => p.locales.length < LOCALES.length).map((p) => [p.path, p.locales])
      ),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    // One copy of each, also when dev takes @edubeam/plot from its own repository: the solver's
    // classes must be the same ones in the site and in the plot.
    resolve: { dedupe: ['vue', '@edubeam/fem', 'mathjs'] },
    server: { fs: { allow: [fileURLToPath(new URL('.', import.meta.url)), resolve(PLOT_BUILD, '../..')] } },
    // Served as published, not pre-bundled: a local build of the library dropped into node_modules
    // shows on the next reload while it is being worked on
    optimizeDeps: { exclude: ['@edubeam/plot'] },
  },

  nitro: {
    // llms-full.txt is built from the pages' Markdown as written
    serverAssets: [{ baseName: 'content', dir: CONTENT_DIR }],
    hooks: {
      // A URL in a language its page is not translated into is written as the redirect alone, not
      // as a whole page shell (a few hundred bytes rather than 60 kB, for some 500 URLs), and needs no payload
      'prerender:generate'(route) {
        // 404.html is the SPA shell, whose title the error page sets only once it runs; Analytics
        // reads the title when it loads, before that, so the shell names itself in English
        if (route.route === '/404.html' && typeof route.contents === 'string' && !route.contents.includes('<title>')) {
          route.contents = route.contents.replace('<head>', '<head><title>Page not found | EduBeam</title>')
          return
        }
        const page = route.route.replace(/\/_payload\.json$/, '')
        if (!FALLBACK.has(page)) return
        if (page !== route.route) route.skip = true
        else route.contents = redirectPage(englishPath(page, localeOfPath(page, CODES)))
      },
    },
    prerender: {
      // `guide/intro.html`, which Cloudflare Pages serves at `/guide/intro` as the VitePress docs
      // were; `guide/intro/index.html` would answer every canonical URL with a redirect to `…/intro/`
      autoSubfolderIndex: false,
      crawlLinks: true,
      // A page that fails to render, or a link to one that does not exist, stops the build.
      failOnError: true,
      routes: [
        ...LOCALES.map((l) => (l.code === 'en' ? '/' : `/${l.code}`)),
        // The search index of each language, which no page links to
        ...LOCALES.map((l) => `/search/${l.code}.json`),
        ...FALLBACK_ROUTES,
        // Cloudflare Pages answers an unknown URL with this and a 404; without it, with the home page and a 200
        '/404.html',
        // For search engines and language models
        '/sitemap.xml',
        '/llms.txt',
        '/llms-full.txt',
      ],
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
