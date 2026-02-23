<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updateCommonModelPreset, addCommonModelPreset } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')
const toast = useToast()

const typeOptions = [
  { label: '聊天预设', value: 0 },
  { label: '创作预设', value: 1 }
]

const roleOptions = [
  { label: 'system', value: 'system' },
  { label: 'user', value: 'user' },
  { label: 'assistant', value: 'assistant' }
]

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val) => { state.form.state = val ? 2 : 0 }
})

const state = reactive({
  loading: false,
  form: {} as any,
  params: {
    temperature: 1,
    top_p: 1,
    top_k: 40,
    frequency_penalty: 0,
    presence_penalty: 0,
    repetition_penalty: 1,
    openai_max_tokens: 4096,
    openai_max_context: 128000
  } as Record<string, number>,
  prompts: [] as any[],
  editingPrompt: null as any,
  editingIndex: -1,
  showPromptModal: false
})

const paramGroups = [
  {
    title: '生成控制',
    items: [
      { key: 'temperature', label: '温度', desc: '控制随机性', min: 0, max: 2, step: 0.01 },
      { key: 'top_p', label: 'Top P', desc: '核采样阈值', min: 0, max: 1, step: 0.01 },
      { key: 'top_k', label: 'Top K', desc: '候选词数量', min: 1, max: 100, step: 1 }
    ]
  },
  {
    title: '惩罚参数',
    items: [
      { key: 'frequency_penalty', label: '频率惩罚', desc: '降低重复词频率', min: -2, max: 2, step: 0.01 },
      { key: 'presence_penalty', label: '存在惩罚', desc: '鼓励新话题', min: -2, max: 2, step: 0.01 },
      { key: 'repetition_penalty', label: '重复惩罚', desc: '避免重复内容', min: 0, max: 2, step: 0.01 }
    ]
  },
  {
    title: 'Token 限制',
    items: [
      { key: 'openai_max_tokens', label: '最大输出', desc: '单次回复上限', min: 1, max: 32000, step: 1 },
      { key: 'openai_max_context', label: '上下文长度', desc: '总上下文窗口', min: 1, max: 200000, step: 1 }
    ]
  }
]

const parseContent = (content: string) => {
  try {
    const obj = JSON.parse(content)
    paramGroups.forEach(g => g.items.forEach((p) => {
      if (obj[p.key] !== undefined) state.params[p.key] = obj[p.key]
    }))
    state.prompts = Array.isArray(obj.prompts) ? obj.prompts : []
  } catch { resetParams() }
}

const resetParams = () => {
  state.params = {
    temperature: 1, top_p: 1, top_k: 40,
    frequency_penalty: 0, presence_penalty: 0, repetition_penalty: 1,
    openai_max_tokens: 4096, openai_max_context: 128000
  }
  state.prompts = []
}

const buildContent = () => JSON.stringify({ ...state.params, prompts: state.prompts })

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    postForm.content = buildContent()
    const { error } = await (postForm.id ? updateCommonModelPreset : addCommonModelPreset)(postForm)
    if (!error) {
      toast.add({ title: '保存成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally { state.loading = false }
}

// Drag & Drop
const dragIndex = ref<number | null>(null)
const onDragStart = (index: number) => {
  dragIndex.value = index
}
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}
const onDrop = (index: number) => {
  if (dragIndex.value === null || dragIndex.value === index) return
  const item = state.prompts.splice(dragIndex.value, 1)[0]
  if (item) state.prompts.splice(index, 0, item)
  dragIndex.value = null
}
const onDragEnd = () => {
  dragIndex.value = null
}

// Prompt Operations
const addPrompt = () => {
  state.editingPrompt = {
    identifier: '', name: '', enabled: true, role: 'system',
    system_prompt: false, marker: false, content: '',
    injection_depth: 4, injection_order: 100
  }
  state.editingIndex = -1
  state.showPromptModal = true
}

const editPrompt = (index: number) => {
  const prompt = state.prompts[index]
  if (!prompt) return
  state.editingPrompt = cloneDeep(prompt)
  state.editingIndex = index
  state.showPromptModal = true
}

const savePrompt = () => {
  if (!state.editingPrompt?.identifier || !state.editingPrompt?.name) {
    toast.add({ title: '请填写标识符和名称', color: 'error' })
    return
  }
  if (state.editingIndex === -1) state.prompts.push(state.editingPrompt)
  else state.prompts[state.editingIndex] = state.editingPrompt
  state.showPromptModal = false
}

const deletePrompt = (index: number) => {
  state.prompts.splice(index, 1)
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = cloneDeep(props.currentForm)
    if (state.form.content) parseContent(state.form.content)
    else resetParams()
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" title="模型预设" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-settings-2" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑预设' : '新建预设' }}</span>
      </div>
    </template>

    <template #body>
      <UForm ref="formRef" :state="state.form" @submit="onSubmit">
        <!-- 基本信息 -->
        <div class="mb-6 p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">基本信息</span>
          </div>
          <div class="flex gap-2">
            <UFormField label="预设名称" name="name" class="w-50">
              <UInput v-model.trim="state.form.name" placeholder="输入预设名称" />
            </UFormField>
            <UFormField label="类型" name="ty" class="w-[200px]">
              <USelect
                v-model="state.form.ty"
                :items="typeOptions"
                class="w-full"
                :ui="{ content: 'w-[200px]' }"
              />
            </UFormField>
            <UFormField label="状态" name="state" class="w-24">
              <div class="flex items-center h-9">
                <USwitch v-model="stateEnabled" />
                <span class="ml-2 text-sm">{{ stateEnabled ? '启用' : '关闭' }}</span>
              </div>
            </UFormField>
          </div>
        </div>

        <!-- 两栏布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <!-- 左侧：采样参数 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4 text-(--ui-primary)" />
              <span class="text-sm font-medium">采样参数</span>
            </div>
            <div class="space-y-4">
              <div v-for="group in paramGroups" :key="group.title" class="space-y-2">
                <div class="text-xs font-medium text-(--ui-text-muted) uppercase">
                  {{ group.title }}
                </div>
                <div v-for="param in group.items" :key="param.key" class="flex items-center gap-3 p-3 rounded-lg bg-(--ui-bg)">
                  <div class="w-24 shrink-0">
                    <div class="text-sm font-medium">
                      {{ param.label }}
                    </div>
                    <div class="text-xs text-(--ui-text-muted)">
                      {{ param.desc }}
                    </div>
                  </div>
                  <USlider
                    v-model="state.params[param.key]"
                    :min="param.min"
                    :max="param.max"
                    :step="param.step"
                    class="flex-1"
                    size="sm"
                  />
                  <UInput
                    v-model.number="state.params[param.key]"
                    type="number"
                    :min="param.min"
                    :max="param.max"
                    :step="param.step"
                    class="w-24 text-center"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：提示词 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-message-square-text" class="w-4 h-4 text-(--ui-primary)" />
                <span class="text-sm font-medium">提示词</span>
                <UBadge v-if="state.prompts.length" size="xs" color="primary">
                  {{ state.prompts.length }}
                </UBadge>
              </div>
              <UButton
                size="xs"
                icon="i-lucide-plus"
                label="添加"
                @click="addPrompt"
              />
            </div>

            <!-- 空状态 -->
            <div v-if="!state.prompts.length" class="flex flex-col items-center justify-center py-12 text-center">
              <UIcon name="i-lucide-file-text" class="w-10 h-10 text-(--ui-text-dimmed) mb-2" />
              <p class="text-sm text-(--ui-text-muted)">
                暂无提示词
              </p>
            </div>

            <!-- 列表 -->
            <div v-else class="space-y-2 max-h-[600px] overflow-y-auto">
              <div
                v-for="(prompt, index) in state.prompts"
                :key="prompt.identifier + index"
                draggable="true"
                class="group flex items-center gap-2 p-3 rounded-lg bg-(--ui-bg) cursor-grab hover:shadow-sm transition-all"
                :class="{ 'opacity-40': dragIndex === index }"
                @dragstart="onDragStart(index)"
                @dragover="onDragOver"
                @drop="onDrop(index)"
                @dragend="onDragEnd"
              >
                <div class="w-6 h-6 rounded bg-(--ui-bg-elevated) flex items-center justify-center text-xs text-(--ui-text-muted)">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="font-medium text-sm truncate">{{ prompt.name }}</span>
                    <UBadge
                      v-if="prompt.system_prompt"
                      size="xs"
                      color="info"
                      variant="subtle"
                    >
                      系统
                    </UBadge>
                    <UBadge
                      v-if="!prompt.enabled"
                      size="xs"
                      color="neutral"
                      variant="subtle"
                    >
                      禁用
                    </UBadge>
                  </div>
                  <div class="text-xs text-(--ui-text-muted)">
                    <code class="bg-(--ui-bg-elevated) px-1 rounded">{{ prompt.identifier }}</code>
                    · 深度 {{ prompt.injection_depth }} · 顺序 {{ prompt.injection_order }}
                  </div>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    @click="editPrompt(index)"
                  />
                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    @click="deletePrompt(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton :loading="state.loading" label="保存" @click="formRef?.submit()" />
    </template>
  </UModal>

  <!-- 提示词编辑弹窗 -->
  <UModal v-model:open="state.showPromptModal" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <span class="font-semibold">{{ state.editingIndex === -1 ? '添加提示词' : '编辑提示词' }}</span>
    </template>
    <template #body>
      <div v-if="state.editingPrompt" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="标识符" required>
            <UInput v-model="state.editingPrompt.identifier" placeholder="唯一标识" />
          </UFormField>
          <UFormField label="名称" required>
            <UInput v-model="state.editingPrompt.name" placeholder="显示名称" />
          </UFormField>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <UFormField label="角色">
            <USelect v-model="state.editingPrompt.role" :items="roleOptions" />
          </UFormField>
          <UFormField label="注入深度">
            <UInput v-model.number="state.editingPrompt.injection_depth" type="number" :min="0" />
          </UFormField>
          <UFormField label="注入顺序">
            <UInput v-model.number="state.editingPrompt.injection_order" type="number" :min="0" />
          </UFormField>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <USwitch v-model="state.editingPrompt.enabled" />
            <span class="text-sm">启用</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <USwitch v-model="state.editingPrompt.system_prompt" />
            <span class="text-sm">系统提示词</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <USwitch v-model="state.editingPrompt.marker" />
            <span class="text-sm">标记</span>
          </label>
        </div>
        <UFormField label="内容">
          <UTextarea
            v-model="state.editingPrompt.content"
            placeholder="提示词内容"
            :rows="12"
            class="font-mono w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="state.showPromptModal = false"
      />
      <UButton label="确定" @click="savePrompt" />
    </template>
  </UModal>
</template>
