<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addCommonModel, updateCommonModel, getCommonModelPresetList, testCommonModel, getLlmRouterBackendList } from '@/api'

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

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val) => { state.form.state = val ? 2 : 0 }
})

const typeOptions = [
  { label: '聊天模型', value: 0 },
  { label: '创作模型', value: 1 },
  { label: '文生图模型', value: 5 },
  { label: '图生图模型', value: 6 }
]

const streamEnabled = computed({
  get: () => state.form.stream === 1,
  set: (val) => { state.form.stream = val ? 1 : 0 }
})

const state = reactive({
  loading: false,
  testing: false,
  form: {} as any,
  presetOptions: [] as any[],
  modelLoading: false,
  backendOptions: [] as any[],
  backendList: [] as any[]
})

// 表单验证规则
const validate = (formState: any): Array<{ path: string; message: string }> => {
  const errors: Array<{ path: string; message: string }> = []

  if (!formState.name?.trim()) {
    errors.push({ path: 'name', message: '名称不能为空' })
  }

  // ty 可以是 0，所以检查是否在有效值范围内
  if (formState.ty === undefined || formState.ty === null || ![0, 1, 5, 6].includes(formState.ty)) {
    errors.push({ path: 'ty', message: '模型类型不能为空' })
  }

  if (!formState.m?.trim()) {
    errors.push({ path: 'm', message: '模型名称不能为空' })
  }

  if (!formState.preset_id) {
    errors.push({ path: 'preset_id', message: '预设不能为空' })
  }

  return errors
}

// 根据选中的渠道动态生成模型选项
const modelOptions = computed(() => {
  const backend = state.backendList.find((b: any) => b.id === state.form.llm_router_backend_id)
  if (!backend?.models) return []
  return backend.models.split(',').map((m: string) => ({ label: m.trim(), value: m.trim() }))
})

const loadPresetOptions = async () => {
  state.modelLoading = true
  const [presetRes, backendRes] = await Promise.all([
    getCommonModelPresetList({}),
    getLlmRouterBackendList({})
  ])
  if (presetRes.data) {
    state.presetOptions = presetRes.data.list.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
  }
  if (backendRes.data) {
    state.backendList = backendRes.data.list || []
    state.backendOptions = state.backendList.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
  }
  state.modelLoading = false
}

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    if (postForm.price != null) {
      postForm.price = Math.round(postForm.price * 100)
    }
    const { error } = await (postForm.id ? updateCommonModel : addCommonModel)(postForm)
    if (!error) {
      toast.add({ title: '保存成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

async function onTest() {
  if (!state.form.id) {
    toast.add({ title: '请先保存模型', color: 'warning' })
    return
  }
  state.testing = true
  try {
    const { data, error } = await testCommonModel({ id: state.form.id })
    if (!error && data?.list) {
      toast.add({ title: '获取模型列表成功', color: 'success' })
    }
  } finally {
    state.testing = false
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    const form = cloneDeep(props.currentForm)
    if (form.price != null) {
      form.price = form.price / 100
    }
    state.form = form
    loadPresetOptions()
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-bot" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑模型' : '新建模型' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        :validate="validate"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">基本信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="名称" name="name" required>
              <UInput v-model.trim="state.form.name" placeholder="输入模型名称" />
            </UFormField>
            <UFormField label="模型类型" name="ty" required>
              <USelect
                v-model="state.form.ty"
                :items="typeOptions"
                placeholder="选择模型类型"
              />
            </UFormField>
            <UFormField label="排序" name="r">
              <UInput v-model.number="state.form.r" type="number" placeholder="数值越大越靠前" />
            </UFormField>
            <UFormField label="模型价格" name="price">
              <UInput v-model.number="state.form.price" type="number" :min="0" placeholder="不能小于0" />
            </UFormField>
            <UFormField label="免费次数" name="free_times">
              <UInput v-model.number="state.form.free_times" type="number" :min="0" placeholder="0表示不免费" />
            </UFormField>
            <UFormField label="模型渠道" name="llm_router_backend_id">
              <USelect
                v-model="state.form.llm_router_backend_id"
                :items="state.backendOptions"
                placeholder="选择模型渠道"
              />
            </UFormField>
            <UFormField label="模型名称 (m)" name="m" required>
              <USelect
                v-model="state.form.m"
                :items="modelOptions"
                placeholder="选择模型名称"
              />
            </UFormField>
            <UFormField label="预设" name="preset_id" required>
              <USelect
                v-model="state.form.preset_id"
                :items="state.presetOptions"
                :loading="state.modelLoading"
                placeholder="选择预设"
              />
            </UFormField>
            <UFormField label="描述" name="description" class="col-span-2">
              <UTextarea
                v-model.trim="state.form.description"
                placeholder="输入描述"
                :rows="3"
                autoresize
                class="w-full"
              />
            </UFormField>
            <UFormField label="额外参数 (extra_params)" name="extra_params" class="col-span-2">
              <UTextarea
                v-model.trim="state.form.extra_params"
                placeholder="输入额外参数（JSON格式），例如: {&quot;temperature&quot;: 0.7, &quot;max_tokens&quot;: 1000}"
                :rows="3"
                autoresize
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 其他设置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">其他设置</span>
          </div>
          <div class="flex items-center gap-6">
            <UFormField label="流式输出" name="stream">
              <div class="flex items-center h-9">
                <USwitch v-model="streamEnabled" />
                <span class="ml-2 text-sm">{{ streamEnabled ? '是' : '否' }}</span>
              </div>
            </UFormField>
            <UFormField label="状态" name="state">
              <div class="flex items-center h-9">
                <USwitch v-model="stateEnabled" />
                <span class="ml-2 text-sm">{{ stateEnabled ? '启用' : '关闭' }}</span>
              </div>
            </UFormField>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        v-if="currentForm.id"
        :loading="state.testing"
        label="测试链接"
        color="warning"
        variant="outline"
        icon="i-lucide-play"
        @click="onTest"
      />
      <div class="flex-1" />
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton :loading="state.loading" label="保存" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
