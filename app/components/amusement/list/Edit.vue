<script setup lang="ts">
import { extractPNGChunk, buildCharacterFromCard } from '@/utils/character'
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { uploadFile, updateAmusement, addAmusement, getAmusementDetail, updateAmusementState } from '@/api'
import { useAuthStore } from '@/store'

// 获取当前用户信息
const authStore = useAuthStore()
const isSuperAdmin = computed(() => authStore.userInfo?.group_id === 99)

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  tagsOptions?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh', 'tags-options'])

const drawerVisible = computed({
  get() {
    return props.dialog
  },
  set(visible) {
    emit('update:dialog', visible)
  }
})

const closeModal = () => {
  drawerVisible.value = false
}

/* ================= Tabs ================= */
type Tab = 'card' | 'info' | 'dialogue' | 'world' | 'regex' | 'status'
const tab = ref<Tab>('card')

const tabItems = computed(() => {
  const items: Array<readonly [Tab, string]> = [
    ['info', '基础信息'],
    ['dialogue', '对话'],
    ['world', '世界书'],
    ['regex', '正则'],
    ['status', '状态管理']
  ]

  // 新增时才显示角色卡选项
  if (!props.currentForm?.id) {
    items.unshift(['card', '角色卡'] as const)
  }

  return items
})

/* ================= 表单 & 校验 ================= */
const formRef = useTemplateRef('formRef')
const fileRef = ref<HTMLInputElement>()
const pngInputRef = ref<HTMLInputElement>()
const jsonInputRef = ref<HTMLInputElement>()

/* ================= 下拉选项 ================= */
const sourceOptions = [
  { label: '原创', value: 0 },
  { label: '转载', value: 1 }
]

const anonymousOptions = [
  { label: '隐私', value: 2 },
  { label: '公开', value: 0 }
]

const positionOptions = [
  { label: '角色定义前', value: '0-0' },
  { label: '角色定义后', value: '1-0' },
  { label: '角色定义后-1', value: '2-0' },
  { label: '角色定义后-2', value: '3-0' },
  { label: '智能插入', value: '4-0' },
  { label: '智能插入-User', value: '4-1' },
  { label: '智能插入-AI', value: '4-2' },
  { label: '智能插入-System', value: '4-3' }
]

/* ================= 核心状态（唯一数据源） ================= */
const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {
    tag: [] as string[],
    name: '',
    avatar: '',
    summary: '',
    description: '',
    first_mes: '',
    scenario: '',
    mes_example: '',
    personality: '',
    system_prompt: '',
    character_version: '',
    source_url: '',
    guide: '',
    character_book: {
      name: '',
      entries: [] as Array<{
        keys: string[]
        content: string
        enabled: boolean
        insertion_order: number
      }>
    },
    regex_enabled: false,
    regex_rules: [] as { pattern: string, reply: string }[],
    opening_lines: [] as string[]
  } as any
})

const schema = z.object({
  anonymous: z.number(),
  source: z.number(),
  image: z.string().nonempty(),
  source_url: z.string().optional()
}).refine((data) => {
  // 如果是转载（source === 1），source_url 必填
  if (data.source === 1 && !data.source_url) {
    return false
  }
  return true
}, {
  message: '转载时必须填写来源地址',
  path: ['source_url']
})

const toast = useToast()

// 创建默认表单对象
function createDefaultForm(data: any = {}) {
  return {
    opening_lines: [],
    character_book: {
      name: '',
      entries: []
    },
    regex_enabled: false,
    regex_rules: [],
    ...data
  }
}

// 添加世界书条目
function addCharacterBookEntry() {
  state.form.character_book.entries.push({
    keys: [''],
    secondary_keys: [],
    content: '',
    enabled: true,
    constant: false,
    selective: false,
    use_regex: false,
    insertion_order: 0,
    priority: 0,
    extensions: {
      depth: 4,
      position: 0,
      role: 0,
      probability: 100,
      scan_depth: null
    }
  })
}

// 删除世界书条目
function removeCharacterBookEntry(index: string | number) {
  state.form.character_book.entries.splice(Number(index), 1)
}

// 添加关键词
function addKey(entry: any) {
  if (!entry.keys) entry.keys = []
  entry.keys.push('')
}

// 删除关键词
function removeKey(entry: any, index: string | number) {
  entry.keys?.splice(Number(index), 1)
}

// 获取插入位置的值
function getPositionValue(entry: any) {
  if (!entry.extensions) return '0-0'
  const position = entry.extensions.position || 0
  const role = entry.extensions.role || 0
  return `${position}-${role}`
}

// 更新插入位置
function updatePosition(entry: any, value: string) {
  if (!entry.extensions) {
    entry.extensions = {}
  }
  if (value) {
    const [position, role] = value.split('-').map(Number)
    entry.extensions.position = position
    entry.extensions.role = role
  }
}

// 切换 placement 选项
function togglePlacement(rule: any, value: number) {
  if (!rule.placement) {
    rule.placement = []
  }
  const index = rule.placement.indexOf(value)
  if (index > -1) {
    rule.placement.splice(index, 1)
  } else {
    rule.placement.push(value)
  }
}

// 检查 placement 是否选中
function isPlacementSelected(rule: any, value: number) {
  return rule.placement && rule.placement.includes(value)
}

// 添加正则规则
function addRegexRule() {
  state.form.regex_rules.push({
    id: String(state.form.regex_rules.length),
    scriptName: '',
    findRegex: '',
    replaceString: '',
    trimStrings: [],
    placement: [],
    disabled: false,
    markdownOnly: false,
    promptOnly: false,
    runOnEdit: false,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: null
  })
}

// 删除正则规则
function removeRegexRule(index: string | number) {
  state.form.regex_rules.splice(Number(index), 1)
}

/* ================= 状态管理 ================= */
// 处理状态管理标签页中的开关变化
async function handleStatusToggle(field: string, value: any) {
  if (!state.form.id) {
    toast.add({ title: '请先保存角色卡', color: 'warning' })
    return
  }

  // 先更新本地状态
  state.form[field] = value

  const { error } = await updateAmusementState({
    id: state.form.id,
    [field]: value
  })

  if (!error) {
    toast.add({ title: '更新成功', color: 'success' })
    emit('refresh')
  } else {
    toast.add({ title: '更新失败', color: 'error' })
    // 恢复原值
    if (field === 'state') {
      state.form[field] = value === 2 ? 4 : 2
    } else {
      state.form[field] = value ? 0 : 1
    }
  }
}

/* ================= 角色卡导入 ================= */
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  if (imageFormat(input.files[0])) {
    state.avatarLoading = true
    const { data } = await uploadFile({ image: input.files[0] })
    if (data) {
      state.form.image = data.uri
    }
    state.avatarLoading = false
  }
}

function onFileClick() {
  fileRef.value?.click()
}

async function onPngImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    state.avatarLoading = true
    const { charData } = await extractPNGChunk(file)
    const newChar = buildCharacterFromCard(charData, file)

    if (!newChar) {
      toast.add({ title: '导入失败：无效的角色卡数据', color: 'error' })
      return
    }

    // 填充表单数据
    Object.assign(state.form, newChar)

    // 切换到基础信息选项卡
    tab.value = 'info'

    toast.add({ title: '导入成功', color: 'success' })
  } catch (err: any) {
    console.error('导入 PNG 角色卡失败:', err)
    toast.add({ title: `导入失败：${err.message || '未知错误'}`, color: 'error' })
  } finally {
    state.avatarLoading = false
    // 清空文件选择，允许重新选择同一文件
    const input = e.target as HTMLInputElement
    if (input) input.value = ''
  }
}

async function onJsonImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    state.avatarLoading = true
    const text = await file.text()
    const jsonData = JSON.parse(text)

    if (!jsonData) {
      toast.add({ title: '导入失败：无效的 JSON 数据', color: 'error' })
      return
    }

    // 填充表单数据
    Object.assign(state.form, jsonData)

    // 切换到基础信息选项卡
    tab.value = 'info'

    toast.add({ title: '导入成功', color: 'success' })
  } catch (err: any) {
    console.error('导入 JSON 失败:', err)
    toast.add({ title: `导入失败：${err.message || 'JSON 格式错误'}`, color: 'error' })
  } finally {
    state.avatarLoading = false
    // 清空文件选择
    const input = e.target as HTMLInputElement
    if (input) input.value = ''
  }
}

// JSON 格式化
const jsonError = ref<string | null>(null)
const prettyJson = computed({
  get() {
    try {
      const obj = typeof state.form.body === 'string'
        ? JSON.parse(state.form.body)
        : state.form.body
      return JSON.stringify(obj, null, 2)
    } catch {
      return state.form.body
    }
  },
  set(val: string) {
    state.form.body = val
  }
})

/* ================= 提交 ================= */
async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)

    if (Array.isArray(postForm.tag)) {
      postForm.tag = postForm.tag.join(',')
    }

    // 如果是原创，删除 source_url 字段
    if (postForm.source === 0) {
      delete postForm.source_url
    }

    // JSON 校验和格式化
    try {
      const parsedBody = JSON.parse(postForm.body)
      jsonError.value = null
      postForm.content = JSON.stringify(parsedBody)
    } catch (err: any) {
      jsonError.value = err.message
      toast.add({ title: `JSON 格式错误: ${err.message}`, color: 'error' })
      return
    }
    // 提交数据
    const { error } = await (postForm.id ? updateAmusement : addAmusement)(postForm)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

const importItems = [
  {
    label: '导入 PNG 角色卡',
    icon: 'i-lucide-image',
    onSelect() {
      pngInputRef.value?.click()
    }
  },
  {
    label: '导入 JSON',
    icon: 'i-lucide-file-json',
    onSelect() {
      jsonInputRef.value?.click()
    }
  }
]

/* ================= 打开弹窗时初始化 ================= */
watch(
  () => props.dialog,
  async (val) => {
    if (!val) return
    state.loading = true
    jsonError.value = null
    try {
      if (props.currentForm?.id) {
        // 编辑模式：默认显示基础信息
        tab.value = 'info'
        const { data, error } = await getAmusementDetail({ biz_id: props.currentForm.id })
        if (!error && data) {
          state.form = createDefaultForm(data.info)
        } else {
          state.form = createDefaultForm(props.currentForm)
          toast.add({ title: '获取详情失败', color: 'error' })
        }
      } else {
        // 新增模式：默认显示角色卡
        tab.value = 'card'
        state.form = createDefaultForm(props.currentForm)
      }
    } catch {
      state.form = createDefaultForm(props.currentForm)
      toast.add({ title: '获取详情异常', color: 'error' })
    } finally {
      state.loading = false
    }
  }
)

watch(
  () => state.form.source,
  (newSource) => {
    // 如果切换为原创，清空来源地址
    if (newSource === 0) {
      state.form.source_url = ''
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="state.form.id ? '编辑' : '新增'"
    :description="state.form.id ? '编辑角色' : '新增角色'"

    :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }"
  >
    <template #body>
      <!-- 标签页导航 -->
      <div class="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-6">
        <div class="flex gap-2">
          <button
            v-for="[key, label] in tabItems"
            :key="key"
            type="button"
            class="px-5 py-3.5 text-sm transition-all relative rounded-t-lg"
            :class="tab === key
              ? 'text-white dark:text-white font-bold bg-blue-400 dark:bg-blue-400 shadow-lg'
              : 'text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800'"
            @click="tab = key as Tab"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="state.loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <UIcon
              name="i-material-symbols-progress-activity"
              class="w-12 h-12 text-primary-500 animate-spin mx-auto"
            />
            <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
              加载中...
            </p>
          </div>
        </div>

        <!-- 表单内容 -->
        <div v-else class="max-h-[60vh] overflow-y-auto pr-2">
          <!-- 角色卡导入 -->
          <div v-if="tab === 'card'" class="space-y-4">
            <div class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-primary-100 dark:border-primary-800">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <UIcon name="i-material-symbols-upload-file" class="w-6 h-6 text-primary-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    导入角色卡
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    支持导入 PNG 格式的角色卡或 JSON 配置文件
                  </p>
                  <UDropdownMenu :items="importItems">
                    <UButton
                      :loading="state.avatarLoading"
                      trailing-icon="i-material-symbols-keyboard-arrow-down"
                      size="lg"
                    >
                      <template #leading>
                        <UIcon name="i-material-symbols-download" />
                      </template>
                      选择导入方式
                    </UButton>
                  </UDropdownMenu>
                </div>
              </div>
            </div>

            <input
              ref="pngInputRef"
              type="file"
              class="hidden"
              accept=".png"
              @change="onPngImport"
            >
            <input
              ref="jsonInputRef"
              type="file"
              class="hidden"
              accept=".json"
              @change="onJsonImport"
            >
          </div>

          <!-- 基础信息 -->
          <div v-if="tab === 'info'">
            <UForm
              ref="formRef"
              :schema="schema"
              :state="state.form"
              class="flex flex-col gap-5"
              @submit="onSubmit"
            >
              <!-- 基本信息卡片 -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-5">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-primary-600" />
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    基本信息
                  </h4>
                </div>

                <UFormField label="角色名" name="name" required>
                  <UInput
                    v-model.trim="state.form.name"
                    placeholder="请输入角色名称"
                    class="w-full"
                    type="text"
                    size="lg"
                  >
                    <template #leading>
                      <UIcon name="i-material-symbols-person-outline" class="w-5 h-5 text-gray-400" />
                    </template>
                  </UInput>
                </UFormField>

                <UFormField
                  label="前导词语"
                  name="guide"
                  description="角色对话的前导提示词，可选填"
                >
                  <UTextarea
                    v-model.trim="state.form.guide"
                    placeholder="例如：你是一位友善的助手，擅长解答问题..."
                    :rows="3"
                    class="w-full"
                    size="lg"
                  />
                </UFormField>

                <div class="grid grid-cols-3 gap-4">
                  <UFormField label="来源" name="source" required>
                    <USelect
                      v-model="state.form.source"
                      :items="sourceOptions"
                      placeholder="请选择"
                      class="w-full"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField label="标签" name="tag">
                    <USelect
                      v-model="state.form.tag"
                      :items="tagsOptions"
                      multiple
                      placeholder="请选择标签"
                      class="w-full"
                      clearable
                      size="lg"
                    />
                  </UFormField>

                  <UFormField label="隐私" name="anonymous" required>
                    <USelect
                      v-model="state.form.anonymous"
                      :items="anonymousOptions"
                      placeholder="请选择"
                      class="w-full"
                      size="lg"
                    />
                  </UFormField>
                </div>

                <!-- 转载时显示来源地址 -->
                <UFormField
                  v-if="state.form.source === 1"
                  label="来源地址"
                  name="source_url"
                  description="请输入转载来源的网址"
                  required
                >
                  <UInput
                    v-model.trim="state.form.source_url"
                    placeholder="请输入来源地址，如：https://example.com"
                    class="w-full"
                    type="url"
                    size="lg"
                  >
                    <template #leading>
                      <UIcon name="i-material-symbols-link" class="w-5 h-5 text-gray-400" />
                    </template>
                    <template #trailing>
                      <UButton
                        v-if="state.form.source_url"
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-material-symbols-close"
                        @click="state.form.source_url = ''"
                      />
                    </template>
                  </UInput>
                </UFormField>
              </div>

              <!-- 封面图片卡片 -->
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
                <div class="flex items-center gap-2 mb-4">
                  <UIcon name="i-material-symbols-image-outline" class="w-5 h-5 text-primary-600" />
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    封面图片
                  </h4>
                </div>

                <UFormField
                  name="image"
                  description="JPG, JPEG or PNG. 1MB Max."
                >
                  <div class="flex items-center gap-4">
                    <div class="relative group">
                      <UAvatar
                        :src="state.form.image"
                        :alt="state.form.name"
                        size="2xl"
                        class="ring-2 ring-gray-200 dark:ring-gray-700"
                      />
                      <div
                        v-if="state.form.image"
                        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                      >
                        <UIcon name="i-material-symbols-edit" class="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div class="flex-1">
                      <UButton
                        :loading="state.avatarLoading"
                        color="neutral"
                        variant="outline"
                        size="lg"
                        @click="onFileClick"
                      >
                        <template #leading>
                          <UIcon name="i-material-symbols-upload" />
                        </template>
                        {{ state.form.image ? '更换图片' : '上传图片' }}
                      </UButton>
                      <input
                        ref="fileRef"
                        type="file"
                        class="hidden"
                        accept=".jpg, .jpeg, .png"
                        @change="onFileChange"
                      >
                    </div>
                  </div>
                </UFormField>
              </div>

              <!-- JSON 配置卡片 - 仅超级管理员可见 -->
              <div v-if="isSuperAdmin" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
                <UFormField label="角色数据 (JSON)" name="content">
                  <UTextarea
                    v-model="prettyJson"
                    class="w-full font-mono text-sm"
                    :rows="12"
                    placeholder="请输入 JSON"
                    :class="{ 'border-red-500 bg-red-50 dark:bg-red-900/20': jsonError }"
                  />
                  <div v-if="jsonError" class="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <UIcon name="i-material-symbols-error-outline" class="w-5 h-5" />
                    <span>JSON 错误: {{ jsonError }}</span>
                  </div>
                </UFormField>
              </div>
            </UForm>
          </div>

          <!-- 对话 -->
          <div v-if="tab === 'dialogue'" class="space-y-4">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-5 border border-blue-100 dark:border-blue-800 mb-6">
              <div class="flex items-start gap-3">
                <UIcon name="i-material-symbols-chat-outline" class="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    开场对话配置
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    设置角色的开场白和初始对话内容
                  </p>
                </div>
              </div>
            </div>

            <div
              v-for="(item, i) in state.form.opening_lines"
              :key="i"
              class="group rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 flex gap-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
            >
              <div class="flex flex-col items-center justify-center min-w-[60px] pt-2">
                <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span class="font-bold text-primary-600 dark:text-primary-400">{{ Number(i) + 1 }}</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">对话</span>
              </div>
              <UTextarea
                v-model="state.form.opening_lines[i]"
                placeholder="请输入对话内容..."
                class="flex-1"
                :rows="4"
                size="lg"
              />
              <UButton
                icon="i-material-symbols-delete-outline"
                color="error"
                variant="ghost"
                size="lg"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click="state.form.opening_lines.splice(i, 1)"
              />
            </div>

            <div class="pt-4">
              <UButton
                variant="outline"
                color="primary"
                size="lg"
                block
                @click="state.form.opening_lines.push('')"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-add-circle-outline" />
                </template>
                新增对话
              </UButton>
            </div>
          </div>

          <!-- 世界书 -->
          <div v-if="tab === 'world'" class="space-y-5">
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-5 border border-purple-100 dark:border-purple-800">
              <div class="flex items-start gap-3 mb-4">
                <UIcon name="i-material-symbols-public" class="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    世界观设定
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    定义角色所处的世界背景和设定
                  </p>
                </div>
              </div>
              <UFormField label="世界书名称">
                <UInput
                  v-model="state.form.character_book.name"
                  placeholder="例如：中世纪魔法世界"
                  size="lg"
                  class="w-full"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-book-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>
            </div>

            <!-- 世界条目 -->
            <div class="space-y-4">
              <div
                v-for="(entry, i) in state.form.character_book.entries"
                :key="i"
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span class="font-semibold text-purple-600 dark:text-purple-400 text-sm">{{ Number(i) + 1 }}</span>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">条目 {{ Number(i) + 1 }}</span>
                  </div>
                  <UButton
                    icon="i-material-symbols-delete-outline"
                    size="sm"
                    variant="ghost"
                    color="error"
                    @click="removeCharacterBookEntry(i)"
                  />
                </div>

                <!-- 表单字段 -->
                <div class="space-y-5">
                  <UFormField label="备注" class="w-full">
                    <UInput
                      v-model="entry.comment"
                      placeholder="备注说明"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="触发关键词" required class="w-full">
                    <div class="space-y-2">
                      <div v-for="(key, ki) in entry.keys" :key="ki" class="flex gap-2">
                        <UInput
                          v-model="entry.keys[ki]"
                          placeholder="输入关键词"
                          size="lg"
                          class="flex-1"
                        />
                        <UButton
                          icon="i-material-symbols-close"
                          size="lg"
                          variant="ghost"
                          color="error"
                          @click="removeKey(entry, ki)"
                        />
                      </div>
                      <UButton variant="soft" size="sm" @click="addKey(entry)">
                        <template #leading>
                          <UIcon name="i-material-symbols-add" />
                        </template>
                        添加关键词
                      </UButton>
                    </div>
                  </UFormField>

                  <UFormField label="内容" required class="w-full">
                    <UTextarea
                      v-model="entry.content"
                      placeholder="输入世界书内容..."
                      :rows="4"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <div class="grid grid-cols-3 gap-4">
                    <UFormField label="优先级" class="w-full">
                      <UInput
                        v-model.number="entry.insertion_order"
                        type="number"
                        placeholder="0"
                        size="lg"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="触发概率 (0%-100%)" class="w-full">
                      <UInput
                        v-model.number="entry.extensions.probability"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="100"
                        size="lg"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="记录深度" class="w-full">
                      <UInput
                        v-model.number="entry.extensions.depth"
                        type="number"
                        placeholder="4"
                        size="lg"
                        class="w-full"
                      />
                    </UFormField>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <UFormField label="深度扫描" class="w-full">
                      <UInput
                        v-model.number="entry.extensions.scan_depth"
                        type="number"
                        placeholder="留空使用默认值"
                        size="lg"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="插入位置" class="w-full">
                      <USelect
                        :model-value="getPositionValue(entry)"
                        :items="positionOptions"
                        placeholder="请选择插入位置"
                        size="lg"
                        class="w-full"
                        @update:model-value="updatePosition(entry, $event)"
                      />
                    </UFormField>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <UCheckbox v-model="entry.enabled" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">启用条目</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <UCheckbox v-model="entry.constant" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">常驻内存</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <UCheckbox v-model="entry.selective" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">选择性注入</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <UCheckbox v-model="entry.use_regex" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">使用正则</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <UButton
                variant="outline"
                color="primary"
                size="lg"
                block
                @click="addCharacterBookEntry"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-add-circle-outline" />
                </template>
                新增条目
              </UButton>
            </div>
          </div>

          <!-- 正则 -->
          <div v-if="tab === 'regex'" class="space-y-6">
            <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-5 border border-orange-100 dark:border-orange-800">
              <div class="flex items-start gap-3">
                <UIcon name="i-material-symbols-regular-expression" class="w-6 h-6 text-orange-600 mt-1" />
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    正则表达式回复
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    使用正则表达式匹配特定内容并自动回复
                  </p>
                  <div class="flex items-center gap-3 mt-4">
                    <USwitch v-model="state.form.regex_enabled" size="lg" />
                    <span class="text-gray-700 dark:text-gray-300 font-medium">
                      {{ state.form.regex_enabled ? '已启用' : '已禁用' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="state.form.regex_enabled" class="space-y-4">
              <div
                v-for="(rule, i) in state.form.regex_rules"
                :key="rule.id || i"
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <span class="font-semibold text-orange-600 dark:text-orange-400 text-sm">{{ Number(i) + 1 }}</span>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">规则 {{ Number(i) + 1 }}</span>
                  </div>
                  <UButton
                    icon="i-material-symbols-delete-outline"
                    size="sm"
                    variant="ghost"
                    color="error"
                    @click="removeRegexRule(i)"
                  />
                </div>

                <!-- 表单字段 -->
                <div class="space-y-5">
                  <UFormField label="脚本名称" class="w-full">
                    <UInput
                      v-model="rule.scriptName"
                      placeholder="输入脚本名称"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="查找正则" required class="w-full">
                    <UInput
                      v-model="rule.findRegex"
                      placeholder="输入正则表达式"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="替换字符串" class="w-full">
                    <UInput
                      v-model="rule.replaceString"
                      placeholder="输入替换内容"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="应用位置" class="w-full">
                    <div class="grid grid-cols-2 gap-3">
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox
                          :model-value="isPlacementSelected(rule, 0)"
                          @update:model-value="togglePlacement(rule, 0)"
                        />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">用户输入</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox
                          :model-value="isPlacementSelected(rule, 1)"
                          @update:model-value="togglePlacement(rule, 1)"
                        />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">AI 输出</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox
                          :model-value="isPlacementSelected(rule, 2)"
                          @update:model-value="togglePlacement(rule, 2)"
                        />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">快捷命令</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox
                          :model-value="isPlacementSelected(rule, 3)"
                          @update:model-value="togglePlacement(rule, 3)"
                        />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">世界信息</span>
                      </div>
                    </div>
                  </UFormField>

                  <UFormField label="其他选项" class="w-full">
                    <div class="grid grid-cols-2 gap-3">
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.disabled" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">禁用</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.markdownOnly" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">仅 Markdown</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.promptOnly" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">仅提示词</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.runOnEdit" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">编辑时运行</span>
                      </div>
                    </div>
                  </UFormField>
                </div>
              </div>
            </div>

            <div v-if="state.form.regex_enabled" class="pt-4">
              <UButton
                variant="outline"
                color="primary"
                size="lg"
                block
                @click="addRegexRule"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-add-circle-outline" />
                </template>
                新增规则
              </UButton>
            </div>
          </div>

          <!-- 状态管理 -->
          <div v-if="tab === 'status'" class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div class="flex items-center gap-2 mb-1">
                <UIcon name="i-material-symbols-settings-outline" class="w-5 h-5 text-primary-600" />
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  状态管理
                </h4>
              </div>

              <!-- 状态开关 -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    状态
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ state.form.state === 2 ? '正常' : '已删除' }}
                  </p>
                </div>
                <USwitch
                  :model-value="state.form.state === 2"
                  size="lg"
                  @update:model-value="handleStatusToggle('state', $event ? 2 : 4)"
                />
              </div>

              <!-- 推荐开关 -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    推荐
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ state.form.recommend ? '已推荐' : '未推荐' }}
                  </p>
                </div>
                <USwitch
                  :model-value="!!state.form.recommend"
                  size="lg"
                  @update:model-value="handleStatusToggle('recommend', $event ? 1 : 0)"
                />
              </div>

              <!-- 每日推荐开关 -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    每日推荐
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ state.form.day_recommend ? '已推荐' : '未推荐' }}
                  </p>
                </div>
                <USwitch
                  :model-value="!!state.form.day_recommend"
                  size="lg"
                  @update:model-value="handleStatusToggle('day_recommend', $event ? 1 : 0)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-material-symbols-info-outline" class="inline w-4 h-4" />
          {{ tab === 'status' ? '状态管理通过开关直接更新' : (state.form.id ? '修改后将更新角色信息' : '确认后将创建新角色') }}
        </div>
        <div class="flex gap-3">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
          >
            <template #leading>
              <UIcon name="i-material-symbols-close" />
            </template>
          </UButton>
          <UButton
            :loading="state.loading"
            :disabled="tab === 'status'"
            label="确认保存"
            variant="solid"
            size="lg"
            @click="formRef?.submit()"
          >
            <template #leading>
              <UIcon name="i-material-symbols-check" />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
