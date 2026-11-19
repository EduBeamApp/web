import { SITE_URL } from '~/lib/site-urls'

/**
 * `/llms.txt` (https://llmstxt.org): what EduBeam is, its conventions, and every English page with
 * its one-line description, in reading order. `/llms-full.txt` has the pages' text. Prerendered.
 */
export default defineEventHandler(async (event) => {
  const sections = await llmsSections(event)
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    '# EduBeam',
    '',
    `> ${LLMS_SUMMARY}`,
    '',
    LLMS_NOTES,
    '',
    ...sections.flatMap((s) => [
      `## ${s.title}`,
      '',
      ...s.pages.map((p) => `- [${p.title}](${SITE_URL}${p.path})${p.description ? `: ${p.description}` : ''}`),
      '',
    ]),
    '## Optional',
    '',
    `- [Full text of every page above](${SITE_URL}/llms-full.txt): the same pages as one Markdown file`,
    '- [EduBeam app](https://run.edubeam.app): the structural analysis app itself',
    `- [@edubeam/fem on npm](https://www.npmjs.com/package/@edubeam/fem): the solver package`,
    `- [@edubeam/plot on npm](https://www.npmjs.com/package/@edubeam/plot): the drawing package`,
    '',
  ].join('\n')
})
