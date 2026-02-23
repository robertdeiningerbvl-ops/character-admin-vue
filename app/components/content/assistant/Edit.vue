<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updateAssistant, getAssistantDetail, updateAssistantState } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
  tagsOptions?: any
  categoryOptions?: any
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

type Tab = 'info' | 'status'
const tab = ref<Tab>('info')

const tabItems: Array<readonly [Tab, string]> = [
  ['info', '基础信息'],
  ['status', '状态管理']
]

const formRef = useTemplateRef('formRef')
const toast = useToast()

const state = reactive({
  loading: false,
  form: {} as any
})

// 处理状态开关变化
async function handleStatusToggle(field: string, value: any) {
  if (!state.form.id) {
    toast.add({ title: '请先保存', color: 'warning' })
    return
  }

  state.form[field] = value

  const { error } = await updateAssistantState({
    id: state.form.id,
    [field]: value
  })

  if (!error) {
    toast.add({ title: '更新成功', color: 'success' })
    emit('refresh')
  } else {
    toast.add({ title: '更新失败', color: 'error' })
    state.form[field] = field === 'state' ? (value === 2 ? 4 : 2) : (value ? 0 : 1)
  }
}

// 提交表单
async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    const { error } = await updateAssistant(postForm)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

// 打开弹窗时初始化
watch(
  () => props.dialog,
  async (val) => {
    if (!val) return
    state.loading = true
    tab.value = 'info'
    try {
      if (props.currentForm?.id) {
        const { data, error } = await getAssistantDetail({ biz_id: props.currentForm.id })
        if (!error && data) {
          state.form = data.info || props.currentForm
        } else {
          state.form = cloneDeep(props.currentForm)
        }
      } else {
        state.form = cloneDeep(props.currentForm)
      }
    } catch {
      state.form = cloneDeep(props.currentForm)
    } finally {
      state.loading = false
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    title="编辑助手"
    description="编辑助手信息"

    :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }"
  >
    <template #body>
      <!-- 标签页导航 -->
      <div class="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-6">
        <div class="flex gap-2">
          <button
            v-for="[key, label] in tabItems"
            :key="key"
            type="button"
            class="px-5 py-3.5 text-sm transition-all relative rounded-t-lg"
            :class="tab === key
              ? 'text-white dark:text-white font-bold bg-blue-400 dark:bg-blue-400 shadow-lg'
              : 'text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800'"
            @click="tab = key as Tab"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="state.loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <UIcon name="i-material-symbols-progress-activity" class="w-12 h-12 text-primary-500 animate-spin mx-auto" />
            <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
              加载中...
            </p>
          </div>
        </div>

        <!-- 表单内容 -->
        <div v-else class="max-h-[60vh] overflow-y-auto pr-2">
          <!-- 基础信息 -->
          <div v-if="tab === 'info'">
            <UForm
              ref="formRef"
              :state="state.form"
              class="flex flex-col gap-5"
              @submit="onSubmit"
            >
              <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-5">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-primary-600" />
                  <h4 class="font-semibold text-gray-900 dark:text-white">
                    基本信息
                  </h4>
                </div>

                <UFormField label="名称" name="name">
                  <UInput
                    v-model.trim="state.form.name"
                    placeholder="请输入名称"
                    class="w-full"
                    size="lg"
                  />
                </UFormField>

                <UFormField label="简介" name="summary">
                  <UTextarea
                    v-model.trim="state.form.summary"
                    placeholder="请输入简介"
                    :rows="3"
                    class="w-full"
                    size="lg"
                  />
                </UFormField>
              </div>
            </UForm>
          </div>

          <!-- 状态管理 -->
          <div v-if="tab === 'status'" class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div class="flex items-center gap-2 mb-1">
                <UIcon name="i-material-symbols-settings-outline" class="w-5 h-5 text-primary-600" />
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  状态管理
                </h4>
              </div>

              <!-- 审核状态 -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    审核状态
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ state.form.state === 2 ? '已通过' : '待审核' }}
                  </p>
                </div>
                <USwitch
                  :model-value="state.form.state === 2"
                  size="lg"
                  @update:model-value="handleStatusToggle('state', $event ? 2 : 0)"
                />
              </div>

              <!-- 推荐 -->
              <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    推荐
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ state.form.recommend === 2 ? '已推荐' : '未推荐' }}
                  </p>
                </div>
                <USwitch
                  :model-value="state.form.recommend === 2"
                  size="lg"
                  @update:model-value="handleStatusToggle('recommend', $event ? 2 : 0)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-material-symbols-info-outline" class="inline w-4 h-4" />
          {{ tab === 'status' ? '状态管理通过开关直接更新' : '修改后将更新信息' }}
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
            :disabled="tab === 'status'"
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
