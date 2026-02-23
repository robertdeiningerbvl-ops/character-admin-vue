<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updateCommonModelToken, addCommonModelToken, getCommonModelList } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  bizId?: string | number
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { drawerVisible.value = false }

const formRef = useTemplateRef('formRef')
const toast = useToast()

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val) => { state.form.state = val ? 2 : 4 }
})

const state = reactive({
  loading: false,
  form: {} as any,
  modelOptions: [] as any[],
  modelLoading: false
})

const loadModelOptions = async () => {
  state.modelLoading = true
  const { data } = await getCommonModelList({})
  if (data) {
    state.modelOptions = data.list.map((item: any) => ({
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
    const { error } = await (postForm.id ? updateCommonModelToken : addCommonModelToken)(postForm)
    if (!error) {
      toast.add({ title: '保存成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = cloneDeep(props.currentForm)
    if (!state.form.id && props.bizId) {
      state.form.biz_id = Number(props.bizId)
    }
    loadModelOptions()
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-lg', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-key" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑 Token' : '新建 Token' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="关联模型" name="biz_id" required>
          <USelect
            v-model="state.form.biz_id"
            :items="state.modelOptions"
            :loading="state.modelLoading"
            placeholder="选择模型"
            :disabled="!!bizId"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="最大 Token 数" name="max_token" required>
            <UInput
              v-model.number="state.form.max_token"
              type="number"
              :min="0"
              placeholder="输入最大 Token"
            />
          </UFormField>
          <UFormField label="每次消耗电量" name="battery">
            <UInput
              v-model.number="state.form.battery"
              type="number"
              :min="0"
              placeholder="输入消耗电量"
            />
          </UFormField>
        </div>

        <UFormField label="说明" name="description">
          <UTextarea
            v-model.trim="state.form.description"
            placeholder="输入说明"
            :rows="2"
            autoresize
            class="w-full"
          />
        </UFormField>

        <UFormField label="状态" name="state">
          <div class="flex items-center h-9">
            <USwitch v-model="stateEnabled" />
            <span class="ml-2 text-sm">{{ stateEnabled ? '启用' : '关闭' }}</span>
          </div>
        </UFormField>
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
</template>
