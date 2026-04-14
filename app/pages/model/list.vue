<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getCommonModelList, updateCommonModel } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'CommonModelList' })

const router = useRouter()
const dialog = useDialog()
const toast = useToast()

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateMap: Record<number, [string, BadgeColor]> = {
  2: ['启用', 'success'],
  0: ['关闭', 'error']
}

const streamMap: Record<number, [string, BadgeColor]> = {
  1: ['是', 'success'],
  0: ['否', 'neutral']
}

const typeMap: Record<number, [string, BadgeColor]> = {
  0: ['聊天模型', 'primary'],
  1: ['创作模型', 'warning']
}

const state = reactive({
  loading: false,
  list: [] as any[],
  isDialog: false,
  currentForm: {},
  filterState: null as number | null,
  filterName: ''
})

const filteredList = computed(() => {
  return state.list.filter(item => {
    const matchState = state.filterState === null || item.state === state.filterState
    const matchName = !state.filterName || item.name?.includes(state.filterName)
    return matchState && matchName
  })
})

const resetFilter = () => {
  state.filterState = null
  state.filterName = ''
}

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getCommonModelList({})
    state.list = (data?.list || []).sort((a: any, b: any) => (b.r || 0) - (a.r || 0))
  } finally {
    state.loading = false
  }
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2, stream: 1, ty: 0 }
  state.isDialog = true
}

const refresh = () => {
  state.isDialog = false
  loadData()
}

const deleteModel = async (item: any) => {
  const { error } = await updateCommonModel({ id: item.id, state: 4 })
  if (!error) {
    toast.add({ title: '删除成功', color: 'success' })
    loadData()
  }
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton label="新增" icon="i-lucide-plus" @click="openEditModal()" />
    </template>

    <!-- 筛选栏 -->
    <div class="flex items-center gap-2 mb-4">
      <UInput v-model="state.filterName" placeholder="模型名称" class="w-40" />
      <USelect
        v-model="state.filterState"
        :items="[{ label: '筛选状态', value: null }, { label: '启用', value: 2 }, { label: '关闭', value: 0 }]"
        class="w-32"
      />
      <UButton icon="i-lucide-search" label="查询" color="neutral" @click="() => {}" />
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetFilter" />
    </div>

    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 卡片列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="p-4 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all"
      >
        <!-- 头部 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
              <UIcon name="i-lucide-bot" class="w-4 h-4 text-(--ui-primary)" />
            </div>
            <div>
              <div class="font-medium">
                {{ item.name }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                ID: {{ item.id }}
              </div>
            </div>
          </div>
          <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="subtle">
            {{ stateMap[item.state]?.[0] || '未知' }}
          </UBadge>
          <UBadge :color="typeMap[item.ty]?.[1] || 'neutral'" variant="solid" class="ml-1">
            {{ typeMap[item.ty]?.[0] || '未知' }}
          </UBadge>
        </div>

        <!-- 信息 -->
        <div class="space-y-2 text-xs mb-3">
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">模型标识</span>
            <code class="bg-(--ui-bg) px-1.5 py-0.5 rounded truncate">{{ item.f || '-' }}</code>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">模型名称</span>
            <code class="bg-(--ui-bg) px-1.5 py-0.5 rounded truncate">{{ item.m || '-' }}</code>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">预设</span>
            <span class="truncate">{{ item.preset_name || '-' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">流式</span>
            <UBadge :color="streamMap[item.stream]?.[1] || 'neutral'" variant="subtle" size="xs">
              {{ streamMap[item.stream]?.[0] || '-' }}
            </UBadge>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">排序</span>
            <span>{{ item.r || 0 }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">价格</span>
            <span class="font-medium text-(--ui-primary)">{{ item.price ?? '-' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-(--ui-text-muted) w-16 shrink-0">渠道</span>
            <span>{{ item.channel || '-' }}</span>
          </div>
        </div>

        <!-- 描述 -->
        <div v-if="item.description" class="text-xs text-(--ui-text-muted) mb-3 line-clamp-2">
          {{ item.description }}
        </div>

        <!-- 时间 -->
        <div class="text-xs text-(--ui-text-muted) mb-3">
          更新于 {{ formatToDateTime(item.updated_at) }}
        </div>

        <!-- 操作 -->
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-(--ui-border)">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-pencil"
            label="编辑"
            @click="openEditModal(item)"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-key"
            label="上下文设置"
            @click="router.push(`/model/token/${item.id}`)"
          />
          <UButton
            size="xs"
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            label="删除"
            @click="dialog.open({ color: 'error', title: '删除模型', description: '确定要删除此模型吗？', onPositiveClick: () => deleteModel(item) })"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon name="i-lucide-bot" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无模型</p>
    </div>
  </DashboardLayout>

  <CommonModelEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
