<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getPaymentList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'PaymentList' })

const state = reactive({
  isDialog: false,
  currentForm: {},
  loading: false,
  list: [] as any[]
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getPaymentList()
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

const tyMap: Record<number, string> = {
  1: '支付宝',
  2: '微信',
  3: 'USDT',
  4: '自建'
}

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const tyColorMap: Record<number, BadgeColor> = {
  1: 'info',
  2: 'success',
  3: 'warning',
  4: 'neutral'
}

const stateMap: Record<number, [string, BadgeColor]> = {
  2: ['正常', 'success'],
  4: ['删除', 'error'],
  0: ['待审核', 'warning']
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
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="relative p-4 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all h-full flex flex-col"
      >
        <!-- 头部：名称和类型 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <UIcon name="i-lucide-credit-card" class="w-5 h-5 text-(--ui-primary) shrink-0" />
            <span class="font-semibold text-(--ui-text-highlighted) truncate">{{ item.name }}</span>
          </div>
          <UBadge :color="tyColorMap[item.ty]" variant="subtle" class="shrink-0 ml-2">
            {{ tyMap[item.ty] || '未知' }}
          </UBadge>
        </div>

        <!-- 重要信息 -->
        <div class="space-y-2 mb-3 flex-1">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-(--ui-text-muted)">排序:</span>
            <span class="text-(--ui-text-highlighted)">{{ item.sort }}</span>
          </div>
          <div class="text-sm">
            <span class="text-(--ui-text-muted)">描述:</span>
            <span class="text-(--ui-text-highlighted) ml-2">{{ item.desc || '-' }}</span>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between pt-3 border-t border-(--ui-border)">
          <div class="flex items-center gap-2">
            <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="subtle">
              {{ stateMap[item.state]?.[0] || '未知' }}
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
      暂无支付通道
    </div>
  </DashboardLayout>

  <PaymentPaymentEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
