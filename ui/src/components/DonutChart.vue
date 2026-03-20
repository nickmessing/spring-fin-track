<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface Segment {
  value: number
  color: string
  label: string
}

const { segments, centerText, centerSubtext } = defineProps<{
  segments: Segment[]
  centerText?: string
  centerSubtext?: string
}>()

const mounted = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

const total = computed(() => segments.reduce((sum, s) => sum + s.value, 0))

const radius = 90
const circumference = 2 * Math.PI * radius

const computedSegments = computed(() => {
  let accumulated = 0
  const segs: Array<{ offset: number; length: number; color: string; label: string }> = []

  for (const seg of segments) {
    if (seg.value <= 0 || total.value === 0) continue
    const fraction = seg.value / total.value
    const length = fraction * circumference
    segs.push({
      offset: accumulated,
      length,
      color: seg.color,
      label: seg.label,
    })
    accumulated += length
  }

  return segs
})
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <svg width="240" height="240" viewBox="0 0 240 240">
      <!-- Background ring -->
      <circle
        cx="120"
        cy="120"
        :r="radius"
        fill="none"
        stroke-width="30"
        class="stroke-zinc-100 dark:stroke-zinc-800"
      />
      <!-- Segments -->
      <circle
        v-for="(seg, i) in computedSegments"
        :key="i"
        cx="120"
        cy="120"
        :r="radius"
        fill="none"
        stroke-width="30"
        :stroke="seg.color"
        stroke-linecap="butt"
        :stroke-dasharray="`${mounted ? seg.length : 0} ${circumference}`"
        :stroke-dashoffset="`${-seg.offset}`"
        transform="rotate(-90 120 120)"
        style="transition: stroke-dasharray 0.8s ease-out"
      />
    </svg>
    <!-- Center text -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span v-if="centerText" class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
        {{ centerText }}
      </span>
      <span v-if="centerSubtext" class="text-xs text-zinc-500 dark:text-zinc-400">
        {{ centerSubtext }}
      </span>
    </div>
  </div>
</template>
