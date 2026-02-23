<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateCommonFeed } from '@/api'

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
const toast = useToast()

const stateOptions = [
  { label: '待处理', value: 0 },
  { label: '已回复', value: 1 },
  { label: '已关闭', value: 2 }
]

const schema = z.object({
  state: z.number().min(0)
})

const state = reactive({
  loading: false,
  form: {
    id: 0,
    title: '',
    content: '',
    reply: '',
    state: 0,
    member: null as any
  }
})

// 提交表单
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await updateCommonFeed(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
    closeModal()
  }
  state.loading = false
}

// 监听弹窗打开
watch(
  () => props.dialog,
  (val) => {
    if (val && props.currentForm) {
      state.form = cloneDeep(props.currentForm)
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    title="回复反馈"
    description="编辑反馈信息并回复用户"

    :ui="{
      content: 'sm:max-w-3xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="max-h-[75vh] overflow-y-auto p-6 space-y-4">
        <!-- 用户信息卡片 -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UAvatar
            :src="state.form.member?.avatar"
            :alt="state.form.member?.username"
            size="lg"
          />
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ state.form.member?.username || '未知用户' }}
            </div>
            <div class="text-sm text-gray-500 truncate">
              {{ state.form.member?.email || '' }}
            </div>
          </div>
        </div>

        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- 反馈标题 -->
          <UFormField label="标题" name="title">
            <UInput
              v-model="state.form.title"
              disabled
              class="w-full"
            />
          </UFormField>

          <!-- 反馈内容 -->
          <UFormField label="反馈内容" name="content">
            <UTextarea
              v-model="state.form.content"
              :rows="3"
              disabled
              class="w-full"
            />
          </UFormField>

          <!-- 回复 -->
          <UFormField label="回复内容" name="reply">
            <UTextarea
              v-model="state.form.reply"
              placeholder="请输入回复内容"
              :rows="4"
              class="w-full"
            />
          </UFormField>

          <!-- 状态 -->
          <UFormField label="状态" name="state">
            <USelect
              v-model="state.form.state"
              :items="stateOptions"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          label="取消"
          color="neutral"
          variant="outline"
          @click="closeModal"
        />
        <UButton
          :loading="state.loading"
          label="保存"
          @click="formRef?.submit()"
        />
      </div>
    </template>
  </UModal>
</template>
