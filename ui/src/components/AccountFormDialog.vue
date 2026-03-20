<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Label } from 'reka-ui'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { graphql } from '@/graphql'

const {
  open = false,
  accountId,
  accountName,
  accountIcon,
  accountCurrency,
  accountInitialBalance,
} = defineProps<{
  open?: boolean
  accountId?: string
  accountName?: string
  accountIcon?: string
  accountCurrency?: string
  accountInitialBalance?: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
  deleted: []
}>()

const isEditing = computed(() => accountId != null)
const name = ref('')
const icon = ref('')
const currency = ref('USD')
const initialBalance = ref('0.00')

watch(
  () => open,
  (isOpen) => {
    if (isOpen) {
      name.value = accountName ?? ''
      icon.value = accountIcon ?? ''
      currency.value = accountCurrency ?? 'USD'
      initialBalance.value =
        accountInitialBalance != null ? (accountInitialBalance / 100).toFixed(2) : '0.00'
    }
  },
)

const { current: currenciesResult } = useQuery(
  graphql(`
    query AccountFormCurrencies {
      currencies {
        code
        name
      }
    }
  `),
)

const {
  mutate: createAccount,
  loading: creating,
  error: createError,
} = useMutation(
  graphql(`
    mutation CreateAccount($input: CreateAccountInput!) {
      createAccount(input: $input) {
        id
        ...AccountFields
      }
    }
  `),
)

const {
  mutate: updateAccount,
  loading: updating,
  error: updateError,
} = useMutation(
  graphql(`
    mutation UpdateAccount($input: UpdateAccountInput!) {
      updateAccount(input: $input) {
        id
        ...AccountFields
      }
    }
  `),
)

const {
  mutate: deleteAccount,
  loading: deleting,
  error: deleteError,
} = useMutation(
  graphql(`
    mutation DeleteAccount($id: ID!) {
      deleteAccount(id: $id)
    }
  `),
)

const loading = computed(() => creating.value || updating.value || deleting.value)
const error = computed(() => createError.value ?? updateError.value ?? deleteError.value)

function parseAmount(str: string): number {
  const num = parseFloat(str)
  return isNaN(num) ? 0 : Math.round(num * 100)
}

async function handleSubmit() {
  if (!name.value.trim() || !icon.value.trim()) return

  if (isEditing.value) {
    const result = await updateAccount({
      variables: {
        input: {
          id: accountId!,
          name: name.value.trim(),
          icon: icon.value.trim(),
          initialBalance: parseAmount(initialBalance.value),
        },
      },
    })
    if (result?.data) {
      emit('saved')
      emit('update:open', false)
    }
  } else {
    const result = await createAccount({
      variables: {
        input: {
          name: name.value.trim(),
          icon: icon.value.trim(),
          currency: currency.value,
          initialBalance: parseAmount(initialBalance.value),
        },
      },
    })
    if (result?.data) {
      emit('saved')
      emit('update:open', false)
    }
  }
}

async function handleDelete() {
  if (!accountId) return
  const result = await deleteAccount({
    variables: { id: accountId },
  })
  if (result?.data) {
    emit('deleted')
    emit('update:open', false)
  }
}
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <DialogTitle class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {{ isEditing ? 'Edit Account' : 'New Account' }}
        </DialogTitle>
        <DialogDescription class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {{ isEditing ? 'Update account details.' : 'Add a new account to track.' }}
        </DialogDescription>

        <form class="mt-4 flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <Label for="acc-icon" class="text-sm font-medium">Icon (emoji)</Label>
            <input
              id="acc-icon"
              v-model="icon"
              type="text"
              required
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-center text-2xl outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:focus:border-orange-400 dark:focus:ring-orange-400"
              placeholder="💳"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="acc-name" class="text-sm font-medium">Name</Label>
            <input
              id="acc-name"
              v-model="name"
              type="text"
              required
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
              placeholder="Account name"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="acc-currency" class="text-sm font-medium">Currency</Label>
            <select
              id="acc-currency"
              v-model="currency"
              required
              :disabled="isEditing"
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50 dark:border-zinc-700 dark:focus:border-orange-400 dark:focus:ring-orange-400"
            >
              <template v-if="currenciesResult.resultState === 'complete'">
                <option
                  v-for="c in currenciesResult.result.currencies"
                  :key="c.code"
                  :value="c.code"
                >
                  {{ c.code }} - {{ c.name }}
                </option>
              </template>
              <option v-else disabled>Loading...</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="acc-balance" class="text-sm font-medium">Initial Balance</Label>
            <input
              id="acc-balance"
              v-model="initialBalance"
              type="number"
              step="0.01"
              required
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
              placeholder="0.00"
            />
          </div>

          <div
            v-if="error"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400"
          >
            {{ error.message }}
          </div>

          <div class="flex gap-3">
            <button
              v-if="isEditing"
              type="button"
              :disabled="loading"
              class="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
              @click="handleDelete"
            >
              Delete
            </button>
            <div class="flex-1" />
            <DialogClose
              class="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </DialogClose>
            <button
              type="submit"
              :disabled="loading || !name.trim() || !icon.trim()"
              class="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50 dark:hover:bg-orange-400"
            >
              {{ loading ? 'Saving...' : isEditing ? 'Save' : 'Create' }}
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
