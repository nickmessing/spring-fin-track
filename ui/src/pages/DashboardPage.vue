<script setup lang="ts">
import { computed, ref } from 'vue'
import { TransactionKind } from '@/graphql'
import { transactions, categoryColors } from '@/lib/mock-data'
import DonutChart from '@/components/DonutChart.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import PeriodSelector from '@/components/PeriodSelector.vue'

const period = ref('Month')

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

const now = new Date()

function isInPeriod(iso: string, p: string): boolean {
  const d = new Date(iso)
  const diffMs = now.getTime() - d.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  switch (p) {
    case 'Day':
      return diffDays < 1
    case 'Week':
      return diffDays < 7
    case 'Month':
      return diffDays < 30
    case 'Year':
      return diffDays < 365
    default:
      return true
  }
}

const filteredTransactions = computed(() =>
  transactions.filter((tx) => isInPeriod(tx.createdAt, period.value)),
)

const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.kind === TransactionKind.Expense)
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.kind === TransactionKind.Income)
    .reduce((sum, tx) => sum + tx.amount, 0),
)

const balance = computed(() => totalIncome.value - totalExpense.value)

const chartSegments = computed(() => {
  const map = new Map<string, { value: number; color: string; label: string }>()
  for (const tx of filteredTransactions.value) {
    if (tx.kind !== TransactionKind.Expense || !tx.category) continue
    const catId = tx.category.id
    const existing = map.get(catId)
    if (existing) {
      existing.value += tx.amount
    } else {
      map.set(catId, {
        value: tx.amount,
        color: categoryColors[catId] ?? '#6b7280',
        label: tx.category.name,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.value - a.value)
})

// Group transactions by date
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
  const groups: Array<{ label: string; items: typeof filteredTransactions.value }> = []
  const map = new Map<string, typeof filteredTransactions.value>()

  for (const tx of filteredTransactions.value) {
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
  </div>
</template>
