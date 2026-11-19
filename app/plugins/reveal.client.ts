import type { Directive } from 'vue'

/**
 * `v-reveal` (optionally `v-reveal="120"` for a delay in ms): the element fades and rises into place
 * the first time it scrolls into view. The hidden start state is added here, at mount, so a reader
 * without JavaScript - or who asked for reduced motion - gets the page painted in full.
 */
const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen when the page loads: leave it be, rather than blink it out and back
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.add('reveal-in')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
