<script setup lang="ts">
import { getAmusementList, removeAmusement, hardRemoveAmusement, getCommonTagList, updateAmusementState, getAmusementCategoryList } from '@/api'

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
  // 周推月推弹框
  weekMonthPickerVisible: false,
  weekMonthPickerItem: null as any,
  weekMonthPickerType: '' as 'week' | 'month',
  selectedWeeks: [] as string[],
  selectedMonths: [] as string[],
  // 批量周推月推
  batchWeekValue: [] as string[],
  batchMonthValue: [] as string[],
  // 批量选择
  selectedIds: new Set<number>(),
  batchModalVisible: false,
  batchAction: '' as string,
  batchProcessing: false,
  batchResults: [] as { id: number; name: string; status: 'pending' | 'processing' | 'success' | 'skip' | 'error'; msg?: string }[],
  batchDateValue: '',
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
    week_recommend: [] as string[],
    month_recommend: [] as string[],
    sort: 'all'
  }
})

const router = useRouter()
const route = useRoute()

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

const hardDelRowConfirm = async (record: any) => {
  const { error } = await hardRemoveAmusement({ id: record.id })
  if (!error) {
    toast.add({ title: '物理删除成功', color: 'success' })
    loadCurrentList()
  }
}

// 设置推荐
const setRecommend = async (item: any) => {
  const newVal = item.recommend === 2 ? 0 : 2
  const { error } = await updateAmusementState({ id: item.id, recommend: newVal })
  if (!error) {
    toast.add({ title: newVal === 2 ? '已设为推荐' : '已取消推荐', color: 'success' })
    loadCurrentList(state.pagination.page)
  }
}

// 设置日推
const setDailyRecommend = async (item: any) => {
  const newVal = item.day_recommend === 2 ? 0 : 2
  const { error } = await updateAmusementState({ id: item.id, day_recommend: newVal })
  if (!error) {
    toast.add({ title: newVal === 2 ? '已设为日推' : '已取消日推', color: 'success' })
    loadCurrentList(state.pagination.page)
  }
}

// 打开周推设置
const openWeekPicker = (item: any) => {
  state.weekMonthPickerItem = item
  state.weekMonthPickerType = 'week'
  const weekRecommend = item.week_recommend || ''
  state.selectedWeeks = typeof weekRecommend === 'string' && weekRecommend ? weekRecommend.split(',') : []
  state.weekMonthPickerVisible = true
}

// 打开月推设置
const openMonthPicker = (item: any) => {
  state.weekMonthPickerItem = item
  state.weekMonthPickerType = 'month'
  const monthRecommend = item.month_recommend || ''
  state.selectedMonths = typeof monthRecommend === 'string' && monthRecommend ? monthRecommend.split(',') : []
  state.weekMonthPickerVisible = true
}

// 确认周推/月推设置
const confirmWeekMonthRecommend = async () => {
  if (!state.weekMonthPickerItem) return
  const params: any = { id: state.weekMonthPickerItem.id }
  if (state.weekMonthPickerType === 'week') {
    params.week_recommend = state.selectedWeeks.join(',')
  } else {
    params.month_recommend = state.selectedMonths.join(',')
  }
  const { error } = await updateAmusementState(params)
  if (!error) {
    toast.add({ title: '设置成功', color: 'success' })
    state.weekMonthPickerVisible = false
    loadCurrentList(state.pagination.page)
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
    loadCurrentList(state.pagination.page)
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
    loadCurrentList(state.pagination.page)
  }
}

// 批量选择相关
const toggleSelect = (id: number) => {
  if (state.selectedIds.has(id)) {
    state.selectedIds.delete(id)
  } else {
    state.selectedIds.add(id)
  }
  state.selectedIds = new Set(state.selectedIds)
}

const isSelected = (id: number) => state.selectedIds.has(id)

const selectAll = () => {
  if (state.selectedIds.size === state.currentList.length) {
    state.selectedIds.clear()
  } else {
    state.currentList.forEach(item => state.selectedIds.add(item.id))
  }
  state.selectedIds = new Set(state.selectedIds)
}

const selectedItems = computed(() => {
  return state.currentList.filter(item => state.selectedIds.has(item.id))
})

// 批量操作配置
const batchActionConfig: Record<string, { label: string; field: string; targetValue: any; checkField?: string; checkValue?: any }> = {
  publish: { label: '发布', field: 'state', targetValue: 2, checkField: 'state', checkValue: 2 },
  unpublish: { label: '取消发布', field: 'state', targetValue: 0, checkField: 'state', checkValue: 0 },
  recommend: { label: '推荐', field: 'recommend', targetValue: 2, checkField: 'recommend', checkValue: 2 },
  unrecommend: { label: '取消推荐', field: 'recommend', targetValue: 0, checkField: 'recommend', checkValue: 0 },
  daily: { label: '日推', field: 'day_recommend', targetValue: 2, checkField: 'day_recommend', checkValue: 2 },
  undaily: { label: '取消日推', field: 'day_recommend', targetValue: 0, checkField: 'day_recommend', checkValue: 0 },
  weekRecommend: { label: '周推', field: 'week_recommend', targetValue: '' },
  monthRecommend: { label: '月推', field: 'month_recommend', targetValue: '' },
  delete: { label: '删除', field: '', targetValue: null },
  dateRecommend: { label: '日期推荐', field: 'recommend_time', targetValue: '' },
  hardDelete: { label: '物理删除', field: '', targetValue: null }
}

// 打开批量操作弹框
const openBatchModal = (action: string) => {
  if (state.selectedIds.size === 0) return
  state.batchAction = action
  state.batchDateValue = ''
  state.batchWeekValue = []
  state.batchMonthValue = []
  // 初始化结果列表
  const config = batchActionConfig[action]
  state.batchResults = selectedItems.value.map(item => {
    const shouldSkip = config.checkField && item[config.checkField] === config.checkValue
    return {
      id: item.id,
      name: item.name || `ID:${item.id}`,
      status: shouldSkip ? 'skip' : 'pending',
      msg: shouldSkip ? '已是目标状态' : ''
    }
  })
  state.batchModalVisible = true
}

// 执行批量操作
const executeBatchAction = async () => {
  if (state.batchProcessing) return
  state.batchProcessing = true
  const config = batchActionConfig[state.batchAction]
  const items = selectedItems.value

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const result = state.batchResults[i]
    if (result.status === 'skip') continue

    result.status = 'processing'
    state.batchResults = [...state.batchResults]

    try {
      if (state.batchAction === 'delete') {
        const { error } = await removeAmusement({ id: item.id })
        result.status = error ? 'error' : 'success'
        result.msg = error ? '删除失败' : ''
      } else if (state.batchAction === 'hardDelete') {
        const { error } = await hardRemoveAmusement({ id: item.id })
        result.status = error ? 'error' : 'success'
        result.msg = error ? '物理删除失败' : ''
      } else if (state.batchAction === 'dateRecommend') {
        const { error } = await updateAmusementState({ id: item.id, recommend_time: state.batchDateValue.replace('T', ' ') })
        result.status = error ? 'error' : 'success'
      } else if (state.batchAction === 'weekRecommend') {
        const { error } = await updateAmusementState({ id: item.id, week_recommend: state.batchWeekValue.join(',') })
        result.status = error ? 'error' : 'success'
      } else if (state.batchAction === 'monthRecommend') {
        const { error } = await updateAmusementState({ id: item.id, month_recommend: state.batchMonthValue.join(',') })
        result.status = error ? 'error' : 'success'
      } else {
        const { error } = await updateAmusementState({ id: item.id, [config.field]: config.targetValue })
        result.status = error ? 'error' : 'success'
      }
    } catch {
      result.status = 'error'
      result.msg = '请求失败'
    }
    state.batchResults = [...state.batchResults]
  }

  state.batchProcessing = false
  const successCount = state.batchResults.filter(r => r.status === 'success').length
  const skipCount = state.batchResults.filter(r => r.status === 'skip').length
  toast.add({ title: `完成 ${successCount} 项，跳过 ${skipCount} 项`, color: 'success' })
}

// 关闭弹框并刷新
const closeBatchModal = async () => {
  state.batchModalVisible = false
  const hasSuccess = state.batchResults.some(r => r.status === 'success')
  if (hasSuccess) {
    state.selectedIds.clear()
    state.selectedIds = new Set()
    // 如果是删除操作且删除了当前页所有项，需要回到上一页
    const deletedCount = state.batchAction === 'delete'
      ? state.batchResults.filter(r => r.status === 'success').length
      : 0
    const remainingOnPage = state.currentList.length - deletedCount
    let targetPage = state.pagination.page
    if (remainingOnPage <= 0 && targetPage > 1) {
      targetPage = targetPage - 1
    }
    await loadCurrentList(targetPage)
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

// 格式化周推显示
const formatWeekRecommend = (weekRecommend: any) => {
  if (!weekRecommend) return ''
  const arr = Array.isArray(weekRecommend) ? weekRecommend : (typeof weekRecommend === 'string' ? weekRecommend.split(',') : [])
  if (arr.length === 0) return ''
  return ' ' + arr.map((w: string) => `第${w}周`).join('、')
}

// 格式化月推显示
const formatMonthRecommend = (monthRecommend: any) => {
  if (!monthRecommend) return ''
  const arr = Array.isArray(monthRecommend) ? monthRecommend : (typeof monthRecommend === 'string' ? monthRecommend.split(',') : [])
  if (arr.length === 0) return ''
  return ' ' + arr.map((m: string) => `${m}月`).join('、')
}

// 判断是否为本月第几周的周推
const isWeekRecommend = (weekRecommend: string) => {
  if (!weekRecommend || typeof weekRecommend !== 'string') return false
  const now = new Date()
  const weekOfMonth = Math.floor((now.getDate() - 1) / 7) + 1
  return weekRecommend.split(',').includes(String(weekOfMonth))
}

// 判断是否为当前月份的月推
const isMonthRecommend = (monthRecommend: string) => {
  if (!monthRecommend || typeof monthRecommend !== 'string') return false
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  return monthRecommend.split(',').includes(String(currentMonth))
}

// 判断是否在本周（旧逻辑，保留用于日期推荐显示）
const isThisWeek = (dateStr: string | number) => {
  if (!dateStr) return false
  let timestamp = typeof dateStr === 'number' ? dateStr : Number(dateStr)
  if (!isNaN(timestamp) && timestamp < 10000000000) {
    timestamp = timestamp * 1000
  }
  const date = isNaN(timestamp) ? new Date(dateStr) : new Date(timestamp)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  return date >= weekStart && date < weekEnd
}

// 判断是否在本月
const isThisMonth = (dateStr: string | number) => {
  if (!dateStr) return false
  let timestamp = typeof dateStr === 'number' ? dateStr : Number(dateStr)
  if (!isNaN(timestamp) && timestamp < 10000000000) {
    timestamp = timestamp * 1000
  }
  const date = isNaN(timestamp) ? new Date(dateStr) : new Date(timestamp)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

// 格式化日期
const formatDate = (dateStr: string | number) => {
  if (!dateStr) return ''
  // 如果是数字且小于一定值，认为是秒级时间戳，需要乘以1000
  let timestamp = typeof dateStr === 'number' ? dateStr : Number(dateStr)
  if (!isNaN(timestamp) && timestamp < 10000000000) {
    timestamp = timestamp * 1000
  }
  const date = isNaN(timestamp) ? new Date(dateStr) : new Date(timestamp)
  if (isNaN(date.getTime()) || date.getTime() < new Date('2000-01-01').getTime()) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

// 加载当前标签页的列表数据
const loadCurrentList = async (page = 1) => {
  state.loading = true
  state.pagination.page = page
  // 同步页码到URL
  router.replace({ query: { ...route.query, page: String(page), tab: String(state.activeTab) } })
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
  if (state.search.week_recommend && state.search.week_recommend.length > 0) {
    params.week_recommend = state.search.week_recommend.join(',')
  }
  if (state.search.month_recommend && state.search.month_recommend.length > 0) {
    params.month_recommend = state.search.month_recommend.join(',')
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
  state.search.week_recommend = []
  state.search.month_recommend = []
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
  // 从URL恢复页码和标签页
  const urlPage = Number(route.query.page) || 1
  const urlTab = Number(route.query.tab)
  if (!isNaN(urlTab) && [0, 2, 3, 4, 5].includes(urlTab)) {
    state.activeTab = urlTab
  }
  loadCurrentList(urlPage)
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
              v-model="state.search.week_recommend"
              :items="[
                { label: '第1周', value: '1' },
                { label: '第2周', value: '2' },
                { label: '第3周', value: '3' },
                { label: '第4周', value: '4' },
                { label: '第5周', value: '5' }
              ]"
              value-key="value"
              multiple
              placeholder="周推"
              class="w-[140px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            >
              <template #label>
                <span v-if="state.search.week_recommend.length === 0">周推</span>
                <span v-else>周推 ({{ state.search.week_recommend.length }})</span>
              </template>
            </USelectMenu>
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">周推</span>
            </label>
          </div>
          <div class="relative">
            <USelectMenu
              v-model="state.search.month_recommend"
              :items="[
                { label: '1月', value: '1' },
                { label: '2月', value: '2' },
                { label: '3月', value: '3' },
                { label: '4月', value: '4' },
                { label: '5月', value: '5' },
                { label: '6月', value: '6' },
                { label: '7月', value: '7' },
                { label: '8月', value: '8' },
                { label: '9月', value: '9' },
                { label: '10月', value: '10' },
                { label: '11月', value: '11' },
                { label: '12月', value: '12' }
              ]"
              value-key="value"
              multiple
              placeholder="月推"
              class="w-[140px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            >
              <template #label>
                <span v-if="state.search.month_recommend.length === 0">月推</span>
                <span v-else>月推 ({{ state.search.month_recommend.length }})</span>
              </template>
            </USelectMenu>
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">月推</span>
            </label>
          </div>
          <div class="relative z-10">
            <USelectMenu
              v-model="state.search.sort"
              :items="[
                { label: '默认', value: 'all' },
                { label: '电量', value: 'battery' },
                { label: '播放数', value: 'play_count' },
                { label: '浏览量', value: 'browse_count' },
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
            <UButton
              label="卡片检查"
              icon="i-lucide-scan-eye"
              color="neutral"
              variant="soft"
              @click="router.push('/amusement/detail/check')"
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

      <!-- 批量操作栏 -->
      <div v-if="state.activeTab !== 4" class="mb-4">
        <UButton size="sm" variant="outline" color="neutral" @click="selectAll">
          {{ state.selectedIds.size === state.currentList.length && state.currentList.length > 0 ? '取消全选' : '全选' }}
        </UButton>
      </div>
      <div v-if="state.activeTab !== 4 && state.selectedIds.size > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-3 flex-wrap">
        <span class="text-sm text-gray-500">已选 {{ state.selectedIds.size }} 项</span>
        <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <UButton size="sm" @click="openBatchModal('publish')">发布</UButton>
        <UButton size="sm" color="neutral" variant="outline" @click="openBatchModal('unpublish')">取消发布</UButton>
        <UButton size="sm" @click="openBatchModal('recommend')">推荐</UButton>
        <UButton size="sm" color="neutral" variant="outline" @click="openBatchModal('unrecommend')">取消推荐</UButton>
        <UButton size="sm" @click="openBatchModal('daily')">日推</UButton>
        <UButton size="sm" color="neutral" variant="outline" @click="openBatchModal('undaily')">取消日推</UButton>
        <UButton size="sm" @click="openBatchModal('weekRecommend')">周推</UButton>
        <UButton size="sm" @click="openBatchModal('monthRecommend')">月推</UButton>
        <UButton size="sm" @click="openBatchModal('dateRecommend')">日期推荐</UButton>
        <UButton size="sm" color="error" @click="openBatchModal('delete')">删除</UButton>
        <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <UButton size="sm" variant="ghost" @click="state.selectedIds.clear(); state.selectedIds = new Set()">取消选择</UButton>
      </div>

      <!-- 已删除标签页的批量操作栏 -->
      <div v-if="state.activeTab === 4" class="mb-4">
        <UButton size="sm" variant="outline" color="neutral" @click="selectAll">
          {{ state.selectedIds.size === state.currentList.length && state.currentList.length > 0 ? '取消全选' : '全选' }}
        </UButton>
      </div>
      <div v-if="state.activeTab === 4 && state.selectedIds.size > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center gap-3">
        <span class="text-sm text-gray-500">已选 {{ state.selectedIds.size }} 项</span>
        <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <UButton size="sm" color="error" @click="openBatchModal('hardDelete')">物理删除</UButton>
        <div class="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <UButton size="sm" variant="ghost" @click="state.selectedIds.clear(); state.selectedIds = new Set()">取消选择</UButton>
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
              class="group bg-white dark:bg-gray-900 rounded-lg border p-4 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
              :class="[
                state.activeTab === 4 ? 'opacity-60' : '',
                isSelected(item.id) ? 'border-gray-900 dark:border-white' : 'border-gray-200 dark:border-gray-800 hover:border-pink-300'
              ]"
              @click="openEditCoins(item)"
            >
              <!-- 选择框 -->
              <div
                class="absolute top-2 left-2 z-10"
                @click.stop="toggleSelect(item.id)"
              >
                <div
                  class="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all"
                  :class="isSelected(item.id)
                    ? 'bg-gray-900 dark:bg-white border border-gray-900 dark:border-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 hover:border-gray-500'"
                >
                  <UIcon v-if="isSelected(item.id)" name="i-lucide-check" class="w-3.5 h-3.5 text-white dark:text-gray-900" />
                </div>
              </div>
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
                          { label: '周推设置', icon: 'i-lucide-calendar-days', onSelect: () => openWeekPicker(item) },
                          { label: '月推设置', icon: 'i-lucide-calendar-range', onSelect: () => openMonthPicker(item) },
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
                    <UButton
                      v-if="state.activeTab === 4"
                      color="error"
                      variant="ghost"
                      size="xs"
                      class="opacity-0 group-hover:opacity-100 -mt-1 -mr-1"
                      @click.stop="dialog.open({ color: 'error', title: '物理删除', description: '此操作不可恢复，确定要永久删除吗？', onPositiveClick() { hardDelRowConfirm(item) } })"
                    >
                      <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
                    </UButton>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatDate(item.created_at) }}
                  </p>
                  <!-- 用户信息 -->
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    UID: {{ item.uid || '-' }} · {{ item.username || item.member?.nickname || item.member?.username || '-' }}
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
                <span v-if="item.week_recommend && (Array.isArray(item.week_recommend) ? item.week_recommend.length > 0 : item.week_recommend !== '')" class="px-1.5 py-0.5 text-[10px] font-medium bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 rounded">周推{{ formatWeekRecommend(item.week_recommend) }}</span>
                <span v-if="item.month_recommend && (Array.isArray(item.month_recommend) ? item.month_recommend.length > 0 : item.month_recommend !== '')" class="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded">月推{{ formatMonthRecommend(item.month_recommend) }}</span>
                <span v-if="item.recommend_time && formatDate(item.recommend_time)" class="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded">{{ formatDate(item.recommend_time) }}</span>
              </div>
              <!-- 统计数据 -->
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                <UTooltip text="创作时间">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-calendar-plus" class="w-3 h-3 text-gray-500" />{{ formatDate(item.created_at) }}</span>
                </UTooltip>
                <UTooltip text="更新时间">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-calendar-clock" class="w-3 h-3 text-gray-500" />{{ formatDate(item.updated_at) }}</span>
                </UTooltip>
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
                <UTooltip text="浏览量">
                  <span class="flex items-center gap-1 cursor-help"><UIcon name="i-lucide-eye" class="w-3 h-3 text-cyan-500" />{{ item.browse_count || 0 }}</span>
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

  <!-- 周推/月推设置弹框 -->
  <UModal v-model:open="state.weekMonthPickerVisible" :title="state.weekMonthPickerType === 'week' ? '设置周推' : '设置月推'" :ui="{ content: 'sm:max-w-md' }">
    <template #body>
      <div class="p-4">
        <div class="mb-2 text-sm font-medium">{{ state.weekMonthPickerType === 'week' ? '选择周次' : '选择月份' }}</div>
        <div v-if="state.weekMonthPickerType === 'week'" class="flex flex-wrap gap-2">
          <label v-for="week in [1,2,3,4,5]" :key="week" class="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" :value="String(week)" v-model="state.selectedWeeks" class="rounded" />
            <span class="text-sm">第{{ week }}周</span>
          </label>
        </div>
        <div v-else class="grid grid-cols-4 gap-2">
          <label v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="month" class="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" :value="String(month)" v-model="state.selectedMonths" class="rounded" />
            <span class="text-sm">{{ month }}月</span>
          </label>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="state.weekMonthPickerVisible = false">取消</UButton>
        <UButton @click="confirmWeekMonthRecommend">确认</UButton>
      </div>
    </template>
  </UModal>

  <!-- 批量操作弹框 -->
  <UModal v-model:open="state.batchModalVisible" :title="'批量' + (batchActionConfig[state.batchAction]?.label || '')" :ui="{ content: 'sm:max-w-lg' }">
    <template #body>
      <div class="p-4 space-y-4">
        <!-- 日期选择（仅日期推荐时显示） -->
        <div v-if="state.batchAction === 'dateRecommend'">
          <label class="block text-sm font-medium mb-2">推荐时间</label>
          <UInput v-model="state.batchDateValue" type="datetime-local" step="1" class="w-full" />
        </div>

        <!-- 周推选择 -->
        <div v-if="state.batchAction === 'weekRecommend'">
          <label class="block text-sm font-medium mb-2">选择周次</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="week in [1,2,3,4,5]" :key="week" class="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" :value="String(week)" v-model="state.batchWeekValue" class="rounded" />
              <span class="text-sm">第{{ week }}周</span>
            </label>
          </div>
        </div>

        <!-- 月推选择 -->
        <div v-if="state.batchAction === 'monthRecommend'">
          <label class="block text-sm font-medium mb-2">选择月份</label>
          <div class="grid grid-cols-4 gap-2">
            <label v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="month" class="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" :value="String(month)" v-model="state.batchMonthValue" class="rounded" />
              <span class="text-sm">{{ month }}月</span>
            </label>
          </div>
        </div>

        <!-- 执行列表 -->
        <div class="border rounded-lg dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 max-h-[300px] overflow-y-auto">
          <div v-for="(result, idx) in state.batchResults" :key="result.id" class="flex items-center gap-3 px-3 py-2">
            <img v-if="selectedItems[idx]?.image" :src="selectedItems[idx].image" class="w-8 h-10 rounded object-cover shrink-0" />
            <div v-else class="w-8 h-10 rounded bg-gray-100 dark:bg-gray-800 shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ result.name }}</div>
              <div v-if="result.msg" class="text-xs text-gray-400">{{ result.msg }}</div>
            </div>
            <div class="shrink-0">
              <UIcon v-if="result.status === 'pending'" name="i-lucide-circle" class="w-4 h-4 text-gray-300" />
              <UIcon v-else-if="result.status === 'processing'" name="i-lucide-loader-2" class="w-4 h-4 text-primary-500 animate-spin" />
              <UIcon v-else-if="result.status === 'success'" name="i-lucide-check-circle" class="w-4 h-4 text-green-500" />
              <UIcon v-else-if="result.status === 'skip'" name="i-lucide-minus-circle" class="w-4 h-4 text-gray-400" />
              <UIcon v-else name="i-lucide-x-circle" class="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>

        <!-- 统计 -->
        <div class="text-sm text-gray-500">
          待执行 {{ state.batchResults.filter(r => r.status === 'pending').length }} 项，
          跳过 {{ state.batchResults.filter(r => r.status === 'skip').length }} 项
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="closeBatchModal">
          {{ state.batchResults.some(r => r.status === 'success') ? '完成' : '取消' }}
        </UButton>
        <UButton
          v-if="!state.batchResults.every(r => r.status !== 'pending')"
          :loading="state.batchProcessing"
          :disabled="(state.batchAction === 'dateRecommend' && !state.batchDateValue) || (state.batchAction === 'weekRecommend' && state.batchWeekValue.length === 0) || (state.batchAction === 'monthRecommend' && state.batchMonthValue.length === 0)"
          :color="state.batchAction === 'delete' ? 'error' : 'primary'"
          @click="executeBatchAction"
        >
          执行
        </UButton>
      </div>
    </template>
  </UModal>
</template>
