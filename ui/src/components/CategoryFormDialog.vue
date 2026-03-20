<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
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
import { graphql, type CategoryKind } from '@/graphql'

const {
  open = false,
  categoryId,
  categoryName,
  categoryIcon,
  categoryKind,
} = defineProps<{
  open?: boolean
  categoryId?: string
  categoryName?: string
  categoryIcon?: string
  categoryKind: CategoryKind
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
  deleted: []
}>()

const isEditing = computed(() => categoryId != null)
const name = ref('')
const icon = ref('')

watch(
  () => open,
  (isOpen) => {
    if (isOpen) {
      name.value = categoryName ?? ''
      icon.value = categoryIcon ?? ''
    }
  },
)

const { mutate: createCategory, loading: creating, error: createError } = useMutation(
  graphql(`
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
        ...CategoryFields
      }
    }
  `),
)

const { mutate: updateCategory, loading: updating, error: updateError } = useMutation(
  graphql(`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
      updateCategory(input: $input) {
        id
        ...CategoryFields
      }
    }
  `),
)

const { mutate: deleteCategory, loading: deleting, error: deleteError } = useMutation(
  graphql(`
    mutation DeleteCategory($id: ID!) {
      deleteCategory(id: $id)
    }
  `),
)

const loading = computed(() => creating.value || updating.value || deleting.value)
const error = computed(() => createError.value ?? updateError.value ?? deleteError.value)

async function handleSubmit() {
  if (!name.value.trim() || !icon.value.trim()) return

  if (isEditing.value) {
    const result = await updateCategory({
      variables: {
        input: {
          id: categoryId!,
          name: name.value.trim(),
          icon: icon.value.trim(),
        },
      },
    })
    if (result?.data) {
      emit('saved')
      emit('update:open', false)
    }
  } else {
    const result = await createCategory({
      variables: {
        input: {
          name: name.value.trim(),
          icon: icon.value.trim(),
          kind: categoryKind,
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
  if (!categoryId) return
  const result = await deleteCategory({
    variables: { id: categoryId },
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
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <DialogTitle class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </DialogTitle>
        <DialogDescription class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {{ isEditing ? 'Update the category details.' : `Add a new ${categoryKind.toLowerCase()} category.` }}
        </DialogDescription>

        <form class="mt-4 flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <Label for="cat-icon" class="text-sm font-medium">Icon (emoji)</Label>
            <input
              id="cat-icon"
              v-model="icon"
              type="text"
              required
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-center text-2xl outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:focus:border-orange-400 dark:focus:ring-orange-400"
              placeholder="🍕"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="cat-name" class="text-sm font-medium">Name</Label>
            <input
              id="cat-name"
              v-model="name"
              type="text"
              required
              class="rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-orange-400 dark:focus:ring-orange-400"
              placeholder="Category name"
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
