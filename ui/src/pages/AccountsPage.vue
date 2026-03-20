<script setup lang="ts">
import { computed } from 'vue'
import { accounts } from '@/lib/mock-data'

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

const totalBalance = computed(() => accounts.reduce((sum, a) => sum + a.balance, 0))
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Accounts</h1>

    <!-- Total balance card -->
    <div class="mt-4 rounded-2xl bg-orange-500 p-5 text-white shadow-sm">
      <p class="text-sm font-medium text-orange-100">Total Balance</p>
      <p class="mt-1 text-3xl font-bold">{{ formatAmount(totalBalance) }}</p>
    </div>

    <!-- Account cards -->
    <div class="mt-6 space-y-3">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-colors active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800"
        >
          {{ account.icon }}
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {{ account.name }}
          </p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            {{ account.currency }}
          </p>
        </div>
        <p class="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {{ formatAmount(account.balance) }}
        </p>
      </div>
    </div>
  </div>
</template>
