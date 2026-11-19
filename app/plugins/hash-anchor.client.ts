/**
 * A link to `/page#heading` from another page scrolls as soon as the page has rendered, but the
 * live figures above the heading size themselves to their column a frame later and push it down
 * the screen. For a short while after such a navigation the heading is held where the scroll put
 * it, just under the header, until the page settles or the reader scrolls themselves.
 *
 * Loading a page with a hash needs none of this: the browser scrolls later, and its scroll
 * anchoring absorbs the shifts.
 */
const SETTLE_MS = 2000
const USER_SCROLL = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  router.afterEach((to, from) => {
    if (!to.hash || to.path === from.path) return
    nuxtApp.hooks.hookOnce('page:loading:end', () => hold(decodeURIComponent(to.hash.slice(1))))
  })
})

const hold = (id: string): void => {
  const target = document.getElementById(id)
  if (!target) return
  const offset =
    (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
    (Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0)

  const align = (): void => {
    const drift = target.getBoundingClientRect().top - offset
    if (Math.abs(drift) > 1) window.scrollBy({ top: drift, behavior: 'instant' })
  }
  const observer = new ResizeObserver(align)
  const stop = (): void => {
    observer.disconnect()
    clearTimeout(timer)
    USER_SCROLL.forEach((type) => window.removeEventListener(type, stop, true))
  }
  const timer = setTimeout(stop, SETTLE_MS)
  USER_SCROLL.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }))
  // Everything that moves the heading changes the document's height first
  observer.observe(document.documentElement)
}
