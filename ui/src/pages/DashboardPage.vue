<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ref, watch } from 'vue'
import DonutChart from '@/components/DonutChart.vue'
import PeriodSelector from '@/components/PeriodSelector.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import { useFormatAmount } from '@/composables/useFormatAmount'
import { graphql, TransactionKind } from '@/graphql'

const { formatAmount } = useFormatAmount()

const period = ref('Month')

function getDateRange(p: string): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString()
  const from = new Date(now)

  switch (p) {
    case 'Day':
      from.setHours(0, 0, 0, 0)
      break
    case 'Week':
      from.setDate(from.getDate() - 7)
      break
    case 'Month':
      from.setMonth(from.getMonth() - 1)
      break
    case 'Year':
      from.setFullYear(from.getFullYear() - 1)
      break
  }

  return { from: from.toISOString(), to }
}

const dateRange = computed(() => getDateRange(period.value))

const { current: meResult } = useQuery(
  graphql(`
    query DashboardMe {
      me {
        id
        balance
      }
    }
  `),
)

const { current, fetchMore } = useQuery(
  graphql(`
    query Transactions($filter: TransactionFilterInput, $after: String) {
      transactions(filter: $filter, after: $after) {
        edges {
          cursor
          node {
            id
            kind
            amount
            createdAt
            category {
              id
              name
              icon
            }
            ...TransactionFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `),
  {
    variables: () => ({
      filter: { from: dateRange.value.from, to: dateRange.value.to },
    }),
  },
)

const transactions = computed(() =>
  current.value.resultState === 'complete'
    ? current.value.result.transactions.edges.map((e) => e.node)
    : [],
)

const pageInfo = computed(() =>
  current.value.resultState === 'complete' ? current.value.result.transactions.pageInfo : null,
)

const loadingMore = ref(false)

async function loadMore() {
  if (!pageInfo.value?.hasNextPage || loadingMore.value) return

  loadingMore.value = true
  try {
    await fetchMore({
      variables: {
        filter: { from: dateRange.value.from, to: dateRange.value.to },
        after: pageInfo.value.endCursor,
      },
      updateQuery(existing, { fetchMoreResult }) {
        if (fetchMoreResult == null) return existing

        const existingEdges = existing.transactions.edges ?? []
        const incomingEdges = fetchMoreResult.transactions.edges ?? []
        const existingCursors = new Set(existingEdges.map((e) => e.cursor))

        return {
          ...fetchMoreResult,
          transactions: {
            ...fetchMoreResult.transactions,
            edges: [
              ...existingEdges,
              ...incomingEdges.filter((e) => !existingCursors.has(e.cursor)),
            ],
          },
        }
      },
    })
  } finally {
    loadingMore.value = false
  }
}

const totalExpense = computed(() =>
  transactions.value
    .filter((tx) => tx.kind === TransactionKind.Expense)
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const totalIncome = computed(() =>
  transactions.value
    .filter((tx) => tx.kind === TransactionKind.Income)
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const balance = computed(() =>
  meResult.value.resultState === 'complete' && meResult.value.result.me
    ? meResult.value.result.me.balance
    : totalIncome.value - totalExpense.value,
)

const CHART_COLORS = [
  '#f97316',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#f43f5e',
  '#a855f7',
  '#0ea5e9',
]

const chartSegments = computed(() => {
  const map = new Map<string, { value: number; color: string; label: string }>()
  let colorIdx = 0
  for (const tx of transactions.value) {
    if (tx.kind !== TransactionKind.Expense || !tx.category) continue
    const catId = tx.category.id
    const existing = map.get(catId)
    if (existing) {
      existing.value += tx.amount
    } else {
      map.set(catId, {
        value: tx.amount,
        color: CHART_COLORS[colorIdx++ % CHART_COLORS.length]!,
        label: tx.category.name,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value)
})

function formatDateGroup(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  })
}

const groupedTransactions = computed(() => {
  const groups: Array<{ label: string; items: typeof transactions.value }> = []
  const map = new Map<string, typeof transactions.value>()

  for (const tx of transactions.value) {
    const label = formatDateGroup(tx.createdAt)
    const existing = map.get(label)
    if (existing) {
      existing.push(tx)
    } else {
      const arr = [tx]
      map.set(label, arr)
      groups.push({ label, items: arr })
    }
  }
  return groups
})
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg
          viewBox="0 0 160 160"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7 text-orange-500"
        >
          <path
            d="M 132 76 A 52 52 0 1 1 84 28"
            fill="none"
            stroke="currentColor"
            stroke-width="10"
            stroke-linecap="round"
          />
          <line
            x1="30"
            y1="130"
            x2="117"
            y2="43"
            stroke="currentColor"
            stroke-width="8"
            stroke-linecap="round"
          />
          <circle cx="117" cy="43" r="7.5" fill="currentColor" />
          <circle cx="30" cy="130" r="4.5" fill="currentColor" />
        </svg>
        <span class="text-lg font-bold tracking-tight">Finance Tracker</span>
      </div>
    </div>

    <!-- Period selector -->
    <div class="flex justify-center">
      <PeriodSelector v-model="period" />
    </div>

    <!-- Donut chart -->
    <div class="mt-6 flex justify-center">
      <DonutChart
        :segments="chartSegments"
        :center-text="formatAmount(Math.abs(balance))"
        :center-subtext="balance >= 0 ? 'Balance' : 'Deficit'"
      />
    </div>

    <!-- Income / Expense summary cards -->
    <div class="mt-6 grid grid-cols-2 gap-3">
      <div
        class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Income</p>
        <p class="mt-1 text-lg font-bold text-emerald-500">+{{ formatAmount(totalIncome) }}</p>
      </div>
      <div
        class="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Expenses</p>
        <p class="mt-1 text-lg font-bold text-red-500">-{{ formatAmount(totalExpense) }}</p>
      </div>
    </div>

    <!-- Transaction list -->
    <div class="mt-6 space-y-4">
      <div v-for="group in groupedTransactions" :key="group.label">
        <h3
          class="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500"
        >
          {{ group.label }}
        </h3>
        <div
          class="rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <TransactionItem v-for="tx in group.items" :key="tx.id" :transaction="tx" />
        </div>
      </div>
    </div>

    <p
      v-if="transactions.length === 0 && current.resultState === 'complete'"
      class="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
    >
      No transactions for this period
    </p>

    <!-- Load more -->
    <button
      v-if="pageInfo?.hasNextPage"
      :disabled="loadingMore"
      class="mt-4 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      @click="loadMore"
    >
      {{ loadingMore ? 'Loading...' : 'Load more' }}
    </button>
  </div>
</template>
