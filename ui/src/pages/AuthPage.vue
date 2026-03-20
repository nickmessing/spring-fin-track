<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Label } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { graphql } from '@/graphql'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isSignUp = ref(false)

const email = ref('')
const password = ref('')
const displayName = ref('')
const currency = ref('USD')

const { current: currenciesResult } = useQuery(
  graphql(`
    query AuthCurrencies {
      currencies {
        code
        name
      }
    }
  `),
)

const {
  mutate: signIn,
  loading: signInLoading,
  error: signInError,
} = useMutation(
  graphql(`
    mutation SignIn($input: SignInInput!) {
      signIn(input: $input) {
        token
      }
    }
  `),
)

const {
  mutate: signUp,
  loading: signUpLoading,
  error: signUpError,
} = useMutation(
  graphql(`
    mutation SignUp($input: SignUpInput!) {
      signUp(input: $input) {
        token
      }
    }
  `),
)

const rawError = computed(() => isSignUp.value ? signUpError.value : signInError.value)
const loading = computed(() => signInLoading.value || signUpLoading.value)

function friendlyError(msg: string): string {
  if (msg.includes('Invalid email or password')) return 'Invalid email or password'
  if (msg.includes('Email already in use')) return 'Email already in use'
  return msg
}

const errorMessage = computed(() => {
  if (!rawError.value) return null
  return friendlyError(rawError.value.message)
})

const prefixDisplay = ref("Don't")
const suffixDisplay = ref('up')
let timer: ReturnType<typeof setTimeout> | null = null

function morphText(
  from: string,
  target: string,
  onUpdate: (v: string) => void,
  onDone: () => void,
) {
  const delay = 40
  const maxLen = Math.max(from.length, target.length)
  let i = 0
  // Start with the full "from" padded to maxLen so we can replace in place
  const buf = Array.from(from.padEnd(maxLen))

  function step() {
    if (i < maxLen) {
      if (i < target.length) {
        buf[i] = target[i]!
      }
      i++
      // Trim trailing spaces if we're past target length and have replaced everything
      const display = buf
        .slice(0, Math.max(i, target.length, from.length - (i - target.length)))
        .join('')
      onUpdate(i >= target.length ? display.trimEnd() : display)
      timer = setTimeout(step, delay)
    } else {
      onUpdate(target)
      onDone()
    }
  }

  step()
}

watch(isSignUp, (signUp) => {
  if (timer) clearTimeout(timer)
  const newPrefix = signUp ? 'Already' : "Don't"
  const newSuffix = signUp ? 'in' : 'up'

  morphText(
    prefixDisplay.value,
    newPrefix,
    (v) => {
      prefixDisplay.value = v
    },
    () => {
      morphText(
        suffixDisplay.value,
        newSuffix,
        (v) => {
          suffixDisplay.value = v
        },
        () => {},
      )
    },
  )
})

async function handleSubmit() {
  if (isSignUp.value) {
    const result = await signUp({
      variables: {
        input: {
          email: email.value,
          password: password.value,
          displayName: displayName.value || null,
          defaultCurrency: currency.value,
        },
      },
    })
    if (result?.data) {
      auth.setToken(result.data.signUp.token)
      router.push('/')
    }
  } else {
    const result = await signIn({
      variables: {
        input: { email: email.value, password: password.value },
      },
    })
    if (result?.data) {
      auth.setToken(result.data.signIn.token)
      router.push('/')
    }
  }
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-2xl font-bold tracking-tight">Finance Tracker</h1>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Extra sign-up fields (animated) -->
        <div class="extra-fields" :class="{ open: isSignUp }">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Label for="display-name" class="text-sm font-medium">Display Name</Label>
              <input
                id="display-name"
                v-model="displayName"
                type="text"
                autocomplete="name"
                :tabindex="isSignUp ? undefined : -1"
                class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>

        <!-- Shared fields -->
        <div class="flex flex-col gap-1.5">
          <Label for="email" class="text-sm font-medium">Email</Label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
            placeholder="you@example.com"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="password" class="text-sm font-medium">Password</Label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :autocomplete="isSignUp ? 'new-password' : 'current-password'"
            class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
            placeholder="Your password"
          />
        </div>

        <!-- Currency field (animated) -->
        <div class="extra-fields" :class="{ open: isSignUp }">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Label for="currency" class="text-sm font-medium">Default Currency</Label>
              <select
                id="currency"
                v-model="currency"
                required
                :tabindex="isSignUp ? undefined : -1"
                class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
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
                <option v-else disabled>Loading currencies...</option>
              </select>
            </div>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="relative mt-2 h-11 overflow-hidden rounded-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-400"
        >
          <span class="btn-text" :class="isSignUp ? 'out-up' : 'in'">
            {{ signInLoading ? 'Signing in...' : 'Sign In' }}
          </span>
          <span class="btn-text" :class="isSignUp ? 'in' : 'out-down'">
            {{ signUpLoading ? 'Creating account...' : 'Create Account' }}
          </span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <button
          type="button"
          class="font-medium text-orange-600 transition-colors hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
          @click="isSignUp = !isSignUp"
        >
          {{ prefixDisplay }} have an account? Sign {{ suffixDisplay }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.extra-fields {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 300ms ease,
    opacity 200ms ease;
}

.extra-fields > * {
  overflow: hidden;
}

.extra-fields.open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.btn-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 250ms ease,
    opacity 250ms ease;
}

.btn-text.in {
  transform: translateY(0);
  opacity: 1;
}

.btn-text.out-up {
  transform: translateY(-100%);
  opacity: 0;
}

.btn-text.out-down {
  transform: translateY(100%);
  opacity: 0;
}
</style>
