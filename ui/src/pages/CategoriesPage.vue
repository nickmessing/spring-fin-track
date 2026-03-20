<script setup lang="ts">
import { ref } from 'vue'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { expenseCategories, incomeCategories } from '@/lib/mock-data'

const activeTab = ref('expense')
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Categories</h1>

    <!-- Tabs -->
    <TabsRoot v-model="activeTab" class="mt-4">
      <TabsList class="relative flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <TabsIndicator
          class="absolute top-1 left-0 h-[calc(100%-8px)] w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-lg bg-orange-500 shadow-sm transition-all duration-200"
        />
        <TabsTrigger
          value="expense"
          class="relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors data-[state=active]:text-white data-[state=inactive]:text-zinc-600 dark:data-[state=inactive]:text-zinc-400"
        >
          Expense
        </TabsTrigger>
        <TabsTrigger
          value="income"
          class="relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors data-[state=active]:text-white data-[state=inactive]:text-zinc-600 dark:data-[state=inactive]:text-zinc-400"
        >
          Income
        </TabsTrigger>
      </TabsList>

      <TabsContent value="expense" class="mt-4">
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="cat in expenseCategories"
            :key="cat.id"
            class="flex min-h-22 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {{ cat.name }}
            </span>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="income" class="mt-4">
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="cat in incomeCategories"
            :key="cat.id"
            class="flex min-h-22 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {{ cat.name }}
            </span>
          </div>
        </div>
      </TabsContent>
    </TabsRoot>
  </div>
</template>
