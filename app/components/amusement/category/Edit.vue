<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateAmusementCategory, addAmusementCategory } from '@/api'

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
  content: z.string().nonempty('请输入 JSON')
})

const stateOptions = [
  {
    label: '删除',
    value: 4
  },
  {
    label: '待审核',
    value: 2
  },
  {
    label: '正常',
    value: 1
  },
  {
    label: '提交',
    value: 0
  }
]

const state = reactive({
  loading: false,
  form: { tag: [], content: '' } as any
})

// JSON 格式化
const jsonError = ref<string | null>(null)
const prettyJson = computed({
  get() {
    try {
      const obj = typeof state.form.content === 'string'
        ? JSON.parse(state.form.content)
        : state.form.content
      return JSON.stringify(obj, null, 2)
    } catch {
      return state.form.content || ''
    }
  },
  set(val: string) {
    state.form.content = val
  }
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  if (Array.isArray(postForm.tag)) {
    postForm.tag = postForm.tag.join(',')
  }
  // JSON 校验
  try {
    JSON.parse(postForm.content) // 仅校验，不修改
    jsonError.value = null
    postForm.content = JSON.stringify(JSON.parse(postForm.content))
  } catch (err: any) {
    jsonError.value = err.message
    toast.add({ title: `JSON 格式错误: ${err.message}`, color: 'error' })
    state.loading = false
    return
  }
  const { error } = await (postForm.id ? updateAmusementCategory : addAmusementCategory)(postForm)
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
    jsonError.value = null
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
        <UFormField label="可评分值" name="rating" required>
          <UInput
            v-model.trim="state.form.rating"
            placeholder="请输入"
            class="w-full"
            type="number"
            :ui="{ trailing: 'pe-1' }"
          />
        </UFormField>
        <UFormField label="提示限制" name="hint" required>
          <UInput
            v-model.trim="state.form.hint"
            placeholder="请输入"
            class="w-full"
            type="number"
            min="0"
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
        <UFormField label="描述 (JSON)" name="content">
          <UTextarea
            v-model="prettyJson"
            class="w-full font-mono text-sm"
            :rows="12"
            placeholder="请输入 JSON"
            :class="{ 'border-red-500 bg-red-50': jsonError }"
          />
          <div v-if="jsonError" class="text-red-500 text-sm mt-1">
            JSON 错误: {{ jsonError }}
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
      <UButton
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
