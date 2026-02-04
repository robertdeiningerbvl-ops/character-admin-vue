<script setup lang="ts">
const props = withDefaults(defineProps<{
  modal?: any
  color?: 'error' | 'primary' | 'neutral' | 'secondary' | 'success' | 'info' | 'warning' | undefined
  title?: string
  description?: string
  onPositiveClick?: () => void
}>(), {
  modal: {} as any,
  color: 'error',
  title: '',
  description: '',
  onPositiveClick: () => {}
})

async function onSubmit() {
  props.onPositiveClick?.()
  props.modal.close()
}
</script>

<template>
  <UModal
    :title="title"
    :description="description"
  >
    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="取消"
          color="neutral"
          variant="outline"
          @click="modal.close()"
        />
        <UButton
          label="确认"
          :color="color"
          variant="solid"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
