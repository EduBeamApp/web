import { queryCollectionSearchSections } from '@nuxt/content/server'
import navigation from '~/data/navigation.json'

/**
 * `/search/cs.json`: every section of every page in one language - its heading, the headings above
 * it and its text - for the search box to index in the browser. Prerendered, one file a language.
 */
const CODES = Object.keys(navigation)

/** A section's path is `/cs/guide/x#anchor`; English pages have no prefix. */
const languageOf = (id: string) => {
  const first = /^\/([a-z]{2})(?=[/#]|$)/.exec(id)?.[1]
  return first && CODES.includes(first) ? first : 'en'
}

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'file')?.replace(/\.json$/, '')
  if (!code || !CODES.includes(code)) throw createError({ statusCode: 404 })

  const sections = await queryCollectionSearchSections(event, 'docs', { ignoredTags: ['style', 'script'] })
  return sections
    .filter((s) => languageOf(s.id) === code && s.content !== undefined)
    .map((s) => ({ id: s.id, title: s.title, titles: s.titles, content: s.content.slice(0, 1200) }))
})
