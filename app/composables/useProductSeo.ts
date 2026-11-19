import type { Product } from '~/data/products'
import { SITE_URL } from '~/lib/site-urls'

/**
 * A library's landing page in search results and link previews: its own title and description
 * (`<id>.seo.*` in the locale files), and schema.org data naming it as source code on npm and GitHub.
 */
export const useProductSeo = (product: Product): void => {
  const { t } = useI18n()
  const { sitePath } = useSitePages()
  const title = () => t(`${product.id}.seo.title`)
  const description = () => t(`${product.id}.seo.description`)
  useSeoMeta({ title, description, ogTitle: title, ogDescription: description })
  useHead(() => ({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: product.name,
          description: description(),
          url: SITE_URL + sitePath(product.path),
          codeRepository: product.repo,
          programmingLanguage: 'TypeScript',
          runtimePlatform: 'JavaScript',
          license: `https://spdx.org/licenses/${product.license}.html`,
          isAccessibleForFree: true,
          ...(product.author ? { author: { '@type': 'Person', name: product.author.name, url: product.author.url } } : {}),
        }),
      },
    ],
  }))
}
