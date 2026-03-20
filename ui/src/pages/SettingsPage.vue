<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useDark, useToggle } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { graphql } from '@/graphql'
import { apolloClient } from '@/graphql/client'
import { useAuthStore } from '@/stores/auth'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()
const auth = useAuthStore()

const { current: meResult } = useQuery(
  graphql(`
    query SettingsMe {
      me {
        id
        email
        displayName
        defaultCurrency {
          code
          name
        }
      }
    }
  `),
)

const { current: currenciesResult } = useQuery(
  graphql(`
    query SettingsCurrencies {
      currencies {
        code
        name
      }
    }
  `),
)

const me = computed(() =>
  meResult.value.resultState === 'complete' ? meResult.value.result.me : null,
)

const { mutate: updateCurrency, loading: updatingCurrency } = useMutation(
  graphql(`
    mutation UpdateDefaultCurrency($currency: CurrencyCode!) {
      updateDefaultCurrency(currency: $currency) {
        id
        defaultCurrency {
          code
          name
        }
      }
    }
  `),
  {
    refetchQueries: ['MeForCurrency', 'DashboardMe', 'AccountsMe'],
  },
)

async function handleCurrencyChange(event: Event) {
  const code = (event.target as HTMLSelectElement).value
  await updateCurrency({ variables: { currency: code } })
}

async function handleLogout() {
  auth.logout()
  await apolloClient.clearStore()
  router.push('/auth')
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>

    <!-- User info card -->
    <div
      v-if="me"
      class="mt-6 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        >
          {{ (me.displayName ?? me.email)[0]?.toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <p
            v-if="me.displayName"
            class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {{ me.displayName }}
          </p>
          <p class="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {{ me.email }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 space-y-3">
      <!-- Default currency -->
      <div
        class="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Default Currency</span>
        <select
          :value="me?.defaultCurrency.code"
          :disabled="updatingCurrency || !me"
          class="max-w-32 rounded-lg border border-zinc-200 bg-transparent px-2 py-1 text-right text-sm text-zinc-700 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:focus:border-orange-400 dark:focus:ring-orange-400"
          @change="handleCurrencyChange"
        >
          <template v-if="currenciesResult.resultState === 'complete'">
            <option v-for="c in currenciesResult.result.currencies" :key="c.code" :value="c.code">
              {{ c.code }}
            </option>
          </template>
        </select>
      </div>

      <!-- Dark mode toggle -->
      <button
        class="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-colors active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800"
        @click="toggleDark()"
      >
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Dark Mode</span>
        <span class="text-sm text-zinc-500 dark:text-zinc-400">
          {{ isDark ? 'On' : 'Off' }}
        </span>
      </button>

      <!-- Logout -->
      <button
        class="flex w-full items-center justify-center rounded-2xl border border-red-100 bg-white p-4 text-sm font-medium text-red-500 shadow-sm transition-colors active:bg-red-50 dark:border-red-900/30 dark:bg-zinc-900 dark:active:bg-zinc-800"
        @click="handleLogout"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
