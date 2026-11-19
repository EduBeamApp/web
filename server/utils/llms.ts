import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import navigation from '~/data/navigation.json'
import { SITE_URL, type SitePage } from '~/lib/site-urls'

/**
 * The English pages for `llms.txt` and `llms-full.txt`, in the order a reader meets them: the
 * sidebar's groups, then any page the sidebar leaves out, then each library's docs in its own order.
 */
export interface LlmsSection {
  readonly title: string
  readonly pages: readonly LlmsPage[]
}
export interface LlmsPage {
  readonly path: string
  readonly title: string
  readonly description?: string
  /** Its Markdown in `content/`, as a server-asset key; a Vue page has none */
  readonly source?: string
}

const key = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/** `/guide/intro` → `en:guide:intro.md`, `/examples/` → `en:examples:index.md` */
const docsSource = (path: string): string =>
  `en${path === '/' ? '/index' : path.endsWith('/') ? `${path}index` : path}.md`.replaceAll('/', ':')

export const llmsSections = async (event: H3Event): Promise<LlmsSection[]> => {
  const config = useRuntimeConfig(event)
  const english = (config.docsPages as readonly SitePage[])
    .filter((p) => p.locales.includes('en') && p.path !== '/')
    .map((p) => p.path)
  const docs = await queryCollection(event, 'docs').select('path', 'title', 'description').all()
  const meta = new Map(docs.map((d) => [key(d.path), d]))
  const page = (path: string): LlmsPage | undefined => {
    const d = meta.get(key(path))
    return d && { path, title: d.title, description: d.description, source: docsSource(path) }
  }

  const listed = new Set<string>()
  const sections: LlmsSection[] = navigation.en.sidebar.map((group) => ({
    title: group.text,
    pages: group.items.flatMap((item) => {
      const path = english.find((p) => key(p) === key(item.link))
      const found = path && page(path)
      if (!found) return []
      listed.add(path)
      return [found]
    }),
  }))
  const rest = english.filter((p) => !listed.has(p)).flatMap((p) => page(p) ?? [])
  if (rest.length) sections.push({ title: 'More', pages: rest })

  sections.push({
    title: 'Practice tools',
    pages: [
      {
        path: '/practice',
        title: 'Practice statics',
        description:
          'Generated beam, frame and truss problems: students work out the reactions and the largest bending moment or a bar force, check them against the exact solution, get a hint, and see the diagrams. Each problem has a code (for example H2048) that always names the same problem.',
      },
      {
        path: '/exam',
        title: 'Exam builder',
        description:
          'Printable statics test papers with a different version for every student, equally hard, an answer key, space for working, and the figures as SVG with the answers as CSV. The settings are in the URL, so an exam can be printed again.',
      },
    ],
  })

  // English pages only: their paths have no language prefix
  const libs = await queryCollection(event, 'libs').select('path', 'title', 'description', 'order').order('order', 'ASC').all()
  for (const [root, name] of [
    ['/solver', '@edubeam/fem: the solver'],
    ['/plot', '@edubeam/plot: the drawings'],
  ] as const) {
    sections.push({
      title: name,
      pages: libs
        .filter((l) => l.path.startsWith(`${root}/`))
        .map((l) => ({
          path: l.path,
          title: l.title,
          description: l.description,
          source: `libs/en${l.path}.md`.replaceAll('/', ':'),
        })),
    })
  }
  return sections.filter((s) => s.pages.length > 0)
}

export const LLMS_SUMMARY = `EduBeam is a free structural analysis app that runs in the browser (https://run.edubeam.app): draw plane beams, frames and trusses, add supports and loads, and get reactions, deflections and N, V and M diagrams, solved by the finite element method. It is made for teaching and learning structural mechanics. This site holds its user guide, tutorials and theory manual, and the docs of two open-source TypeScript libraries (GPL-3.0) behind it: @edubeam/fem, the solver, and @edubeam/plot, Vue components that draw structures and their results.`

export const LLMS_NOTES = `Conventions used throughout: x points right and z points down, so a downward load is a positive Fz or fz; rotations and moments are positive counter-clockwise on screen. N is positive in tension, V positive when it turns a short piece of a member clockwise, and M positive when it sags (tension in the bottom fibres, on the element's local +z side). Models are stored in SI units (m, N, Pa, rad); the display units only change what is typed and read.

The guide is also available in Czech, German, Spanish, French, Italian, Polish, Portuguese, Russian, Ukrainian, Turkish, Chinese, Japanese, Korean, Hindi, Indonesian, Thai and Vietnamese, under /<code>/ (for example ${SITE_URL}/cs/guide/introduction).`

/** Components that draw something: a figure's caption stands in for it */
const FIGURES = new Set([
  'model-figure',
  'element-sketch',
  'example-structure',
  'exercise-generator',
  'feature-structures',
  'elementarium-promo',
  'team-members',
  'structure',
  'truss-element',
  'load-showcase',
])

const attr = (attrs: string, name: string): string | undefined =>
  new RegExp(`${name}="([^"]*)"`).exec(attrs)?.[1]

const absolute = (href: string): string => (href.startsWith('/') ? SITE_URL + href : href)

/**
 * A page's Markdown as plain Markdown: no front matter, figures as their captions, the site's
 * block components (cards, callouts, layout divs) unwrapped to their text, `{.class}` and `{#id}`
 * attributes dropped, and site links made absolute.
 */
export const plainMarkdown = (source: string, url: string): string => {
  const lines = source.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')
  const out: string[] = []
  /** Open block components: how many colons close each, and whether its content is skipped */
  const open: { colons: number; skip: boolean }[] = []
  let inStyle = false
  /** The fence of the code block we are in: its code is kept exactly as written */
  let fence: string | undefined

  for (const line of lines) {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (fence !== undefined || marker) {
      if (fence === undefined) fence = marker
      else if (marker?.[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) fence = undefined
      if (!open.some((o) => o.skip)) out.push(line)
      continue
    }
    if (inStyle) {
      if (/^<\/style>/.test(line)) inStyle = false
      continue
    }
    if (/^<style/.test(line)) {
      inStyle = true
      continue
    }
    const close = /^(:{2,})\s*$/.exec(line)
    if (close && open.at(-1)?.colons === close[1].length) {
      open.pop()
      continue
    }
    if (open.some((o) => o.skip)) {
      // A figure's YAML may hold nested blocks of its own; keep counting so its end is found
      const nested = /^(:{2,})[a-z]/.exec(line)
      if (nested) open.push({ colons: nested[1].length, skip: true })
      continue
    }
    const start = /^(:{2,})([a-z][a-z-]*)(\{.*\})?\s*$/.exec(line)
    if (start) {
      const [, colons, name, attrs = ''] = start
      const figure = FIGURES.has(name)
      open.push({ colons: colons.length, skip: figure })
      const caption = attr(attrs, 'caption')
      if (figure && caption) out.push(`*Figure: ${caption}*`, '')
      if (name === 'card') {
        const title = attr(attrs, 'title')
        const to = attr(attrs, 'to')
        if (title) out.push(to ? `**[${title}](${to.startsWith('#') ? url + to : absolute(to)})**` : `**${title}**`)
      }
      if (name === 'callout') out.push(`**${attr(attrs, 'title') ?? 'Note'}**`, '')
      continue
    }
    out.push(
      line
        .replace(/\s*\{#[^}]+\}\s*$/, '')
        .replace(/\[([^\]]+)\]\{[^}]*\}/g, '$1')
        .replace(/(!?\[[^\]]*\]\([^)]*\))\{[^}]*\}/g, '$1')
        .replace(/^\{[.#][^}]*\}\s*$/, '')
        .replace(/\]\((\/[^)\s]*)\)/g, (_, href: string) => `](${absolute(href)})`)
        // In one long file a bare #anchor is ambiguous: it is this page's
        .replace(/\]\((#[^)\s]*)\)/g, (_, hash: string) => `](${url}${hash})`)
    )
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
