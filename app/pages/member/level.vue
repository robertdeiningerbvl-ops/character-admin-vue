<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getMemberLevelList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberLevelList' })

const state = reactive({
  isDialog: false,
  currentForm: {},
  loading: false,
  list: [] as any[]
})

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateMap: Record<number, [string, BadgeColor]> = {
  2: ['启用', 'success'],
  1: ['待审核', 'warning'],
  4: ['已删除', 'error']
}

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getMemberLevelList({})
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2 }
  state.isDialog = true
}

const refresh = () => {
  state.isDialog = false
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 卡片列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="p-4 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all"
      >
        <!-- 头部 -->
        <div class="flex items-center gap-3 mb-3">
          <UAvatar :src="item.logo" :alt="item.name" size="lg" />
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-(--ui-text-highlighted) truncate">
              {{ item.name }}
            </div>
            <div class="text-xs text-(--ui-text-muted)">
              ID: {{ item.id }}
            </div>
          </div>
          <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="subtle">
            {{ stateMap[item.state]?.[0] || '未知' }}
          </UBadge>
        </div>

        <!-- 信息 -->
        <div class="space-y-2 text-sm mb-3">
          <div class="flex justify-between">
            <span class="text-(--ui-text-muted)">所需电量</span>
            <span class="font-medium text-yellow-600">{{ item.battery }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-(--ui-text-muted)">参与分成</span>
            <UBadge :color="item.divided === 1 ? 'success' : 'error'" variant="subtle">
              {{ item.divided === 1 ? '是' : '否' }}
            </UBadge>
          </div>
          <div v-if="item.remark" class="flex justify-between items-start">
            <span class="text-(--ui-text-muted) shrink-0">备注</span>
            <UTooltip :text="item.remark">
              <span class="text-xs text-(--ui-text-muted) truncate max-w-[200px] cursor-help">{{ item.remark }}</span>
            </UTooltip>
          </div>
        </div>

        <!-- 操作 -->
        <div class="pt-3 border-t border-(--ui-border) flex justify-end">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            label="编辑"
            @click="openEditModal(item)"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      暂无用户等级
    </div>
  </DashboardLayout>

  <MemberLevelEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
