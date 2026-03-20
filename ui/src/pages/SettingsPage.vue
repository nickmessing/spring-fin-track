<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apolloClient } from '@/graphql/client'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  auth.logout()
  await apolloClient.clearStore()
  router.push('/auth')
}
</script>

<template>
  <div class="mx-auto max-w-lg px-4 pb-24 pt-6">
    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>

    <div class="mt-6 space-y-3">
      <!-- Dark mode toggle -->
      <button
        class="flex w-full items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-colors active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800"
        @click="toggleDark()"
      >
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100"> Dark Mode </span>
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
