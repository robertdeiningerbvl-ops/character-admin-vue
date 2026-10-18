<script setup lang="ts">
/** 运营统计页顶部的数字卡片 */
defineProps<{
  label: string
  value: string
  hint?: string
  icon?: string
  loading?: boolean
}>()
</script>

<template>
  <div class="p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg)">
    <USkeleton v-if="loading" class="h-14" />
    <div v-else class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-sm text-(--ui-text-muted) mb-1">
          {{ label }}
        </p>
        <p class="text-2xl font-semibold text-(--ui-text-highlighted) truncate">
          {{ value }}
        </p>
        <p v-if="hint" class="text-xs text-(--ui-text-dimmed) mt-1 truncate">
          {{ hint }}
        </p>
      </div>
      <div v-if="icon" class="size-9 rounded-lg bg-(--ui-primary)/10 text-(--ui-primary) flex items-center justify-center shrink-0">
        <UIcon :name="icon" class="size-5" />
      </div>
    </div>
  </div>
</template>
