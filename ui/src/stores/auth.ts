import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<string | null>('auth-token', null)

  const isAuthenticated = computed(() => token.value != null)

  function setToken(newToken: string) {
    token.value = newToken
  }

  function logout() {
    token.value = null
  }

  return { token, isAuthenticated, setToken, logout }
})
