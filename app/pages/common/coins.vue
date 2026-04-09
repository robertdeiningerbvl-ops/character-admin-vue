<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getCommonCoinsList, removeCommonCoins } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'CoinsList' })

const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {},
  loading: false,
  list: [] as any[],
  filterState: null as number | null,
  filterTy: null as number | null,
  tierDialog: false,
  currentTiers: [] as any[]
})

const filteredList = computed(() => {
  return state.list.filter(item => {
    const matchState = state.filterState === null || item.state === state.filterState
    const matchTy = state.filterTy === null || item.ty === state.filterTy
    return matchState && matchTy
  })
})

const resetFilter = () => {
  state.filterState = null
  state.filterTy = null
}

// 加载数据
const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getCommonCoinsList()
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

// 打开编辑弹框
const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2, sort: 0 }
  state.isDialog = true
}

// 刷新
const refresh = () => {
  state.isDialog = false
  loadData()
}

// 删除
const delConfirm = (record: any) => {
  dialog.open({
    color: 'error',
    title: '删除套餐',
    description: `确定要删除「${record.title}」吗？`,
    onPositiveClick: async () => {
      const { error } = await removeCommonCoins({ id: record.id })
      if (!error) loadData()
    }
  })
}

// 查看档位
const viewTiers = (record: any) => {
  try {
    state.currentTiers = record.tier_json ? (typeof record.tier_json === 'string' ? JSON.parse(record.tier_json) : record.tier_json) : []
  } catch (e) {
    state.currentTiers = []
  }
  state.tierDialog = true
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton
        label="新增套餐"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditModal()"
      />
    </template>

    <!-- 筛选栏 -->
    <div class="flex items-center gap-2 mb-4">
      <USelect
        v-model="state.filterTy"
        :items="[{ label: '筛选类型', value: null }, { label: '常驻套餐', value: 1 }, { label: '活动套餐', value: 2 }, { label: '礼包套餐', value: 3 }]"
        class="w-32"
      />
      <USelect
        v-model="state.filterState"
        :items="[{ label: '筛选状态', value: null }, { label: '启用', value: 2 }, { label: '关闭', value: 0 }]"
        class="w-32"
      />
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetFilter" />
    </div>

    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 卡片列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="relative p-4 rounded-xl border transition-all group h-full flex flex-col"
        :class="{
          'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:border-blue-400': item.ty === 1,
          'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 hover:border-amber-400': item.ty === 2,
          'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 hover:border-purple-400': item.ty === 3,
          'bg-(--ui-bg-elevated) border-(--ui-border) hover:border-(--ui-primary)': !item.ty || (item.ty !== 1 && item.ty !== 2 && item.ty !== 3)
        }"
      >
        <!-- 推荐标签 -->
        <UBadge
          v-if="item.recommend_tag && item.recommend_tag_color"
          variant="solid"
          :style="{ backgroundColor: item.recommend_tag_color, color: '#fff' }"
          class="absolute -top-2 -right-2 text-xs px-2 py-1"
        >
          {{ item.recommend_tag }}
        </UBadge>

        <!-- 套餐名称 -->
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-package" class="w-5 h-5 text-(--ui-primary)" />
          <span class="font-semibold text-lg text-(--ui-text-highlighted)">{{ item.title }}</span>
        </div>

        <!-- 套餐类型 -->
        <div class="mb-3">
          <UBadge
            :color="item.ty === 1 ? 'info' : item.ty === 2 ? 'warning' : item.ty === 3 ? 'secondary' : 'neutral'"
            variant="solid"
          >
            {{ item.ty === 1 ? '常驻套餐' : item.ty === 2 ? '活动套餐' : item.ty === 3 ? '礼包套餐' : '未知类型' }}
          </UBadge>
        </div>

        <!-- 查看档位按钮 -->
        <div class="mb-3">
          <UButton
            size="sm"
            color="neutral"
            variant="outline"
            icon="i-lucide-list"
            label="查看档位"
            @click="viewTiers(item)"
          />
        </div>

        <!-- 底部信息 -->
        <div class="flex items-center justify-between pt-3 border-t border-(--ui-border)">
          <div class="flex items-center gap-2">
            <UBadge :color="item.state === 2 ? 'success' : 'error'" variant="subtle">
              {{ item.state === 2 ? '启用' : '关闭' }}
            </UBadge>
          </div>
          <div class="flex gap-1">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-pencil"
              @click="openEditModal(item)"
            />
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              @click="delConfirm(item)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      暂无能量套餐
    </div>
  </DashboardLayout>

  <CommonCoinsEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />

  <!-- 档位查看弹窗 -->
  <UModal v-model:open="state.tierDialog" :ui="{ content: 'sm:max-w-2xl' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-list" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">档位详情</span>
      </div>
    </template>

    <template #body>
      <div v-if="state.currentTiers.length === 0" class="text-center py-8 text-(--ui-text-muted)">
        暂无档位信息
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(tier, idx) in state.currentTiers"
          :key="idx"
          class="p-4 rounded-lg border border-(--ui-border) bg-(--ui-bg-elevated)"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-medium text-(--ui-text-highlighted)">{{ tier.name }}</span>
            <UBadge color="primary" variant="subtle">档位 {{ tier.tier_no }}</UBadge>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-zap" class="w-4 h-4 text-(--ui-warning)" />
              <span class="text-(--ui-text-muted)">妖力数量:</span>
              <span class="font-medium">{{ tier.coins }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-dollar-sign" class="w-4 h-4 text-(--ui-success)" />
              <span class="text-(--ui-text-muted)">美元:</span>
              <span class="font-medium">{{ tier.us }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-banknote" class="w-4 h-4 text-(--ui-error)" />
              <span class="text-(--ui-text-muted)">人民币:</span>
              <span class="font-medium">{{ tier.CNY }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-percent" class="w-4 h-4 text-(--ui-primary)" />
              <span class="text-(--ui-text-muted)">优惠比例:</span>
              <span class="font-medium">{{ tier.rebate }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton label="关闭" color="neutral" @click="state.tierDialog = false" />
    </template>
  </UModal>
</template>
