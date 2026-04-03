<script setup lang="ts">
const props = withDefaults(defineProps<{
  dialog?: boolean
  params?: string
}>(), {
  dialog: false,
  params: ''
})

const emit = defineEmits(['update:dialog'])

const drawerVisible = computed({
  get() { return props.dialog },
  set(visible) { emit('update:dialog', visible) }
})

const parsedData = computed(() => {
  if (!props.params || props.params === '-') return null
  try {
    return JSON.parse(props.params)
  } catch {
    return null
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-file-json" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">操作参数详情</span>
      </div>
    </template>

    <template #body>
      <div v-if="parsedData" class="space-y-2">
        <div
          v-for="(value, key) in parsedData"
          :key="key"
          class="flex gap-3 p-3 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)"
        >
          <span class="font-semibold text-sm min-w-[100px]">{{ key }}:</span>
          <span class="text-sm text-(--ui-text-muted) break-all">
            {{ Array.isArray(value) ? value.join(', ') : value }}
          </span>
        </div>
      </div>
      <div v-else class="text-center text-(--ui-text-muted) py-8">
        无法解析参数内容
      </div>
    </template>
  </UModal>
</template>
