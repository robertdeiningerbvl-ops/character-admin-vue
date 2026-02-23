<script setup lang="ts">
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
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { drawerVisible.value = false }

const formRef = useTemplateRef('formRef')
const toast = useToast()

const stateOptions = [
  { label: '启用', value: 1 },
  { label: '待审核', value: 2 },
  { label: '已删除', value: 4 }
]

const stateEnabled = computed({
  get: () => state.form.state === 1,
  set: (val) => { state.form.state = val ? 1 : 4 }
})

const state = reactive({
  loading: false,
  form: {
    name: '',
    rating: 0,
    hint: '',
    state: 1,
    contentList: [] as Array<{ id: number, name: string, content: string, sort: number }>
  } as any
})

const addContentItem = () => {
  const newId = state.form.contentList.length + 1
  state.form.contentList.push({ id: newId, name: '', content: '', sort: newId })
}

const removeContentItem = (index: number) => {
  state.form.contentList.splice(index, 1)
  state.form.contentList.forEach((item: any, idx: number) => { item.id = idx + 1 })
}

async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  postForm.content = JSON.stringify(postForm.contentList)
  delete postForm.contentList
  const { error } = await (postForm.id ? updateAmusementCategory : addAmusementCategory)(postForm)
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
    const formData = cloneDeep(props.currentForm)
    if (formData.content) {
      try {
        const contentArray = JSON.parse(formData.content)
        formData.contentList = Array.isArray(contentArray) ? contentArray : []
      } catch {
        formData.contentList = []
      }
    } else {
      formData.contentList = []
    }
    state.form = formData
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-folder" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑分类' : '新增分类' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">基本信息</span>
          </div>
          <div class="flex items-center gap-4">
            <UFormField
              label="分类名称"
              name="name"
              required
              class="flex-1"
            >
              <UInput v-model.trim="state.form.name" placeholder="请输入分类名称" class="w-full" />
            </UFormField>
            <UFormField label="启用">
              <div class="flex items-center h-9">
                <USwitch v-model="stateEnabled" />
                <span class="ml-2 text-sm">{{ stateEnabled ? '启用' : '关闭' }}</span>
              </div>
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="可评分值" name="rating">
              <UInput
                v-model.number="state.form.rating"
                type="number"
                placeholder="请输入"
                class="w-full"
              />
            </UFormField>
            <UFormField label="提示限制" name="hint">
              <UInput
                v-model.number="state.form.hint"
                type="number"
                min="0"
                placeholder="请输入"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 内容配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-primary)" />
              <span class="text-sm font-medium">内容配置</span>
              <UBadge v-if="state.form.contentList?.length" size="xs" color="primary">
                {{ state.form.contentList.length }}
              </UBadge>
            </div>
            <UButton
              size="xs"
              icon="i-lucide-plus"
              label="添加"
              @click="addContentItem"
            />
          </div>

          <!-- 内容项列表 -->
          <div class="space-y-3">
            <div
              v-for="(item, index) in state.form.contentList"
              :key="index"
              class="p-4 rounded-lg bg-(--ui-bg) border border-(--ui-border)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-(--ui-primary)/10 flex items-center justify-center">
                    <span class="text-xs font-medium text-(--ui-primary)">{{ index + 1 }}</span>
                  </div>
                  <span class="text-sm font-medium">内容项</span>
                </div>
                <UButton
                  icon="i-lucide-trash-2"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="removeContentItem(index)"
                />
              </div>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <UFormField label="内容名称">
                    <UInput v-model.trim="item.name" placeholder="请输入内容名称" class="w-full" />
                  </UFormField>
                  <UFormField label="排序">
                    <UInput
                      v-model.number="item.sort"
                      type="number"
                      placeholder="请输入排序值"
                      class="w-full"
                    />
                  </UFormField>
                </div>
                <UFormField label="内容描述">
                  <UTextarea
                    v-model="item.content"
                    :rows="4"
                    placeholder="请输入内容描述"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!state.form.contentList?.length" class="py-8 text-center">
            <UIcon name="i-lucide-file-text" class="w-10 h-10 mx-auto mb-2 text-(--ui-text-dimmed)" />
            <p class="text-sm text-(--ui-text-muted)">
              暂无内容项，点击上方添加
            </p>
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
