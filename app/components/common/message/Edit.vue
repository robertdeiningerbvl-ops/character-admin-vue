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
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')
const fileRef = ref<HTMLInputElement>()
const toast = useToast()

const schema = z.object({
  title: z.string().nonempty('标题不能为空'),
  content: z.string().nonempty('内容不能为空'),
  ty: z.number().min(2, '类型不能为空'),
  state: z.number().min(2, '状态不能为空')
})

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '禁用', value: 4 }
]

const typeOptions = [
  { label: '系统', value: 2 },
  { label: '公告', value: 3 },
  { label: '营销', value: 4 }
]

interface FormState {
  loading: boolean
  uploading: boolean
  form: {
    id?: number
    title?: string
    content?: string
    ty?: number
    state?: number
    image?: string
    tm?: number
  }
}

const state = reactive<FormState>({
  loading: false,
  uploading: false,
  form: {}
})

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
  try {
    const postForm = cloneDeep(state.form)
    const { error } = await (postForm.id ? updateCommonMessage : addCommonMessage)(postForm)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
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

    :ui="{
      content: 'sm:max-w-3xl',
      footer: 'justify-end bg-(--ui-bg-elevated)'
    }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">基本信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="消息类型" name="ty" required>
              <USelect
                v-model="state.form.ty"
                :items="typeOptions"
                placeholder="请选择类型"
                class="w-full"
              />
            </UFormField>
            <UFormField label="消息状态" name="state" required>
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择状态"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="消息标题" name="title" required>
            <UInput v-model.trim="state.form.title" placeholder="请输入消息标题" class="w-full" />
          </UFormField>
        </div>

        <!-- 消息内容 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-info)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">消息内容</span>
          </div>
          <UFormField label="消息正文" name="content" required>
            <RichTextEditor v-model="state.form.content" min-height="200px" />
          </UFormField>
        </div>

        <!-- 宣传图 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-image" class="w-4 h-4 text-(--ui-success)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">宣传图</span>
            <span class="text-xs text-(--ui-text-muted)">（可选）</span>
          </div>
          <UFormField name="image">
            <div class="w-full">
              <!-- 上传区域 -->
              <div
                v-if="!state.form.image"
                class="border-2 border-dashed border-(--ui-border) rounded-lg p-6 text-center cursor-pointer hover:border-(--ui-primary) hover:bg-(--ui-bg-elevated)/50 transition-all"
                @click="onFileClick"
              >
                <div class="flex flex-col items-center gap-2">
                  <UIcon
                    :name="state.uploading ? 'i-lucide-loader' : 'i-lucide-image-plus'"
                    class="w-10 h-10 text-(--ui-text-muted)"
                    :class="{ 'animate-spin': state.uploading }"
                  />
                  <div>
                    <p class="text-sm font-medium text-(--ui-text-highlighted)">
                      {{ state.uploading ? '上传中...' : '点击上传宣传图' }}
                    </p>
                    <p class="text-xs text-(--ui-text-muted) mt-1">
                      支持 JPG、PNG、GIF、WebP，最大 5MB
                    </p>
                  </div>
                </div>
              </div>

              <!-- 图片预览 -->
              <div v-else class="relative group">
                <div class="border border-(--ui-border) rounded-lg overflow-hidden">
                  <img :src="state.form.image" alt="宣传图" class="w-full h-48 object-cover">
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
        </div>

        <!-- 弹框配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-bell-ring" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">弹框配置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-between p-3 rounded-lg border border-(--ui-border)">
              <div>
                <p class="text-sm font-medium text-(--ui-text-highlighted)">
                  是否弹框
                </p>
                <p class="text-xs text-(--ui-text-muted)">
                  开启后将定时弹出消息提示
                </p>
              </div>
              <USwitch :model-value="(state.form.tm ?? 0) > 0" @update:model-value="state.form.tm = $event ? 60 : 0" />
            </div>
            <UFormField v-if="(state.form.tm ?? 0) > 0" label="弹框间隔（秒）" name="tm">
              <UInput
                v-model.number="state.form.tm"
                type="number"
                min="1"
                placeholder="间隔秒数"
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
      <UButton
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
