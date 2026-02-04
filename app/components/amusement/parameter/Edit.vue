<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateAmusementParameter, addAmusementParameter } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

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

const formRef = useTemplateRef('formRef')

const schema = z.object({
  name: z.string().nonempty('名称不能为空'),
  state: z.number().min(0),
  ty: z.number().min(0)
})

const stateOptions = [
  { label: '删除', value: 9 },
  { label: '待审核', value: 2 },
  { label: '正常', value: 1 }
]

const tyOptions = [
  { label: '正则规则', value: 1 },
  { label: '世界观', value: 2 }
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

// 根据后端 Go 结构体定义的完整接口
interface CharacterBookExtension {
  position?: number
  exclude_recursion?: boolean
  display_index?: number
  probability?: number
  useProbability?: boolean
  depth?: number
  selectiveLogic?: number
  group?: string
  group_override?: boolean
  group_weight?: number
  prevent_recursion?: boolean
  scan_depth?: any
  match_whole_words?: any
  use_group_scoring?: boolean
  case_sensitive?: any
  automation_id?: string
  role?: number
  vectorized?: boolean
  sticky?: number
  cooldown?: number
  delay?: number
}

interface CharacterBookEntry {
  id?: number
  keys?: string[]
  secondary_keys?: string[]
  comment?: string
  content?: string
  constant?: boolean
  selective?: boolean
  insertion_order?: number
  priority?: number
  enabled?: boolean
  position?: string
  use_regex?: boolean
  extensions?: CharacterBookExtension
}

interface CharacterBook {
  name?: string
  entries?: CharacterBookEntry[]
}

interface RegexRule {
  id?: string
  scriptName?: string
  findRegex?: string
  replaceString?: string
  trimStrings?: string[]
  placement?: number[]
  disabled?: boolean
  markdownOnly?: boolean
  promptOnly?: boolean
  runOnEdit?: boolean
  substituteRegex?: number
  minDepth?: any
  maxDepth?: any
}

interface ParameterForm {
  id?: number
  name: string
  ty: number
  state: number
  content?: string
  regex?: RegexRule[]
  regex_enabled?: boolean
  character_book?: CharacterBook
}

const state = reactive({
  loading: false,
  form: {
    name: '',
    ty: 1,
    state: 1,
    regex_enabled: false,
    regex: [],
    character_book: {
      name: '',
      entries: []
    }
  } as ParameterForm
})

const toast = useToast()

// 添加正则规则
const addRegexRule = () => {
  if (!state.form.regex) {
    state.form.regex = []
  }
  state.form.regex.push({
    id: '',
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
const removeRegexRule = (index: number) => {
  state.form.regex?.splice(index, 1)
}

// 切换 placement 选项
const togglePlacement = (rule: any, value: number) => {
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
const isPlacementSelected = (rule: any, value: number) => {
  return rule.placement && rule.placement.includes(value)
}

// 获取插入位置的值（用于显示）
const getPositionValue = (entry: any) => {
  if (!entry.extensions) return '0-0'
  const position = entry.extensions.position || 0
  const role = entry.extensions.role || 0
  return `${position}-${role}`
}

// 更新插入位置
const updatePosition = (entry: any, value: string) => {
  if (!entry.extensions) {
    entry.extensions = {}
  }
  if (value) {
    const [position, role] = value.split('-').map(Number)
    entry.extensions.position = position
    entry.extensions.role = role
  }
}

// 添加世界书条目
const addCharacterBookEntry = () => {
  if (!state.form.character_book) {
    state.form.character_book = { name: '', entries: [] }
  }
  if (!state.form.character_book.entries) {
    state.form.character_book.entries = []
  }
  state.form.character_book.entries.push({
    id: 0,
    keys: [],
    secondary_keys: [],
    comment: '',
    content: '',
    constant: false,
    selective: false,
    insertion_order: 0,
    priority: 0,
    enabled: true,
    position: '',
    use_regex: false,
    extensions: {
      position: 0,
      exclude_recursion: false,
      display_index: 0,
      probability: 100,
      useProbability: false,
      depth: 4,
      selectiveLogic: 0,
      group: '',
      group_override: false,
      group_weight: 0,
      prevent_recursion: false,
      scan_depth: null,
      match_whole_words: null,
      use_group_scoring: false,
      case_sensitive: null,
      automation_id: '',
      role: 0,
      vectorized: false,
      sticky: 0,
      cooldown: 0,
      delay: 0
    }
  })
}

// 删除世界书条目
const removeCharacterBookEntry = (index: number) => {
  state.form.character_book?.entries?.splice(index, 1)
}

// 添加关键词
const addKey = (entry: CharacterBookEntry) => {
  if (!entry.keys) entry.keys = []
  entry.keys.push('')
}

// 删除关键词
const removeKey = (entry: CharacterBookEntry, index: number) => {
  entry.keys?.splice(index, 1)
}

// 提交表单
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)

  // 根据 ty 类型构建 content
  // ty=1: content 是 RegexRule[] 数组
  // ty=2: content 是 CharacterBook 对象
  if (postForm.ty === 1) {
    // 正则规则：content 是数组
    postForm.content = JSON.stringify(postForm.regex || [])
  } else if (postForm.ty === 2) {
    // 世界书：content 是对象
    postForm.content = JSON.stringify(postForm.character_book || { name: '', entries: [] })
  }

  // 删除临时字段
  delete postForm.regex_enabled
  delete postForm.regex
  delete postForm.character_book

  const { error } = await (postForm.id ? updateAmusementParameter : addAmusementParameter)(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
    closeModal()
  }
  state.loading = false
}

// 监听弹窗打开
watch(
  () => props.dialog,
  (val) => {
    if (val) {
      if (props.currentForm?.id) {
        // 编辑模式：根据 ty 类型解析 content
        const form = cloneDeep(props.currentForm)

        console.log('编辑模式 - 原始数据:', form)

        // 初始化默认值
        form.regex_enabled = false
        form.regex = []
        form.character_book = { name: '', entries: [] }

        // 解析 content 字段
        if (form.content) {
          try {
            const contentData = typeof form.content === 'string'
              ? JSON.parse(form.content)
              : form.content

            console.log('解析后的 content 数据:', contentData)
            console.log('参数类型 ty:', form.ty)

            // 根据 ty 类型解析 content
            // ty=1: content 是 RegexRule[] 数组
            // ty=2: content 是 CharacterBook 对象
            if (form.ty === 1) {
              // 正则规则：content 应该是数组
              if (Array.isArray(contentData)) {
                console.log('解析正则规则数组')
                form.regex_enabled = true
                form.regex = contentData.map((rule: any) => ({
                  id: rule.id || '',
                  scriptName: rule.scriptName || '',
                  findRegex: rule.findRegex || '',
                  replaceString: rule.replaceString || '',
                  trimStrings: rule.trimStrings || [],
                  placement: rule.placement || [],
                  disabled: rule.disabled || false,
                  markdownOnly: rule.markdownOnly || false,
                  promptOnly: rule.promptOnly || false,
                  runOnEdit: rule.runOnEdit || false,
                  substituteRegex: rule.substituteRegex || 0,
                  minDepth: rule.minDepth || null,
                  maxDepth: rule.maxDepth || null
                }))
              }
            } else if (form.ty === 2) {
              // 世界书：content 应该是对象
              console.log('解析世界书对象')
              form.character_book = {
                name: contentData.name || '',
                entries: []
              }

              // 展开 entries 数组
              if (contentData.entries && Array.isArray(contentData.entries)) {
                form.character_book.entries = contentData.entries.map((entry: any) => ({
                  id: entry.id || 0,
                  keys: entry.keys || [],
                  secondary_keys: entry.secondary_keys || [],
                  comment: entry.comment || '',
                  content: entry.content || '',
                  constant: entry.constant || false,
                  selective: entry.selective || false,
                  insertion_order: entry.insertion_order || 0,
                  priority: entry.priority || 0,
                  enabled: entry.enabled !== undefined ? entry.enabled : true,
                  position: entry.position || '',
                  use_regex: entry.use_regex || false,
                  extensions: entry.extensions
                    ? {
                        position: entry.extensions.position || 0,
                        exclude_recursion: entry.extensions.exclude_recursion || false,
                        display_index: entry.extensions.display_index || 0,
                        probability: entry.extensions.probability || 100,
                        useProbability: entry.extensions.useProbability || false,
                        depth: entry.extensions.depth || 4,
                        selectiveLogic: entry.extensions.selectiveLogic || 0,
                        group: entry.extensions.group || '',
                        group_override: entry.extensions.group_override || false,
                        group_weight: entry.extensions.group_weight || 0,
                        prevent_recursion: entry.extensions.prevent_recursion || false,
                        scan_depth: entry.extensions.scan_depth || null,
                        match_whole_words: entry.extensions.match_whole_words || null,
                        use_group_scoring: entry.extensions.use_group_scoring || false,
                        case_sensitive: entry.extensions.case_sensitive || null,
                        automation_id: entry.extensions.automation_id || '',
                        role: entry.extensions.role || 0,
                        vectorized: entry.extensions.vectorized || false,
                        sticky: entry.extensions.sticky || 0,
                        cooldown: entry.extensions.cooldown || 0,
                        delay: entry.extensions.delay || 0
                      }
                    : {
                        position: 0,
                        exclude_recursion: false,
                        display_index: 0,
                        probability: 100,
                        useProbability: false,
                        depth: 4,
                        selectiveLogic: 0,
                        group: '',
                        group_override: false,
                        group_weight: 0,
                        prevent_recursion: false,
                        scan_depth: null,
                        match_whole_words: null,
                        use_group_scoring: false,
                        case_sensitive: null,
                        automation_id: '',
                        role: 0,
                        vectorized: false,
                        sticky: 0,
                        cooldown: 0,
                        delay: 0
                      }
                }))
              }
            }

            console.log('展开后的表单数据:', {
              regex_enabled: form.regex_enabled,
              regex: form.regex,
              character_book: form.character_book
            })
          } catch (err) {
            console.error('解析 content 失败:', err, '原始 content:', form.content)
            toast.add({ title: '解析参数数据失败', color: 'error' })
          }
        } else {
          console.warn('content 字段为空')
        }

        state.form = form
        console.log('最终表单状态:', state.form)
      } else {
        // 新增模式：使用默认值
        console.log('新增模式')
        state.form = {
          name: '',
          ty: 1,
          state: 1,
          regex_enabled: false,
          regex: [],
          character_book: { name: '', entries: [] }
        }
      }
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="state.form.id ? '编辑参数' : '新增参数'"
    :description="state.form.id ? '编辑参数配置' : '新增参数配置'"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-6xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="max-h-[75vh] overflow-y-auto p-6">
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="flex flex-col gap-5"
          @submit="onSubmit"
        >
          <!-- 基本信息 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div class="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
              <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-primary-600" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                基本信息
              </h4>
            </div>

            <UFormField
              label="参数名称"
              name="name"
              required
              class="w-full"
            >
              <UInput
                v-model.trim="state.form.name"
                placeholder="请输入参数名称"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="参数类型"
                name="ty"
                required
                class="w-full"
              >
                <USelect
                  v-model="state.form.ty"
                  :items="tyOptions"
                  placeholder="请选择类型"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="参数状态"
                name="state"
                required
                class="w-full"
              >
                <USelect
                  v-model="state.form.state"
                  :items="stateOptions"
                  placeholder="请选择状态"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>

          <!-- 正则规则配置 (ty === 1) -->
          <div v-if="state.form.ty === 1" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <UIcon name="i-material-symbols-regular-expression" class="w-5 h-5 text-orange-600" />
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  正则表达式配置
                </h4>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ state.form.regex_enabled ? '已启用' : '已禁用' }}
                </span>
                <USwitch v-model="state.form.regex_enabled" />
              </div>
            </div>

            <div v-if="state.form.regex_enabled" class="space-y-4">
              <div
                v-for="(rule, i) in state.form.regex"
                :key="i"
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <span class="font-semibold text-orange-600 dark:text-orange-400 text-sm">{{ i + 1 }}</span>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">规则 {{ i + 1 }}</span>
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
                      placeholder="可选"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="查找正则" required class="w-full">
                    <UInput
                      v-model="rule.findRegex"
                      placeholder="例如：^hello|你好"
                      class="font-mono w-full"
                      size="lg"
                    />
                  </UFormField>

                  <UFormField label="替换内容" required class="w-full">
                    <UTextarea
                      v-model="rule.replaceString"
                      placeholder="匹配成功后的替换内容..."
                      :rows="3"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="生效位置" class="w-full" description="留空表示所有位置生效">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox :model-value="isPlacementSelected(rule, 1)" @update:model-value="togglePlacement(rule, 1)" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">用户输入</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox :model-value="isPlacementSelected(rule, 2)" @update:model-value="togglePlacement(rule, 2)" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">AI输出</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox :model-value="isPlacementSelected(rule, 3)" @update:model-value="togglePlacement(rule, 3)" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">快捷命令</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox :model-value="isPlacementSelected(rule, 4)" @update:model-value="togglePlacement(rule, 4)" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">世界信息</span>
                      </div>
                    </div>
                  </UFormField>

                  <UFormField label="其他选项" class="w-full">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.disabled" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">禁用规则</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.markdownOnly" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">仅Markdown</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.promptOnly" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">仅Prompt</span>
                      </div>
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <UCheckbox v-model="rule.runOnEdit" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">编辑时运行</span>
                      </div>
                    </div>
                  </UFormField>
                </div>
              </div>

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
                新增正则规则
              </UButton>
            </div>
          </div>

          <!-- 世界书配置 (ty === 2) -->
          <div v-if="state.form.ty === 2" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <div class="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
              <UIcon name="i-material-symbols-public" class="w-5 h-5 text-purple-600" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                世界书设定
              </h4>
            </div>

            <UFormField label="世界书名称">
              <UInput
                v-model="state.form.character_book!.name"
                placeholder="例如：中世纪魔法世界"
                size="lg"
              />
            </UFormField>

            <div class="space-y-4">
              <div
                v-for="(entry, i) in state.form.character_book!.entries"
                :key="i"
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <!-- 标题栏 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span class="font-semibold text-purple-600 dark:text-purple-400 text-sm">{{ i + 1 }}</span>
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">条目 {{ i + 1 }}</span>
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
                      <div v-for="(key, ki) in (entry.keys || [])" :key="ki" class="flex gap-2">
                        <UInput
                          v-model="entry.keys![ki]"
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
                        v-model.number="entry.extensions!.probability"
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
                        v-model.number="entry.extensions!.depth"
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
                        v-model.number="entry.extensions!.scan_depth"
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
                新增世界书条目
              </UButton>
            </div>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-material-symbols-info-outline" class="inline w-4 h-4" />
          {{ state.form.id ? '修改后将更新参数配置' : '确认后将创建新参数' }}
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
