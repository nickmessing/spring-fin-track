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
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
    <h1 class="text-2xl font-bold">Welcome</h1>
    <p class="text-zinc-500 dark:text-zinc-400">You are logged in.</p>
    <div class="flex gap-3">
      <button
        class="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium transition-colors dark:bg-zinc-800"
        @click="toggleDark()"
      >
        {{ isDark ? 'Light' : 'Dark' }}
      </button>
      <button
        class="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium transition-colors dark:bg-zinc-800"
        @click="handleLogout"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
