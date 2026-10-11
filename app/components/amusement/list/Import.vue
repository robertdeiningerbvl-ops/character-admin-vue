<script setup lang="ts">
import { importAmusement } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
}>(), {
  dialog: false
})

const emit = defineEmits(['update:dialog', 'refresh'])

const MAX_FILES = 50
const MAX_FILE_SIZE = 20 * 1024 * 1024

const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const fileRef = ref<HTMLInputElement>()
const toast = useToast()

const form = reactive({
  anonymous: '0',
  publish: '0',
  nsfw: '1',
  source: '0',
  source_url: '',
  default_image: '',
  skip_duplicate: '1'
})

const state = reactive({
  files: [] as File[],
  submitting: false,
  results: null as any
})

const anonymousOptions = [
  { label: '公开', value: '0' },
  { label: '私密', value: '1' }
]

const publishOptions = [
  { label: '直接上架', value: '1' },
  { label: '进入待审核', value: '0' }
]

const nsfwOptions = [
  { label: '自动判断', value: 'auto' },
  { label: '是', value: '1' },
  { label: '否', value: '0' }
]

const sourceOptions = [
  { label: '原创', value: '0' },
  { label: '转载', value: '1' }
]

const skipDuplicateOptions = [
  { label: '跳过同名角色', value: '1' },
  { label: '允许重复', value: '0' }
]

const isSource = computed(() => form.source === '1')
const canSubmit = computed(() => state.files.length > 0 && !state.submitting)

function formatFileSize(size: number) {
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

function openFilePicker() {
  fileRef.value?.click()
}

function addFiles(fileList: FileList | File[]) {
  const incoming = Array.from(fileList)
  const available = MAX_FILES - state.files.length
  if (available <= 0) {
    toast.add({ title: `一次最多导入 ${MAX_FILES} 个文件`, color: 'error' })
    return
  }

  const accepted: File[] = []
  const tooMany = incoming.length > available
  const slice = tooMany ? incoming.slice(0, available) : incoming

  for (const file of slice) {
    const name = file.name.toLowerCase()
    if (!name.endsWith('.png') && !name.endsWith('.json')) {
      toast.add({ title: `「${file.name}」格式不支持，仅支持 .png / .json`, color: 'error' })
      continue
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.add({ title: `「${file.name}」超过 20MB，已跳过`, color: 'error' })
      continue
    }
    accepted.push(file)
  }

  state.files = [...state.files, ...accepted]
  if (tooMany) {
    toast.add({ title: `一次最多导入 ${MAX_FILES} 个文件，已保留前 ${MAX_FILES} 个`, color: 'warning' })
  }
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    addFiles(input.files)
  }
  input.value = ''
}

function handleDrop(e: DragEvent) {
  if (e.dataTransfer?.files?.length) {
    addFiles(e.dataTransfer.files)
  }
}

function removeFile(index: number) {
  state.files.splice(index, 1)
}

function resultStatus(item: any): { label: string, color: 'success' | 'warning' | 'error' } {
  if (item.ok) return { label: '成功', color: 'success' }
  if (item.skipped) return { label: '已跳过', color: 'warning' }
  return { label: '失败', color: 'error' }
}

async function handleSubmit() {
  if (state.files.length === 0) {
    toast.add({ title: '请先选择要导入的角色卡文件', color: 'error' })
    return
  }

  state.submitting = true
  state.results = null

  const fd = new FormData()
  state.files.forEach(file => fd.append('files', file))
  fd.append('anonymous', form.anonymous)
  fd.append('publish', form.publish)
  fd.append('nsfw', form.nsfw)
  fd.append('source', form.source)
  fd.append('source_url', form.source_url.trim())
  fd.append('default_image', form.default_image.trim())
  fd.append('skip_duplicate', form.skip_duplicate)

  const { data, error } = await importAmusement(fd)
  state.submitting = false

  if (error) {
    toast.add({ title: '导入失败，请重试', color: 'error' })
    return
  }

  state.results = data
  if (data?.success > 0) {
    emit('refresh')
    toast.add({ title: `成功导入 ${data.success} 张角色卡`, color: 'success' })
  } else if (data?.failed > 0) {
    toast.add({ title: `导入完成，${data.failed} 张失败`, color: 'warning' })
  }
}

function closeModal() {
  drawerVisible.value = false
}

watch(
  () => props.dialog,
  (visible) => {
    if (visible) {
      state.files = []
      state.results = null
      state.submitting = false
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :ui="{ content: 'sm:max-w-3xl', footer: 'justify-between' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-upload" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">批量导入角色卡</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-5">
        <!-- 文件选择 -->
        <div class="space-y-3">
          <div
            class="cursor-pointer rounded-xl border-2 border-dashed border-(--ui-border) bg-(--ui-bg-elevated) px-5 py-8 text-center transition-colors hover:border-(--ui-primary)"
            @click="openFilePicker"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <UIcon name="i-lucide-file-up" class="mx-auto mb-2 h-8 w-8 text-(--ui-text-muted)" />
            <div class="text-sm text-(--ui-text-highlighted)">点击选择，或将文件拖拽到这里</div>
            <div class="mt-1 text-xs text-(--ui-text-muted)">
              支持 .png（酒馆角色卡图片）和 .json，单文件不超过 20MB，一次最多 50 个
            </div>
            <input
              ref="fileRef"
              type="file"
              accept=".png,.json"
              multiple
              class="hidden"
              @change="handleFileChange"
            >
          </div>

          <div v-if="state.files.length > 0" class="space-y-2">
            <div class="text-xs text-(--ui-text-muted)">已选择 {{ state.files.length }} 个文件</div>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="(file, index) in state.files"
                :key="`${file.name}-${index}`"
                class="flex items-center gap-3 rounded-lg border border-(--ui-border) bg-(--ui-bg) px-3 py-2"
              >
                <UIcon
                  :name="file.name.toLowerCase().endsWith('.png') ? 'i-lucide-image' : 'i-lucide-file-json'"
                  class="h-4 w-4 shrink-0 text-(--ui-text-muted)"
                />
                <span class="min-w-0 flex-1 truncate text-sm">{{ file.name }}</span>
                <span class="shrink-0 text-xs text-(--ui-text-muted)">{{ formatFileSize(file.size) }}</span>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  @click="removeFile(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 导入结果 -->
        <div v-if="state.results" class="rounded-lg border border-(--ui-border) bg-(--ui-bg-elevated) p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-clipboard-check" class="h-4 w-4 text-(--ui-primary)" />
              <span class="text-sm font-medium">导入结果</span>
            </div>
            <div class="flex gap-2">
              <UBadge color="success" variant="subtle">成功 {{ state.results.success }}</UBadge>
              <UBadge color="warning" variant="subtle">跳过 {{ state.results.skipped }}</UBadge>
              <UBadge color="error" variant="subtle">失败 {{ state.results.failed }}</UBadge>
            </div>
          </div>

          <div class="max-h-64 overflow-y-auto space-y-2">
            <div
              v-for="(item, index) in state.results.list"
              :key="index"
              class="flex items-start gap-3 rounded-lg bg-(--ui-bg) px-3 py-2"
            >
              <UBadge :color="resultStatus(item).color" variant="subtle" class="mt-0.5 shrink-0">
                {{ resultStatus(item).label }}
              </UBadge>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm">{{ item.filename }}</div>
                <div class="text-xs text-(--ui-text-muted)">
                  {{ item.error || (item.ok ? `角色：${item.name || '-'}（ID ${item.id}）` : item.name ? `角色：${item.name}` : '处理完成') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 导入选项 -->
        <div class="rounded-lg border border-(--ui-border) bg-(--ui-bg-elevated) p-4 space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings-2" class="h-4 w-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">导入选项</span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="可见性">
              <USelect v-model="form.anonymous" :items="anonymousOptions" class="w-full" />
            </UFormField>
            <UFormField label="上架方式">
              <USelect v-model="form.publish" :items="publishOptions" class="w-full" />
            </UFormField>
            <UFormField label="NSFW">
              <USelect v-model="form.nsfw" :items="nsfwOptions" class="w-full" />
            </UFormField>
            <UFormField label="重复角色">
              <USelect v-model="form.skip_duplicate" :items="skipDuplicateOptions" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="来源">
              <USelect v-model="form.source" :items="sourceOptions" class="w-full" />
            </UFormField>
            <UFormField v-if="isSource" label="转载来源地址">
              <UInput v-model.trim="form.source_url" placeholder="https://..." class="w-full" />
            </UFormField>
          </div>

          <UFormField label="默认封面地址（JSON 角色卡无图片时使用）">
            <UInput v-model.trim="form.default_image" placeholder="https://..." class="w-full" />
          </UFormField>
        </div>

      </div>
    </template>

    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeModal" />
      <UButton
        :loading="state.submitting"
        :disabled="!canSubmit"
        label="开始导入"
        icon="i-lucide-upload"
        @click="handleSubmit"
      />
    </template>
  </UModal>
</template>
