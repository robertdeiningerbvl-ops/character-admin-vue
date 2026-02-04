<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addCommonSensitive, updateCommonSensitive } from '@/api'

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
  name: z.string().nonempty('请输入敏感词'),
  state: z.number().min(2)
})

const stateOptions = [
  {
    label: '开启',
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
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updateCommonSensitive : addCommonSensitive)(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = cloneDeep(props.currentForm)
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '编辑敏感词' : '新增敏感词'"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-2xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="p-6">
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- 敏感词信息卡片 -->
          <div class="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-5 space-y-5 border border-red-100 dark:border-red-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-warning-outline" class="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                敏感词信息
              </h4>
            </div>

            <UFormField label="敏感词" name="name" required>
              <UInput
                v-model.trim="state.form.name"
                placeholder="请输入敏感词"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-warning-outline" class="w-5 h-5 text-red-400" />
                </template>
              </UInput>
            </UFormField>

            <UFormField label="类型" name="ty" required>
              <USelect
                v-model="state.form.ty"
                :items="tyOptions"
                placeholder="请选择类型"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-category-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </USelect>
            </UFormField>

            <UFormField label="状态" name="state" required>
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择状态"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-toggle-on-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </USelect>
            </UFormField>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <UIcon name="i-material-symbols-info-outline" class="w-4 h-4" />
          <span>{{ currentForm.id ? '修改后将更新敏感词配置' : '确认后将创建新的敏感词' }}</span>
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
