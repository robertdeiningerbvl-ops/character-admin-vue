<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addCommonTag, updateCommonTag } from '@/api'

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
  name: z.string().nonempty(),
  ty: z.number().min(0),
  state: z.number().min(0)
})

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '已删除',
    value: 4
  }
]

const tyOptions = [
  {
    label: '系统',
    value: 0
  },
  {
    label: '业务',
    value: 1
  }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  console.log('postForm', postForm)
  const { error } = await (postForm.id ? updateCommonTag : addCommonTag)(postForm)
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
        <UFormField label="类型" name="ty" required>
          <USelect
            v-model="state.form.ty"
            :items="tyOptions"
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
