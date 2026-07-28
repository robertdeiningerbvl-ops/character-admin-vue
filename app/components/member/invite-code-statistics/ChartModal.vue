<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open: boolean
  title: string
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'max-w-5xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="space-y-4">
        <!-- 查询条件表单插槽 -->
        <slot name="filters" />

        <!-- 图表容器 -->
        <div v-if="loading" class="flex items-center justify-center h-96">
          <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-primary" />
        </div>
        <div v-else>
          <slot name="chart" />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
