<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, ref } from 'vue'
import AccountCard from '@/components/AccountCard.vue'
import AccountFormDialog from '@/components/AccountFormDialog.vue'
import { useFormatAmount } from '@/composables/useFormatAmount'
import { graphql } from '@/graphql'

const { formatAmount } = useFormatAmount()

const { current: meResult, refetch: refetchMe } = useQuery(
  graphql(`
    query AccountsMe {
      me {
        balance
      }
    }
  `),
)

const { current, refetch, fetchMore } = useQuery(
  graphql(`
    query Accounts($after: String) {
      accounts(after: $after) {
        edges {
          cursor
          node {
            id
            balance
            ...AccountFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `),
)

const accounts = computed(() =>
  current.value.resultState === 'complete'
    ? current.value.result.accounts.edges.map((e) => e.node)
    : [],
)

const pageInfo = computed(() =>
  current.value.resultState === 'complete' ? current.value.result.accounts.pageInfo : null,
)

const loadingMore = ref(false)

async function loadMore() {
  if (!pageInfo.value?.hasNextPage || loadingMore.value) return

  loadingMore.value = true
  try {
    await fetchMore({
      variables: {
        after: pageInfo.value.endCursor,
      },
      updateQuery(existing, { fetchMoreResult }) {
        if (fetchMoreResult == null) return existing

        const existingEdges = existing.accounts.edges ?? []
        const incomingEdges = fetchMoreResult.accounts.edges ?? []
        const existingCursors = new Set(existingEdges.map((e) => e.cursor))

        return {
          ...fetchMoreResult,
          accounts: {
            ...fetchMoreResult.accounts,
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

// Dialog state
const dialogOpen = ref(false)
const editingId = ref<string>()
const editingName = ref<string>()
const editingIcon = ref<string>()
const editingCurrency = ref<string>()
const editingInitialBalance = ref<number>()

function openCreate() {
  editingId.value = undefined
  editingName.value = undefined
  editingIcon.value = undefined
  editingCurrency.value = undefined
  editingInitialBalance.value = undefined
  dialogOpen.value = true
}

function openEdit(data: {
  id: string
  name: string
  icon: string
  currency: string
  initialBalance: number
}) {
  editingId.value = data.id
  editingName.value = data.name
  editingIcon.value = data.icon
  editingCurrency.value = data.currency
  editingInitialBalance.value = data.initialBalance
  dialogOpen.value = true
}

function handleSavedOrDeleted() {
  refetch()
  refetchMe()
}

const totalBalance = computed(() =>
  meResult.value.resultState === 'complete' && meResult.value.result.me
    ? meResult.value.result.me.balance
    : null,
)
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Accounts</h1>
      <button
        class="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 active:scale-95 dark:hover:bg-orange-400"
        @click="openCreate"
      >
        + Add
      </button>
    </div>

    <!-- Total balance card -->
    <div
      v-if="totalBalance != null"
      class="mt-4 rounded-2xl bg-orange-500 p-5 text-white shadow-sm"
    >
      <p class="text-sm font-medium text-orange-100">Total Balance</p>
      <p class="mt-1 text-3xl font-bold">{{ formatAmount(totalBalance) }}</p>
    </div>

    <!-- Account cards -->
    <div class="mt-6 space-y-3">
      <AccountCard v-for="acc in accounts" :key="acc.id" :account="acc" @edit="openEdit" />
    </div>

    <p
      v-if="accounts.length === 0 && current.resultState === 'complete'"
      class="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
    >
      No accounts yet
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

    <!-- Form dialog -->
    <AccountFormDialog
      v-model:open="dialogOpen"
      :account-id="editingId"
      :account-name="editingName"
      :account-icon="editingIcon"
      :account-currency="editingCurrency"
      :account-initial-balance="editingInitialBalance"
      @saved="handleSavedOrDeleted"
      @deleted="handleSavedOrDeleted"
    />
  </div>
</template>
