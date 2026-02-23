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
  list: [] as any[]
})

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
        <!-- 推荐标签 -->
        <UBadge
          v-if="item.recommend_desc"
          variant="solid"
          color="warning"
          class="absolute -top-2 -right-2 text-xs"
        >
          {{ item.recommend_desc }}
        </UBadge>

        <!-- 套餐名称 -->
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-package" class="w-5 h-5 text-(--ui-primary)" />
          <span class="font-semibold text-lg text-(--ui-text-highlighted)">{{ item.title }}</span>
        </div>

        <!-- 能量信息 -->
        <div class="flex items-baseline gap-2 mb-2">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-zap" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-2xl font-bold text-(--ui-text-highlighted)">{{ item.coins }}</span>
          </div>
          <span v-if="item.gift_coins" class="text-sm text-(--ui-success)">+{{ item.gift_coins }} 赠送</span>
        </div>

        <!-- 价格 -->
        <div class="text-xl font-bold text-(--ui-primary) mb-3">
          ¥{{ (item.amount / 100).toFixed(2) }}
        </div>

        <!-- 描述 -->
        <p class="text-sm text-(--ui-text-muted) mb-4 line-clamp-2">
          {{ item.content || '暂无描述' }}
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
</template>
