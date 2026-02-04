<script setup lang="ts">
import * as z from 'zod'
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
  battery: z.number().min(0),
  max_token: z.number().min(0),
  biz_id: z.number().min(0),
  state: z.number().min(0)
})

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '关闭',
    value: 4
  }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  presetOptions: [] as any,
  modelLoading: false,
  form: {} as any
})

const loadPresetOptions = async (isChange: boolean = false) => {
  if (isChange) {
    state.presetOptions = []
  }

  state.modelLoading = true
  formRef.value?.clear('preset_id')

  const { data, error } = await getCommonModelList({})
  if (data) {
    const presetOptions = [] as any
    data.list.forEach((item: any) => {
      presetOptions.push({
        label: item.name,
        value: item.id
      })
    })
    state.presetOptions = presetOptions
  } else if (error) {
    state.form.mark = undefined
    if (error.code === 400) {
      formRef.value?.setErrors([{ name: 'preset_id', message: error.msg }])
    } else if (error.code === 401) {
      formRef.value?.setErrors([{ name: 'type', message: error.msg }])
    } else {
      formRef.value?.setErrors([{ name: 'mark', message: error.msg }])
    }
  }
  state.modelLoading = false
}

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  console.log('postForm', postForm)
  const { error } = await (postForm.id ? updateCommonModelToken : addCommonModelToken)(postForm)
  if (!error) {
    toast.add({ title: `操作成功`, color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = props.currentForm
      if (!state.form.id && props.bizId) {
        state.form.biz_id = Number(props.bizId)
      }
      loadPresetOptions()
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '修改' : '新增'"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="关联模型" name="biz_id" required>
          <USelect
            v-model="state.form.biz_id"
            :items="state.presetOptions"
            placeholder="请选择"
            class="w-full"
            @change="loadPresetOptions(true)"
          />
        </UFormField>
        <UFormField label="最大token数" name="max_token" required>
          <UInput
            v-model.trim="state.form.max_token"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
            type="number"
            min="0"
          />
        </UFormField>
        <UFormField label="说明" name="description">
          <UInput
            v-model.trim="state.form.description"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>
        <UFormField label="每次消耗" name="battery">
          <UInput
            v-model.trim="state.form.battery"
            placeholder="请输入"
            type="number"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>
        <UFormField label="状态" name="state" required>
          <USelect
            v-model="state.form.state"
            :items="stateOptions"
            placeholder="请选择"
            class="w-full"
          />
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
      <UButton
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
