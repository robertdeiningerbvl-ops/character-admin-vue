<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addCommonMessage, updateCommonMessage, uploadFile } from '@/api'

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
const fileRef = ref<HTMLInputElement>()

const schema = z.object({
  title: z.string().nonempty('标题不能为空'),
  content: z.string().nonempty('内容不能为空'),
  ty: z.number().min(2, '类型不能为空'),
  state: z.number().min(2, '状态不能为空')
})

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '禁用',
    value: 4
  }
]

const typeOptions = [
  {
    label: '系统',
    value: 2
  },
  {
    label: '公告',
    value: 3
  },
  {
    label: '营销',
    value: 4
  }
]

const state = reactive({
  loading: false,
  uploading: false,
  form: {} as any
})

const toast = useToast()

// 图片上传处理
function onFileClick() {
  fileRef.value?.click()
}

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]

  if (!input.files?.length || !file) {
    return
  }
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    toast.add({ title: '请上传图片文件（jpg、png、gif、webp）', color: 'error' })
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.add({ title: '图片大小不能超过 5MB', color: 'error' })
    return
  }
  state.uploading = true
  try {
    const { data, error } = await uploadFile({
      image: input.files[0]
    })
    if (!error && data) {
      state.form.image = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    } else {
      toast.add({ title: '上传失败', color: 'error' })
    }
  } catch {
    toast.add({ title: '上传失败', color: 'error' })
  } finally {
    state.uploading = false
    input.value = ''
  }
}

const handleDeleteImage = () => {
  state.form.image = ''
}

async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updateCommonMessage : addCommonMessage)(postForm)
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
      state.uploading = false
      state.form = props.currentForm
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '修改消息' : '新增消息'"
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
        <UFormField label="标题" name="title" required>
          <UInput
            v-model.trim="state.form.title"
            placeholder="请输入标题"
            class="w-full"
          />
        </UFormField>

        <UFormField label="内容" name="content" required>
          <UTextarea
            v-model.trim="state.form.content"
            placeholder="请输入消息内容"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <UFormField label="类型" name="ty" required>
          <USelect
            v-model="state.form.ty"
            :items="typeOptions"
            placeholder="请选择类型"
            class="w-full"
          />
        </UFormField>

        <UFormField label="状态" name="state" required>
          <USelect
            v-model="state.form.state"
            :items="stateOptions"
            placeholder="请选择状态"
            class="w-full"
          />
        </UFormField>

        <UFormField label="宣传图" name="image">
          <div class="w-full">
            <!-- 上传区域 -->
            <div
              v-if="!state.form.image"
              class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
              @click="onFileClick"
            >
              <div class="flex flex-col items-center gap-2">
                <UIcon
                  :name="state.uploading ? 'i-lucide-loader' : 'i-lucide-image-plus'"
                  class="w-10 h-10 text-gray-400"
                  :class="{ 'animate-spin': state.uploading }"
                />
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ state.uploading ? '上传中...' : '点击上传宣传图' }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    支持 JPG、PNG、GIF、WebP，最大 5MB
                  </p>
                </div>
              </div>
            </div>

            <!-- 图片预览 -->
            <div v-else class="relative group">
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <img
                  :src="state.form.image"
                  alt="宣传图"
                  class="w-full h-48 object-cover"
                >
              </div>
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                <UButton
                  icon="i-lucide-refresh-cw"
                  color="neutral"
                  variant="solid"
                  label="更换"
                  @click="onFileClick"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="solid"
                  label="删除"
                  @click="handleDeleteImage"
                />
              </div>
            </div>

            <input
              ref="fileRef"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              class="hidden"
              @change="onFileChange"
            >
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
