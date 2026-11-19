/**
 * The products this site is home to. Names and packages live only here: every page, menu and code
 * sample reads them from this file (the solver was ts-fem until it went to npm as @edubeam/fem). The URLs
 * (`/solver`, `/plot`) are deliberately not the names, so links survive a rename.
 *
 * Their words are in the locale files under the product's `id`: `<id>.tagline`, and for search
 * results and link previews `<id>.seo.title` (what it is, in under 60 characters) and
 * `<id>.seo.description` (in two sentences).
 */
export interface Product {
  /** Its messages' group in the locale files */
  id: 'solver' | 'plot'
  /** URL root on this site, never renamed */
  path: string
  name: string
  /** What to install, and how */
  install: string
  importFrom: string
  /** Its public repository, once it has one */
  repo?: string
  license: string
  /** On npm */
  published: boolean
  /** Before it is on npm, `install` fetches it from its repository (it builds itself on install) */
  installsFromRepo?: boolean
  /** Who made it, credited on its page */
  author?: { name: string; url: string }
}

export const SOLVER: Product = {
  id: 'solver',
  path: '/solver',
  name: '@edubeam/fem',
  install: 'npm install @edubeam/fem',
  importFrom: '@edubeam/fem',
  repo: 'https://github.com/EduBeamApp/fem',
  license: 'GPL-3.0',
  published: true,
}

export const PLOT: Product = {
  id: 'plot',
  path: '/plot',
  name: '@edubeam/plot',
  install: 'npm install @edubeam/plot @edubeam/fem vue',
  importFrom: '@edubeam/plot',
  repo: 'https://github.com/EduBeamApp/plot',
  license: 'GPL-3.0',
  published: true,
  author: { name: 'Jan Voříšek', url: 'https://github.com/janvorisek' },
}

export const LIBRARIES = [SOLVER, PLOT] as const
