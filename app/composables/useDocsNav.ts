import navigation from '~/data/navigation.json'

export interface NavItem {
  text: string
  link: string
}

export interface NavGroup {
  text: string
  icon?: string
  /** The header section the group belongs to (guide, learn, theory); without one, all groups share a sidebar. */
  section?: string
  items: NavItem[]
}

type LocaleCode = keyof typeof navigation

/** A path as the content knows it: no trailing slash, except the root. */
export const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/**
 * The docs' navigation in the page's language: its sidebar, the pages in reading order for the
 * previous/next links, and a link into the app in the same language (the app calls Chinese `cn`).
 * A link to a page not yet translated into the language goes to its English page.
 */
export const useDocsNav = () => {
  const { locale } = useI18n()
  const route = useRoute()
  const { resolveLink } = useSitePages()

  const current = computed(() => navigation[(locale.value as LocaleCode) ?? 'en'] ?? navigation.en)
  /** Every group, in every section: the footer's map of the docs. */
  const groups = computed<NavGroup[]>(() =>
    current.value.sidebar.map((g) => ({ ...g, items: g.items.map((item) => ({ ...item, link: resolveLink(item.link) })) }))
  )
  /** The section the page is in; the sidebar and the previous/next links stay inside it. */
  const section = computed(
    () => groups.value.find((g) => g.items.some((item) => normalizePath(item.link) === normalizePath(route.path)))?.section
  )
  const sidebar = computed<NavGroup[]>(() => groups.value.filter((g) => g.section === section.value))
  const pages = computed<NavItem[]>(() => sidebar.value.flatMap((group) => group.items))

  const index = computed(() => pages.value.findIndex((p) => normalizePath(p.link) === normalizePath(route.path)))
  const prev = computed(() => (index.value > 0 ? pages.value[index.value - 1] : null))
  const next = computed(() => (index.value >= 0 && index.value < pages.value.length - 1 ? pages.value[index.value + 1] : null))

  const appUrl = computed(() => {
    const lang = current.value.appLocale
    return lang === 'en' ? 'https://run.edubeam.app' : `https://run.edubeam.app/?lang=${lang}`
  })

  const isActive = (link: string) => normalizePath(link) === normalizePath(route.path)

  return { groups, section, sidebar, pages, prev, next, appUrl, appLocale: computed(() => current.value.appLocale), isActive }
}
