<script setup lang="ts">
import { getAmusementDetail, updateAmusement, getAmusementVersionDetail, submitAmusement, updateAmusementVersion } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AmusementDetail'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = computed(() => route.params.id as string)
const isNew = computed(() => id.value === 'new')

// 当前 Tab
type TabType = 'overview' | 'settings' | 'worldbook' | 'regex' | 'quickreply' | 'version'
const activeTab = ref<TabType>('overview')

const tabItems = [
  { key: 'overview', label: '概览', icon: 'i-lucide-file-text' },
  { key: 'settings', label: '设定', icon: 'i-lucide-settings-2' },
  { key: 'worldbook', label: '世界书', icon: 'i-lucide-globe' },
  { key: 'regex', label: '正则', icon: 'i-lucide-regex' },
  { key: 'quickreply', label: '快速回复', icon: 'i-lucide-message-square' },
  { key: 'version', label: '版本管理', icon: 'i-lucide-git-branch' }
]

// 状态
const state = reactive({
  loading: false,
  saving: false,
  publishing: false,
  // 基础信息
  name: '',
  creatorName: '',
  summary: '',
  description: '',
  personality: '',
  scenario: '',
  mesExample: '',
  systemPrompt: '',
  creatorNotes: '',
  tags: [] as string[],
  greetings: [''] as string[],
  currentGreetingIndex: 0,
  // 设置
  isPrivate: false,
  isRepost: false,
  isNsfw: false,
  sourceUrl: '',
  // 图片
  backgroundImage: '',
  avatarImage: '',
  // 世界书
  worldBookName: '',
  worldBookEntries: [] as any[],
  worldBookSearch: '',
  // 正则
  regexEntries: [] as any[],
  regexSearch: '',
  // 快速回复
  quickReplies: [{ id: '1', content: '' }] as { id: string, content: string }[],
  // 版本
  versions: [] as any[],
  amusementId: null as number | null,
  amusementState: 0,
  amusementDraft: 2,
  currentVersionId: null as number | null,
  reviewVersionId: null as number | null,
  editingVersionId: null as number | null,
  // 统计数据
  stats: {
    praiseCount: 0,
    commentCount: 0,
    collectCount: 0,
    dialogueCount: 0,
    playCount: 0,
    score: 0,
    scoreCount: 0,
    battery: 0
  },
  // 状态标记
  recommend: 0,
  dayRecommend: 0
})

// 返回列表
const goBack = () => {
  router.push('/amusement/list')
}

// 加载详情
const loadDetail = async (applyContent = true) => {
  if (isNew.value) return
  state.loading = true
  try {
    const { data, error } = await getAmusementDetail({ biz_id: id.value })
    if (!error && data) {
      await applyData(data, applyContent)
    }
  } catch (e: any) {
    toast.add({ title: e.message || '加载失败', color: 'error' })
  } finally {
    state.loading = false
  }
}

// 应用数据
const applyData = async (data: any, applyContent = true) => {
  state.amusementId = data.id
  state.amusementState = data.state ?? 0
  state.amusementDraft = data.draft ?? 2
  state.currentVersionId = data.version_id ?? null
  state.reviewVersionId = data.review_version_id ?? null
  state.versions = data.version || []

  // 从 item 中获取统计数据和状态
  const item = data.item
  if (item) {
    state.stats.praiseCount = item.praise_count ?? 0
    state.stats.commentCount = item.comment_count ?? 0
    state.stats.collectCount = item.collect_count ?? 0
    state.stats.dialogueCount = item.dialogue_count ?? 0
    state.stats.playCount = item.play_count ?? 0
    state.stats.score = item.score ?? 0
    state.stats.scoreCount = item.score_count ?? 0
    state.stats.battery = item.battery ?? 0
    state.recommend = item.recommend ?? 0
    state.dayRecommend = item.day_recommend ?? 0
    state.isPrivate = item.anonymous === 1
    state.isNsfw = item.nsfw === 1
    state.isRepost = item.source === 1
    state.sourceUrl = item.source_url || ''
  }

  // 设置版本列表后，加载第一个版本的内容
  if (state.versions.length > 0 && applyContent) {
    const firstVersion = state.versions[0]
    state.editingVersionId = firstVersion.id
    try {
      const { data: versionData } = await getAmusementVersionDetail({
        id: state.amusementId,
        version_id: firstVersion.id
      })
      if (versionData?.body) {
        const content = JSON.parse(versionData.body)
        applyCharacterCard(content)
      }
    } catch {}
  } else if (applyContent && data.body) {
    try {
      const content = JSON.parse(data.body)
      applyCharacterCard(content)
    } catch {}
  }
}

// 应用角色卡数据
const applyCharacterCard = (card: any) => {
  const data = card.data || card
  state.name = data.name || card.name || ''
  state.creatorName = data.creator || ''
  state.summary = data.summary || ''
  state.description = data.description || ''
  state.personality = data.personality || ''
  state.scenario = data.scenario || ''
  state.mesExample = data.mes_example || ''
  state.systemPrompt = data.system_prompt || ''
  state.creatorNotes = data.creator_notes || ''
  state.tags = data.tags || []

  // 第一句话
  const allGreetings = [data.first_mes || '', ...(data.alternate_greetings || [])].filter(Boolean)
  state.greetings = allGreetings.length > 0 ? allGreetings : ['']
  state.currentGreetingIndex = 0

  // 世界书
  if (data.character_book) {
    state.worldBookEntries = data.character_book.entries || []
    state.worldBookName = data.character_book.name || ''
  }

  // 正则
  if (data.regex && Array.isArray(data.regex)) {
    state.regexEntries = data.regex.map((r: any, idx: number) => ({
      ...r,
      id: r.id != null ? String(r.id) : String(idx + 1),
      placement: Array.isArray(r.placement) ? r.placement : [],
      trimStrings: Array.isArray(r.trimStrings) ? r.trimStrings : []
    }))
  }

  // anohana 数据
  if (card.anohana) {
    if (card.anohana.image) state.backgroundImage = card.anohana.image
    if (card.anohana.avatar) state.avatarImage = card.anohana.avatar
    if (card.anohana.summary) state.summary = card.anohana.summary
    state.isRepost = card.anohana.source === true
    state.sourceUrl = card.anohana.source_url || ''
    state.isPrivate = card.anohana.anonymous === true
    state.isNsfw = card.anohana.nsfw === true
    if (card.anohana.guide && Array.isArray(card.anohana.guide)) {
      state.quickReplies = card.anohana.guide
    }
  }
}

// 构建角色卡数据
const buildCharacterData = () => {
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    name: state.name,
    anohana: {
      image: state.backgroundImage,
      avatar: state.avatarImage || state.backgroundImage,
      source: state.isRepost,
      source_url: state.sourceUrl,
      summary: state.summary,
      anonymous: state.isPrivate,
      nsfw: state.isNsfw,
      guide: state.quickReplies.filter(r => (r.content || '').trim())
    },
    data: {
      name: state.name,
      description: state.description,
      personality: state.personality,
      scenario: state.scenario,
      mes_example: state.mesExample,
      first_mes: state.greetings[0] || '',
      alternate_greetings: state.greetings.slice(1),
      creator_notes: state.creatorNotes,
      system_prompt: state.systemPrompt,
      creator: state.creatorName,
      tags: state.tags,
      character_book: state.worldBookEntries.length > 0
        ? {
            name: state.worldBookName || `${state.name}的世界书`,
            entries: state.worldBookEntries
          }
        : undefined,
      regex: state.regexEntries.length > 0 ? state.regexEntries : undefined
    }
  }
}

// 保存版本
const handleSave = async () => {
  if (!state.name.trim()) {
    toast.add({ title: '请输入角色名称', color: 'error' })
    return
  }
  state.saving = true
  try {
    const draft = buildCharacterData()
    if (state.amusementId && state.editingVersionId) {
      // 已有游戏，保存当前版本
      const { error } = await updateAmusementVersion({
        id: state.amusementId,
        version_id: state.editingVersionId,
        content: JSON.stringify(draft)
      })
      if (!error) {
        toast.add({ title: '保存成功', color: 'success' })
        await loadDetail(false)
      }
    } else {
      // 新增游戏
      const { data, error } = await updateAmusement({
        content: JSON.stringify(draft),
        image: draft.anohana?.image || '',
        source: draft.anohana?.source || false,
        source_url: draft.anohana?.source_url || '',
        summary: draft.anohana?.summary || '',
        avatar: draft.anohana?.avatar || '',
        anonymous: state.isPrivate,
        nsfw: state.isNsfw,
        guide: JSON.stringify(state.quickReplies.filter(r => (r.content || '').trim()))
      })
      if (!error && data?.id) {
        state.amusementId = data.id
        toast.add({ title: '保存成功', color: 'success' })
        await loadDetail(false)
        router.replace(`/amusement/detail/${data.id}`)
      }
    }
  } catch (e: any) {
    toast.add({ title: e.message || '保存失败', color: 'error' })
  } finally {
    state.saving = false
  }
}

// 发布版本
const handlePublish = async (versionId: number, options: { seeking?: number, state?: number, reason?: string }) => {
  if (!state.amusementId) {
    toast.add({ title: '请先保存', color: 'error' })
    return
  }
  state.publishing = true
  try {
    const params: any = { id: state.amusementId, version_id: versionId }
    if (options.seeking !== undefined) {
      params.seeking = options.seeking
    }
    if (options.state !== undefined) {
      params.state = options.state
    }
    if (options.reason) {
      params.reason = options.reason
    }
    const { error } = await submitAmusement(params)
    if (!error) {
      toast.add({ title: options.seeking === 2 ? '审核通过' : '操作成功', color: 'success' })
      await loadDetail(false)
    }
  } catch (e: any) {
    toast.add({ title: e.message || '操作失败', color: 'error' })
  } finally {
    state.publishing = false
  }
}

// 切换版本
const handleSwitchVersion = async (versionId: number) => {
  const version = state.versions.find(v => v.id === versionId)
  if (!version || !state.amusementId) return
  try {
    const { data } = await getAmusementVersionDetail({
      id: state.amusementId,
      version_id: versionId
    })
    if (data?.body) {
      const cardData = JSON.parse(data.body)
      applyCharacterCard(cardData)
      state.editingVersionId = versionId
      toast.add({ title: `已切换到版本 ${version.version}`, color: 'success' })
    }
  } catch (e: any) {
    toast.add({ title: e.message || '切换版本失败', color: 'error' })
  }
}

// 状态显示文本
const statusText = computed(() => {
  if (!state.amusementId) return '未保存'
  if (state.amusementDraft === 2) return '草稿'
  if (state.amusementState === 0) return '待审核'
  if (state.amusementState === 2) return '已通过'
  return '未通过'
})

const statusColor = computed(() => {
  if (!state.amusementId) return 'text-gray-400'
  if (state.amusementDraft === 2) return 'text-yellow-500'
  if (state.amusementState === 0) return 'text-blue-500'
  if (state.amusementState === 2) return 'text-green-500'
  return 'text-red-500'
})

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <ConfigLayout>
    <div class="flex h-[calc(100vh-4rem)]">
      <!-- 左侧导航 -->
      <div class="w-44 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div class="flex items-center justify-between px-4 py-3">
          <button
            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            @click="goBack"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            返回列表
          </button>
        </div>

        <nav class="flex-1 p-2 space-y-1">
          <button
            v-for="item in tabItems"
            :key="item.key"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            :class="activeTab === item.key
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click="activeTab = item.key as TabType"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <!-- 状态和操作 -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <!-- 版本切换 -->
          <USelectMenu
            v-if="state.versions.length > 0"
            :model-value="state.editingVersionId?.toString() || ''"
            :items="state.versions.map(v => ({
              label: `v${v.version}${v.id === state.reviewVersionId ? ' (使用中)' : v.id === state.currentVersionId && state.reviewVersionId !== state.currentVersionId ? ' (审核中)' : v.state === 2 ? ' (已发布)' : ''}`,
              value: v.id.toString()
            }))"
            value-key="value"
            size="sm"
            @update:model-value="handleSwitchVersion(Number($event))"
          />
          <!-- 状态显示 -->
          <div class="text-xs" :class="statusColor">
            {{ statusText }}
          </div>
          <UButton
            variant="outline"
            size="sm"
            class="w-full"
            :loading="state.saving"
            @click="handleSave"
          >
            <template #leading>
              <UIcon name="i-lucide-save" class="w-3 h-3" />
            </template>
            {{ state.amusementId ? '保存' : '新增保存' }}
          </UButton>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="flex-1 overflow-auto">
        <!-- 加载中 -->
        <div v-if="state.loading" class="flex items-center justify-center py-20">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
        </div>

        <template v-else>
          <!-- 概览 -->
          <AmusementDetailOverview
            v-if="activeTab === 'overview'"
            v-model:state="state"
            @save="handleSave"
          />

          <!-- 设定 -->
          <AmusementDetailSettings
            v-if="activeTab === 'settings'"
            v-model:state="state"
          />

          <!-- 世界书 -->
          <AmusementDetailWorldbook
            v-if="activeTab === 'worldbook'"
            v-model:state="state"
          />

          <!-- 正则 -->
          <AmusementDetailRegex
            v-if="activeTab === 'regex'"
            v-model:state="state"
          />

          <!-- 快速回复 -->
          <AmusementDetailQuickreply
            v-if="activeTab === 'quickreply'"
            v-model:state="state"
          />

          <!-- 版本 -->
          <AmusementDetailVersion
            v-if="activeTab === 'version'"
            v-model:state="state"
            @publish="handlePublish"
            @switch-version="handleSwitchVersion"
          />
        </template>
      </div>
    </div>
  </ConfigLayout>
</template>
