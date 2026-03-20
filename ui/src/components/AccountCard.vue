<script setup lang="ts">
import { useFragment } from '@vue/apollo-composable'
import { useFormatAmount } from '@/composables/useFormatAmount'
import { graphql } from '@/graphql'

const AccountFields = graphql(`
  fragment AccountFields on Account {
    id
    name
    icon
    currency
    balance
    initialBalance
  }
`)

const { account } = defineProps<{
  account: { __typename: 'Account'; id: string }
}>()

const emit = defineEmits<{
  edit: [data: { id: string; name: string; icon: string; currency: string; initialBalance: number }]
}>()

const { formatAmountWithCurrency } = useFormatAmount()

const { current } = useFragment({
  fragment: AccountFields,
  from: () => account,
})
</script>

<template>
  <button
    v-if="current.resultState === 'complete'"
    class="flex w-full items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-4 text-left shadow-sm transition-colors active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800"
    @click="
      emit('edit', {
        id: current.result.id,
        name: current.result.name,
        icon: current.result.icon,
        currency: current.result.currency,
        initialBalance: current.result.initialBalance,
      })
    "
  >
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800"
    >
      {{ current.result.icon }}
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {{ current.result.name }}
      </p>
      <p class="text-xs text-zinc-500 dark:text-zinc-400">
        {{ current.result.currency }}
      </p>
    </div>
    <p class="shrink-0 text-base font-bold text-zinc-900 dark:text-zinc-100">
      {{ formatAmountWithCurrency(current.result.balance, current.result.currency) }}
    </p>
  </button>
</template>
