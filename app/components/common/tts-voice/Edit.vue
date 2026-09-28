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
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')
const avatarFileRef = ref<HTMLInputElement>()
const audioFileRef = ref<HTMLInputElement>()
const toast = useToast()

const state = reactive({
  loading: false,
  avatarLoading: false,
  audioLoading: false,
  form: {} as any
})

const stateOptions = [
  { label: '正常', value: 1 },
  { label: '删除', value: 9 }
]

const vipOptions = [
  { label: '普通语音', value: 0 },
  { label: 'VIP语音', value: 1 }
]

const initFormDefaults = () => ({
  id: 0,
  provider_voice_key: '',
  name: '',
  avatar: '',
  demo_audio: '',
  description: '',
  state: 1,
  vip: 0,
  sort: 0
})

const onAvatarFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file) return

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
    input.value = ''
  }
}

const onAvatarFileClick = () => {
  avatarFileRef.value?.click()
}

const onAudioFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (!file) return
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
    input.value = ''
  }
}

const onAudioFileClick = () => {
  audioFileRef.value?.click()
}

const handleSubmit = async () => {
  const name = String(state.form.name ?? '').trim()
  if (!name) {
    toast.add({ title: '声优名称不能为空', color: 'error' })
    return
  }

  state.loading = true
  const isEdit = Number(state.form.id) > 0
  const postForm: any = {
    provider_voice_key: String(state.form.provider_voice_key ?? '').trim(),
    name,
    avatar: state.form.avatar,
    demo_audio: state.form.demo_audio,
    description: state.form.description,
    state: Number(state.form.state),
    vip: Number(state.form.vip) === 1 ? 1 : 0,
    sort: Number(state.form.sort) || 0
  }

  if (isEdit) {
    postForm.id = state.form.id
  }

  const apiFunc = isEdit ? updateCommonTtsVoice : addCommonTtsVoice
  const { error } = await apiFunc(postForm)
  state.loading = false

  if (!error) {
    toast.add({ title: isEdit ? '修改成功' : '添加成功', color: 'success' })
    emit('refresh')
    closeModal()
  }
}

watch(
  () => props.dialog,
  (visible) => {
    if (visible) {
      state.loading = false
      if (props.currentForm?.id) {
        state.form = cloneDeep(props.currentForm)
      } else {
        state.form = initFormDefaults()
      }
    }
  }
)
</script>

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
        <!-- 声优头像 -->
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
          <UFormField label="第三方 voice_id" name="provider_voice_key">
            <UInput
              v-model.trim="state.form.provider_voice_key"
              placeholder="fish.audio 的 reference_id"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-3 gap-4">
            <UFormField label="状态" name="state">
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="语音类型" name="vip">
              <USelect
                v-model="state.form.vip"
                :items="vipOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="排序权重" name="sort">
              <UInput v-model.number="state.form.sort" type="number" placeholder="数字越大越靠前" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- 详细描述 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">详细描述</span>
          </div>
          <UFormField label="描述" name="description">
            <UTextarea
              v-model.trim="state.form.description"
              placeholder="请输入详细描述"
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
