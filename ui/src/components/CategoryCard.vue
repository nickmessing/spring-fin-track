<script setup lang="ts">
import { useFragment } from '@vue/apollo-composable'
import { graphql } from '@/graphql'

const CategoryFields = graphql(`
  fragment CategoryFields on Category {
    id
    name
    icon
    kind
  }
`)

const { category } = defineProps<{
  category: { __typename: 'Category'; id: string }
}>()

const emit = defineEmits<{
  edit: [data: { id: string; name: string; icon: string }]
}>()

const { current } = useFragment({
  fragment: CategoryFields,
  from: () => category,
})
</script>

<template>
  <button
    v-if="current.resultState === 'complete'"
    class="flex min-h-22 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
    @click="
      emit('edit', { id: current.result.id, name: current.result.name, icon: current.result.icon })
    "
  >
    <span class="text-2xl">{{ current.result.icon }}</span>
    <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
      {{ current.result.name }}
    </span>
  </button>
</template>
