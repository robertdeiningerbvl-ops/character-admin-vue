<script setup lang="ts">
import { getAmusementList, getAmusementDetail, getAmusementVersionDetail, getChatHistory, removeAmusement, hardRemoveAmusement, updateAmusementState, submitAmusement } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'AmusementCheck' })

const toast = useToast()
const dialog = useDialog()
const route = useRoute()
const router = useRouter()

const state = reactive({
  loading: false,
  detailLoading: false,
  list: [] as any[],
  currentIndex: 0,
  seeking: 0, // 0=全部, 2=待审核, 3=版本升级审核, 5=已发布
  pagination: { page: 1, pagesize: 50, total: 0 },
  // 当前卡片详情
  name: '',
  backgroundImage: '',
  avatarImage: '',
  greetings: [''] as string[],
  chatHistory: [] as { role: string, content: string }[],
  amusementId: null as number | null,
  editingVersionId: null as number | null,
  versions: [] as any[],
  reviewVersionId: null as number | null,
  // 角色卡数据
  cardData: null as any
})

const current = computed(() => state.list[state.currentIndex] || null)
const displayAvatar = computed(() => state.avatarImage || state.backgroundImage || current.value?.image)
const pendingVersion = computed(() => state.versions.find((v: any) => v.state === 1))
const currentVersion = computed(() => state.versions.find((v: any) => v.id === state.reviewVersionId))
const formatTime = (t: any) => {
  if (!t) return '-'
  let timestamp = typeof t === 'number' ? t : Number(t)
  if (!isNaN(timestamp) && timestamp < 10000000000) {
    timestamp = timestamp * 1000
  }
  const d = new Date(timestamp)
  if (isNaN(d.getTime()) || d.getTime() < new Date('2000-01-01').getTime()) return '-'
  const Y = d.getFullYear()
  const M = String(d.getMonth() + 1).padStart(2, '0')
  const D = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}`
}

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

// Token 估算
const estimateTokens = (text: string) => {
  if (!text) return 0
  const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  return Math.ceil(cn / 2 + (text.length - cn) / 4)
}

const tokenStats = computed(() => {
  const card = state.cardData?.data || state.cardData || {}
  const settingsText = [card.name, card.description, card.personality, card.scenario, card.mes_example, card.system_prompt, card.creator_notes, card.first_mes, ...(card.alternate_greetings || [])].join('')
  const worldBookEntries = card.character_book?.entries || []
  const regexEntries = card.regex || []
  const guide = state.cardData?.anohana?.guide || []
  return {
    total: estimateTokens(settingsText) + estimateTokens(worldBookEntries.map((e: any) => `${(e.keys || []).join(',')}${e.content || ''}`).join('')) + estimateTokens(regexEntries.map((e: any) => `${e.scriptName}${e.findRegex}${e.replaceString}`).join('')) + estimateTokens(guide.join('')),
    settings: estimateTokens(settingsText),
    worldBook: worldBookEntries.length,
    regex: regexEntries.length,
    guide: guide.filter((g: any) => g?.trim?.()).length
  }
})

const loadList = async (page = 1, targetId?: number) => {
  state.loading = true
  state.pagination.page = page
  const params: any = { page, pagesize: state.pagination.pagesize }
  if (state.seeking > 0) params.seeking = state.seeking
  const { data } = await getAmusementList(params)
  if (data) {
    state.list = data.list || []
    state.pagination.total = data.total || 0
    // 如果有目标ID，找到对应索引
    if (targetId) {
      const idx = state.list.findIndex((item: any) => Number(item.id) === Number(targetId))
      state.currentIndex = idx >= 0 ? idx : 0
    } else {
      state.currentIndex = 0
    }
    if (state.list.length > 0) loadDetail()
  }
  state.loading = false
  syncUrl()
}

const loadDetail = async () => {
  if (!current.value) return
  state.detailLoading = true
  try {
    const { data } = await getAmusementDetail({ biz_id: current.value.id })
    if (data) {
      state.amusementId = data.id
      state.versions = data.version || []
      state.reviewVersionId = data.review_version_id || null
      // 默认加载第一个版本
      if (!state.editingVersionId || !state.versions.find((v: any) => v.id === state.editingVersionId)) {
        state.editingVersionId = state.versions[0]?.id || null
      }
      await loadVersionContent()
    }
  } catch {}
  state.detailLoading = false
}

// 加载版本内容
const loadVersionContent = async () => {
  if (!state.amusementId || !state.editingVersionId) return
  const { data: vData } = await getAmusementVersionDetail({ id: state.amusementId, version_id: state.editingVersionId })
  if (vData?.body) {
    const card = JSON.parse(vData.body)
    state.cardData = card
    state.name = card.data?.name || card.name || ''
    state.backgroundImage = card.anohana?.image || ''
    state.avatarImage = card.anohana?.avatar || ''
    state.greetings = [card.data?.first_mes || '', ...(card.data?.alternate_greetings || [])]
  }
  // 加载聊天历史
  const { data: hData } = await getChatHistory({ biz_id: state.amusementId, version_id: state.editingVersionId })
  state.chatHistory = (hData?.history || []).map((msg: any) => ({
    role: msg.role || 'assistant',
    content: msg.content || ''
  }))
}

// 切换版本
const switchVersion = async (versionId: number) => {
  state.editingVersionId = versionId
  state.detailLoading = true
  await loadVersionContent()
  state.detailLoading = false
}

const seekingOptions = [
  { label: '全部', value: 0 },
  { label: '待审核', value: 2 },
  { label: '版本升级审核', value: 3 },
  { label: '已发布', value: 5 },
  { label: '已删除', value: 4 }
]

const changeFilter = (val: number) => {
  state.seeking = val
  loadList(1)
  syncUrl()
}

// 同步URL
const syncUrl = () => {
  router.replace({ query: { page: state.pagination.page, id: current.value?.id, seeking: state.seeking } })
}

watch(() => state.currentIndex, () => { loadDetail(); syncUrl() })

const prev = () => { if (state.currentIndex > 0) state.currentIndex-- }
const next = () => {
  if (state.currentIndex < state.list.length - 1) state.currentIndex++
  else if (state.pagination.page * state.pagination.pagesize < state.pagination.total) loadList(state.pagination.page + 1)
}

const doDelete = async (hard = false) => {
  if (!current.value) return
  const { error } = await (hard ? hardRemoveAmusement : removeAmusement)({ id: current.value.id })
  if (!error) {
    toast.add({ title: hard ? '物理删除成功' : '删除成功', color: 'success' })
    state.list.splice(state.currentIndex, 1)
    if (state.currentIndex >= state.list.length && state.currentIndex > 0) state.currentIndex--
    if (state.list.length === 0) loadList(state.pagination.page)
    else loadDetail()
  }
}

const confirmDelete = (hard = false) => {
  dialog.open({
    color: 'error',
    title: hard ? '物理删除' : '删除',
    description: `确定${hard ? '物理' : ''}删除「${current.value?.name}」？`,
    onPositiveClick: () => doDelete(hard)
  })
}

// 审核操作
const reviewDialogVisible = ref(false)
const reviewAction = ref<2 | 3>(2)
const rejectReason = ref('')

const openReviewDialog = (action: 2 | 3) => {
  reviewAction.value = action
  rejectReason.value = ''
  reviewDialogVisible.value = true
}

const confirmReview = async () => {
  const versionId = pendingVersion.value?.id || state.reviewVersionId
  if (!state.amusementId || !versionId) return
  if (reviewAction.value === 3 && !rejectReason.value.trim()) {
    toast.add({ title: '请输入拒绝理由', color: 'error' })
    return
  }
  const params: any = { id: state.amusementId, version_id: versionId, seeking: reviewAction.value }
  if (reviewAction.value === 3) params.reason = rejectReason.value
  const { error } = await submitAmusement(params)
  if (!error) {
    toast.add({ title: reviewAction.value === 2 ? '已通过' : '已拒绝', color: 'success' })
    reviewDialogVisible.value = false
    refreshCurrent()
  }
}

// 日期推荐
const datePickerVisible = ref(false)
const selectedDate = ref('')
const openDatePicker = () => { selectedDate.value = current.value?.recommend_time || ''; datePickerVisible.value = true }
const confirmDateRecommend = async () => {
  if (!current.value) return
  const { error } = await updateAmusementState({ id: current.value.id, recommend_time: selectedDate.value.replace('T', ' ') })
  if (!error) { toast.add({ title: '设置成功', color: 'success' }); datePickerVisible.value = false; refreshCurrent() }
}

// 周推月推
const weekMonthPickerVisible = ref(false)
const weekMonthPickerType = ref<'week' | 'month'>('week')
const selectedWeeks = ref<string[]>([])
const selectedMonths = ref<string[]>([])

// 判断是否为本月第几周的周推
const isWeekRecommend = (weekRecommend: string) => {
  if (!weekRecommend) return false
  const now = new Date()
  const weekOfMonth = Math.floor((now.getDate() - 1) / 7) + 1
  return weekRecommend.split(',').includes(String(weekOfMonth))
}

// 判断是否为当前月份的月推
const isMonthRecommend = (monthRecommend: string) => {
  if (!monthRecommend) return false
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  return monthRecommend.split(',').includes(String(currentMonth))
}

const openWeekPicker = () => {
  const weekRecommend = current.value?.week_recommend || ''
  selectedWeeks.value = typeof weekRecommend === 'string' && weekRecommend ? weekRecommend.split(',') : []
  weekMonthPickerType.value = 'week'
  weekMonthPickerVisible.value = true
}
const openMonthPicker = () => {
  const monthRecommend = current.value?.month_recommend || ''
  selectedMonths.value = typeof monthRecommend === 'string' && monthRecommend ? monthRecommend.split(',') : []
  weekMonthPickerType.value = 'month'
  weekMonthPickerVisible.value = true
}
const confirmWeekMonthRecommend = async () => {
  if (!current.value) return
  const params: any = { id: current.value.id }
  if (weekMonthPickerType.value === 'week') {
    params.week_recommend = selectedWeeks.value.join(',')
  } else {
    params.month_recommend = selectedMonths.value.join(',')
  }
  const { error } = await updateAmusementState(params)
  if (!error) { toast.add({ title: '设置成功', color: 'success' }); weekMonthPickerVisible.value = false; refreshCurrent() }
}

// 切换推荐/日推/发布
const toggleState = async (field: string, val: number) => {
  if (!current.value) return
  const { error } = await updateAmusementState({ id: current.value.id, [field]: val })
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    current.value[field] = val
  }
}

const refreshCurrent = () => {
  loadList(state.pagination.page, current.value?.id)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  // 从URL恢复状态
  const urlPage = Number(route.query.page) || 1
  const urlId = Number(route.query.id) || undefined
  const urlSeeking = Number(route.query.seeking) || 0
  state.seeking = urlSeeking
  loadList(urlPage, urlId)
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => { window.removeEventListener('keydown', onKeydown) })
</script>

<template>
  <div class="flex h-screen">
    <!-- 左侧：手机预览（使用共用组件） -->
    <div class="w-[420px] p-4 border-r border-gray-200 dark:border-gray-800 shrink-0 overflow-hidden">
      <div class="w-[388px] h-full flex flex-col">
        <AmusementPhonePreview
          v-if="current"
          :name="state.name"
          :background-image="state.backgroundImage"
          :avatar-image="state.avatarImage"
          :greetings="state.greetings"
          :chat-history="state.chatHistory"
          :loading="state.loading || state.detailLoading"
          :show-toggle="false"
        />
        <div v-else-if="state.loading || state.detailLoading" class="flex-1 flex items-center justify-center">
          <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
        </div>
        <div v-else class="flex-1 flex items-center justify-center text-gray-500">暂无数据</div>
      </div>
    </div>

    <!-- 右侧：信息和操作 -->
    <div class="flex-1 p-6 flex flex-col min-w-0 overflow-hidden">
      <div class="flex items-center justify-between mb-4 min-w-0">
        <div class="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
          <h1 class="text-xl font-bold">卡片检查</h1>
          <div class="flex gap-1">
            <UButton v-for="opt in seekingOptions" :key="opt.value" size="sm" :color="state.seeking === opt.value ? 'primary' : 'gray'" :variant="state.seeking === opt.value ? 'solid' : 'ghost'" @click="changeFilter(opt.value)">{{ opt.label }}</UButton>
          </div>
        </div>
        <div class="text-sm text-gray-500">{{ state.currentIndex + 1 }} / {{ state.list.length }} · 第 {{ state.pagination.page }} 页 (共 {{ state.pagination.total }} 张)</div>
      </div>
      <div v-if="current" class="flex-1 overflow-auto">
        <!-- 卡片信息和操作 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-hidden">
          <div class="flex items-start gap-3 mb-3 min-w-0">
            <img v-if="current.image" :src="current.image" class="w-14 h-18 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="font-bold break-words">{{ current.name }}</p>
              <p class="text-xs text-gray-400 truncate" :title="`ID: ${current.id} · UID: ${current.uid || '-'} · ${current.username || current.member?.nickname || '-'}`">ID: {{ current.id }} · UID: {{ current.uid || '-' }} · {{ current.username || current.member?.nickname || '-' }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span class="text-xs px-1.5 py-0.5 rounded" :class="current.state === 2 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">{{ current.state === 2 ? '已发布' : '未发布' }}</span>
                <span v-if="current.recommend === 2" class="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">推荐</span>
                <span v-if="current.day_recommend === 2" class="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">日推</span>
                <span v-if="current.week_recommend && (Array.isArray(current.week_recommend) ? current.week_recommend.length > 0 : current.week_recommend !== '')" class="text-xs px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-600">周推{{ formatWeekRecommend(current.week_recommend) }}</span>
                <span v-if="current.month_recommend && (Array.isArray(current.month_recommend) ? current.month_recommend.length > 0 : current.month_recommend !== '')" class="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">月推{{ formatMonthRecommend(current.month_recommend) }}</span>
                <span v-if="current.recommend_time && formatTime(current.recommend_time) !== '-'" class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{{ formatTime(current.recommend_time) }}</span>
              </div>
            </div>
          </div>
          <!-- 时间信息 -->
          <div class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>创作时间: {{ formatTime(current.created_at) }}</span>
              <span>更新时间: {{ formatTime(current.updated_at) }}</span>
            </div>
          </div>
          <!-- 数据统计 -->
          <div class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-activity" class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">数据统计</span>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-amber-500">{{ current.battery || 0 }}</div>
                <div class="text-xs text-gray-500">电量</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-pink-500">{{ current.praise_count || 0 }}</div>
                <div class="text-xs text-gray-500">点赞</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-orange-500">{{ current.collect_count || 0 }}</div>
                <div class="text-xs text-gray-500">收藏</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-blue-500">{{ current.comment_count || 0 }}</div>
                <div class="text-xs text-gray-500">评论</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-green-500">{{ current.play_count || 0 }}</div>
                <div class="text-xs text-gray-500">播放</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-cyan-500">{{ current.browse_count || 0 }}</div>
                <div class="text-xs text-gray-500">浏览</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-purple-500">{{ current.dialogue_count || 0 }}</div>
                <div class="text-xs text-gray-500">对话</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-yellow-500">{{ current.score || 0 }}</div>
                <div class="text-xs text-gray-500">评分</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-indigo-500">{{ current.score_count || 0 }}</div>
                <div class="text-xs text-gray-500">评分人数</div>
              </div>
            </div>
          </div>
          <!-- Token 统计 -->
          <div class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Token 统计</span>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-primary-600">{{ tokenStats.total }}</div>
                <div class="text-xs text-gray-500">总计</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-gray-700">{{ tokenStats.settings }}</div>
                <div class="text-xs text-gray-500">设定</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-gray-700">{{ tokenStats.worldBook }}</div>
                <div class="text-xs text-gray-500">世界书</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-gray-700">{{ tokenStats.regex }}</div>
                <div class="text-xs text-gray-500">正则</div>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-center">
                <div class="text-lg font-bold text-gray-700">{{ tokenStats.guide }}</div>
                <div class="text-xs text-gray-500">引导词</div>
              </div>
            </div>
          </div>
          <!-- 版本管理 -->
          <div v-if="state.versions.length" class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div class="grid grid-cols-2 gap-3 mb-3">
              <!-- 当前使用版本 -->
              <div class="p-3 rounded-lg bg-green-50 border border-green-200">
                <div class="flex items-center gap-1 text-green-700 text-sm font-medium mb-1">
                  <UIcon name="i-lucide-check-circle" class="w-4 h-4" /> 当前使用版本
                </div>
                <div class="text-xs text-green-600">
                  版本号: v{{ currentVersion?.version || '-' }}<br>
                  发布时间: {{ formatTime(currentVersion?.updated_at) }}
                </div>
              </div>
              <!-- 待审核版本 -->
              <div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <div class="flex items-center gap-1 text-yellow-700 text-sm font-medium mb-1">
                  <UIcon name="i-lucide-clock" class="w-4 h-4" /> 待审核版本
                </div>
                <div class="text-xs text-yellow-600">
                  <template v-if="pendingVersion">
                    版本号: v{{ pendingVersion.version }}<br>
                    提交时间: {{ formatTime(pendingVersion.updated_at) }}
                  </template>
                  <template v-else>暂无待审核版本</template>
                </div>
              </div>
            </div>
            <!-- 全部版本 -->
            <div class="text-xs text-gray-500 mb-2">全部版本 {{ state.versions.length }}</div>
            <div class="flex flex-wrap gap-2">
              <button v-for="v in state.versions" :key="v.id" class="text-xs px-2 py-1 rounded border cursor-pointer transition-all" :class="[
                v.id === state.editingVersionId ? 'ring-2 ring-primary-500' : '',
                v.id === state.reviewVersionId ? 'bg-green-50 border-green-200 text-green-700' : v.state === 1 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-600'
              ]" @click="switchVersion(v.id)">
                v{{ v.version }}
                <span v-if="v.id === state.reviewVersionId">使用中</span>
                <span v-else-if="v.state === 1">待审核</span>
              </button>
            </div>
          </div>
          <!-- 导航按钮 -->
          <div class="flex items-center gap-2 mb-3">
            <UButton color="gray" size="sm" :disabled="state.pagination.page <= 1" @click="loadList(state.pagination.page - 1)">上一页</UButton>
            <UButton color="primary" :disabled="state.currentIndex === 0" @click="prev"><UIcon name="i-lucide-chevron-left" /> 上一个</UButton>
            <UButton color="primary" @click="next">下一个 <UIcon name="i-lucide-chevron-right" /></UButton>
            <UButton color="gray" size="sm" @click="loadList(state.pagination.page + 1)">下一页</UButton>
            <UButton size="sm" variant="ghost" @click="router.push(`/amusement/detail/${current.id}`)"><UIcon name="i-lucide-external-link" /></UButton>
          </div>
          <!-- 审核操作 -->
          <div v-if="pendingVersion || state.seeking === 2 || state.seeking === 3" class="flex gap-2 mb-3">
            <UButton color="green" size="sm" @click="openReviewDialog(2)"><UIcon name="i-lucide-check" /> 通过</UButton>
            <UButton color="red" size="sm" variant="soft" @click="openReviewDialog(3)"><UIcon name="i-lucide-x" /> 拒绝</UButton>
          </div>
          <!-- 状态操作 -->
          <div class="flex flex-wrap gap-2">
            <UButton size="sm" :color="current.state === 2 ? 'gray' : 'primary'" @click="toggleState('state', current.state === 2 ? 0 : 2)">{{ current.state === 2 ? '取消发布' : '发布' }}</UButton>
            <UButton size="sm" :color="current.recommend === 2 ? 'amber' : 'gray'" variant="soft" @click="toggleState('recommend', current.recommend === 2 ? 0 : 2)">{{ current.recommend === 2 ? '取消推荐' : '推荐' }}</UButton>
            <UButton size="sm" :color="current.day_recommend === 2 ? 'orange' : 'gray'" variant="soft" @click="toggleState('day_recommend', current.day_recommend === 2 ? 0 : 2)">{{ current.day_recommend === 2 ? '取消日推' : '日推' }}</UButton>
            <UButton size="sm" color="gray" variant="soft" @click="openWeekPicker">周推设置</UButton>
            <UButton size="sm" color="gray" variant="soft" @click="openMonthPicker">月推设置</UButton>
            <UButton size="sm" color="gray" variant="soft" @click="openDatePicker">日期推荐</UButton>
            <UButton size="sm" color="red" variant="soft" @click="confirmDelete(false)">删除</UButton>
            <UButton size="sm" color="red" @click="confirmDelete(true)">物理删除</UButton>
          </div>
        </div>
        <p class="text-xs text-gray-400 text-center mt-2">← → 切换 | Del 删除 | Shift+Del 物理删除</p>
      </div>
    </div>
  </div>

  <!-- 日期推荐弹框 -->
  <UModal v-model:open="datePickerVisible">
    <template #content>
      <div class="p-4">
        <h3 class="font-bold mb-3">日期推荐</h3>
        <input v-model="selectedDate" type="datetime-local" class="w-full border rounded px-3 py-2 mb-3" />
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="datePickerVisible = false">取消</UButton>
          <UButton @click="confirmDateRecommend">确定</UButton>
        </div>
      </div>
    </template>
  </UModal>

  <!-- 周推/月推设置弹框 -->
  <UModal v-model:open="weekMonthPickerVisible">
    <template #content>
      <div class="p-4">
        <h3 class="font-bold mb-3">{{ weekMonthPickerType === 'week' ? '设置周推' : '设置月推' }}</h3>
        <div v-if="weekMonthPickerType === 'week'" class="flex flex-wrap gap-2 mb-3">
          <label v-for="week in [1,2,3,4,5]" :key="week" class="flex items-center gap-1">
            <input type="checkbox" :value="String(week)" v-model="selectedWeeks" />
            <span>第{{ week }}周</span>
          </label>
        </div>
        <div v-else class="grid grid-cols-4 gap-2 mb-3">
          <label v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="month" class="flex items-center gap-1">
            <input type="checkbox" :value="String(month)" v-model="selectedMonths" />
            <span>{{ month }}月</span>
          </label>
        </div>
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="weekMonthPickerVisible = false">取消</UButton>
          <UButton @click="confirmWeekMonthRecommend">确定</UButton>
        </div>
      </div>
    </template>
  </UModal>

  <!-- 审核弹框 -->
  <UModal v-model:open="reviewDialogVisible">
    <template #content>
      <div class="p-4">
        <h3 class="font-bold mb-3">{{ reviewAction === 2 ? '审核通过' : '审核拒绝' }}</h3>
        <div v-if="reviewAction === 3" class="mb-3">
          <label class="text-sm text-gray-500 mb-1 block">拒绝理由</label>
          <textarea v-model="rejectReason" rows="3" class="w-full border rounded px-3 py-2" placeholder="请输入拒绝理由" />
        </div>
        <p v-else class="text-gray-600 mb-3">确定通过该版本的审核？</p>
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="reviewDialogVisible = false">取消</UButton>
          <UButton :color="reviewAction === 2 ? 'green' : 'red'" @click="confirmReview">确定</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
/* 页面级样式已移至共享组件 AmusementPhonePreview.vue */
</style>