import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import navigation from './app/data/navigation.json'

/**
 * One collection for every language: `content/en/**` is served from the root, `content/cs/**` under
 * `/cs`, and so on - the paths the docs always had. The home page of each language is a document
 * too; its `hero` and `features` front matter feed the home page's design.
 */
export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: Object.keys(navigation).map((code) => ({
        include: `${code}/**/*.md`,
        prefix: code === 'en' ? '/' : `/${code}`,
      })),
      schema: z.object({
        layout: z.string().optional(),
        hero: z
          .object({
            name: z.string().optional(),
            text: z.string().optional(),
            tagline: z.string().optional(),
            image: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
            actions: z.array(z.object({ theme: z.string(), text: z.string(), link: z.string() })).optional(),
          })
          .optional(),
        features: z
          .array(
            z.object({
              icon: z.string().optional(),
              title: z.string(),
              details: z.string(),
              link: z.string().optional(),
              linkText: z.string().optional(),
            })
          )
          .optional(),
      }),
    }),
    /**
     * The libraries' developer docs, by language as the guide is: `content/libs/en/solver/*.md` is
     * served at `/solver/…`, `content/libs/en/plot/*.md` at `/plot/…`, and a translation in
     * `content/libs/cs/solver/` at `/cs/solver/…`. A page not translated into a language redirects
     * to its English page there. `order` sorts a library's sidebar (a translation keeps the English
     * page's), and `group` heads the run of pages it starts (pages without one join the group above them).
     */
    libs: defineCollection({
      type: 'page',
      source: Object.keys(navigation).map((code) => ({
        include: `libs/${code}/**/*.md`,
        prefix: code === 'en' ? '/' : `/${code}`,
      })),
      schema: z.object({ order: z.number().optional(), group: z.string().optional() }),
    }),
  },
})
