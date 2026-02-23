<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getAssistantList, removeAssistant, getCommonTagList, updateAssistantState, getAmusementCategoryList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'ContentAssistant'
})

const dialog = useDialog()
const toast = useToast()

const state = reactive({
  isDialog: false,
  currentForm: {},
  tagsOptions: [] as any,
  categoryOptions: [] as any,
  activeTab: 0, // 0=全部, 2=待审核, 3=版本升级审核, 5=已发布, 4=已删除
  currentList: [] as any[],
  loading: false,
  selectedCardId: null as number | null,
  sortType: 1, // 1=时间排序, 2=电量排序
  pagination: {
    page: 1,
    pagesize: 12,
    total: 0
  },
  search: {
    uid: '',
    name: '',
    category_id: '',
    anonymous: ''
  }
})

const openEdit = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = {}
  }
}

const toggleCardSelection = (cardId: number) => {
  if (state.selectedCardId === cardId) {
    state.selectedCardId = null
  } else {
    state.selectedCardId = cardId
  }
}

const refresh = async () => {
  loadCurrentList()
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeAssistant({ id: record.id })
  if (!error) {
    toast.add({ title: '删除成功', color: 'success' })
    loadCurrentList()
  }
}

// 加载标签选项
const loadTagsOptions = async () => {
  const { data } = await getCommonTagList({ page: 1, pagesize: -1, ty: '1' })
  if (data) {
    state.tagsOptions = data.list.map((item: any) => {
      return { label: item.name, value: item.name }
    })
  } else {
    state.tagsOptions = []
  }
}

// 加载分类选项
const loadCategoryOptions = async () => {
  const { data } = await getAmusementCategoryList({ page: 1, pagesize: -1 })
  if (data) {
    state.categoryOptions = data.list.map((item: any) => {
      return { label: item.name, value: item.id }
    })
  } else {
    state.categoryOptions = []
  }
}

// 加载当前标签页的列表数据
const loadCurrentList = async (page = 1) => {
  state.loading = true
  state.pagination.page = page
  const params: any = {
    page: state.pagination.page,
    pagesize: state.pagination.pagesize,
    r: state.sortType
  }

  // seeking: 0=全部, 2=待审核, 3=版本升级审核, 5=已发布, 4=已删除
  if (state.activeTab > 0) {
    params.seeking = state.activeTab
  }

  // 添加搜索参数
  if (state.search.uid) {
    params.uid = state.search.uid
  }
  if (state.search.name) {
    params.name = state.search.name
  }
  if (state.search.category_id) {
    params.category_id = state.search.category_id
  }
  if (state.search.anonymous) {
    params.anonymous = state.search.anonymous
  }

  const { data } = await getAssistantList(params)
  state.currentList = data?.list || []
  state.pagination.total = data?.count || 0
  state.loading = false
}

// 搜索
const handleSearch = () => {
  state.pagination.page = 1
  loadCurrentList(1)
}

// 重置搜索
const handleReset = () => {
  state.search.uid = ''
  state.search.name = ''
  state.search.category_id = ''
  state.search.anonymous = ''
  state.pagination.page = 1
  loadCurrentList(1)
}

// 处理分页变化
const handlePageChange = (page: number) => {
  loadCurrentList(page)
}

// 更新状态函数
const updateStatus = async (id: number, field: string, value: any) => {
  const { error } = await updateAssistantState({ id, [field]: value })
  if (!error) {
    toast.add({ title: '更新成功', color: 'success' })
    loadCurrentList(state.pagination.page)
  } else {
    toast.add({ title: '更新失败', color: 'error' })
  }
}

const init = () => {
  loadTagsOptions()
  loadCategoryOptions()
  loadCurrentList()
}

// 监听标签页切换
watch(
  () => state.activeTab,
  () => {
    state.pagination.page = 1
    loadCurrentList(1)
  }
)

// 监听排序切换
watch(
  () => state.sortType,
  () => {
    state.pagination.page = 1
    loadCurrentList(1)
  }
)

onActivated(() => {
  init()
})
</script>

<template>
  <ConfigLayout>
    <div class="p-4 sm:p-6">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          助手管理
        </h1>
      </div>

      <!-- 搜索栏 -->
      <UCard class="mb-4">
        <div class="flex flex-wrap items-end gap-2">
          <UFormField label="UID" class="w-32">
            <UInput
              v-model="state.search.uid"
              placeholder="用户UID"
              icon="i-lucide-user"
              size="sm"
              @keyup.enter="handleSearch"
            />
          </UFormField>
          <UFormField label="名称" class="w-40">
            <UInput
              v-model="state.search.name"
              placeholder="角色名称"
              icon="i-lucide-search"
              size="sm"
              @keyup.enter="handleSearch"
            />
          </UFormField>
          <UFormField label="分类" class="w-36">
            <USelectMenu
              v-model="state.search.category_id"
              :items="[{ label: '全部', value: '' }, ...state.categoryOptions]"
              value-key="value"
              size="sm"
            />
          </UFormField>
          <UFormField label="隐私" class="w-28">
            <USelectMenu
              v-model="state.search.anonymous"
              :items="[
                { label: '全部', value: '' },
                { label: '公开', value: '0' },
                { label: '隐私', value: '2' }
              ]"
              value-key="value"
              size="sm"
            />
          </UFormField>
          <UFormField label="排序" class="w-28">
            <USelectMenu
              v-model="state.sortType"
              :items="[
                { label: '时间', value: 1 },
                { label: '电量', value: 2 }
              ]"
              value-key="value"
              size="sm"
            />
          </UFormField>
          <UButton
            label="搜索"
            icon="i-lucide-search"
            size="sm"
            @click="handleSearch"
          />
          <UButton
            label="重置"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="soft"
            size="sm"
            @click="handleReset"
          />
        </div>
      </UCard>

      <!-- 标签页切换 -->
      <div class="mb-4">
        <UTabs
          v-model="state.activeTab"
          :items="[
            { value: 0, label: '全部', icon: 'i-lucide-list' },
            { value: 2, label: '待审核', icon: 'i-lucide-clock' },
            { value: 3, label: '版本升级审核', icon: 'i-lucide-git-branch' },
            { value: 5, label: '已发布', icon: 'i-lucide-check-circle' },
            { value: 4, label: '已删除', icon: 'i-lucide-trash-2' }
          ]"
        />
      </div>

      <!-- 加载中 -->
      <div v-if="state.loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <UIcon name="i-material-symbols-progress-activity" class="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            加载中...
          </p>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="state.currentList.length === 0" class="flex flex-col items-center justify-center py-16">
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <UIcon name="i-material-symbols-inbox-outline" class="w-12 h-12 text-gray-400" />
        </div>
        <p class="text-gray-900 dark:text-white text-xl font-semibold mb-2">
          暂无数据
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          试试调整搜索条件或切换其他标签页
        </p>
      </div>

      <!-- 卡片网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        <div
          v-for="item in state.currentList"
          :key="item.id"
          class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 cursor-pointer"
          :class="{
            'opacity-60': state.activeTab === 4,
            'scale-105 shadow-2xl border-primary-500 dark:border-primary-500 z-10': state.selectedCardId === item.id,
            'hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 hover:-translate-y-1': state.selectedCardId !== item.id
          }"
          @click="toggleCardSelection(item.id)"
        >
          <!-- 图片区域 -->
          <div class="relative overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
              :class="{ grayscale: state.activeTab === 4 }"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <!-- 左上角标签 -->
            <div class="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              <UBadge
                v-if="item.anonymous === 2"
                color="primary"
                variant="solid"
                size="md"
                class="shadow-xl font-bold bg-purple-500"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-visibility-off" class="w-4 h-4" />
                </template>
                隐私
              </UBadge>
              <UBadge
                v-if="item.recommend === 2"
                color="warning"
                variant="solid"
                size="md"
                class="shadow-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-star" class="w-4 h-4" />
                </template>
                推荐
              </UBadge>
              <UBadge
                v-if="item.nsfw === 2"
                color="error"
                variant="solid"
                size="md"
                class="shadow-xl font-bold"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-18-up-rating" class="w-4 h-4" />
                </template>
                18+
              </UBadge>
            </div>
            <!-- 底部信息 -->
            <div class="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
              <h3 class="font-bold text-white text-xs truncate drop-shadow-lg">
                {{ item.name }}
              </h3>
              <p class="text-white/70 text-[10px] mt-0.5">
                ID: {{ item.id }}
              </p>
              <div class="flex items-center justify-between gap-2 mt-0.5">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <p class="text-white/70 text-[10px] flex-shrink-0">
                    UID: {{ item.uid || item.member?.id || '-' }}
                  </p>
                  <p class="text-white/70 text-[10px] truncate">
                    {{ item.member?.nickname || item.member?.username || 'Unknown' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- 统计数据 -->
          <div class="p-2">
            <div class="space-y-1 mb-2">
              <div class="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-900/50 rounded">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <UIcon name="i-material-symbols-bolt" class="w-2.5 h-2.5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-[10px] text-gray-600 dark:text-gray-400">电量</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white text-xs">{{ item.battery || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-900/50 rounded">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <UIcon name="i-material-symbols-favorite" class="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-[10px] text-gray-600 dark:text-gray-400">收藏</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white text-xs">{{ item.collect_count || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-1 bg-gray-50 dark:bg-gray-900/50 rounded">
                <div class="flex items-center gap-1.5">
                  <div class="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UIcon name="i-material-symbols-chat-bubble-outline" class="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-[10px] text-gray-600 dark:text-gray-400">评论</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white text-xs">{{ item.comment_count || 0 }}</span>
              </div>
            </div>
            <!-- 操作按钮 -->
            <div class="flex gap-1.5">
              <UButton
                size="xs"
                color="primary"
                block
                @click.stop="openEdit(item)"
              >
                <template #leading>
                  <UIcon :name="state.activeTab === 4 ? 'i-material-symbols-visibility-outline' : 'i-material-symbols-edit-outline'" />
                </template>
                {{ state.activeTab === 4 ? '查看' : '编辑' }}
              </UButton>
              <UButton
                v-if="state.activeTab !== 4"
                size="xs"
                color="error"
                variant="soft"
                @click.stop="dialog.open({
                  color: 'error',
                  title: '删除数据',
                  description: '您确定要删除吗？',
                  onPositiveClick() {
                    delRowConfirm(item)
                  }
                })"
              >
                <UIcon name="i-material-symbols-delete-outline" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="!state.loading && state.currentList.length > 0" class="flex justify-center mt-6">
        <UPagination
          :page="state.pagination.page"
          :items-per-page="state.pagination.pagesize"
          :total="state.pagination.total"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </ConfigLayout>
  <ContentAssistantEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :tags-options="state.tagsOptions"
    :category-options="state.categoryOptions"
    @refresh="refresh"
  />
</template>
