<script setup lang="ts">
import { useFragment } from '@vue/apollo-composable'
import { computed } from 'vue'
import { useFormatAmount } from '@/composables/useFormatAmount'
import { graphql, TransactionKind } from '@/graphql'

const TransactionFields = graphql(`
  fragment TransactionFields on Transaction {
    id
    kind
    amount
    description
    createdAt
    category {
      id
      name
      icon
    }
  }
`)

const { transaction } = defineProps<{
  transaction: { __typename: 'Transaction'; id: string }
}>()

const { formatAmount } = useFormatAmount()

const { current } = useFragment({
  fragment: TransactionFields,
  from: () => transaction,
})

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const displayAmount = computed(() => {
  if (current.value.resultState !== 'complete') return ''
  const tx = current.value.result
  if (tx.kind === TransactionKind.Expense) return `-${formatAmount(tx.amount)}`
  if (tx.kind === TransactionKind.Income) return `+${formatAmount(tx.amount)}`
  return formatAmount(tx.amount)
})

const amountColor = computed(() => {
  if (current.value.resultState !== 'complete') return ''
  const tx = current.value.result
  if (tx.kind === TransactionKind.Expense) return 'text-red-500'
  if (tx.kind === TransactionKind.Income) return 'text-emerald-500'
  return 'text-orange-500'
})

const icon = computed(() => {
  if (current.value.resultState !== 'complete') return ''
  const tx = current.value.result
  if (tx.category) return tx.category.icon
  if (tx.kind === TransactionKind.Transfer) return '\u21C4'
  return '\u2022'
})

const label = computed(() => {
  if (current.value.resultState !== 'complete') return ''
  const tx = current.value.result
  if (tx.category) return tx.category.name
  if (tx.kind === TransactionKind.Transfer) return 'Transfer'
  return 'Unknown'
})
</script>

<template>
  <div
    v-if="current.resultState === 'complete'"
    class="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors active:bg-zinc-50 dark:active:bg-zinc-900"
  >
    <!-- Icon -->
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-xl dark:bg-zinc-800"
    >
      {{ icon }}
    </div>

    <!-- Name & description -->
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {{ label }}
      </p>
      <p
        v-if="current.result.description"
        class="truncate text-xs text-zinc-500 dark:text-zinc-400"
      >
        {{ current.result.description }}
      </p>
    </div>

    <!-- Amount & time -->
    <div class="shrink-0 text-right">
      <p class="text-sm font-semibold" :class="amountColor">
        {{ displayAmount }}
      </p>
      <p class="text-[10px] text-zinc-400 dark:text-zinc-500">
        {{ formatTime(current.result.createdAt) }}
      </p>
    </div>
  </div>
</template>
