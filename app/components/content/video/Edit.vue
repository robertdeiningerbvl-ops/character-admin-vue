<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addVideo, updateVideo, uploadVideoFile, uploadFile } from '@/api'
import { formatDuration } from './columns'

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
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const videoInputRef = useTemplateRef<HTMLInputElement>('videoInputRef')
const coverInputRef = useTemplateRef<HTMLInputElement>('coverInputRef')

const pickVideo = () => videoInputRef.value?.click()
const pickCover = () => coverInputRef.value?.click()
const toast = useToast()

const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'm4v']
const MAX_VIDEO_SIZE = 500 * 1024 * 1024

const stateOptions = [
  { label: '上架', value: 1 },
  { label: '下架', value: 2 }
]

const state = reactive({
  loading: false,
  videoUploading: false,
  coverUploading: false,
  // 本地选择的视频，用于截取封面（远程地址跨域无法截帧）
  localVideoUrl: '',
  tags: [] as string[],
  form: {} as any
})

const previewSrc = computed(() => state.localVideoUrl || state.form.url || '')

function revokeLocal() {
  if (state.localVideoUrl) {
    URL.revokeObjectURL(state.localVideoUrl)
    state.localVideoUrl = ''
  }
}

function uploadedUri(data: any) {
  return data?.uri || data?.url || ''
}

async function handleVideoFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!VIDEO_EXTS.includes(ext)) {
    toast.add({ title: '仅支持 mp4 / mov / webm / m4v', color: 'error' })
    return
  }
  if (file.size > MAX_VIDEO_SIZE) {
    toast.add({ title: '视频不能超过 500MB', color: 'error' })
    return
  }

  revokeLocal()
  state.localVideoUrl = URL.createObjectURL(file)
  if (!state.form.title) {
    state.form.title = file.name.replace(/\.[^.]+$/, '')
  }

  state.videoUploading = true
  const formData = new FormData()
  formData.append('file', file)
  const { data, error } = await uploadVideoFile(formData)
  state.videoUploading = false
  if (error) return
  const uri = uploadedUri(data)
  if (uri) {
    state.form.url = uri
    toast.add({ title: '视频上传成功', color: 'success' })
  }
}

// 读取时长和宽高
function onLoadedMetadata() {
  const v = videoRef.value
  if (!v) return
  if (Number.isFinite(v.duration)) state.form.duration = Math.round(v.duration)
  if (v.videoWidth) state.form.width = v.videoWidth
  if (v.videoHeight) state.form.height = v.videoHeight
}

async function uploadCoverBlob(blob: Blob, name: string) {
  state.coverUploading = true
  const formData = new FormData()
  formData.append('image', blob, name)
  const { data, error } = await uploadFile(formData)
  state.coverUploading = false
  if (error) return
  const uri = uploadedUri(data)
  if (uri) {
    state.form.cover = uri
    toast.add({ title: '封面已更新', color: 'success' })
  }
}

async function handleCoverFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  await uploadCoverBlob(file, file.name)
}

// 用当前播放帧作为封面
function captureCover() {
  const v = videoRef.value
  if (!v || !v.videoWidth) {
    toast.add({ title: '视频还没加载好', color: 'warning' })
    return
  }
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth
  canvas.height = v.videoHeight
  try {
    canvas.getContext('2d')?.drawImage(v, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) uploadCoverBlob(blob, `cover-${Date.now()}.jpg`)
    }, 'image/jpeg', 0.88)
  } catch {
    toast.add({ title: '无法截取该视频画面，请手动上传封面', color: 'warning' })
  }
}

async function onSubmit() {
  if (!state.form.url) {
    toast.add({ title: '请先上传视频', color: 'warning' })
    return
  }
  state.loading = true
  const postForm = cloneDeep(state.form)
  postForm.tags = state.tags.map(t => t.trim()).filter(Boolean).join(',')
  if (postForm.id) delete postForm.state
  const { error } = await (postForm.id ? updateVideo : addVideo)(postForm)
  state.loading = false
  if (!error) {
    toast.add({ title: '保存成功', color: 'success' })
    closeModal()
    emit('refresh')
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.videoUploading = false
    state.coverUploading = false
    const f = cloneDeep(props.currentForm || {})
    state.form = {
      id: f.id,
      title: f.title || '',
      description: f.description || '',
      url: f.url || '',
      cover: f.cover || '',
      duration: f.duration || 0,
      width: f.width || 0,
      height: f.height || 0,
      sort: f.sort || 0,
      state: f.state || 1
    }
    state.tags = String(f.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
  } else {
    revokeLocal()
  }
})

onBeforeUnmount(revokeLocal)
</script>

<template>
  <UModal v-model:open="drawerVisible" :dismissible="!state.videoUploading" :ui="{ content: 'sm:max-w-3xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-clapperboard" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑视频' : '上传视频' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="grid gap-5 md:grid-cols-[240px_minmax(0,1fr)]"
        @submit="onSubmit"
      >
        <!-- 左：视频与封面 -->
        <div class="space-y-3">
          <div class="relative aspect-[9/16] rounded-lg overflow-hidden bg-black border border-(--ui-border)">
            <video
              v-if="previewSrc"
              ref="videoRef"
              :src="previewSrc"
              class="w-full h-full object-contain"
              controls
              playsinline
              preload="metadata"
              @loadedmetadata="onLoadedMetadata"
            />
            <button
              v-else
              type="button"
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer text-(--ui-text-muted) hover:text-(--ui-text) transition-colors"
              @click="pickVideo"
            >
              <UIcon name="i-lucide-upload-cloud" class="w-10 h-10" />
              <span class="text-sm">点击选择视频</span>
              <span class="text-xs text-(--ui-text-dimmed)">mp4 / mov / webm / m4v，≤500MB</span>
            </button>
            <div
              v-if="state.videoUploading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white"
            >
              <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin" />
              <span class="text-sm">视频上传中，请勿关闭</span>
            </div>
          </div>

          <input ref="videoInputRef" type="file" accept=".mp4,.mov,.webm,.m4v,video/*" class="hidden" @change="handleVideoFile" />
          <UButton
            block
            color="neutral"
            variant="outline"
            icon="i-lucide-film"
            :loading="state.videoUploading"
            :label="state.form.url ? '更换视频' : '选择视频'"
            @click="pickVideo"
          />

          <div v-if="state.form.duration || state.form.width" class="flex justify-between text-xs text-(--ui-text-muted) font-mono">
            <span>{{ formatDuration(state.form.duration) }}</span>
            <span v-if="state.form.width">{{ state.form.width }}×{{ state.form.height }}</span>
          </div>
        </div>

        <!-- 右：信息 -->
        <div class="space-y-4 min-w-0">
          <UFormField label="标题" name="title" required>
            <UInput v-model.trim="state.form.title" placeholder="视频标题，最多 200 字" maxlength="200" class="w-full" />
          </UFormField>

          <UFormField label="简介" name="description">
            <UTextarea v-model="state.form.description" :rows="3" autoresize placeholder="选填" class="w-full" />
          </UFormField>

          <UFormField label="标签" name="tags" help="输入后按回车添加">
            <UInputTags v-model="state.tags" placeholder="例如：古风、狐娘" class="w-full" />
          </UFormField>

          <UFormField label="封面" name="cover">
            <div class="flex items-start gap-3">
              <div class="w-[72px] h-[96px] rounded-md overflow-hidden bg-(--ui-bg-elevated) border border-(--ui-border) flex-shrink-0 flex items-center justify-center">
                <img v-if="state.form.cover" :src="state.form.cover" class="w-full h-full object-cover" />
                <UIcon v-else name="i-lucide-image" class="w-6 h-6 text-(--ui-text-muted)" />
              </div>
              <div class="flex flex-col gap-2">
                <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverFile" />
                <UButton
                  size="sm"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-image-up"
                  label="上传封面"
                  :loading="state.coverUploading"
                  @click="pickCover"
                />
                <UButton
                  v-if="state.localVideoUrl"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-scan"
                  label="用当前画面做封面"
                  :disabled="state.coverUploading"
                  @click="captureCover"
                />
                <p v-if="state.localVideoUrl" class="text-xs text-(--ui-text-dimmed)">先把视频拖到想要的画面再点</p>
              </div>
            </div>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="排序" name="sort" help="越大越靠前">
              <UInput v-model.number="state.form.sort" type="number" class="w-full" />
            </UFormField>
            <UFormField v-if="!state.form.id" label="状态" name="state">
              <USelect v-model="state.form.state" :items="stateOptions" class="w-full" />
            </UFormField>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" :disabled="state.videoUploading" @click="closeModal" />
      <UButton
        :loading="state.loading"
        :disabled="state.videoUploading || state.coverUploading || !state.form.url"
        label="保存"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
