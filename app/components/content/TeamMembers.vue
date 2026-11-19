<script setup lang="ts">
interface Member {
  avatar: string
  name: string
  title?: string
  links?: { icon: string; link: string }[]
}

const props = defineProps<{ members: Member[]; size?: string }>()
/** Two columns at most; an odd one out takes a full row of its own */
const cols = computed(() => Math.min(Math.max(props.members.length, 1), 2))

const ICONS: Record<string, string> = { github: 'lucide:github', twitter: 'lucide:twitter', linkedin: 'lucide:linkedin' }
</script>

<template>
  <div class="team-frame not-prose my-8">
    <div class="team sheet" :style="{ '--cols': cols }">
    <div v-for="m in members" :key="m.name" class="member flex items-center gap-4 p-5">
      <!-- !m-0: the docs centre their images, which would push a portrait off its row -->
      <img :src="m.avatar" :alt="m.name" class="!m-0 h-14 w-14 shrink-0 rounded-full border border-rule" loading="lazy" />
      <div class="min-w-0">
        <p class="font-display font-semibold text-ink">{{ m.name }}</p>
        <p v-if="m.title" class="text-sm text-muted">{{ m.title }}</p>
        <div v-if="m.links?.length" class="mt-1.5 flex gap-2">
          <a v-for="l in m.links" :key="l.link" :href="l.link" target="_blank" rel="noopener" class="text-muted hover:text-ink">
            <Icon :name="ICONS[l.icon] ?? 'lucide:link'" class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.team-frame {
  container-type: inline-size;
}
.team {
  grid-template-columns: 1fr;
}
@container (min-width: 30rem) {
  .team {
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  }
  .member:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}
</style>
