<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addLanguage, updateLanguage } from '@/api'

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
  content: z.string().nonempty(),
  nation: z.string()
})

const state = reactive({
  loading: false,
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updateLanguage : addLanguage)(postForm)
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
    :title="currentForm.id ? '编辑翻译' : '新增翻译'"

    :ui="{
      content: 'sm:max-w-lg',
      footer: 'justify-end bg-(--ui-bg-elevated)'
    }"
  >
    <template #body>
      <div class="space-y-5">
        <!-- 说明卡片 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
            <div class="text-sm text-(--ui-text-muted)">
              <p class="font-medium text-(--ui-text-highlighted) mb-1">
                翻译配置说明
              </p>
              <p>配置多语言翻译内容，用于前端界面的国际化显示。</p>
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
          <UFormField
            label="中文名称"
            name="name"
            required
            hint="原始文本内容"
          >
            <UInput
              v-model.trim="state.form.name"
              placeholder="请输入中文名称"
              class="w-full"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-lucide-type" class="w-5 h-5 text-(--ui-text-muted)" />
              </template>
            </UInput>
          </UFormField>
          <UFormField
            label="翻译内容"
            name="content"
            required
            hint="对应语言的翻译文本"
          >
            <UInput
              v-model.trim="state.form.content"
              placeholder="请输入翻译内容"
              class="w-full"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-lucide-languages" class="w-5 h-5 text-(--ui-text-muted)" />
              </template>
            </UInput>
          </UFormField>
          <UFormField label="菜单标识" name="nation" hint="用于区分不同模块的翻译">
            <UInput
              v-model.trim="state.form.nation"
              placeholder="请输入菜单标识，如：common、user"
              class="w-full"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-lucide-tag" class="w-5 h-5 text-(--ui-text-muted)" />
              </template>
            </UInput>
          </UFormField>
        </UForm>
      </div>
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
