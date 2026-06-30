<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addCommonTtsVoice, updateCommonTtsVoice } from '@/api'
import { uploadFile } from '@/api/modules/account'

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
const avatarFileRef = ref<HTMLInputElement>()
const audioFileRef = ref<HTMLInputElement>()

const state = reactive({
  loading: false,
  avatarLoading: false,
  audioLoading: false,
  form: {} as any
})

const genderOptions = [
  { label: '未知', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '其他', value: 3 }
]

const visibilityOptions = [
  { label: '公有', value: 1 },
  { label: '私有', value: 2 }
]

const sourceOptions = [
  { label: '系统内置', value: 1 },
  { label: '用户克隆', value: 2 },
  { label: '第三方导入', value: 3 }
]

const stateOptions = [
  { label: '正常', value: 1 },
  { label: '待审核', value: 2 },
  { label: '禁用', value: 3 }
]

const isHotOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 1 }
]

const initFormDefaults = () => ({
  id: 0,
  uid: 0,
  name: '',
  avatar: '',
  demo_audio: '',
  summary: '',
  description: '',
  gender: 0,
  language: 'zh-CN',
  visibility: 1,  // 默认公有
  source: 1,      // 默认系统内置
  state: 1,       // 默认正常
  sort: 0,
  is_hot: 1       // 默认热门
})

const toast = useToast()

const onAvatarFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  // 验证文件格式
  if (!imageFormat(file)) {
    input.value = ''
    return
  }

  state.avatarLoading = true

  try {
    const { data, error } = await uploadFile({ image: file })
    if (error) {
      toast.add({ title: '上传失败，请重试', color: 'error' })
    } else if (data) {
      state.form.avatar = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    }
  } catch (err) {
    toast.add({ title: '上传失败，请重试', color: 'error' })
  } finally {
    state.avatarLoading = false
    input.value = ''  // 重置 input，允许重新选择同一文件
  }
}

const onAvatarFileClick = () => {
  avatarFileRef.value?.click()
}

const onAudioFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  // 验证音频格式
  const validFormats = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a']
  if (!validFormats.includes(file.type)) {
    toast.add({ title: '仅支持 MP3、WAV、M4A 格式', color: 'error' })
    input.value = ''
    return
  }

  state.audioLoading = true

  try {
    const { data, error } = await uploadFile({ image: file })
    if (error) {
      toast.add({ title: '上传失败，请重试', color: 'error' })
    } else if (data) {
      state.form.demo_audio = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    }
  } catch (err) {
    toast.add({ title: '上传失败，请重试', color: 'error' })
  } finally {
    state.audioLoading = false
    input.value = ''  // 重置 input，允许重新选择同一文件
  }
}

const onAudioFileClick = () => {
  audioFileRef.value?.click()
}

const handleSubmit = async () => {
  state.loading = true
  const isEdit = state.form.id > 0
  const apiFunc = isEdit ? updateCommonTtsVoice : addCommonTtsVoice

  const { error } = await apiFunc(cloneDeep(state.form))
  state.loading = false

  if (!error) {
    toast.add({ title: isEdit ? '修改成功' : '添加成功', color: 'success' })
    emit('refresh')
    closeModal()
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    // 编辑时使用现有数据，新增时使用默认值
    if (props.currentForm?.id) {
      state.form = cloneDeep(props.currentForm)
    } else {
      state.form = initFormDefaults()
    }
  }
})
</script>

<template>
<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-2xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-mic" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑声优' : '新增声优' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <!-- 头像上传 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-image" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">声优头像</span>
          </div>
          <div class="flex items-center gap-4">
            <UAvatar :src="state.form.avatar" :alt="state.form.name" size="xl" />
            <div>
              <UButton
                :loading="state.avatarLoading"
                label="上传头像"
                color="neutral"
                variant="soft"
                icon="i-lucide-upload"
                @click="onAvatarFileClick"
              />
              <p class="text-xs text-(--ui-text-muted) mt-1">
                支持 JPG、PNG，最大 1MB
              </p>
            </div>
            <input
              ref="avatarFileRef"
              type="file"
              class="hidden"
              accept=".jpg,.jpeg,.png"
              @change="onAvatarFileChange"
            >
          </div>
        </div>

        <!-- 试听音频 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-audio-lines" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">试听音频</span>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              :loading="state.audioLoading"
              label="上传音频"
              color="neutral"
              variant="soft"
              icon="i-lucide-upload"
              @click="onAudioFileClick"
            />
            <span class="text-xs text-(--ui-text-muted)">支持 MP3、WAV、M4A</span>
            <input
              ref="audioFileRef"
              type="file"
              class="hidden"
              accept=".mp3,.wav,.m4a"
              @change="onAudioFileChange"
            >
          </div>
          <audio v-if="state.form.demo_audio" :src="state.form.demo_audio" controls class="w-full" />
        </div>

        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">基本信息</span>
          </div>
          <UFormField label="声优名称" name="name" required>
            <UInput v-model.trim="state.form.name" placeholder="请输入声优名称" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="性别" name="gender" required>
              <USelect
                v-model="state.form.gender"
                :items="genderOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="可见性" name="visibility">
              <USelect
                v-model="state.form.visibility"
                :items="visibilityOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="来源" name="source">
              <USelect
                v-model="state.form.source"
                :items="sourceOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="状态" name="state">
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="是否热门" name="is_hot">
              <USelect
                v-model="state.form.is_hot"
                :items="isHotOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="排序" name="sort">
              <UInput v-model.number="state.form.sort" type="number" placeholder="数字越大越靠前" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">详细信息</span>
          </div>
          <UFormField label="简介" name="summary">
            <UTextarea
              v-model.trim="state.form.summary"
              placeholder="简短介绍(255字符内)"
              class="w-full"
              :rows="2"
            />
          </UFormField>
          <UFormField label="详细描述" name="description">
            <UTextarea
              v-model.trim="state.form.description"
              placeholder="详细描述"
              class="w-full"
              :rows="4"
            />
          </UFormField>
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
</template>
