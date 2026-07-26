<script setup lang="ts">
import type { AgentChannelAttrsParams } from '@/api/modules/agent'

const emit = defineEmits<{
  search: [params: AgentChannelAttrsParams]
  reset: []
}>()

const filterForm = reactive<AgentChannelAttrsParams>({
  agent_code: '',
  channel_id: '',
  start_time: '',
  end_time: ''
})

const handleSearch = () => {
  emit('search', { ...filterForm })
}

const handleReset = () => {
  filterForm.agent_code = ''
  filterForm.channel_id = ''
  filterForm.start_time = ''
  filterForm.end_time = ''
  emit('reset')
}
</script>

<template>
  <div class="p-4 bg-(--ui-bg-elevated) rounded-lg border border-(--ui-border)">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <!-- 代理编码 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">代理编码</label>
        <UInput
          v-model="filterForm.agent_code"
          placeholder="请输入代理编码"
          class="w-full"
        />
      </div>

      <!-- 渠道ID -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">渠道ID</label>
        <UInput
          v-model="filterForm.channel_id"
          placeholder="请输入渠道ID"
          class="w-full"
        />
      </div>

      <!-- 开始时间 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">开始时间</label>
        <UInput
          v-model="filterForm.start_time"
          type="date"
          placeholder="请选择开始时间"
          class="w-full"
        />
      </div>

      <!-- 结束时间 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">结束时间</label>
        <UInput
          v-model="filterForm.end_time"
          type="date"
          placeholder="请选择结束时间"
          class="w-full"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3">
      <UButton
        color="primary"
        variant="solid"
        label="查询"
        icon="i-lucide-search"
        @click="handleSearch"
      />
      <UButton
        color="neutral"
        variant="outline"
        label="重置"
        icon="i-lucide-rotate-ccw"
        @click="handleReset"
      />
    </div>
  </div>
</template>
