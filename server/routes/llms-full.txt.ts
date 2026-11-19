import { SITE_URL } from '~/lib/site-urls'

/**
 * `/llms-full.txt`: every English page of `llms.txt` as plain Markdown, one after another, each
 * under its title and URL. Figures appear as their captions. Prerendered.
 */
export default defineEventHandler(async (event) => {
  const sections = await llmsSections(event)
  const storage = useStorage('assets:content')
  const decoder = new TextDecoder()
  const pages = await Promise.all(
    sections.flatMap((s) =>
      s.pages.map(async (p) => {
        const raw = p.source ? await storage.getItemRaw(p.source) : null
        const markdown = raw ? plainMarkdown(typeof raw === 'string' ? raw : decoder.decode(raw), SITE_URL + p.path) : (p.description ?? '')
        // The page's own H1 is replaced by the title and URL
        return [`# ${p.title}`, '', `URL: ${SITE_URL}${p.path}`, '', markdown.replace(/^# .*\n+/, '')].join('\n')
      })
    )
  )
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [`# EduBeam`, '', `> ${LLMS_SUMMARY}`, '', LLMS_NOTES, '', ...pages.map((p) => `${p}\n\n---\n`)].join('\n')
})
