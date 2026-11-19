/**
 * AdSense auto ads, as on the VitePress docs. Auto ads scan the page only once, when their script
 * loads, and never again after client-side navigation. The home pages are excluded in AdSense, so
 * loading the script on one would leave the whole visit without ads: it loads on the first page
 * the reader opens that is not a home page instead.
 */
export default defineNuxtPlugin(() => {
  const client = useRuntimeConfig().public.adsenseClient
  if (!client) return

  const router = useRouter()
  const routeBaseName = useRouteBaseName()
  let loaded = false

  const load = (): void => {
    if (loaded || routeBaseName(router.currentRoute.value) === 'index') return
    loaded = true
    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }

  onNuxtReady(load)
  router.afterEach(() => load())
})
