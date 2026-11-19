<script setup lang="ts">
import type { CodeLang } from '~/composables/useHighlighter'

/**
 * A code sample, highlighted by Shiki: on the server for the prerendered page, and again in the
 * browser whenever the code changes (as on the plot page, where it follows the controls).
 */
const props = defineProps<{ code: string; lang: CodeLang; caption?: string }>()

const html = ref(await highlight(props.code, props.lang))
watch(
  () => props.code,
  async (code) => (html.value = await highlight(code, props.lang))
)
</script>

<template>
  <figure class="code-panel">
    <figcaption v-if="caption" class="code-caption">{{ caption }}</figcaption>
    <!-- eslint-disable-next-line vue/no-v-html -- Shiki's own markup of code we wrote -->
    <div class="code-body" v-html="html" />
  </figure>
</template>
