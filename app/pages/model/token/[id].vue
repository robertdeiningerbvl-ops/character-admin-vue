<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getCommonModelTokenList, removeCommonModelToken } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'CommonModelTokenList' })

const route = useRoute()
const dialog = useDialog()
const toast = useToast()

const biz_id = computed(() => route.params.id as string)

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateMap: Record<number, [string, BadgeColor]> = {
  2: ['启用', 'success'],
  4: ['关闭', 'error']
}

const state = reactive({
  loading: false,
  list: [] as any[],
  isDialog: false,
  currentForm: {}
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getCommonModelTokenList({ biz_id: biz_id.value })
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2 }
  state.isDialog = true
}

const delRowConfirm = async (record: any) => {
  dialog.open({
    color: 'error',
    title: '删除 Token',
    description: `确定要删除该 Token 配置吗？`,
    onPositiveClick: async () => {
      const { error } = await removeCommonModelToken({ id: record.id })
      if (!error) {
        toast.add({ title: '删除成功', color: 'success' })
        loadData()
      }
    }
  })
}

const refresh = () => {
  state.isDialog = false
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/model/list"
      />
      <UButton label="新增" icon="i-lucide-plus" @click="openEditModal()" />
    </template>

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
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-(--ui-primary)/10 flex items-center justify-center">
              <UIcon name="i-lucide-key" class="w-4 h-4 text-(--ui-primary)" />
            </div>
            <div>
              <div class="font-medium">
                Token #{{ item.id }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                模型 ID: {{ item.biz_id }}
              </div>
            </div>
          </div>
          <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="subtle" size="xs">
            {{ stateMap[item.state]?.[0] || '未知' }}
          </UBadge>
        </div>

        <!-- 信息 -->
        <div class="space-y-2 text-xs mb-3">
          <div class="flex items-center justify-between">
            <span class="text-(--ui-text-muted)">最大 Token</span>
            <span class="font-medium">{{ item.max_token?.toLocaleString() || 0 }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-(--ui-text-muted)">每次消耗</span>
            <span class="font-medium text-yellow-500">{{ item.battery || 0 }} 电量</span>
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
        <div class="flex items-center gap-2 pt-3 border-t border-(--ui-border)">
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
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            label="删除"
            @click="delRowConfirm(item)"
          />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon name="i-lucide-key" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无 Token 配置</p>
    </div>
  </DashboardLayout>

  <CommonModelTokenEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :biz-id="biz_id"
    @refresh="refresh"
  />
</template>
