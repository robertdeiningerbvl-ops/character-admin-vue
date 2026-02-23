<script setup lang="ts">
import { getAmusementVersionDetail } from '@/api'

const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state', 'publish', 'switch-version'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

// 版本对比相关
const showCompareDialog = ref(false)
const compareLoading = ref(false)
const leftVersionId = ref<number | null>(null)
const rightVersionId = ref<number | null>(null)
const leftVersionData = ref<any>(null)
const rightVersionData = ref<any>(null)
const allFieldsData = ref<any[]>([])
const diffResults = ref<any[]>([])
const compareMode = ref<'all' | 'diff'>('all')

// 版本选项
const versionOptions = computed(() => {
  return localState.value.versions.map((v: any) => ({
    label: `v${v.version} - ${getStateLabel(v.state)}`,
    value: v.id
  }))
})

// 获取待审核版本
const pendingVersion = computed(() => {
  return localState.value.versions.find((v: any) => v.state === 1)
})

// 获取当前使用中的版本
const currentVersion = computed(() => {
  const reviewId = localState.value.reviewVersionId
  return localState.value.versions.find((v: any) => v.id === reviewId)
})

// 审核弹框
const showReviewDialog = ref(false)
const reviewVersionId = ref<number | null>(null)
const reviewState = ref<number>(2)
const rejectReason = ref('')

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStateLabel = (state: number) => {
  switch (state) {
    case 0: return '草稿'
    case 1: return '待审核'
    case 2: return '已发布'
    case 3: return '已拒绝'
    case 4: return '已删除'
    default: return '未知'
  }
}

const getStateColor = (state: number) => {
  switch (state) {
    case 0: return 'neutral'
    case 1: return 'warning'
    case 2: return 'success'
    case 3: return 'error'
    case 4: return 'neutral'
    default: return 'neutral'
  }
}

const canPublish = (version: any) => {
  return version.state === 1 || version.state === 2
}

const openReviewDialog = (versionId: number) => {
  reviewVersionId.value = versionId
  reviewState.value = 2
  rejectReason.value = ''
  showReviewDialog.value = true
}

const confirmReview = () => {
  if (reviewState.value === 3 && !rejectReason.value.trim()) {
    toast.add({ title: '请输入拒绝理由', color: 'error' })
    return
  }
  if (reviewState.value === 2) {
    emit('publish', reviewVersionId.value, { seeking: 2 })
  } else {
    emit('publish', reviewVersionId.value, { seeking: 3, reason: rejectReason.value })
  }
  showReviewDialog.value = false
}

// 字段配置 - 分组显示
const fieldGroups = [
  {
    name: '基础信息',
    icon: 'i-lucide-user',
    fields: [
      { key: 'data.name', label: '角色名称' },
      { key: 'data.creator', label: '创作者' },
      { key: 'data.tags', label: '标签' },
      { key: 'anohana.summary', label: '简介' }
    ]
  },
  {
    name: '角色设定',
    icon: 'i-lucide-file-text',
    fields: [
      { key: 'data.description', label: '描述' },
      { key: 'data.personality', label: '性格' },
      { key: 'data.scenario', label: '场景' },
      { key: 'data.system_prompt', label: '系统提示词' },
      { key: 'data.creator_notes', label: '创作者备注' }
    ]
  },
  {
    name: '对话内容',
    icon: 'i-lucide-message-square',
    fields: [
      { key: 'data.first_mes', label: '开场白' },
      { key: 'data.alternate_greetings', label: '备选开场白' },
      { key: 'data.mes_example', label: '对话示例' },
      { key: 'anohana.guide', label: '快速回复' }
    ]
  },
  {
    name: '扩展数据',
    icon: 'i-lucide-puzzle',
    fields: [
      { key: 'data.character_book', label: '世界书' },
      { key: 'data.regex', label: '正则规则' }
    ]
  },
  {
    name: '媒体资源',
    icon: 'i-lucide-image',
    fields: [
      { key: 'anohana.image', label: '背景图' },
      { key: 'anohana.avatar', label: '头像' }
    ]
  },
  {
    name: '发布设置',
    icon: 'i-lucide-settings',
    fields: [
      { key: 'anohana.source', label: '是否转载' },
      { key: 'anohana.source_url', label: '原作链接' },
      { key: 'anohana.anonymous', label: '匿名发布' },
      { key: 'anohana.nsfw', label: 'NSFW' }
    ]
  }
]

// 获取嵌套对象的值
const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// 格式化显示值
const formatValue = (val: any, isImage = false): string => {
  if (val === null || val === undefined || val === '') return '(空)'
  if (val === true) return '是'
  if (val === false) return '否'
  if (isImage && typeof val === 'string' && val.startsWith('http')) return val
  if (Array.isArray(val)) {
    if (val.length === 0) return '(空)'
    if (typeof val[0] === 'string') return val.join('\n')
    return JSON.stringify(val, null, 2)
  }
  if (typeof val === 'object') return JSON.stringify(val, null, 2)
  return String(val)
}

// 判断值是否相同
const isValueSame = (oldVal: any, newVal: any): boolean => {
  if (oldVal === newVal) return true
  if (oldVal == null && newVal == null) return true
  if (oldVal == null || newVal == null) return false
  return JSON.stringify(oldVal) === JSON.stringify(newVal)
}

// 判断是否是图片字段
const isImageField = (key: string): boolean => {
  return key.includes('image') || key.includes('avatar')
}

// 打开版本对比弹框
const openCompareDialog = () => {
  if (localState.value.versions.length < 2) {
    toast.add({ title: '至少需要2个版本才能对比', color: 'warning' })
    return
  }

  // 默认选择：左边选当前使用版本，右边选待审核版本
  if (currentVersion.value) {
    leftVersionId.value = currentVersion.value.id
  } else {
    leftVersionId.value = localState.value.versions[1]?.id || null
  }

  if (pendingVersion.value) {
    rightVersionId.value = pendingVersion.value.id
  } else {
    rightVersionId.value = localState.value.versions[0]?.id || null
  }

  showCompareDialog.value = true
  compareMode.value = 'all'
  loadCompareData()
}

// 加载对比数据
const loadCompareData = async () => {
  if (!leftVersionId.value || !rightVersionId.value) return
  if (!localState.value.amusementId) return

  compareLoading.value = true
  allFieldsData.value = []
  diffResults.value = []

  try {
    // 并行获取两个版本的数据
    const [leftRes, rightRes] = await Promise.all([
      getAmusementVersionDetail({
        id: localState.value.amusementId,
        version_id: leftVersionId.value
      }),
      getAmusementVersionDetail({
        id: localState.value.amusementId,
        version_id: rightVersionId.value
      })
    ])

    if (leftRes.error || !leftRes.data?.body) {
      toast.add({ title: '获取左侧版本失败', color: 'error' })
      return
    }
    if (rightRes.error || !rightRes.data?.body) {
      toast.add({ title: '获取右侧版本失败', color: 'error' })
      return
    }

    leftVersionData.value = JSON.parse(leftRes.data.body)
    rightVersionData.value = JSON.parse(rightRes.data.body)

    buildCompareData()
  } catch (e: any) {
    toast.add({ title: e.message || '对比失败', color: 'error' })
  } finally {
    compareLoading.value = false
  }
}

// 构建对比数据
const buildCompareData = () => {
  const results: any[] = []
  const diffs: any[] = []

  for (const group of fieldGroups) {
    const groupData = {
      name: group.name,
      icon: group.icon,
      fields: [] as any[]
    }

    for (const field of group.fields) {
      const leftVal = getNestedValue(leftVersionData.value, field.key)
      const rightVal = getNestedValue(rightVersionData.value, field.key)
      const isSame = isValueSame(leftVal, rightVal)
      const isImage = isImageField(field.key)

      const fieldData = {
        key: field.key,
        label: field.label,
        leftVal,
        rightVal,
        isSame,
        isImage
      }

      groupData.fields.push(fieldData)
      if (!isSame) {
        diffs.push({ ...fieldData, group: group.name })
      }
    }

    results.push(groupData)
  }

  allFieldsData.value = results
  diffResults.value = diffs
}

// 版本切换时重新加载
watch([leftVersionId, rightVersionId], () => {
  if (showCompareDialog.value && leftVersionId.value && rightVersionId.value) {
    loadCompareData()
  }
})

// 过滤显示的数据
const displayData = computed(() => {
  if (compareMode.value === 'diff') {
    return allFieldsData.value
      .map(group => ({
        ...group,
        fields: group.fields.filter((f: any) => !f.isSame)
      }))
      .filter(group => group.fields.length > 0)
  }
  return allFieldsData.value
})

// 获取版本信息
const getVersionInfo = (versionId: number | null) => {
  if (!versionId) return null
  return localState.value.versions.find((v: any) => v.id === versionId)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        版本管理
      </h1>
      <UButton
        v-if="localState.versions.length >= 2"
        variant="soft"
        color="primary"
        @click="openCompareDialog"
      >
        <template #leading>
          <UIcon name="i-lucide-git-compare" class="w-4 h-4" />
        </template>
        版本对比
      </UButton>
    </div>

    <!-- 版本状态卡片 -->
    <div v-if="currentVersion || pendingVersion" class="grid grid-cols-2 gap-4">
      <!-- 当前使用版本 -->
      <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-500" />
          <span class="font-medium text-green-700 dark:text-green-300">当前使用版本</span>
        </div>
        <div v-if="currentVersion" class="text-sm text-green-600 dark:text-green-400">
          <p>版本号: v{{ currentVersion.version }}</p>
          <p>发布时间: {{ formatDate(currentVersion.created_at) }}</p>
        </div>
        <div v-else class="text-sm text-gray-500">
          暂无发布版本
        </div>
      </div>

      <!-- 待审核版本 -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-lucide-clock" class="w-5 h-5 text-yellow-500" />
          <span class="font-medium text-yellow-700 dark:text-yellow-300">待审核版本</span>
        </div>
        <div v-if="pendingVersion" class="text-sm text-yellow-600 dark:text-yellow-400">
          <p>版本号: v{{ pendingVersion.version }}</p>
          <p>提交时间: {{ formatDate(pendingVersion.created_at) }}</p>
        </div>
        <div v-else class="text-sm text-gray-500">
          暂无待审核版本
        </div>
      </div>
    </div>

    <!-- 版本列表标题 -->
    <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <UIcon name="i-lucide-git-branch" class="w-5 h-5" />
      <span class="font-medium">全部版本</span>
      <UBadge color="neutral" variant="soft" size="xs">
        {{ localState.versions.length }}
      </UBadge>
    </div>

    <!-- 空状态 -->
    <div v-if="localState.versions.length === 0" class="p-16 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
      <UIcon name="i-lucide-git-branch" class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>暂无版本记录</p>
    </div>

    <!-- 版本列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="version in localState.versions"
        :key="version.id"
        class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl transition-all"
        :class="{
          'ring-2 ring-primary-500': version.id === localState.editingVersionId,
          'ring-2 ring-green-500': version.id === localState.reviewVersionId && version.id !== localState.editingVersionId,
          'ring-2 ring-yellow-500': version.state === 1 && version.id !== localState.editingVersionId
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="font-medium text-lg">v{{ version.version }}</span>
            <UBadge :color="getStateColor(version.state)" variant="soft" size="xs">
              {{ getStateLabel(version.state) }}
            </UBadge>
            <UBadge
              v-if="version.id === localState.editingVersionId"
              color="primary"
              variant="soft"
              size="xs"
            >
              当前编辑
            </UBadge>
            <UBadge
              v-if="version.id === localState.reviewVersionId"
              color="success"
              variant="soft"
              size="xs"
            >
              使用中
            </UBadge>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">{{ formatDate(version.created_at) }}</span>
            <UButton
              v-if="version.id !== localState.editingVersionId"
              size="xs"
              variant="ghost"
              @click="emit('switch-version', version.id)"
            >
              切换
            </UButton>
            <UButton
              v-if="canPublish(version)"
              size="xs"
              variant="outline"
              :loading="localState.publishing"
              @click="openReviewDialog(version.id)"
            >
              审核
            </UButton>
          </div>
        </div>
        <p v-if="version.remarks" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ version.remarks }}
        </p>
      </div>
    </div>
  </div>

  <!-- 审核弹框 -->
  <UModal v-model:open="showReviewDialog">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-primary-500" />
        <span class="font-semibold">版本审核</span>
      </div>
    </template>
    <template #body>
      <div class="p-5 space-y-5">
        <p class="text-sm text-gray-500">
          请选择审核结果
        </p>
        <div class="grid grid-cols-2 gap-4">
          <button
            :class="[
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              reviewState === 2
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            ]"
            @click="reviewState = 2"
          >
            <UIcon name="i-lucide-check-circle" :class="['w-8 h-8', reviewState === 2 ? 'text-green-500' : 'text-gray-400']" />
            <span :class="['text-sm font-medium', reviewState === 2 ? 'text-green-600' : 'text-gray-600']">通过</span>
          </button>
          <button
            :class="[
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              reviewState === 3
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            ]"
            @click="reviewState = 3"
          >
            <UIcon name="i-lucide-x-circle" :class="['w-8 h-8', reviewState === 3 ? 'text-red-500' : 'text-gray-400']" />
            <span :class="['text-sm font-medium', reviewState === 3 ? 'text-red-600' : 'text-gray-600']">拒绝</span>
          </button>
        </div>
        <div v-if="reviewState === 3">
          <label class="block text-sm text-gray-500 mb-2">拒绝理由</label>
          <UTextarea
            v-model="rejectReason"
            placeholder="请输入拒绝理由..."
            :rows="3"
            class="w-full"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="showReviewDialog = false">
          取消
        </UButton>
        <UButton :loading="localState.publishing" @click="confirmReview">
          确认
        </UButton>
      </div>
    </template>
  </UModal>

  <!-- 版本对比弹框 -->
  <UModal v-model:open="showCompareDialog" :ui="{ width: 'max-w-6xl' }">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-git-compare" class="w-5 h-5 text-primary-500" />
        <span class="font-semibold">版本对比</span>
        <UBadge
          v-if="diffResults.length > 0"
          color="warning"
          variant="soft"
          size="xs"
        >
          {{ diffResults.length }} 处差异
        </UBadge>
      </div>
    </template>
    <template #body>
      <div class="p-4 space-y-4">
        <!-- 版本选择器 -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">左侧版本（旧）</label>
            <USelectMenu
              v-model="leftVersionId"
              :items="versionOptions"
              value-key="value"
              placeholder="选择版本"
              class="w-full"
            />
            <div v-if="getVersionInfo(leftVersionId)" class="mt-2 text-xs text-gray-500">
              {{ formatDate(getVersionInfo(leftVersionId)?.created_at) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">右侧版本（新）</label>
            <USelectMenu
              v-model="rightVersionId"
              :items="versionOptions"
              value-key="value"
              placeholder="选择版本"
              class="w-full"
            />
            <div v-if="getVersionInfo(rightVersionId)" class="mt-2 text-xs text-gray-500">
              {{ formatDate(getVersionInfo(rightVersionId)?.created_at) }}
            </div>
          </div>
        </div>

        <!-- 显示模式切换 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              :variant="compareMode === 'all' ? 'solid' : 'ghost'"
              @click="compareMode = 'all'"
            >
              全部字段
            </UButton>
            <UButton
              size="xs"
              :variant="compareMode === 'diff' ? 'solid' : 'ghost'"
              @click="compareMode = 'diff'"
            >
              仅差异 ({{ diffResults.length }})
            </UButton>
          </div>
          <div v-if="compareLoading" class="flex items-center gap-2 text-sm text-gray-500">
            <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            加载中...
          </div>
        </div>

        <!-- 对比内容 -->
        <div v-if="!compareLoading" class="max-h-[60vh] overflow-y-auto space-y-4">
          <!-- 无数据 -->
          <div v-if="displayData.length === 0 && compareMode === 'diff'" class="py-12 text-center">
            <UIcon name="i-lucide-check-circle" class="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p class="text-gray-500">
              两个版本内容完全相同
            </p>
          </div>

          <!-- 分组显示 -->
          <div v-for="group in displayData" :key="group.name" class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <!-- 分组标题 -->
            <div class="px-4 py-3 bg-gray-100 dark:bg-gray-800 flex items-center gap-2">
              <UIcon :name="group.icon" class="w-4 h-4 text-gray-500" />
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ group.name }}</span>
            </div>

            <!-- 字段列表 -->
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="field in group.fields" :key="field.key" class="p-3">
                <!-- 字段名 -->
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ field.label }}</span>
                  <UBadge
                    v-if="!field.isSame"
                    color="warning"
                    variant="soft"
                    size="xs"
                  >
                    已修改
                  </UBadge>
                  <UBadge
                    v-else
                    color="success"
                    variant="soft"
                    size="xs"
                  >
                    相同
                  </UBadge>
                </div>

                <!-- 对比内容 -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- 左侧值 -->
                  <div class="min-h-[60px]">
                    <div class="text-xs text-gray-400 mb-1">
                      左侧版本
                    </div>
                    <!-- 图片预览 -->
                    <template v-if="field.isImage && field.leftVal">
                      <img :src="field.leftVal" class="w-20 h-20 object-cover rounded">
                    </template>
                    <!-- 文本内容 -->
                    <template v-else>
                      <pre
                        class="text-sm whitespace-pre-wrap break-all p-2 rounded max-h-32 overflow-auto"
                        :class="field.isSame ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'"
                      >{{ formatValue(field.leftVal) }}</pre>
                    </template>
                  </div>
                  <!-- 右侧值 -->
                  <div class="min-h-[60px]">
                    <div class="text-xs text-gray-400 mb-1">
                      右侧版本
                    </div>
                    <!-- 图片预览 -->
                    <template v-if="field.isImage && field.rightVal">
                      <img :src="field.rightVal" class="w-20 h-20 object-cover rounded">
                    </template>
                    <!-- 文本内容 -->
                    <template v-else>
                      <pre
                        class="text-sm whitespace-pre-wrap break-all p-2 rounded max-h-32 overflow-auto"
                        :class="field.isSame ? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'"
                      >{{ formatValue(field.rightVal) }}</pre>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <UButton variant="outline" @click="showCompareDialog = false">
          关闭
        </UButton>
      </div>
    </template>
  </UModal>
</template>
