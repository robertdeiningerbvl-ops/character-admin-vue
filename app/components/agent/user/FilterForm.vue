<script setup lang="ts">
import type { AgentUserParams } from '@/api/modules/agent'

const emit = defineEmits<{
  search: [params: AgentUserParams]
  reset: []
}>()

const filterForm = reactive<AgentUserParams>({
  username: '',
  code: '',
  parent_code: '',
  state: undefined
})

const handleSearch = () => {
  emit('search', { ...filterForm })
}

const handleReset = () => {
  filterForm.username = ''
  filterForm.code = ''
  filterForm.parent_code = ''
  filterForm.state = undefined
  emit('reset')
}

const stateOptions = [
  { label: '全部', value: undefined },
  { label: '禁用', value: 0 },
  { label: '启用', value: 1 }
]
</script>

<template>
  <div class="p-4 bg-(--ui-bg-elevated) rounded-lg border border-(--ui-border)">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <!-- 用户名 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">用户名</label>
        <UInput
          v-model="filterForm.username"
          placeholder="请输入用户名"
          class="w-full"
        />
      </div>

      <!-- 代理编码 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">代理编码</label>
        <UInput
          v-model="filterForm.code"
          placeholder="请输入代理编码"
          class="w-full"
        />
      </div>

      <!-- 上级代理编码 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">上级代理</label>
        <UInput
          v-model="filterForm.parent_code"
          placeholder="请输入上级代理编码"
          class="w-full"
        />
      </div>

      <!-- 状态 -->
      <div>
        <label class="block text-sm font-medium text-(--ui-text) mb-2">状态</label>
        <USelect
          v-model="filterForm.state"
          :options="stateOptions"
          placeholder="请选择状态"
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
