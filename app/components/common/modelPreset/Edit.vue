<script setup lang="ts">
import * as z from 'zod'
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

/* ================= Dialog Control ================= */
const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

/* ================= Form ================= */
const formRef = useTemplateRef('formRef')
const toast = useToast()

const schema = z.object({
  name: z.string().nonempty('预设名称不能为空'),
  state: z.number().min(0)
})

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '关闭', value: 1 }
]

const roleOptions = [
  { label: 'system', value: 'system' },
  { label: 'user', value: 'user' },
  { label: 'assistant', value: 'assistant' }
]

const state = reactive({
  loading: false,
  form: {} as any,
  activeTab: 'params',
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
// 采样参数配置
const paramGroups = [
  {
    title: '生成控制',
    icon: 'lucide:sliders-horizontal',
    items: [
      { key: 'temperature', label: '温度', desc: '控制随机性', min: 0, max: 2, step: 0.01 },
      { key: 'top_p', label: 'Top P', desc: '核采样阈值', min: 0, max: 1, step: 0.01 },
      { key: 'top_k', label: 'Top K', desc: '候选词数量', min: 1, max: 100, step: 1 }
    ]
  },
  {
    title: '惩罚参数',
    icon: 'lucide:shield',
    items: [
      { key: 'frequency_penalty', label: '频率惩罚', desc: '降低重复词频率', min: -2, max: 2, step: 0.01 },
      { key: 'presence_penalty', label: '存在惩罚', desc: '鼓励新话题', min: -2, max: 2, step: 0.01 },
      { key: 'repetition_penalty', label: '重复惩罚', desc: '避免重复内容', min: 0, max: 2, step: 0.01 }
    ]
  },
  {
    title: 'Token 限制',
    icon: 'lucide:hash',
    items: [
      { key: 'openai_max_tokens', label: '最大输出', desc: '单次回复上限', min: 1, max: 32000, step: 1 },
      { key: 'openai_max_context', label: '上下文长度', desc: '总上下文窗口', min: 1, max: 200000, step: 1 }
    ]
  }
]

/* ================= Content Parsing ================= */
const parseContent = (content: string) => {
  try {
    const obj = JSON.parse(content)
    paramGroups.forEach(g => g.items.forEach((p) => {
      if (obj[p.key] !== undefined) {
        state.params[p.key] = obj[p.key]
      }
    }))
    state.prompts = Array.isArray(obj.prompts) ? obj.prompts : []
  } catch {
    resetParams()
  }
}

const resetParams = () => {
  state.params = {
    temperature: 1,
    top_p: 1,
    top_k: 40,
    frequency_penalty: 0,
    presence_penalty: 0,
    repetition_penalty: 1,
    openai_max_tokens: 4096,
    openai_max_context: 128000
  }
  state.prompts = []
}

const buildContent = () => {
  return JSON.stringify({
    ...state.params,
    prompts: state.prompts
  })
}

/* ================= Form Submit ================= */
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
  } finally {
    state.loading = false
  }
}

/* ================= Drag & Drop ================= */
const dragIndex = ref<number | null>(null)

const onDragStart = (index: number) => {
  dragIndex.value = index
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const onDrop = (index: number) => {
  if (dragIndex.value === null || dragIndex.value === index) return

  const removed = state.prompts.splice(dragIndex.value, 1)
  const item = removed[0]
  if (!item) return

  state.prompts.splice(index, 0, item)
  dragIndex.value = null
}

const onDragEnd = () => {
  dragIndex.value = null
}

/* ================= Prompt Operations ================= */
const addPrompt = () => {
  state.editingPrompt = {
    identifier: '',
    name: '',
    enabled: true,
    role: 'system',
    system_prompt: false,
    marker: false,
    content: '',
    injection_depth: 4,
    injection_order: 100
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
  if (!state.editingPrompt) return

  if (!state.editingPrompt.identifier || !state.editingPrompt.name) {
    toast.add({ title: '请填写标识符和名称', color: 'error' })
    return
  }

  if (state.editingIndex === -1) {
    state.prompts.push(state.editingPrompt)
  } else {
    state.prompts[state.editingIndex] = state.editingPrompt
  }

  state.showPromptModal = false
}

const deletePrompt = (index: number) => {
  state.prompts.splice(index, 1)
}

/* ================= Watchers ================= */
watch(
  () => props.dialog,
  (val) => {
    if (val) {
      state.loading = false
      state.activeTab = 'params'
      state.form = cloneDeep(props.currentForm)
      if (state.form.content) {
        parseContent(state.form.content)
      } else {
        resetParams()
      }
    }
  }
)
</script>

<template>
  <USlideover
    v-model:open="drawerVisible"
    :title="currentForm.id ? '编辑预设' : '新建预设'"
    description="配置模型采样参数和提示词"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">预设名称</label>
            <UInput v-model.trim="state.form.name" placeholder="输入预设名称" size="lg" />
          </div>
          <div class="w-32">
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">状态</label>
            <USelect v-model="state.form.state" :items="stateOptions" size="lg" />
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="flex gap-2 p-1 rounded-xl bg-(--ui-bg-elevated) mb-6">
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="state.activeTab === 'params'
              ? 'bg-(--ui-bg) text-(--ui-text-highlighted) shadow-sm'
              : 'text-(--ui-text-muted) hover:text-(--ui-text)'"
            @click="state.activeTab = 'params'"
          >
            <UIcon name="lucide:sliders-horizontal" class="size-4" />
            采样参数
          </button>
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="state.activeTab === 'prompts'
              ? 'bg-(--ui-bg) text-(--ui-text-highlighted) shadow-sm'
              : 'text-(--ui-text-muted) hover:text-(--ui-text)'"
            @click="state.activeTab = 'prompts'"
          >
            <UIcon name="lucide:message-square-text" class="size-4" />
            提示词
            <UBadge
              v-if="state.prompts.length"
              size="xs"
              color="primary"
              variant="solid"
            >
              {{ state.prompts.length }}
            </UBadge>
          </button>
        </div>

        <!-- 采样参数 -->
        <div v-show="state.activeTab === 'params'" class="space-y-6">
          <div v-for="group in paramGroups" :key="group.title">
            <div class="flex items-center gap-2 mb-4">
              <div class="size-7 rounded-lg bg-(--ui-bg-elevated) flex items-center justify-center">
                <UIcon :name="group.icon" class="size-4 text-(--ui-text-muted)" />
              </div>
              <span class="text-sm font-medium text-(--ui-text-highlighted)">{{ group.title }}</span>
            </div>

            <div class="grid gap-4">
              <div
                v-for="param in group.items"
                :key="param.key"
                class="flex items-center gap-4 p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg) hover:border-(--ui-border-accented) transition-colors"
              >
                <div class="w-28 shrink-0">
                  <p class="text-sm font-medium text-(--ui-text-highlighted)">
                    {{ param.label }}
                  </p>
                  <p class="text-xs text-(--ui-text-muted)">
                    {{ param.desc }}
                  </p>
                </div>
                <div class="flex-1">
                  <USlider
                    v-model="state.params[param.key]"
                    :min="param.min"
                    :max="param.max"
                    :step="param.step"
                    size="sm"
                  />
                </div>
                <UInput
                  v-model.number="state.params[param.key]"
                  type="number"
                  :min="param.min"
                  :max="param.max"
                  :step="param.step"
                  class="w-28 text-center"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 提示词列表 -->
        <div v-show="state.activeTab === 'prompts'" class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-(--ui-text-muted)">
              <UIcon name="lucide:info" class="size-4 inline-block mr-1" />
              拖拽条目可调整顺序
            </p>
            <UButton
              size="sm"
              icon="lucide:plus"
              label="添加条目"
              @click="addPrompt"
            />
          </div>

          <!-- 空状态 -->
          <div
            v-if="!state.prompts.length"
            class="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-(--ui-border)"
          >
            <div class="size-16 rounded-2xl bg-(--ui-bg-elevated) flex items-center justify-center mb-4">
              <UIcon name="lucide:file-text" class="size-8 text-(--ui-text-dimmed)" />
            </div>
            <p class="text-(--ui-text-muted) mb-1">
              暂无提示词条目
            </p>
            <p class="text-sm text-(--ui-text-dimmed) mb-4">
              添加提示词来定制模型行为
            </p>
            <UButton
              size="sm"
              variant="soft"
              icon="lucide:plus"
              label="添加第一个条目"
              @click="addPrompt"
            />
          </div>

          <!-- 列表 -->
          <div class="space-y-2">
            <div
              v-for="(prompt, index) in state.prompts"
              :key="prompt.identifier + index"
              draggable="true"
              class="group relative flex items-center gap-3 p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg) hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
              :class="{
                'opacity-40 scale-95': dragIndex === index,
                'ring-2 ring-primary ring-offset-2': dragIndex !== null && dragIndex !== index
              }"
              @dragstart="onDragStart(index)"
              @dragover="onDragOver"
              @drop="onDrop(index)"
              @dragend="onDragEnd"
            >
              <!-- 序号 -->
              <div class="size-8 rounded-lg bg-(--ui-bg-elevated) flex items-center justify-center text-sm font-medium text-(--ui-text-muted) shrink-0">
                {{ index + 1 }}
              </div>

              <!-- 内容 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-(--ui-text-highlighted) truncate">{{ prompt.name }}</span>
                  <UBadge
                    v-if="prompt.system_prompt"
                    size="xs"
                    color="info"
                    variant="subtle"
                  >
                    系统
                  </UBadge>
                  <UBadge
                    v-if="prompt.marker"
                    size="xs"
                    color="warning"
                    variant="subtle"
                  >
                    标记
                  </UBadge>
                  <UBadge
                    v-if="!prompt.enabled"
                    size="xs"
                    color="neutral"
                    variant="subtle"
                  >
                    已禁用
                  </UBadge>
                </div>
                <div class="flex items-center gap-4 text-xs text-(--ui-text-muted)">
                  <span class="font-mono bg-(--ui-bg-elevated) px-1.5 py-0.5 rounded">{{ prompt.identifier }}</span>
                  <span class="flex items-center gap-1">
                    <UIcon name="lucide:layers" class="size-3" />
                    深度 {{ prompt.injection_depth }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="lucide:arrow-up-down" class="size-3" />
                    顺序 {{ prompt.injection_order }}
                  </span>
                </div>
              </div>

              <!-- 操作 -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <UTooltip text="编辑">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="lucide:pencil"
                    @click="editPrompt(index)"
                  />
                </UTooltip>
                <UTooltip :text="prompt.enabled ? '禁用' : '启用'">
                  <UButton
                    size="xs"
                    :color="prompt.enabled ? 'success' : 'neutral'"
                    variant="ghost"
                    :icon="prompt.enabled ? 'lucide:toggle-right' : 'lucide:toggle-left'"
                    @click="prompt.enabled = !prompt.enabled"
                  />
                </UTooltip>
                <UTooltip text="删除">
                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="lucide:trash-2"
                    @click="deletePrompt(index)"
                  />
                </UTooltip>
              </div>

              <!-- 拖拽指示器 -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <UIcon name="lucide:grip-vertical" class="size-4 text-(--ui-text-dimmed)" />
              </div>
            </div>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-(--ui-text-muted)">
          <span v-if="state.activeTab === 'params'">{{ paramGroups.flatMap(g => g.items).length }} 个参数</span>
          <span v-else>{{ state.prompts.length }} 个提示词条目</span>
        </div>
        <div class="flex gap-2">
          <UButton
            label="取消"
            color="neutral"
            variant="ghost"
            @click="closeModal"
          />
          <UButton
            :loading="state.loading"
            label="保存预设"
            icon="lucide:check"
            @click="formRef?.submit()"
          />
        </div>
      </div>
    </template>
  </USlideover>

  <!-- 提示词编辑弹窗 -->
  <UModal
    v-model:open="state.showPromptModal"
    :title="state.editingIndex === -1 ? '添加提示词' : '编辑提示词'"
    description="配置提示词的标识符、角色、注入参数和内容"
    :ui="{ content: 'max-w-sm' }"
  >
    <template #body>
      <div v-if="state.editingPrompt" class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">
              标识符 <span class="text-red-500">*</span>
            </label>
            <UInput v-model="state.editingPrompt.identifier" placeholder="唯一标识，如 main" />
          </div>
          <div>
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">
              名称 <span class="text-red-500">*</span>
            </label>
            <UInput v-model="state.editingPrompt.name" placeholder="显示名称" />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">角色</label>
            <USelect v-model="state.editingPrompt.role" :items="roleOptions" />
          </div>
          <div>
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">注入深度</label>
            <UInput v-model.number="state.editingPrompt.injection_depth" type="number" :min="0" />
          </div>
          <div>
            <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">注入顺序</label>
            <UInput v-model.number="state.editingPrompt.injection_order" type="number" :min="0" />
          </div>
        </div>

        <div class="flex items-center gap-6 py-2">
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <USwitch v-model="state.editingPrompt.enabled" />
            <span class="text-sm">启用</span>
          </label>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <USwitch v-model="state.editingPrompt.system_prompt" />
            <span class="text-sm">系统提示词</span>
          </label>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <USwitch v-model="state.editingPrompt.marker" />
            <span class="text-sm">标记</span>
          </label>
        </div>

        <div>
          <label class="text-sm font-medium text-(--ui-text) mb-1.5 block">内容</label>
          <UTextarea
            v-model="state.editingPrompt.content"
            placeholder="提示词内容，可留空用于占位"
            :rows="5"
            class="w-full"
            autoresize
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="取消"
          color="neutral"
          variant="ghost"
          @click="state.showPromptModal = false"
        />
        <UButton label="确定" @click="savePrompt" />
      </div>
    </template>
  </UModal>
</template>
