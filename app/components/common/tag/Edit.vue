<script setup lang="ts">
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
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { drawerVisible.value = false }

const formRef = useTemplateRef('formRef')
const toast = useToast()

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '已删除', value: 4 }
]

const tyOptions = [
  { label: '系统', value: 0 },
  { label: '业务', value: 1 }
]

const state = reactive({
  loading: false,
  form: {} as any
})

async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updateCommonTag : addCommonTag)(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    closeModal()
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = cloneDeep(props.currentForm)
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-md', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-tag" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑标签' : '新增标签' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <UFormField label="名称" name="name" required>
            <UInput v-model.trim="state.form.name" placeholder="请输入标签名称" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
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
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton :loading="state.loading" label="确认" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
