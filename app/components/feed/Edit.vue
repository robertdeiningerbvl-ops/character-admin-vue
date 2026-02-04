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
  title: z.string().nonempty('标题不能为空'),
  content: z.string().nonempty('内容不能为空'),
  state: z.number().min(0)
})

const state = reactive({
  loading: false,
  form: {
    id: 0,
    username: '',
    title: '',
    content: '',
    reply: '',
    state: 0
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
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-3xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="max-h-[75vh] overflow-y-auto p-6">
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="flex flex-col gap-5"
          @submit="onSubmit"
        >
          <!-- 用户信息卡片 -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-5 border border-blue-100 dark:border-blue-700">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <UIcon name="i-material-symbols-person-outline" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  反馈用户
                </p>
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ state.form.username || '未知用户' }}
                </p>
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 p-6 space-y-5">
            <div class="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-600">
              <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                基本信息
              </h4>
            </div>

            <UFormField
              label="标题"
              name="title"
              required
              class="w-full"
            >
              <UInput
                v-model.trim="state.form.title"
                placeholder="请输入标题"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="反馈内容"
              name="content"
              required
              class="w-full"
            >
              <UTextarea
                v-model.trim="state.form.content"
                placeholder="用户反馈的内容"
                :rows="4"
                size="lg"
                class="w-full"
                disabled
              />
            </UFormField>
          </div>

          <!-- 回复内容 -->
          <div class="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 p-6 space-y-5">
            <div class="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-600">
              <UIcon name="i-material-symbols-reply" class="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                回复内容
              </h4>
            </div>

            <UFormField label="回复" name="reply" class="w-full">
              <UTextarea
                v-model.trim="state.form.reply"
                placeholder="请输入回复内容"
                :rows="5"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="状态"
              name="state"
              required
              class="w-full"
            >
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择状态"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-material-symbols-info-outline" class="inline w-4 h-4" />
          修改后将更新反馈信息
        </div>
        <div class="flex gap-3">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
          >
            <template #leading>
              <UIcon name="i-material-symbols-close" />
            </template>
          </UButton>
          <UButton
            :loading="state.loading"
            label="确认保存"
            variant="solid"
            size="lg"
            @click="formRef?.submit()"
          >
            <template #leading>
              <UIcon name="i-material-symbols-check" />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
