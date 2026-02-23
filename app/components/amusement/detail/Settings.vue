<script setup lang="ts">
import { getCommonTagList } from '@/api'

const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

// 全屏编辑
type FieldType = 'description' | 'summary' | 'firstMes' | 'personality' | 'scenario' | 'mesExample' | 'systemPrompt' | 'creatorNotes'
const showFullscreen = ref(false)
const fullscreenField = ref<FieldType>('description')
const fullscreenTitle = ref('')

const fieldTitles: Record<FieldType, string> = {
  description: '角色描述',
  summary: '角色简介',
  firstMes: '第一句话',
  personality: '个性',
  scenario: '场景',
  mesExample: '对话示例',
  systemPrompt: '系统提示词',
  creatorNotes: '创作者备注'
}

const openFullscreen = (field: FieldType) => {
  fullscreenField.value = field
  fullscreenTitle.value = fieldTitles[field]
  showFullscreen.value = true
}

const fullscreenValue = computed({
  get: () => {
    const f = fullscreenField.value
    if (f === 'firstMes') return localState.value.greetings[localState.value.currentGreetingIndex] || ''
    return localState.value[f] || ''
  },
  set: (val: string) => {
    const f = fullscreenField.value
    if (f === 'firstMes') {
      localState.value.greetings[localState.value.currentGreetingIndex] = val
    } else {
      localState.value[f] = val
    }
  }
})

// 标签相关
const MAX_TAGS = 10
const tagInput = ref('')
const presetTags = ref<string[]>([])
const discoverTags = ref<string[]>([])

// 获取标签列表
const fetchTags = async () => {
  try {
    const { data } = await getCommonTagList({ page: 1, pagesize: 50, ty: 0, state: 2 })
    const list = data?.list || []
    const tagNames = list.map((x: any) => String(x?.name || '').trim()).filter(Boolean)
    presetTags.value = [...new Set(tagNames)]
    shuffleTags()
  } catch {
    presetTags.value = []
    discoverTags.value = []
  }
}

// 随机打乱标签
const shuffleTags = () => {
  if (!presetTags.value.length) return
  const shuffled = [...presetTags.value].sort(() => Math.random() - 0.5)
  const n = Math.floor(Math.random() * 6) + 10
  discoverTags.value = shuffled.slice(0, n)
}

// 切换标签
const toggleTag = (tag: string) => {
  if (localState.value.tags.includes(tag)) {
    localState.value.tags = localState.value.tags.filter((t: string) => t !== tag)
  } else if (localState.value.tags.length < MAX_TAGS) {
    localState.value.tags.push(tag)
  } else {
    toast.add({ title: `最多只能添加 ${MAX_TAGS} 个标签`, color: 'error' })
  }
}

// 移除标签
const removeTag = (tag: string) => {
  localState.value.tags = localState.value.tags.filter((t: string) => t !== tag)
}

// 添加自定义标签
const addCustomTag = () => {
  const v = tagInput.value.trim()
  if (!v) return
  if (localState.value.tags.includes(v)) {
    toast.add({ title: '标签已存在', color: 'error' })
    return
  }
  if (localState.value.tags.length >= MAX_TAGS) {
    toast.add({ title: `最多只能添加 ${MAX_TAGS} 个标签`, color: 'error' })
    return
  }
  localState.value.tags.push(v)
  tagInput.value = ''
}

// 高级设置展开
const showAdvanced = ref(false)

// 第一句话操作
const prevGreeting = () => {
  if (localState.value.currentGreetingIndex > 0) {
    localState.value.currentGreetingIndex--
  }
}
const nextGreeting = () => {
  if (localState.value.currentGreetingIndex < localState.value.greetings.length - 1) {
    localState.value.currentGreetingIndex++
  }
}
const addGreeting = () => {
  localState.value.greetings.push('')
  localState.value.currentGreetingIndex = localState.value.greetings.length - 1
}
const removeGreeting = () => {
  if (localState.value.greetings.length > 1) {
    localState.value.greetings.splice(localState.value.currentGreetingIndex, 1)
    if (localState.value.currentGreetingIndex >= localState.value.greetings.length) {
      localState.value.currentGreetingIndex = localState.value.greetings.length - 1
    }
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
      角色设定详细信息
    </h1>

    <!-- 身份设定 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
        <UIcon name="i-lucide-settings-2" class="w-5 h-5" />
        <span class="font-medium">身份设定</span>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm text-gray-500 mb-2">角色名称</label>
          <UInput v-model="localState.name" placeholder="输入角色名称..." />
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-2">创作者</label>
          <UInput v-model="localState.creatorName" placeholder="输入创作者名称..." />
        </div>
      </div>

      <!-- 标签 -->
      <div>
        <label class="block text-sm text-gray-500 mb-2">标签</label>
        <!-- 已选标签 -->
        <div v-if="localState.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in localState.tags"
            :key="tag"
            class="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
          >
            {{ tag }}
            <button class="hover:opacity-70" @click="removeTag(tag)">
              <UIcon name="i-lucide-x" class="w-3 h-3" />
            </button>
          </span>
        </div>
        <!-- 预设标签 -->
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            class="px-3 py-1 text-sm rounded-full border bg-purple-50 text-purple-600 border-purple-300 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700 transition-colors"
            @click="shuffleTags"
          >
            换一批
          </button>
          <button
            v-for="tag in discoverTags.filter(t => !localState.tags.includes(t))"
            :key="tag"
            class="px-3 py-1 text-sm rounded-full border bg-white text-gray-600 border-gray-300 hover:border-gray-500 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700 transition-colors"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
        <!-- 自定义标签输入 -->
        <div class="flex gap-2 mb-2">
          <UInput
            v-model="tagInput"
            placeholder="输入自定义标签..."
            class="flex-1"
            @keyup.enter="addCustomTag"
          />
          <UButton variant="outline" @click="addCustomTag">
            <template #leading>
              <UIcon name="i-lucide-plus" class="w-4 h-4" />
            </template>
            添加
          </UButton>
        </div>
        <p class="text-xs text-gray-500">
          最多 {{ MAX_TAGS }} 个标签，已选 {{ localState.tags.length }} 个
        </p>
      </div>
    </div>

    <!-- 角色描述 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <UIcon name="i-lucide-user" class="w-5 h-5" />
          <span class="font-medium">角色描述</span>
        </div>
        <UButton variant="ghost" size="xs" @click="openFullscreen('description')">
          <UIcon name="i-lucide-maximize-2" class="w-4 h-4 mr-1" />
          全屏
        </UButton>
      </div>
      <UTextarea
        v-model="localState.description"
        placeholder="详细描述角色的外貌、性格..."
        :rows="6"
        class="w-full"
      />
    </div>

    <!-- 角色简介 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <UIcon name="i-lucide-file-text" class="w-5 h-5" />
          <span class="font-medium">角色简介</span>
          <span class="text-xs text-gray-400">用于角色卡片展示的简短介绍</span>
        </div>
        <UButton variant="ghost" size="xs" @click="openFullscreen('summary')">
          <UIcon name="i-lucide-maximize-2" class="w-4 h-4 mr-1" />
          全屏
        </UButton>
      </div>
      <UTextarea
        v-model="localState.summary"
        placeholder="简短介绍角色..."
        :rows="4"
        class="w-full"
      />
    </div>

    <!-- 对话行为 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <UIcon name="i-lucide-sparkles" class="w-5 h-5" />
          <span class="font-medium">对话行为</span>
        </div>
        <UButton variant="ghost" size="xs" @click="openFullscreen('firstMes')">
          <UIcon name="i-lucide-maximize-2" class="w-4 h-4 mr-1" />
          全屏
        </UButton>
      </div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ localState.currentGreetingIndex === 0 ? '第一句话 (主)' : '备用开场白' }}
          </span>
          <UBadge variant="soft" size="xs">
            {{ localState.currentGreetingIndex + 1 }} / {{ localState.greetings.length }}
          </UBadge>
        </div>
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            :disabled="localState.currentGreetingIndex === 0"
            @click="prevGreeting"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </UButton>
          <UButton
            variant="ghost"
            size="xs"
            :disabled="localState.currentGreetingIndex >= localState.greetings.length - 1"
            @click="nextGreeting"
          >
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </UButton>
          <UButton variant="ghost" size="xs" @click="addGreeting">
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
          </UButton>
          <UButton
            variant="ghost"
            size="xs"
            color="error"
            :disabled="localState.greetings.length <= 1"
            @click="removeGreeting"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
      <UTextarea
        v-model="localState.greetings[localState.currentGreetingIndex]"
        placeholder="输入第一句话..."
        :rows="6"
        class="w-full"
      />
    </div>

    <!-- 高级选项开关 -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-700 dark:text-gray-300">高级选项</span>
      <USwitch v-model="showAdvanced" />
    </div>

    <!-- 高级选项内容 -->
    <template v-if="showAdvanced">
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">个性 (personality)</label>
          <UButton variant="ghost" size="xs" @click="openFullscreen('personality')">
            <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
          </UButton>
        </div>
        <UTextarea
          v-model="localState.personality"
          placeholder="描述角色的个性特点..."
          :rows="5"
          class="w-full"
        />
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">场景 (scenario)</label>
          <UButton variant="ghost" size="xs" @click="openFullscreen('scenario')">
            <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
          </UButton>
        </div>
        <UTextarea
          v-model="localState.scenario"
          placeholder="描述角色所处的场景..."
          :rows="5"
          class="w-full"
        />
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">对话示例 (mes_example)</label>
          <UButton variant="ghost" size="xs" @click="openFullscreen('mesExample')">
            <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
          </UButton>
        </div>
        <UTextarea
          v-model="localState.mesExample"
          placeholder="提供对话示例..."
          :rows="6"
          class="w-full"
        />
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">系统提示词 (system_prompt)</label>
          <UButton variant="ghost" size="xs" @click="openFullscreen('systemPrompt')">
            <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
          </UButton>
        </div>
        <UTextarea
          v-model="localState.systemPrompt"
          placeholder="系统提示词..."
          :rows="5"
          class="w-full"
        />
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">创作者备注 (creator_notes)</label>
          <UButton variant="ghost" size="xs" @click="openFullscreen('creatorNotes')">
            <UIcon name="i-lucide-maximize-2" class="w-4 h-4" />
          </UButton>
        </div>
        <UTextarea
          v-model="localState.creatorNotes"
          placeholder="创作者备注..."
          :rows="4"
          class="w-full"
        />
      </div>
    </template>

    <!-- 全屏编辑弹窗 -->
    <UModal v-model:open="showFullscreen" :ui="{ width: 'max-w-4xl' }">
      <template #content>
        <div class="flex flex-col h-[80vh]">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ fullscreenTitle }}
            </h3>
            <UButton variant="ghost" size="sm" @click="showFullscreen = false">
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </UButton>
          </div>
          <div class="flex-1 p-6 overflow-hidden">
            <textarea
              v-model="fullscreenValue"
              class="w-full h-full p-4 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              :placeholder="`输入${fullscreenTitle}...`"
            />
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <UButton variant="outline" @click="showFullscreen = false">
              关闭
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
