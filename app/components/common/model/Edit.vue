<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addCommonModel, updateCommonModel, getCommonModelPresetList, testCommonModel } from '@/api'

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

const streamEnabled = computed({
  get: () => state.form.stream === 2,
  set: (val) => { state.form.stream = val ? 2 : 1 }
})

const state = reactive({
  loading: false,
  testing: false,
  form: {} as any,
  presetOptions: [] as any[],
  modelOptions: [] as any[],
  modelLoading: false
})

const loadPresetOptions = async () => {
  state.modelLoading = true
  const { data } = await getCommonModelPresetList({})
  if (data) {
    state.presetOptions = data.list.map((item: any) => ({
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
      state.modelOptions = data.list.map((m: string) => ({ label: m, value: m }))
      // 如果当前值在列表中则保持，否则清空
      if (state.form.m && !data.list.includes(state.form.m)) {
        state.modelOptions.unshift({ label: state.form.m, value: state.form.m })
      }
      toast.add({ title: '获取模型列表成功', color: 'success' })
    }
  } finally {
    state.testing = false
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = cloneDeep(props.currentForm)
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
            <UFormField label="预设类型" name="preset_id" required>
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
          </div>
        </div>

        <!-- 模型配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-settings" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">模型配置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="模型标识 (f)" name="f" required>
              <UInput v-model.trim="state.form.f" placeholder="输入模型标识" :disabled="!!currentForm.id" />
            </UFormField>
            <UFormField label="模型名称 (m)" name="m" required>
              <USelectMenu
                v-if="state.modelOptions.length"
                v-model="state.form.m"
                :items="state.modelOptions"
                placeholder="选择模型名称"
                searchable
              />
              <UInput v-else v-model.trim="state.form.m" placeholder="点击测试链接获取模型列表" />
            </UFormField>
            <UFormField
              label="Key"
              name="key"
              required
              class="col-span-2"
            >
              <UTextarea
                v-model.trim="state.form.key"
                placeholder="输入 Key"
                :rows="2"
                autoresize
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="请求地址"
              name="uri"
              required
              class="col-span-2"
            >
              <UTextarea
                v-model.trim="state.form.uri"
                placeholder="输入请求地址"
                :rows="2"
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
