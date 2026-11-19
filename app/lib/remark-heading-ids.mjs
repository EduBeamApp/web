/**
 * Heading ids exactly as the VitePress docs had them, so every `#anchor` in lecture notes and
 * bookmarks still lands on its heading.
 *
 * - `## Podpory {#supports}` takes the explicit id. Translated pages keep the English ids, so one
 *   anchor - the one the app's help links use - works in every language.
 * - Any other heading gets VitePress's slug of its text: accents stripped (`Úvod` -> `uvod`),
 *   other Unicode kept (`☰`), a leading digit prefixed with `_`, and repeats numbered `-1`, `-2`.
 *   Nuxt Content's own slugger differs on all of these.
 *
 * The id goes in `hProperties`; MDC only slugs a heading that has no id yet, and the table of
 * contents reads the same id.
 */
const TRAILING_ID = /\s*\{#([^\s}]+)\}\s*$/

// VitePress 1.x `slugify` (@mdit-vue/shared), character for character
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[̀-ͯ]/g
export const slugify = (str) =>
  str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()

/** The text VitePress slugged: plain text and inline code, not raw HTML or components. */
const headingText = (node) => {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value
  return node.children?.map(headingText).join('') ?? ''
}

export default function remarkHeadingIds() {
  return (tree) => {
    // markdown-it-anchor's rule: the second `foo` on a page is `foo-1`, the third `foo-2`
    const used = new Set()
    const unique = (slug) => {
      let id = slug
      for (let i = 1; used.has(id); i++) id = `${slug}-${i}`
      used.add(id)
      return id
    }

    const walk = (node) => {
      if (node.type === 'heading') {
        const last = node.children?.at(-1)
        const match = last?.type === 'text' ? TRAILING_ID.exec(last.value) : null
        if (match) last.value = last.value.slice(0, match.index)
        const id = unique(match ? match[1] : slugify(headingText(node)))
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
        return
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}
