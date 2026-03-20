<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <div class="min-h-dvh bg-white dark:bg-zinc-950">
    <RouterView />
    <BottomNav />
  </div>
</template>
