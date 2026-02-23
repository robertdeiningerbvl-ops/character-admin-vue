<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getAmusementParameterList, removeAmusementParameter } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'AmusementParameterList' })

const dialog = useDialog()
const toast = useToast()

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateMap: Record<number, [string, BadgeColor]> = {
  2: ['启用', 'success'],
  0: ['未启用', 'warning'],
  4: ['删除', 'error']
}

const tabs = [
  { label: '正则规则', value: 1, icon: 'i-lucide-regex' },
  { label: '世界书', value: 2, icon: 'i-lucide-globe' }
]

const state = reactive({
  loading: false,
  list: [] as any[],
  activeTab: 1,
  isRegexDialog: false,
  isWorldBookDialog: false,
  currentForm: {},
  page: 1,
  pageSize: 12,
  total: 0
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getAmusementParameterList({
      ty: state.activeTab,
      page: state.page,
      pagesize: state.pageSize
    })
    state.list = data?.list || []
    state.total = data?.count || 0
  } finally {
    state.loading = false
  }
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 1, ty: state.activeTab }
  const ty = record?.ty ?? state.activeTab
  if (ty === 1) {
    state.isRegexDialog = true
  } else {
    state.isWorldBookDialog = true
  }
}

const delRowConfirm = async (record: any) => {
  dialog.open({
    color: 'error',
    title: '删除配置',
    description: `确定要删除「${record.name}」吗？`,
    onPositiveClick: async () => {
      const { error } = await removeAmusementParameter({ id: record.id })
      if (!error) {
        toast.add({ title: '删除成功', color: 'success' })
        loadData()
      }
    }
  })
}

const refresh = () => {
  state.isRegexDialog = false
  state.isWorldBookDialog = false
  loadData()
}

const onTabChange = (val: number) => {
  state.activeTab = val
  state.page = 1
  loadData()
}

const onPageChange = (page: number) => {
  state.page = page
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton label="新增" icon="i-lucide-plus" @click="openEditModal()" />
    </template>

    <!-- Tab 切换 -->
    <div class="mb-6">
      <div class="flex gap-2">
        <UButton
          v-for="tab in tabs"
          :key="tab.value"
          :icon="tab.icon"
          :label="tab.label"
          :color="state.activeTab === tab.value ? 'primary' : 'neutral'"
          :variant="state.activeTab === tab.value ? 'solid' : 'outline'"
          @click="onTabChange(tab.value)"
        />
      </div>
    </div>

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
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="state.activeTab === 1 ? 'bg-orange-500/10' : 'bg-purple-500/10'">
              <UIcon :name="state.activeTab === 1 ? 'i-lucide-regex' : 'i-lucide-globe'" class="w-4 h-4" :class="state.activeTab === 1 ? 'text-orange-500' : 'text-purple-500'" />
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
          <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="subtle" size="xs">
            {{ stateMap[item.state]?.[0] || '未知' }}
          </UBadge>
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

    <!-- 分页 -->
    <div v-if="state.total > state.pageSize" class="flex justify-center mt-6">
      <UPagination
        :page="state.page"
        :items-per-page="state.pageSize"
        :total="state.total"
        @update:page="onPageChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon :name="state.activeTab === 1 ? 'i-lucide-regex' : 'i-lucide-globe'" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无{{ state.activeTab === 1 ? '正则规则' : '世界书' }}配置</p>
    </div>
  </DashboardLayout>

  <!-- 正则规则编辑弹框 -->
  <AmusementParameterRegexEdit
    v-model:dialog="state.isRegexDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />

  <!-- 世界书编辑弹框 -->
  <AmusementParameterWorldBookEdit
    v-model:dialog="state.isWorldBookDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
