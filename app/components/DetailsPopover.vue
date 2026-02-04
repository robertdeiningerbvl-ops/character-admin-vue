<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = withDefaults(defineProps<{
  list?: any[]
  ui?: any
}>(), {
  list: () => ([]),
  ui: () => ({})
})

const reactiveList = reactive(props.list.map(item => ({
  ...item,
  copy: false
})))

watch(() => props.list, (newList) => {
  reactiveList.splice(0, reactiveList.length)
  reactiveList.push(...newList.map(item => ({
    ...item,
    copy: false
  })))
}, { deep: true })

const popoverOpen = ref(false)

const { copy, isSupported } = useClipboard({
  legacy: true
})

const copyTimers = new Map<string, ReturnType<typeof setTimeout>>()

async function handleCopy(item: any) {
  if (!isSupported.value) {
    console.warn('Clipboard API is not supported')
    return
  }

  try {
    await copy(item.value)

    const previousTimer = copyTimers.get(item.key)
    if (previousTimer) {
      clearTimeout(previousTimer)
    }

    item.copy = true

    const timer = setTimeout(() => {
      item.copy = false
      copyTimers.delete(item.key)
    }, 2000)

    copyTimers.set(item.key, timer)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

onUnmounted(() => {
  copyTimers.forEach(timer => clearTimeout(timer))
  copyTimers.clear()
})
</script>

<template>
  <div class="flex">
    <UPopover
      v-model:open="popoverOpen"
      :content="{
        side: 'top'
      }"
      mode="click"
      arrow
    >
      <div class="flex items-center gap-1 text-sm text-muted hover:text-(--ui-primary) cursor-default">
        <UIcon name="hugeicons:view" class="size-4.5" />
        <span>查看</span>
      </div>

      <template #content>
        <div class="min-w-80 flex flex-col p-3 gap-2 outline-none" :class="[props.ui?.base]">
          <UFormField
            v-for="item in reactiveList"
            :key="item.key"
            :label="item.key"
            name="remark"
          >
            <UTextarea
              v-if="item.type === 'textarea'"
              disabled
              :value="item.value"
              :rows="1"
              autoresize
              placeholder="请输入"
              class="w-full"
              :class="[props.ui?.input]"
              :ui="{ base: 'cursor-text!', trailing: 'inset-y-0.5 pe-1' }"
            >
              <template #trailing>
                <UButton
                  v-if="item.copy"
                  tabindex="-1"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-copy-check"
                  class="text-success!"
                  :disabled="!isSupported"
                  @click="handleCopy(item)"
                />
                <UButton
                  v-else
                  tabindex="-1"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-copy"
                  class="text-dimmed"
                  :disabled="!isSupported"
                  @click="handleCopy(item)"
                />
              </template>
            </UTextarea>
            <UInput
              v-else
              disabled
              :value="item.value"
              placeholder="请输入"
              class="w-full"
              :class="[props.ui?.input]"
              :ui="{ base: 'cursor-text!', trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  v-if="item.copy"
                  tabindex="-1"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-copy-check"
                  class="text-success!"
                  :disabled="!isSupported"
                  @click="handleCopy(item)"
                />
                <UButton
                  v-else
                  tabindex="-1"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-copy"
                  class="text-dimmed"
                  :disabled="!isSupported"
                  @click="handleCopy(item)"
                />
              </template>
            </UInput>
          </UFormField>
        </div>
      </template>
    </UPopover>
  </div>
</template>
