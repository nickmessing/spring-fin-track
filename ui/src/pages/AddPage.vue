<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Label } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { graphql, CategoryKind, TransactionKind } from '@/graphql'

const { id } = defineProps<{
  id?: string
}>()

const router = useRouter()
const isEditing = computed(() => id != null)

const kind = ref<'EXPENSE' | 'INCOME' | 'TRANSFER'>('EXPENSE')
const amount = ref('')
const destinationAmount = ref('')
const description = ref('')
const selectedCategoryId = ref<string>()
const selectedAccountId = ref<string>()
const selectedDestAccountId = ref<string>()

// Fetch existing transaction when editing
const { current: txResult } = useQuery(
  graphql(`
    query EditTransaction($id: ID!) {
      transaction(id: $id) {
        id
        kind
        amount
        destinationAmount
        description
        account {
          id
        }
        destinationAccount {
          id
        }
        category {
          id
        }
      }
    }
  `),
  {
    variables: () => ({ id: id! }),
    enabled: () => isEditing.value,
  },
)

// Pre-fill form when transaction data loads
watch(
  () => txResult.value,
  (val) => {
    if (val.resultState !== 'complete' || !val.result.transaction) return
    const tx = val.result.transaction
    kind.value = tx.kind
    amount.value = (tx.amount / 100).toString()
    destinationAmount.value = tx.destinationAmount ? (tx.destinationAmount / 100).toString() : ''
    description.value = tx.description ?? ''
    selectedAccountId.value = tx.account.id
    selectedDestAccountId.value = tx.destinationAccount?.id
    selectedCategoryId.value = tx.category?.id
  },
  { immediate: true },
)

// Fetch categories and accounts
const { current: catResult } = useQuery(
  graphql(`
    query AddTransactionCategories {
      categories {
        edges {
          node {
            id
            name
            icon
            kind
          }
        }
      }
    }
  `),
)

const { current: accResult } = useQuery(
  graphql(`
    query AddTransactionAccounts {
      accounts {
        edges {
          node {
            id
            name
            icon
            currency
          }
        }
      }
    }
  `),
)

const categories = computed(() =>
  catResult.value.resultState === 'complete'
    ? catResult.value.result.categories.edges.map((e) => e.node)
    : [],
)

const accounts = computed(() =>
  accResult.value.resultState === 'complete'
    ? accResult.value.result.accounts.edges.map((e) => e.node)
    : [],
)

const filteredCategories = computed(() => {
  const filterKind = kind.value === 'INCOME' ? CategoryKind.Income : CategoryKind.Expense
  return categories.value.filter((c) => c.kind === filterKind)
})

function setKind(k: 'EXPENSE' | 'INCOME' | 'TRANSFER') {
  kind.value = k
  selectedCategoryId.value = undefined
}

const REFETCH = { refetchQueries: ['Transactions', 'DashboardMe', 'Accounts', 'AccountsMe'] }

const {
  mutate: createTransaction,
  loading: creating,
  error: createError,
} = useMutation(
  graphql(`
    mutation CreateTransaction($input: CreateTransactionInput!) {
      createTransaction(input: $input) {
        id
        ...TransactionFields
      }
    }
  `),
  REFETCH,
)

const {
  mutate: updateTransaction,
  loading: updating,
  error: updateError,
} = useMutation(
  graphql(`
    mutation UpdateTransaction($input: UpdateTransactionInput!) {
      updateTransaction(input: $input) {
        id
        ...TransactionFields
      }
    }
  `),
  REFETCH,
)

const {
  mutate: deleteTransaction,
  loading: deleting,
  error: deleteError,
} = useMutation(
  graphql(`
    mutation DeleteTransaction($id: ID!) {
      deleteTransaction(id: $id)
    }
  `),
  REFETCH,
)

const loading = computed(() => creating.value || updating.value || deleting.value)
const error = computed(() => createError.value ?? updateError.value ?? deleteError.value)

function parseAmount(str: string): number {
  const num = parseFloat(str)
  return isNaN(num) ? 0 : Math.round(num * 100)
}

const canSubmit = computed(() => {
  if (!amount.value || !selectedAccountId.value) return false
  if (kind.value === 'TRANSFER') {
    return !!selectedDestAccountId.value && selectedDestAccountId.value !== selectedAccountId.value
  }
  return !!selectedCategoryId.value
})

async function handleSubmit() {
  if (!canSubmit.value) return

  if (isEditing.value) {
    const result = await updateTransaction({
      variables: {
        input: {
          id: id!,
          amount: parseAmount(amount.value),
          accountId: selectedAccountId.value!,
          categoryId: kind.value !== 'TRANSFER' ? selectedCategoryId.value : undefined,
          description: description.value.trim() || undefined,
          destinationAccountId: kind.value === 'TRANSFER' ? selectedDestAccountId.value : undefined,
          destinationAmount:
            kind.value === 'TRANSFER' && destinationAmount.value
              ? parseAmount(destinationAmount.value)
              : undefined,
        },
      },
    })
    if (result?.data) router.push('/')
  } else {
    const result = await createTransaction({
      variables: {
        input: {
          kind: kind.value as TransactionKind,
          amount: parseAmount(amount.value),
          accountId: selectedAccountId.value!,
          categoryId: kind.value !== 'TRANSFER' ? selectedCategoryId.value : undefined,
          description: description.value.trim() || undefined,
          destinationAccountId: kind.value === 'TRANSFER' ? selectedDestAccountId.value : undefined,
          destinationAmount:
            kind.value === 'TRANSFER' && destinationAmount.value
              ? parseAmount(destinationAmount.value)
              : undefined,
        },
      },
    })
    if (result?.data) router.push('/')
  }
}

async function handleDelete() {
  if (!id) return
  const result = await deleteTransaction({
    variables: { id },
  })
  if (result?.data) router.push('/')
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ isEditing ? 'Edit Transaction' : 'New Transaction' }}
      </h1>
      <button
        class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        @click="router.back()"
      >
        Cancel
      </button>
    </div>

    <!-- Kind selector (disabled when editing) -->
    <div class="mt-4 flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
      <button
        :disabled="isEditing"
        class="flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-60"
        :class="
          kind === 'EXPENSE'
            ? 'bg-red-500 text-white shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400'
        "
        @click="setKind('EXPENSE')"
      >
        Expense
      </button>
      <button
        :disabled="isEditing"
        class="flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-60"
        :class="
          kind === 'INCOME'
            ? 'bg-emerald-500 text-white shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400'
        "
        @click="setKind('INCOME')"
      >
        Income
      </button>
      <button
        :disabled="isEditing"
        class="flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-60"
        :class="
          kind === 'TRANSFER'
            ? 'bg-orange-500 text-white shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400'
        "
        @click="setKind('TRANSFER')"
      >
        Transfer
      </button>
    </div>

    <!-- Amount -->
    <div class="mt-6">
      <Label for="tx-amount" class="text-sm font-medium">Amount</Label>
      <input
        id="tx-amount"
        v-model="amount"
        type="number"
        step="0.01"
        min="0.01"
        required
        inputmode="decimal"
        class="mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-4 text-center text-3xl font-bold outline-none transition-colors placeholder:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-600 dark:focus:border-orange-400 dark:focus:ring-orange-400"
        placeholder="0.00"
      />
    </div>

    <!-- Destination amount (transfer only) -->
    <div v-if="kind === 'TRANSFER'" class="mt-4">
      <Label for="tx-dest-amount" class="text-sm font-medium">
        Destination Amount
        <span class="text-xs text-zinc-400 dark:text-zinc-500">(if different currency)</span>
      </Label>
      <input
        id="tx-dest-amount"
        v-model="destinationAmount"
        type="number"
        step="0.01"
        min="0"
        inputmode="decimal"
        class="mt-1.5 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-center text-xl font-bold outline-none transition-colors placeholder:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-600 dark:focus:border-orange-400 dark:focus:ring-orange-400"
        placeholder="Same as amount"
      />
    </div>

    <!-- Category picker (expense/income only) -->
    <div v-if="kind !== 'TRANSFER'" class="mt-6">
      <Label class="text-sm font-medium">Category</Label>
      <div class="mt-2 grid grid-cols-4 gap-2">
        <button
          v-for="cat in filteredCategories"
          :key="cat.id"
          class="flex flex-col items-center gap-1 rounded-xl border p-2.5 transition-all active:scale-95"
          :class="
            selectedCategoryId === cat.id
              ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/30'
              : 'border-zinc-100 bg-white hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
          "
          @click="selectedCategoryId = cat.id"
        >
          <span class="text-xl">{{ cat.icon }}</span>
          <span class="truncate text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{{
            cat.name
          }}</span>
        </button>
      </div>
      <p
        v-if="filteredCategories.length === 0"
        class="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500"
      >
        No categories yet — create one first
      </p>
    </div>

    <!-- Account -->
    <div class="mt-6">
      <Label class="text-sm font-medium">
        {{ kind === 'TRANSFER' ? 'From Account' : 'Account' }}
      </Label>
      <div class="mt-2 flex flex-col gap-2">
        <button
          v-for="acc in accounts"
          :key="acc.id"
          class="flex items-center gap-3 rounded-xl border p-3 transition-all active:scale-[0.98]"
          :class="
            selectedAccountId === acc.id
              ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/30'
              : 'border-zinc-100 bg-white hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
          "
          @click="selectedAccountId = acc.id"
        >
          <span class="text-xl">{{ acc.icon }}</span>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ acc.name }}</span>
          <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ acc.currency }}</span>
        </button>
      </div>
    </div>

    <!-- Destination account (transfer only) -->
    <div v-if="kind === 'TRANSFER'" class="mt-6">
      <Label class="text-sm font-medium">To Account</Label>
      <div class="mt-2 flex flex-col gap-2">
        <button
          v-for="acc in accounts.filter((a) => a.id !== selectedAccountId)"
          :key="acc.id"
          class="flex items-center gap-3 rounded-xl border p-3 transition-all active:scale-[0.98]"
          :class="
            selectedDestAccountId === acc.id
              ? 'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/30'
              : 'border-zinc-100 bg-white hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
          "
          @click="selectedDestAccountId = acc.id"
        >
          <span class="text-xl">{{ acc.icon }}</span>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">{{ acc.name }}</span>
          <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ acc.currency }}</span>
        </button>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-6">
      <Label for="tx-desc" class="text-sm font-medium">
        Description
        <span class="text-xs text-zinc-400 dark:text-zinc-500">(optional)</span>
      </Label>
      <input
        id="tx-desc"
        v-model="description"
        type="text"
        class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
        placeholder="What was this for?"
      />
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400"
    >
      {{ error.message }}
    </div>

    <!-- Actions -->
    <div class="mt-6 flex flex-col gap-3">
      <button
        :disabled="!canSubmit || loading"
        class="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-40"
        :class="{
          'bg-red-500 hover:bg-red-600': kind === 'EXPENSE',
          'bg-emerald-500 hover:bg-emerald-600': kind === 'INCOME',
          'bg-orange-500 hover:bg-orange-600': kind === 'TRANSFER',
        }"
        @click="handleSubmit"
      >
        {{
          loading
            ? 'Saving...'
            : isEditing
              ? 'Save Changes'
              : kind === 'TRANSFER'
                ? 'Transfer'
                : kind === 'INCOME'
                  ? 'Add Income'
                  : 'Add Expense'
        }}
      </button>
      <button
        v-if="isEditing"
        :disabled="loading"
        class="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
        @click="handleDelete"
      >
        {{ deleting ? 'Deleting...' : 'Delete Transaction' }}
      </button>
    </div>
  </div>
</template>
