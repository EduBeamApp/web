<script setup lang="ts">
/**
 * Cards side by side on one sheet, hairlines between them: `::card-grid{cols=3}` with `:::card`
 * inside. For the docs' lists of options, features and places to go - pages read better as
 * something to scan than as paragraphs. Columns follow the width the grid gets (a container
 * query), not the window: the docs column is narrower than the page.
 */
withDefaults(defineProps<{ cols?: number | string }>(), { cols: 2 })
</script>

<template>
  <div class="card-grid-frame not-prose my-8">
    <div class="card-grid sheet" :class="`card-grid--${cols}`">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card-grid-frame {
  container-type: inline-size;
}
.card-grid {
  grid-template-columns: 1fr;
}
@container (min-width: 32rem) {
  .card-grid--2,
  .card-grid--3,
  .card-grid--4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  /* An odd card out takes the whole last row rather than leave an empty cell beside it */
  .card-grid > :deep(:last-child:nth-child(odd)) {
    grid-column: 1 / -1;
  }
}
@container (min-width: 48rem) {
  .card-grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .card-grid--3 > :deep(:last-child:nth-child(odd)) {
    grid-column: auto;
  }
}
</style>
