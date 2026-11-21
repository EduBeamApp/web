<script setup lang="ts">
/**
 * A picture in a page. A screenshot of the app comes as a light and a dark shot, the dark ones under
 * screenshots/dark/ (`npm run screenshots -- --dark`), and the page shows the one of its own colour
 * mode. Both are in the page, as the mode is a class rather than a media query; both load lazily, so
 * only the one on show is fetched. A picture with no dark shot (the list the screenshot script writes),
 * and any other picture, is as Nuxt Content draws it.
 */
import { computed } from 'vue'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'
import darkScreenshots from '~/data/dark-screenshots.json'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{ src?: string; alt?: string; width?: string | number; height?: string | number }>(),
  { src: '', alt: '', width: undefined, height: undefined },
)

const base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
/** A site path under the app's base URL, as Nuxt Content's own image does */
const based = (src: string) =>
  src.startsWith('/') && !src.startsWith('//') && base !== '/' && !src.startsWith(base) ? joinURL(base, src) : src

const SHOTS = '/screenshots/'
const DARK: ReadonlySet<string> = new Set(darkScreenshots)
const darkSrc = computed(() => {
  if (!props.src.startsWith(SHOTS) || props.src.startsWith(`${SHOTS}dark/`)) return null
  const shot = props.src.slice(SHOTS.length)
  return DARK.has(shot) ? `${SHOTS}dark/${shot}` : null
})
</script>

<template>
  <img
    v-bind="$attrs"
    :src="based(props.src)"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    loading="lazy"
    :class="{ 'dark:hidden': darkSrc }"
  />
  <img
    v-if="darkSrc"
    v-bind="$attrs"
    :src="based(darkSrc)"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    loading="lazy"
    class="hidden dark:inline"
  />
</template>
