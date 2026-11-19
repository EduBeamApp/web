<script setup lang="ts">
import type { LinearStaticSolver } from '@edubeam/fem'
import { defaultResultLayer, modelFromSolver, StructurePlot } from '@edubeam/plot'
import { buildExampleSolver, examples } from '~/lib/examples'

/**
 * The app's own example models, solved live on one results sheet - hairlines between the cells,
 * no cards - each drawn compact by @edubeam/plot (one diagram, the extreme values) and opening in
 * EduBeam exactly as it is drawn here.
 */
const { t } = useI18n()
const { openUrl, numberFormat } = useLiveModel()
const solvers = shallowRef<LinearStaticSolver[]>([])
/** Each tile's link opens the app showing the diagram the tile shows, as the plot chose it. */
const links = shallowRef<string[]>([])
onMounted(() => {
  solvers.value = examples.map(buildExampleSolver)
  links.value = solvers.value.map((solver) => {
    const result = defaultResultLayer(modelFromSolver(solver))
    return openUrl(solver, result ? showOnly(result) : undefined)
  })
})
</script>

<template>
  <ul class="sheet not-prose my-8 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="(example, i) in examples" :key="example.id">
      <a
        :href="links[i]"
        target="_blank"
        rel="noopener"
        class="group flex h-full flex-col"
        :aria-label="t(`examples.items.${example.id}.title`)"
      >
        <div class="flex h-48 items-center px-3">
          <ClientOnly>
            <StructurePlot v-if="solvers[i]" :solver="solvers[i]" compact :height="180" :number-format="numberFormat" class="w-full" />
          </ClientOnly>
        </div>
        <div class="flex flex-1 items-start justify-between gap-3 border-t border-rule px-4 py-3.5">
          <div class="min-w-0">
            <h3 class="font-medium text-ink transition-colors group-hover:text-brand">
              {{ t(`examples.items.${example.id}.title`) }}
            </h3>
            <p class="mt-1 text-sm leading-relaxed text-muted">{{ t(`examples.items.${example.id}.blurb`) }}</p>
          </div>
          <Icon
            name="lucide:arrow-up-right"
            class="mt-0.5 size-4 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </div>
      </a>
    </li>
  </ul>
</template>
