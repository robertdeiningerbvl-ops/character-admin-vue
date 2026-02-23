<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getMarketingList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MarketingList' })

const state = reactive({
  isDialog: false,
  currentForm: {},
  loading: false,
  list: [] as any[]
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getMarketingList()
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : {}
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
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="relative p-4 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all group h-full flex flex-col"
      >
        <!-- 任务名称 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-5 h-5 text-(--ui-warning)" />
            <span class="font-semibold text-lg text-(--ui-text-highlighted)">{{ item.name }}</span>
          </div>
          <code class="px-2 py-1 rounded bg-(--ui-bg) text-xs font-mono text-(--ui-text-muted)">{{ item.code }}</code>
        </div>

        <!-- 奖励信息 -->
        <div class="flex items-center gap-4 mb-3">
          <div v-if="item.battery" class="flex items-center gap-1">
            <UIcon name="i-lucide-battery-charging" class="w-4 h-4 text-(--ui-warning)" />
            <span class="font-bold text-(--ui-text-highlighted)">{{ item.battery }}</span>
            <span class="text-xs text-(--ui-text-muted)">电量</span>
          </div>
          <div v-if="item.amount" class="flex items-center gap-1">
            <UIcon name="i-lucide-coins" class="w-4 h-4 text-(--ui-success)" />
            <span class="font-bold text-(--ui-success)">¥{{ item.amount }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-repeat" class="w-4 h-4 text-(--ui-text-muted)" />
            <span class="text-sm text-(--ui-text-muted)">{{ item.num || 0 }} 次</span>
          </div>
        </div>

        <!-- 描述 -->
        <p class="text-sm text-(--ui-text-muted) mb-4 line-clamp-2 flex-1">
          {{ item.remark || '暂无描述' }}
        </p>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between pt-3 border-t border-(--ui-border)">
          <div class="flex items-center gap-2">
            <UBadge :color="item.state === 2 ? 'success' : 'error'" variant="subtle">
              {{ item.state === 2 ? '启用' : '关闭' }}
            </UBadge>
            <UBadge :color="item.show === 2 ? 'info' : 'neutral'" variant="subtle">
              {{ item.show === 2 ? '显示' : '隐藏' }}
            </UBadge>
          </div>
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            @click="openEditModal(item)"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      暂无营销规则
    </div>
  </DashboardLayout>

  <MarketingEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
