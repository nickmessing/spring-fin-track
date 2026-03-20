<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, ref } from 'vue'
import CategoryCard from '@/components/CategoryCard.vue'
import CategoryFormDialog from '@/components/CategoryFormDialog.vue'
import { graphql, CategoryKind } from '@/graphql'

const activeTab = ref<'expense' | 'income'>('expense')

const { current, refetch } = useQuery(
  graphql(`
    query Categories {
      categories {
        edges {
          node {
            id
            kind
            ...CategoryFields
          }
        }
      }
    }
  `),
)

const expenseCategories = computed(() =>
  current.value.resultState === 'complete'
    ? current.value.result.categories.edges
        .map((e) => e.node)
        .filter((c) => c.kind === CategoryKind.Expense)
    : [],
)

const incomeCategories = computed(() =>
  current.value.resultState === 'complete'
    ? current.value.result.categories.edges
        .map((e) => e.node)
        .filter((c) => c.kind === CategoryKind.Income)
    : [],
)

// Dialog state
const dialogOpen = ref(false)
const editingId = ref<string>()
const editingName = ref<string>()
const editingIcon = ref<string>()

const dialogKind = computed<CategoryKind>(() =>
  activeTab.value === 'income' ? CategoryKind.Income : CategoryKind.Expense,
)

function openCreate() {
  editingId.value = undefined
  editingName.value = undefined
  editingIcon.value = undefined
  dialogOpen.value = true
}

function openEdit(data: { id: string; name: string; icon: string }) {
  editingId.value = data.id
  editingName.value = data.name
  editingIcon.value = data.icon
  dialogOpen.value = true
}

function handleSavedOrDeleted() {
  refetch()
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Categories</h1>
      <button
        class="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 active:scale-95 dark:hover:bg-orange-400"
        @click="openCreate"
      >
        + Add
      </button>
    </div>

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
          <CategoryCard
            v-for="cat in expenseCategories"
            :key="cat.id"
            :category="cat"
            @edit="openEdit"
          />
        </div>
        <p
          v-if="expenseCategories.length === 0 && current.resultState === 'complete'"
          class="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
        >
          No expense categories yet
        </p>
      </TabsContent>

      <TabsContent value="income" class="mt-4">
        <div class="grid grid-cols-3 gap-3">
          <CategoryCard
            v-for="cat in incomeCategories"
            :key="cat.id"
            :category="cat"
            @edit="openEdit"
          />
        </div>
        <p
          v-if="incomeCategories.length === 0 && current.resultState === 'complete'"
          class="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
        >
          No income categories yet
        </p>
      </TabsContent>
    </TabsRoot>

    <!-- Form dialog -->
    <CategoryFormDialog
      v-model:open="dialogOpen"
      :category-id="editingId"
      :category-name="editingName"
      :category-icon="editingIcon"
      :category-kind="dialogKind"
      @saved="handleSavedOrDeleted"
      @deleted="handleSavedOrDeleted"
    />
  </div>
</template>
