<script setup lang="ts">
const model = defineModel<string>({ required: true })

const periods = ['Day', 'Week', 'Month', 'Year'] as const
</script>

<template>
  <div class="inline-flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
    <button
      v-for="period in periods"
      :key="period"
      class="min-h-9 rounded-lg px-4 text-sm font-medium transition-all"
      :class="
        model === period
          ? 'bg-orange-500 text-white shadow-sm'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
      "
      @click="model = period"
    >
      {{ period }}
    </button>
  </div>
</template>
