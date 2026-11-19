import type { Ref } from 'vue'

/**
 * Keeps a scrolling sidebar's current link (`aria-current="page"`) in view, on load and after every
 * navigation: a page far down a long list would otherwise open with its own link scrolled away.
 * Only the sidebar scrolls; scrollIntoView would move the page as well.
 */
export const useActiveInView = (box: Readonly<Ref<HTMLElement | null>>): void => {
  const route = useRoute()
  const reveal = (): void => {
    const el = box.value
    const link = el?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!el || !link) return
    const b = el.getBoundingClientRect()
    const l = link.getBoundingClientRect()
    if (l.top < b.top || l.bottom > b.bottom) el.scrollTop += l.top - b.top - b.height / 3
  }
  onMounted(reveal)
  watch(
    () => route.path,
    () => nextTick(reveal)
  )
}
