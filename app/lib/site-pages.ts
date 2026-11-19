/**
 * Every page of the site and the languages it exists in, read from `content/` when the site is built
 * (by nuxt.config, in Node: this module reads files and must never reach the browser).
 * The sitemap lists them, a page's head names only the translations that exist (a link to a
 * missing one is a 404 to a search engine), and `llms.txt` indexes the English ones.
 *
 * Paths are as the site serves them: `content/en/guide/intro.md` is `/guide/intro`, an `index.md`
 * is its folder with a trailing slash (`/examples/`), as the VitePress docs had them; the other
 * languages add their code in front (`/cs/guide/intro`).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import type { SitePage } from './site-urls'

const markdownFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? markdownFiles(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : []
  )

/** `guide/intro.md` → `/guide/intro`, `examples/index.md` → `/examples/`, `index.md` → `/` */
export const pathOfFile = (rel: string): string => {
  const p = rel.split(sep).join('/').replace(/\.md$/, '')
  if (p === 'index') return '/'
  return p.endsWith('/index') ? `/${p.slice(0, -'index'.length)}` : `/${p}`
}

/**
 * The date of each file's last commit under `dir`, absolute path → ISO date, read in one pass over
 * the history (the newest commit that touches a file comes first). Empty outside a git checkout.
 */
const commitDates = (dir: string): Map<string, string> => {
  const dates = new Map<string, string>()
  try {
    const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, encoding: 'utf8' }).trim()
    const log = execFileSync('git', ['log', '--format=%x00%cI', '--name-only', '--', '.'], {
      cwd: dir,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
    })
    for (const commit of log.split('\0').slice(1)) {
      const [date, ...files] = commit.trim().split('\n')
      for (const file of files) {
        const path = resolve(top, file)
        if (file && !dates.has(path)) dates.set(path, date)
      }
    }
  } catch {
    // Not a git checkout: the sitemap goes without dates
  }
  return dates
}

/** The pages under `dir/<code>/` for each language code, each with the languages it is in, in the order of `codes` */
const scanByLanguage = (dir: string, codes: readonly string[]): SitePage[] => {
  const dates = commitDates(dir)
  const byPath = new Map<string, { locales: string[]; lastmod: Record<string, string> }>()
  for (const code of codes) {
    const root = join(dir, code)
    // A language without a folder has no pages yet
    if (!existsSync(root)) continue
    for (const file of markdownFiles(root)) {
      const path = pathOfFile(relative(root, file))
      const page = byPath.get(path) ?? { locales: [], lastmod: {} }
      page.locales.push(code)
      const date = dates.get(resolve(file))
      if (date) page.lastmod[code] = date
      byPath.set(path, page)
    }
  }
  return [...byPath]
    .map(([path, { locales, lastmod }]) => ({ path, locales, lastmod }))
    .sort((a, b) => a.path.localeCompare(b.path))
}

/** The docs pages, each with the languages it is in, in the order of `codes` */
export const scanDocs = (contentDir: string, codes: readonly string[]): SitePage[] => scanByLanguage(contentDir, codes)

/**
 * The libraries' pages, each with the languages it is in: `content/libs/en/plot/model.md` is
 * `/plot/model`, `content/libs/cs/plot/model.md` its Czech page `/cs/plot/model`.
 */
export const scanLibs = (contentDir: string, codes: readonly string[]): SitePage[] =>
  scanByLanguage(join(contentDir, 'libs'), codes)
