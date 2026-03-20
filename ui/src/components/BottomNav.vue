<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/accounts', label: 'Accounts', icon: 'wallet' },
  { to: '/add', label: 'Add', icon: 'plus' },
  { to: '/categories', label: 'Categories', icon: 'grid' },
  { to: '/settings', label: 'Settings', icon: 'gear' },
] as const

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav
    class="fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90"
  >
    <div class="mx-auto flex max-w-lg items-center justify-around px-2">
      <template v-for="item in navItems" :key="item.to">
        <!-- FAB button -->
        <router-link
          v-if="item.icon === 'plus'"
          :to="item.to"
          class="-mt-7 flex flex-col items-center"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 transition-transform active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </router-link>

        <!-- Regular nav items -->
        <router-link
          v-else
          :to="item.to"
          class="flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 transition-colors"
          :class="isActive(item.to) ? 'text-orange-500' : 'text-zinc-400 dark:text-zinc-500'"
        >
          <!-- Home icon -->
          <svg
            v-if="item.icon === 'home'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <!-- Wallet icon -->
          <svg
            v-else-if="item.icon === 'wallet'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <circle cx="17" cy="15" r="1.5" />
          </svg>
          <!-- Grid icon -->
          <svg
            v-else-if="item.icon === 'grid'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <!-- Gear icon -->
          <svg
            v-else-if="item.icon === 'gear'"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </router-link>
      </template>
    </div>
  </nav>
</template>
