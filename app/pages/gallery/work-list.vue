<script setup lang="ts">
import { getAdminWorkList, batchUpdateWorkState, batchRemoveWork } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'GalleryWorkList'
})

const toast = useToast()
const tableRef = ref()

const state = reactive({
  isDetailDialog: false,
  currentWork: null as ApiGallery.Work | null,
  selectedIds: [] as string[],
  filters: {
    uid: undefined as number | undefined,
    state: undefined as number | undefined,
    is_public: undefined as number | undefined,
    source: undefined as number | undefined,
    keywords: '',
    start_time: '',
    end_time: ''
  }
})

const stateOptions = [
  { label: '全部', value: undefined },
  { label: '正常', value: 1 },
  { label: '已删除', value: 9 }
]

const publicOptions = [
  { label: '全部', value: undefined },
  { label: '私有', value: 0 },
  { label: '公开', value: 1 }
]

const sourceOptions = [
  { label: '全部', value: undefined },
  { label: 'NovelAI', value: 1 },
  { label: 'Aicore', value: 2 }
]

const columns = [
  {
    key: 'select',
    label: '选择',
    sortable: false
  },
  {
    key: 'image',
    label: '图片',
    sortable: false
  },
  {
    key: 'title',
    label: '标题',
    sortable: false
  },
  {
    key: 'uid',
    label: '用户ID',
    sortable: true
  },
  {
    key: 'model_name',
    label: '模型',
    sortable: false
  },
  {
    key: 'ratio',
    label: '比例',
    sortable: false
  },
  {
    key: 'is_public',
    label: '公开状态',
    sortable: false
  },
  {
    key: 'state',
    label: '状态',
    sortable: false
  },
  {
    key: 'stats',
    label: '互动数据',
    sortable: false
  },
  {
    key: 'created_at',
    label: '创建时间',
    sortable: true
  },
  {
    key: 'actions',
    label: '操作',
    sortable: false
  }
]

const loadData = async (params: any) => {
  const response = await getAdminWorkList({
    page: params.page,
    pagesize: params.pageSize,
    ...state.filters
  })
  return {
    list: response.list || [],
    count: response.count || 0
  }
}

const handleSearch = () => {
  tableRef.value?.reload()
}

const handleReset = () => {
  state.filters = {
    uid: undefined,
    state: undefined,
    is_public: undefined,
    source: undefined,
    keywords: '',
    start_time: '',
    end_time: ''
  }
  handleSearch()
}

const handleSelectionChange = (ids: string[]) => {
  state.selectedIds = ids
}

const handleViewDetail = (work: ApiGallery.Work) => {
  state.currentWork = work
  state.isDetailDialog = true
}

const handleUpdateState = async (workId: string, newState: number) => {
  try {
    await batchUpdateWorkState({
      work_ids: workId,
      state: newState
    })
    toast.add({
      title: '成功',
      description: '作品状态已更新',
      color: 'green'
    })
    tableRef.value?.reload()
  } catch (error: any) {
    toast.add({
      title: '失败',
      description: error.message || '更新失败',
      color: 'red'
    })
  }
}

const handleBatchUpdateState = async (newState: number) => {
  if (state.selectedIds.length === 0) {
    toast.add({
      title: '提示',
      description: '请先选择作品',
      color: 'yellow'
    })
    return
  }

  try {
    const result = await batchUpdateWorkState({
      work_ids: state.selectedIds.join(','),
      state: newState
    })
    toast.add({
      title: '成功',
      description: `已更新 ${result.success_count} 个作品`,
      color: 'green'
    })
    state.selectedIds = []
    tableRef.value?.reload()
  } catch (error: any) {
    toast.add({
      title: '失败',
      description: error.message || '批量更新失败',
      color: 'red'
    })
  }
}

const handleBatchRemove = async () => {
  if (state.selectedIds.length === 0) {
    toast.add({
      title: '提示',
      description: '请先选择作品',
      color: 'yellow'
    })
    return
  }

  try {
    const result = await batchRemoveWork({
      work_ids: state.selectedIds.join(',')
    })
    toast.add({
      title: '成功',
      description: `已删除 ${result.success_count} 个作品`,
      color: 'green'
    })
    state.selectedIds = []
    tableRef.value?.reload()
  } catch (error: any) {
    toast.add({
      title: '失败',
      description: error.message || '批量删除失败',
      color: 'red'
    })
  }
}

const getRatioLabel = (ratio: string) => {
  const labels: Record<string, string> = {
    square: '正方形',
    portrait: '竖图',
    landscape: '横图'
  }
  return labels[ratio] || ratio
}

const getPublicLabel = (isPublic: number) => {
  return isPublic === 1 ? '公开' : '私有'
}

const getStateLabel = (state: number) => {
  return state === 1 ? '正常' : '已删除'
}
</script>

<template>
  <div class="p-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">画廊作品管理</h2>
        </div>
      </template>

      <!-- 筛选表单 -->
      <div class="mb-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormGroup label="用户ID">
            <UInput v-model.number="state.filters.uid" placeholder="输入用户ID" />
          </UFormGroup>

          <UFormGroup label="状态">
            <USelect v-model="state.filters.state" :options="stateOptions" />
          </UFormGroup>

          <UFormGroup label="公开状态">
            <USelect v-model="state.filters.is_public" :options="publicOptions" />
          </UFormGroup>

          <UFormGroup label="来源">
            <USelect v-model="state.filters.source" :options="sourceOptions" />
          </UFormGroup>

          <UFormGroup label="关键词">
            <UInput v-model="state.filters.keywords" placeholder="标题或提示词" />
          </UFormGroup>

          <UFormGroup label="开始时间">
            <UInput v-model="state.filters.start_time" type="datetime-local" />
          </UFormGroup>

          <UFormGroup label="结束时间">
            <UInput v-model="state.filters.end_time" type="datetime-local" />
          </UFormGroup>
        </div>

        <div class="flex gap-2">
          <UButton @click="handleSearch">搜索</UButton>
          <UButton color="gray" variant="outline" @click="handleReset">重置</UButton>
        </div>
      </div>

      <!-- 批量操作 -->
      <div v-if="state.selectedIds.length > 0" class="mb-4 flex gap-2">
        <UButton color="green" @click="handleBatchUpdateState(1)">
          批量设为正常
        </UButton>
        <UButton color="red" @click="handleBatchUpdateState(9)">
          批量设为删除
        </UButton>
        <UButton color="red" variant="outline" @click="handleBatchRemove">
          批量删除
        </UButton>
        <span class="text-sm text-gray-600 self-center">
          已选择 {{ state.selectedIds.length }} 项
        </span>
      </div>

      <!-- 数据表格 -->
      <CommonTable
        ref="tableRef"
        :columns="columns"
        :load-data="loadData"
        :enable-selection="true"
        @selection-change="handleSelectionChange"
      >
        <template #cell-image="{ row }">
          <img :src="row.image" alt="作品图片" class="w-16 h-16 object-cover rounded" />
        </template>

        <template #cell-title="{ row }">
          <div class="max-w-xs truncate">{{ row.title || '未命名' }}</div>
        </template>

        <template #cell-ratio="{ row }">
          <UBadge color="gray">{{ getRatioLabel(row.ratio) }}</UBadge>
        </template>

        <template #cell-is_public="{ row }">
          <UBadge :color="row.is_public === 1 ? 'green' : 'gray'">
            {{ getPublicLabel(row.is_public) }}
          </UBadge>
        </template>

        <template #cell-state="{ row }">
          <UBadge :color="row.state === 1 ? 'green' : 'red'">
            {{ getStateLabel(row.state) }}
          </UBadge>
        </template>

        <template #cell-stats="{ row }">
          <div class="text-sm space-y-1">
            <div>👍 {{ row.like_count }} | 💾 {{ row.collect_count }}</div>
            <div>💬 {{ row.comment_count }} | 🔥 {{ row.hot_score.toFixed(1) }}</div>
          </div>
        </template>

        <template #cell-created_at="{ row }">
          <div class="text-sm">
            {{ new Date(row.created_at).toLocaleString('zh-CN') }}
          </div>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" @click="handleViewDetail(row)">详情</UButton>
            <UButton
              v-if="row.state === 1"
              size="xs"
              color="red"
              @click="handleUpdateState(row.id, 9)"
            >
              删除
            </UButton>
            <UButton
              v-else
              size="xs"
              color="green"
              @click="handleUpdateState(row.id, 1)"
            >
              恢复
            </UButton>
          </div>
        </template>
      </CommonTable>
    </UCard>

    <!-- 作品详情对话框 -->
    <UModal v-model="state.isDetailDialog" :ui="{ width: 'max-w-4xl' }">
      <UCard v-if="state.currentWork">
        <template #header>
          <h3 class="text-lg font-semibold">作品详情</h3>
        </template>

        <div class="space-y-4">
          <div class="flex justify-center">
            <img
              :src="state.currentWork.image"
              alt="作品图片"
              class="max-w-full max-h-96 rounded"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">作品ID</label>
              <p class="text-sm">{{ state.currentWork.id }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">用户ID</label>
              <p class="text-sm">{{ state.currentWork.uid }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">标题</label>
              <p class="text-sm">{{ state.currentWork.title || '未命名' }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">模型</label>
              <p class="text-sm">{{ state.currentWork.model_name }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">尺寸</label>
              <p class="text-sm">{{ state.currentWork.width }} x {{ state.currentWork.height }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">比例</label>
              <p class="text-sm">{{ getRatioLabel(state.currentWork.ratio) }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">公开状态</label>
              <p class="text-sm">{{ getPublicLabel(state.currentWork.is_public) }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">状态</label>
              <p class="text-sm">{{ getStateLabel(state.currentWork.state) }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">正向提示词</label>
            <p class="text-sm bg-gray-50 p-2 rounded mt-1">{{ state.currentWork.prompt }}</p>
          </div>

          <div v-if="state.currentWork.negative_prompt">
            <label class="text-sm font-medium text-gray-700">负向提示词</label>
            <p class="text-sm bg-gray-50 p-2 rounded mt-1">{{ state.currentWork.negative_prompt }}</p>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">点赞数</label>
              <p class="text-sm">{{ state.currentWork.like_count }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">收藏数</label>
              <p class="text-sm">{{ state.currentWork.collect_count }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">评论数</label>
              <p class="text-sm">{{ state.currentWork.comment_count }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">热度分</label>
              <p class="text-sm">{{ state.currentWork.hot_score.toFixed(2) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">创建时间</label>
              <p class="text-sm">{{ new Date(state.currentWork.created_at).toLocaleString('zh-CN') }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">过期时间</label>
              <p class="text-sm">{{ new Date(state.currentWork.expired_at).toLocaleString('zh-CN') }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton @click="state.isDetailDialog = false">关闭</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
