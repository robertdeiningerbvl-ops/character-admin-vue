<script setup lang="ts">
const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

const addReply = () => {
  if (localState.value.quickReplies.length >= 5) {
    toast.add({ title: '最多只能添加5条开场白', color: 'error' })
    return
  }
  localState.value.quickReplies.push({ id: String(Date.now()), content: '' })
}

const removeReply = (id: string) => {
  if (localState.value.quickReplies.length <= 1) return
  const idx = localState.value.quickReplies.findIndex((r: any) => r.id === id)
  if (idx > -1) {
    localState.value.quickReplies.splice(idx, 1)
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
      开场白
    </h1>

    <!-- 说明 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
        <UIcon name="i-lucide-message-square" class="w-5 h-5" />
        <span class="font-medium">开场白管理</span>
      </div>
      <p class="text-sm text-gray-500">
        设置角色的开场白内容，最多可添加5条
      </p>
    </div>

    <!-- 开场白列表 -->
    <div class="space-y-3">
      <div
        v-for="(reply, idx) in localState.quickReplies"
        :key="reply.id"
        class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="font-medium text-gray-900 dark:text-gray-100">开场白 {{ idx + 1 }}</span>
          <UButton
            variant="ghost"
            size="xs"
            color="error"
            :disabled="localState.quickReplies.length <= 1"
            @click="removeReply(reply.id)"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4 mr-1" />
            删除
          </UButton>
        </div>
        <UTextarea
          v-model="reply.content"
          placeholder="请输入角色的开场白内容..."
          :rows="5"
          class="w-full"
        />
        <div class="text-right text-xs text-gray-400 mt-2">
          {{ (reply.content || '').length }}/10000
        </div>
      </div>
    </div>

    <!-- 新增按钮 -->
    <button
      class="w-full py-3 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      @click="addReply"
    >
      <UIcon name="i-lucide-plus" class="w-4 h-4" />
      新增开场白
    </button>
    <p class="text-sm text-gray-500">
      建议填写 1-3 条，最多 5 条
    </p>
  </div>
</template>
