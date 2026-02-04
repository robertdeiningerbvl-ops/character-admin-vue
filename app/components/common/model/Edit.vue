<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addCommonModel, updateCommonModel, getCommonModelPresetList } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  factoryOwnerOptions?: any
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
  name: z.string().nonempty(),
  f: z.string().nonempty(),
  m: z.string().nonempty(),
  key: z.string().nonempty(),
  uri: z.string().nonempty(),
  preset_id: z.number().min(0),
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

const streamOptions = [
  {
    label: '是',
    value: 2
  },
  {
    label: '否',
    value: 1
  }
]
const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any,
  presetOptions: [] as any,
  modelLoading: false
})

const loadPresetOptions = async (isChange: boolean = false) => {
  if (isChange) {
    state.presetOptions = []
  }

  state.modelLoading = true
  formRef.value?.clear('preset_id')

  const { data, error } = await getCommonModelPresetList({})
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
  const { error } = await (postForm.id ? updateCommonModel : addCommonModel)(postForm)
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
        <UFormField label="名称" name="name" required>
          <UInput
            v-model.trim="state.form.name"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>

        <UFormField label="key" name="key" required>
          <UInput
            v-model.trim="state.form.key"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>
        <UFormField label="请求地址" name="uri" required>
          <UInput
            v-model.trim="state.form.uri"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>

        <UFormField label="预设类型" name="preset_id" required>
          <USelect
            v-model="state.form.preset_id"
            :items="state.presetOptions"
            placeholder="请选择"
            class="w-full"
            @change="loadPresetOptions(true)"
          />
        </UFormField>
        <UFormField label="模型名称" name="m" required>
          <UInput
            v-model.trim="state.form.m"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>
        <UFormField label="f" name="f" required>
          <UInput
            v-model.trim="state.form.f"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>

        <UFormField label="描述" name="description" required>
          <UInput
            v-model.trim="state.form.description"
            placeholder="请输入"
            class="w-full"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>

        <UFormField label="是否流式" name="stream" required>
          <USelect
            v-model="state.form.stream"
            :items="streamOptions"
            placeholder="请选择"
            class="w-full"
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
