/** On the server `v-reveal` renders nothing extra: the page is prerendered fully visible. */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) })
})
