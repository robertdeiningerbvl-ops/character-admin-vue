<script setup lang="ts">
import { getAmusementList, removeAmusement, getCommonTagList, updateAmusementState, getAmusementCategoryList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AmusementList'
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
  // 日期推荐弹框
  datePickerVisible: false,
  datePickerItem: null as any,
  selectedDate: '',
  pagination: {
    page: 1,
    pagesize: 30,
    total: 0
  },
  search: {
    id: '',
    uid: '',
    name: '',
    category_id: 'all',
    anonymous: 'all',
    recommend: 'all',
    day_recommend: 'all',
    date_recommend: 'all',
    sort: 'all'
  }
})

const router = useRouter()

const openEditCoins = async (record: any) => {
  router.push(`/amusement/detail/${record.id}`)
}

const refresh = async () => {
  loadCurrentList() // 刷新当前列表数据
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeAmusement({ id: record.id })
  if (!error) {
    toast.add({ title: '删除成功', color: 'success' })
    loadCurrentList()
  }
}

// 设置推荐
const setRecommend = async (item: any) => {
  const newVal = item.recommend === 2 ? 0 : 2
  const { error } = await updateAmusementState({ id: item.id, recommend: newVal })
  if (!error) {
    toast.add({ title: newVal === 2 ? '已设为推荐' : '已取消推荐', color: 'success' })
    loadCurrentList()
  }
}

// 设置日推
const setDailyRecommend = async (item: any) => {
  const newVal = item.day_recommend === 2 ? 0 : 2
  const { error } = await updateAmusementState({ id: item.id, day_recommend: newVal })
  if (!error) {
    toast.add({ title: newVal === 2 ? '已设为日推' : '已取消日推', color: 'success' })
    loadCurrentList()
  }
}

// 打开日期推荐弹框
const openDatePicker = (item: any) => {
  state.datePickerItem = item
  state.selectedDate = item.recommend_time || ''
  state.datePickerVisible = true
}

// 设置发布状态
const setPublishState = async (item: any) => {
  const newState = item.state === 2 ? 0 : 2
  const { error } = await updateAmusementState({ id: item.id, state: newState })
  if (!error) {
    toast.add({ title: newState === 2 ? '已发布' : '已取消发布', color: 'success' })
    loadCurrentList()
  }
}

// 确认日期推荐
const confirmDateRecommend = async () => {
  if (!state.datePickerItem) return
  const { error } = await updateAmusementState({
    id: state.datePickerItem.id,
    recommend_time: state.selectedDate.replace('T', ' ')
  })
  if (!error) {
    toast.add({ title: '日期推荐设置成功', color: 'success' })
    state.datePickerVisible = false
    loadCurrentList()
  }
}

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

const loadCategoryOptions = async () => {
  const { data } = await getAmusementCategoryList({ page: 1, pagesize: -1 })
  state.categoryOptions = data?.list?.map((item: any) => ({ label: item.name, value: String(item.id) })) || []
}

const categoryItems = computed(() => [{ label: '全部', value: 'all' }, ...state.categoryOptions])

// 判断是否在本周
const isThisWeek = (dateStr: string) => {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  return date >= weekStart && date < weekEnd
}

// 判断是否在本月
const isThisMonth = (dateStr: string) => {
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

// 加载当前标签页的列表数据
const loadCurrentList = async (page = 1) => {
  state.loading = true
  state.pagination.page = page
  const params: any = {
    page: state.pagination.page,
    pagesize: state.pagination.pagesize
  }

  // seeking: 0=全部, 2=待审核, 3=版本升级审核, 5=已发布, 4=已删除
  if (state.activeTab > 0) {
    params.seeking = state.activeTab
  }

  // 添加搜索参数
  if (state.search.id) {
    params.id = state.search.id
  }
  if (state.search.uid) {
    params.uid = state.search.uid
  }
  if (state.search.name) {
    params.name = state.search.name
  }
  if (state.search.category_id && state.search.category_id !== 'all') {
    params.category_id = state.search.category_id
  }
  if (state.search.sort && state.search.sort !== 'all') {
    params.sort = state.search.sort
  }
  if (state.search.anonymous && state.search.anonymous !== 'all') {
    params.anonymous = state.search.anonymous
  }
  if (state.search.recommend && state.search.recommend !== 'all') {
    params.recommend = state.search.recommend
  }
  if (state.search.day_recommend && state.search.day_recommend !== 'all') {
    params.day_recommend = state.search.day_recommend
  }
  if (state.search.date_recommend && state.search.date_recommend !== 'all') {
    params.date_recommend = state.search.date_recommend
  }

  const { data } = await getAmusementList(params)
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
  state.search.id = ''
  state.search.uid = ''
  state.search.name = ''
  state.search.category_id = 'all'
  state.search.sort = 'all'
  state.search.anonymous = 'all'
  state.search.recommend = 'all'
  state.search.day_recommend = 'all'
  state.search.date_recommend = 'all'
  state.pagination.page = 1
  loadCurrentList(1)
}

// 处理分页变化
const handlePageChange = (page: number) => {
  loadCurrentList(page)
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
    state.pagination.page = 1 // 切换标签页时重置为第一页
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
      <!-- 搜索栏 -->
      <UCard>
        <div class="flex flex-wrap items-center gap-4">
          <UInput
            v-model="state.search.id"
            placeholder=""
            class="w-[180px]"
            :ui="{ base: 'peer', trailing: 'pe-1' }"
            @keyup.enter="handleSearch"
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">角色ID</span>
            </label>
            <template #trailing>
              <UButton
                v-if="state.search.id"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.search.id = ''"
              />
            </template>
          </UInput>
          <UInput
            v-model="state.search.uid"
            placeholder=""
            class="w-[180px]"
            :ui="{ base: 'peer', trailing: 'pe-1' }"
            @keyup.enter="handleSearch"
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">用户UID</span>
            </label>
            <template #trailing>
              <UButton
                v-if="state.search.uid"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.search.uid = ''"
              />
            </template>
          </UInput>
          <UInput
            v-model="state.search.name"
            placeholder=""
            class="w-[260px]"
            :ui="{ base: 'peer', trailing: 'pe-1' }"
            @keyup.enter="handleSearch"
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">搜索(名字/简介/tag/发布者)</span>
            </label>
            <template #trailing>
              <UButton
                v-if="state.search.name"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.search.name = ''"
              />
            </template>
          </UInput>
          <div class="relative">
            <USelectMenu
              v-model="state.search.category_id"
              :items="categoryItems"
              value-key="value"
              placeholder="分类"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">分类</span>
            </label>
          </div>
          <div class="relative">
            <USelectMenu
              v-model="state.search.anonymous"
              :items="[
                { label: '全部', value: 'all' },
                { label: '公开', value: '0' },
                { label: '隐私', value: '1' }
              ]"
              value-key="value"
              placeholder="隐私"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">隐私</span>
            </label>
          </div>
          <div class="relative">
            <USelectMenu
              v-model="state.search.recommend"
              :items="[
                { label: '全部', value: 'all' },
                { label: '推荐', value: '2' },
                { label: '不推荐', value: '0' }
              ]"
              value-key="value"
              placeholder="推荐"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">推荐</span>
            </label>
          </div>
          <div class="relative">
            <USelectMenu
              v-model="state.search.day_recommend"
              :items="[
                { label: '全部', value: 'all' },
                { label: '日推', value: '2' },
                { label: '非日推', value: '0' }
              ]"
              value-key="value"
              placeholder="日推"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">日推</span>
            </label>
          </div>
          <div class="relative">
            <USelectMenu
              v-model="state.search.date_recommend"
              :items="[
                { label: '全部', value: 'all' },
                { label: '周推', value: 'week' },
                { label: '月推', value: 'month' }
              ]"
              value-key="value"
              placeholder="日期推"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">日期推</span>
            </label>
          </div>
          <div class="relative z-10">
            <USelectMenu
              v-model="state.search.sort"
              :items="[
                { label: '默认', value: 'all' },
                { label: '电量', value: 'battery' },
                { label: '播放数', value: 'play_count' },
                { label: '点赞数', value: 'praise_count' },
                { label: '收藏数', value: 'collect_count' },
                { label: '对话数', value: 'dialogue_count' },
                { label: '评分', value: 'score' },
                { label: '推荐时间', value: 'recommend_time' },
                { label: '更新时间', value: 'updated_at' }
              ]"
              value-key="value"
              placeholder="排序"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">排序</span>
            </label>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <UButton
              label="查询"
              icon="i-lucide-search"
              @click="handleSearch"
            />
            <UButton
              label="重置"
              icon="fluent:arrow-reset-24-filled"
              color="neutral"
              variant="outline"
              @click="handleReset"
            />
          </div>
        </div>
      </UCard>

      <!-- 标签页切换 -->
      <div class="mt-2.5 mb-4 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        <button
          v-for="tab in [
            { value: 0, label: '全部' },
            { value: 2, label: '待审核' },
            { value: 3, label: '版本升级审核' },
            { value: 5, label: '已发布' },
            { value: 4, label: '已删除' }
          ]"
          :key="tab.value"
          type="button"
          class="px-4 py-2 text-sm font-medium border-b-2 -mb-px"
          :class="state.activeTab === tab.value
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="state.activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="min-h-[400px]">
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
        <template v-else>
          <div class="grid grid-cols-5 gap-4">
            <div
              v-for="item in state.currentList"
              :key="item.id"
              class="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 cursor-pointer hover:shadow-lg hover:border-pink-300 transition-all relative overflow-hidden"
              :class="{ 'opacity-60': state.activeTab === 4 }"
              @click="openEditCoins(item)"
            >
              <!-- 右上角三角形标签 - 精 -->
              <div v-if="item.recommend === 2" class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-amber-500 dark:border-t-amber-600 border-l-[32px] border-l-transparent">
                <span class="absolute -top-[30px] right-[3px] text-white text-xs font-bold">精</span>
              </div>

              <div class="flex items-start gap-3">
                <!-- 左侧图片 -->
                <div class="relative shrink-0">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="w-16 h-20 rounded-lg object-cover"
                    :class="{ grayscale: state.activeTab === 4 }"
                  >
                  <div v-else class="w-16 h-20 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center text-gray-400 text-xs">
                    暂无
                  </div>
                </div>
                <!-- 右侧内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-1 flex-1 min-w-0 mr-2">
                      <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {{ item.name }}
                      </h3>
                    </div>
                    <UDropdownMenu
                      v-if="state.activeTab !== 4"
                      :items="[
                        [
                          { label: item.state === 2 ? '取消发布' : '设为发布', icon: 'i-lucide-check-circle', onSelect: () => setPublishState(item) },
                          { label: item.recommend === 2 ? '取消推荐' : '设为推荐', icon: 'i-lucide-star', onSelect: () => setRecommend(item) },
                          { label: item.day_recommend === 2 ? '取消日推' : '设为日推', icon: 'i-lucide-sun', onSelect: () => setDailyRecommend(item) },
                          { label: '日期推荐', icon: 'i-lucide-calendar', onSelect: () => openDatePicker(item) }
                        ],
                        [
                          { label: '删除', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => dialog.open({ color: 'error', title: '删除数据', description: '您确定要删除吗？', onPositiveClick() { delRowConfirm(item) } }) }
                        ]
                      ]"
                    >
                      <UButton
                        variant="ghost"
                        size="xs"
                        class="opacity-0 group-hover:opacity-100 -mt-1 -mr-1"
                        @click.stop
                      >
                        <UIcon name="i-lucide-more-vertical" class="w-4 h-4 text-gray-400" />
                      </UButton>
                    </UDropdownMenu>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatDate(item.created_at) }}
                  </p>
                  <!-- 用户信息 -->
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    UID: {{ item.uid || item.member?.id || '-' }} · {{ item.member?.nickname || item.member?.username || '-' }}
                  </p>
                  <!-- 审核状态 -->
                  <span v-if="item.state === 0" class="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded">审核中</span>
                  <span v-if="item.state === 2 && item.version_id !== item.review_version_id" class="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded">新版本审核中</span>
                  <!-- 电量 -->
                  <span v-if="item.battery > 0" class="inline-flex items-center gap-1 mt-1 ml-1 px-1.5 py-0.5 text-xs bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                    <UIcon name="i-lucide-zap" class="w-3 h-3" />{{ item.battery }}
                  </span>
                </div>
              </div>
              <!-- 标签 -->
              <div v-if="item.tag && item.tag.length > 0" class="flex flex-wrap gap-1 mt-3">
                <UBadge
                  v-for="(t, idx) in item.tag.slice(0, 3)"
                  :key="idx"
                  variant="outline"
                  size="xs"
                >
                  {{ t }}
                </UBadge>
                <UBadge v-if="item.tag.length > 3" variant="outline" size="xs">
                  +{{ item.tag.length - 3 }}
                </UBadge>
              </div>
              <!-- 状态标识 -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-if="item.state === 2" class="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded">已发布</span>
                <span v-else class="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 rounded">未发布</span>
                <span v-if="item.recommend === 2" class="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded">推荐</span>
                <span v-if="item.day_recommend === 2" class="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded">日推</span>
                <span v-if="isThisWeek(item.recommend_time)" class="px-1.5 py-0.5 text-[10px] font-medium bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 rounded">周推</span>
                <span v-if="isThisMonth(item.recommend_time)" class="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded">月推</span>
              </div>
              <!-- 统计数据 -->
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                <UTooltip text="点赞数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-heart" class="w-3 h-3 text-pink-500" />{{ item.praise_count || 0 }}</span>
                </UTooltip>
                <UTooltip text="收藏数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-bookmark" class="w-3 h-3 text-orange-500" />{{ item.collect_count || 0 }}</span>
                </UTooltip>
                <UTooltip text="评论数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-message-circle" class="w-3 h-3 text-blue-500" />{{ item.comment_count || 0 }}</span>
                </UTooltip>
                <UTooltip text="播放次数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-play" class="w-3 h-3 text-green-500" />{{ item.play_count || 0 }}</span>
                </UTooltip>
                <UTooltip text="对话人数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-users" class="w-3 h-3 text-purple-500" />{{ item.dialogue_count || 0 }}</span>
                </UTooltip>
                <UTooltip text="评分">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-star" class="w-3 h-3 text-yellow-500" />{{ item.score || 0 }}</span>
                </UTooltip>
                <UTooltip text="评分人数">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-users" class="w-3 h-3 text-indigo-500" />{{ item.score_count || 0 }}</span>
                </UTooltip>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <UPagination
              :page="state.pagination.page"
              :items-per-page="state.pagination.pagesize"
              :total="state.pagination.total"
              @update:page="handlePageChange"
            />
          </div>
        </template>
      </div>
    </div>
  </ConfigLayout>
  <AmusementListEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :tags-options="state.tagsOptions"
    @refresh="refresh"
  />

  <!-- 日期推荐弹框 -->
  <UModal v-model:open="state.datePickerVisible" title="设置日期推荐" :ui="{ content: 'sm:max-w-md' }">
    <template #body>
      <div class="p-4">
        <UFormField label="推荐时间">
          <UInput
            v-model="state.selectedDate"
            type="datetime-local"
            step="1"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="state.datePickerVisible = false">
          取消
        </UButton>
        <UButton @click="confirmDateRecommend">
          确认
        </UButton>
      </div>
    </template>
  </UModal>
</template>
