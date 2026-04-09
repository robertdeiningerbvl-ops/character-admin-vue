<script setup lang="ts">
import { uploadFile, getChatHistory, updateAmusementState } from '@/api'

const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state', 'save'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

// 监控封面图变化
const initialCoverImage = ref<string>('')

// 保存初始封面图
watch(() => props.state.amusementId, (newId) => {
  if (newId) {
    initialCoverImage.value = props.state.coverImage || ''
  }
}, { immediate: true })

// 监控封面图变化并自动提交
watch(() => localState.value.coverImage, async (newValue, oldValue) => {
  // 只有在已有 amusementId 且封面图确实变化时才提交
  if (localState.value.amusementId && oldValue !== undefined && newValue !== oldValue) {
    try {
      const { error } = await updateAmusementState({
        id: localState.value.amusementId,
        image: newValue || ''
      })
      if (!error) {
        initialCoverImage.value = newValue || ''
        toast.add({ title: '封面图已更新', color: 'success' })
      }
    } catch (e: any) {
      toast.add({ title: e.message || '更新封面图失败', color: 'error' })
    }
  }
})

// 时间判断函数
const isThisWeek = (timestamp: number | null) => {
  if (!timestamp) return false
  const ts = timestamp < 10000000000 ? timestamp * 1000 : timestamp
  const date = new Date(ts)
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  return date >= weekStart && date < weekEnd
}

const isThisMonth = (timestamp: number | null) => {
  if (!timestamp) return false
  const ts = timestamp < 10000000000 ? timestamp * 1000 : timestamp
  const date = new Date(ts)
  const now = new Date()
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

const formatDate = (timestamp: number | string | null) => {
  if (!timestamp) return ''
  let ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  if (ts <= 0) return ''
  if (ts < 10000000000) ts = ts * 1000
  if (ts < new Date('2000-01-01').getTime()) return ''
  const date = new Date(ts)
  if (isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

// 格式化周推显示
const formatWeekRecommend = (weekRecommend: any) => {
  if (!weekRecommend) return ''
  const arr = Array.isArray(weekRecommend) ? weekRecommend : (typeof weekRecommend === 'string' ? weekRecommend.split(',') : [])
  if (arr.length === 0) return ''
  return ' ' + arr.map((w: string) => `第${w}周`).join('、')
}

// 格式化月推显示
const formatMonthRecommend = (monthRecommend: any) => {
  if (!monthRecommend) return ''
  const arr = Array.isArray(monthRecommend) ? monthRecommend : (typeof monthRecommend === 'string' ? monthRecommend.split(',') : [])
  if (arr.length === 0) return ''
  return ' ' + arr.map((m: string) => `${m}月`).join('、')
}

// 预览相关
const phonePreviewRef = ref<any>(null)
const loadingHistory = ref(false)
const chatHistoryData = ref<{ role: string, content: string }[]>([])

// 加载聊天历史
const loadChatHistory = async () => {
  if (!localState.value.amusementId) {
    chatHistoryData.value = []
    return
  }
  loadingHistory.value = true
  try {
    const { data } = await getChatHistory({
      biz_id: localState.value.amusementId,
      version_id: localState.value.editingVersionId
    })
    const history = data?.history || []
    if (Array.isArray(history) && history.length > 0) {
      chatHistoryData.value = history.map((msg: any) => ({
        role: msg.role || 'assistant',
        content: msg.content || ''
      }))
    } else {
      chatHistoryData.value = []
    }
  } catch {
    chatHistoryData.value = []
  } finally {
    loadingHistory.value = false
  }
}

// 点击预览时加载数据
const handlePreviewClick = async () => {
  phonePreviewRef.value?.handlePreview()
  await loadChatHistory()
}

// 上传状态
const uploadingBg = ref(false)
const uploadingAvatar = ref(false)
const uploadingCover = ref(false)
const uploadingGallery = ref(false)
const exporting = ref(false)

// 文件上传
const bgInputRef = ref<HTMLInputElement | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)
const galleryInputRef = ref<HTMLInputElement | null>(null)
const showBgPicker = ref(false)
const showAvatarPicker = ref(false)
const showCoverPicker = ref(false)
const showGalleryPicker = ref(false)

const handleBgUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingBg.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await uploadFile(formData)
    if (data?.uri) {
      localState.value.backgroundImage = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    }
  } catch (err: any) {
    toast.add({ title: err.message || '上传失败', color: 'error' })
  } finally {
    uploadingBg.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

const handleAvatarUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await uploadFile(formData)
    if (data?.uri) {
      localState.value.avatarImage = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    }
  } catch (err: any) {
    toast.add({ title: err.message || '上传失败', color: 'error' })
  } finally {
    uploadingAvatar.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

const handleBgSelect = (url: string) => {
  props.state.backgroundImage = url
  toast.add({ title: '选择成功', color: 'success' })
}

const handleAvatarSelect = (url: string) => {
  props.state.avatarImage = url
  toast.add({ title: '选择成功', color: 'success' })
}

const handleCoverUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await uploadFile(formData)
    if (data?.uri) {
      localState.value.coverImage = data.uri
      toast.add({ title: '上传成功', color: 'success' })
    }
  } catch (err: any) {
    toast.add({ title: err.message || '上传失败', color: 'error' })
  } finally {
    uploadingCover.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

const handleCoverSelect = (url: string) => {
  props.state.coverImage = url
  toast.add({ title: '选择成功', color: 'success' })
}

const handleGalleryUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || files.length === 0) return
  uploadingGallery.value = true
  try {
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await uploadFile(formData)
      if (data?.uri) {
        localState.value.images.push(data.uri)
      }
    }
    toast.add({ title: '上传成功', color: 'success' })
  } catch (err: any) {
    toast.add({ title: err.message || '上传失败', color: 'error' })
  } finally {
    uploadingGallery.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

const removeGalleryImage = (index: number) => {
  localState.value.images.splice(index, 1)
}

const handleGallerySelect = (url: string) => {
  localState.value.images.push(url)
  toast.add({ title: '添加成功', color: 'success' })
}

// 显示的头像
const displayAvatar = computed(() => localState.value.avatarImage || localState.value.backgroundImage)

// Token 估算
const estimateTokens = (text: string): number => {
  if (!text) return 0
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const otherChars = text.length - chineseChars
  return Math.ceil(chineseChars / 2 + otherChars / 4)
}

const tokenStats = computed(() => {
  const settingsText = [
    localState.value.name,
    localState.value.description,
    localState.value.personality,
    localState.value.scenario,
    localState.value.mesExample,
    localState.value.systemPrompt,
    localState.value.creatorNotes,
    ...localState.value.greetings
  ].join('')
  const settingsTokens = estimateTokens(settingsText)
  const worldBookText = localState.value.worldBookEntries.map((e: any) =>
    `${(e.keys || []).join(',')}${e.content || ''}`
  ).join('')
  const worldBookTokens = estimateTokens(worldBookText)
  const regexText = localState.value.regexEntries.map((e: any) =>
    `${e.scriptName}${e.findRegex}${e.replaceString}`
  ).join('')
  const regexTokens = estimateTokens(regexText)
  const guideText = localState.value.quickReplies.map((r: any) => r.content).join('')
  const guideTokens = estimateTokens(guideText)

  return {
    total: settingsTokens + worldBookTokens + regexTokens + guideTokens,
    settings: settingsTokens,
    worldBook: localState.value.worldBookEntries.length,
    regex: localState.value.regexEntries.length,
    guide: localState.value.quickReplies.filter((r: any) => (r.content || '').trim()).length
  }
})

// 构建角色卡数据
const buildCharacterData = () => {
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    name: localState.value.name,
    anohana: {
      image: localState.value.backgroundImage,
      avatar: localState.value.avatarImage || localState.value.backgroundImage,
      images: localState.value.images,
      source: localState.value.isRepost,
      source_url: localState.value.sourceUrl,
      summary: localState.value.summary,
      anonymous: localState.value.isPrivate,
      nsfw: localState.value.isNsfw,
      guide: localState.value.quickReplies.filter((r: any) => (r.content || '').trim()).map((r: any) => r.content)
    },
    data: {
      name: localState.value.name,
      description: localState.value.description,
      personality: localState.value.personality,
      scenario: localState.value.scenario,
      mes_example: localState.value.mesExample,
      first_mes: localState.value.greetings[0] || '',
      alternate_greetings: localState.value.greetings.slice(1),
      creator_notes: localState.value.creatorNotes,
      system_prompt: localState.value.systemPrompt,
      creator: localState.value.creatorName,
      tags: localState.value.tags,
      character_book: localState.value.worldBookEntries.length > 0
        ? {
            name: localState.value.worldBookName || `${localState.value.name}的世界书`,
            entries: localState.value.worldBookEntries
          }
        : undefined,
      regex: localState.value.regexEntries.length > 0 ? localState.value.regexEntries : undefined
    }
  }
}

// 导出JSON
const handleExportJson = () => {
  if (!localState.value.description?.trim()) {
    toast.add({ title: '请先填写角色描述', color: 'error' })
    return
  }
  const data = buildCharacterData()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${localState.value.name || 'character'}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'JSON 导出成功', color: 'success' })
}

// 导出PNG
const handleExportPng = async () => {
  if (!localState.value.backgroundImage) {
    toast.add({ title: '请先上传背景图', color: 'error' })
    return
  }
  if (!localState.value.description?.trim()) {
    toast.add({ title: '请先填写角色描述', color: 'error' })
    return
  }
  exporting.value = true
  try {
    const data = buildCharacterData()
    const json = JSON.stringify(data)
    const base64Data = btoa(unescape(encodeURIComponent(json)))

    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = localState.value.backgroundImage
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const dataUrl = canvas.toDataURL('image/png')
    const binaryString = atob(dataUrl.split(',')[1] || '')
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const pngWithChunk = insertPngTextChunk(bytes, 'chara', base64Data)
    const blob = new Blob([pngWithChunk], { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${localState.value.name || 'character'}.png`
    a.click()
    URL.revokeObjectURL(url)
    toast.add({ title: 'PNG 导出成功', color: 'success' })
  } catch (e: any) {
    toast.add({ title: e.message || '导出失败', color: 'error' })
  } finally {
    exporting.value = false
  }
}

// PNG tEXt chunk 插入函数
const insertPngTextChunk = (pngData: Uint8Array, keyword: string, text: string): Uint8Array => {
  const crcTable: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c
  }
  const crc32 = (data: Uint8Array): number => {
    let crc = 0xffffffff
    for (let i = 0; i < data.length; i++) {
      crc = crcTable[(crc ^ (data[i] ?? 0)) & 0xff]! ^ (crc >>> 8)
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  const keywordBytes = new TextEncoder().encode(keyword)
  const textBytes = new TextEncoder().encode(text)
  const chunkData = new Uint8Array(keywordBytes.length + 1 + textBytes.length)
  chunkData.set(keywordBytes, 0)
  chunkData[keywordBytes.length] = 0
  chunkData.set(textBytes, keywordBytes.length + 1)

  const chunkType = new TextEncoder().encode('tEXt')
  const chunkLength = chunkData.length
  const chunk = new Uint8Array(4 + 4 + chunkLength + 4)

  chunk[0] = (chunkLength >> 24) & 0xff
  chunk[1] = (chunkLength >> 16) & 0xff
  chunk[2] = (chunkLength >> 8) & 0xff
  chunk[3] = chunkLength & 0xff
  chunk.set(chunkType, 4)
  chunk.set(chunkData, 8)

  const crcData = new Uint8Array(4 + chunkLength)
  crcData.set(chunkType, 0)
  crcData.set(chunkData, 4)
  const crcValue = crc32(crcData)
  chunk[8 + chunkLength] = (crcValue >> 24) & 0xff
  chunk[8 + chunkLength + 1] = (crcValue >> 16) & 0xff
  chunk[8 + chunkLength + 2] = (crcValue >> 8) & 0xff
  chunk[8 + chunkLength + 3] = crcValue & 0xff

  let insertPos = 8
  while (insertPos < pngData.length - 12) {
    const len = ((pngData[insertPos] ?? 0) << 24) | ((pngData[insertPos + 1] ?? 0) << 16)
      | ((pngData[insertPos + 2] ?? 0) << 8) | (pngData[insertPos + 3] ?? 0)
    const type = String.fromCharCode(
      pngData[insertPos + 4] ?? 0, pngData[insertPos + 5] ?? 0,
      pngData[insertPos + 6] ?? 0, pngData[insertPos + 7] ?? 0
    )
    insertPos += 12 + len
    if (type === 'IHDR') break
  }

  const result = new Uint8Array(pngData.length + chunk.length)
  result.set(pngData.slice(0, insertPos), 0)
  result.set(chunk, insertPos)
  result.set(pngData.slice(insertPos), insertPos + chunk.length)
  return result
}
</script>

<template>
  <div class="flex gap-6 p-6 h-full min-h-0">
    <!-- 左侧：手机预览（使用共用组件） -->
    <div class="w-[388px] shrink-0 flex flex-col overflow-hidden">
      <AmusementPhonePreview
        ref="phonePreviewRef"
        :name="localState.name"
        :background-image="localState.backgroundImage"
        :avatar-image="localState.avatarImage"
        :greetings="localState.greetings"
        :chat-history="chatHistoryData"
        :loading="loadingHistory"
        :show-toggle="true"
        @preview="loadChatHistory"
      />
    </div>

    <!-- 右侧：信息区 -->
    <div class="flex-1 space-y-6 overflow-auto pr-2">
      <!-- 图片上传区 -->
      <div class="flex gap-5">
        <!-- 背景图上传 -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">背景图</label>
            <UButton size="xs" variant="ghost" icon="i-lucide-images" @click="showBgPicker = true">图片库</UButton>
          </div>
          <div
            class="h-44 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all overflow-hidden group"
            @click="!uploadingBg && bgInputRef?.click()"
          >
            <template v-if="uploadingBg">
              <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-gray-400 mb-2 animate-spin" />
              <span class="text-sm text-gray-500">上传中...</span>
            </template>
            <template v-else-if="localState.backgroundImage">
              <img :key="localState.backgroundImage" :src="localState.backgroundImage" alt="背景" loading="lazy" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <UIcon name="i-lucide-image-plus" class="w-10 h-10 text-gray-400 mb-2 group-hover:text-primary-500 transition-colors" />
              <span class="text-sm text-gray-500 group-hover:text-primary-500 transition-colors">点击上传背景图</span>
            </template>
          </div>
        </div>
        <input
          ref="bgInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleBgUpload"
        >

        <!-- 头像上传 -->
        <div class="w-44">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">头像</label>
            <UButton size="xs" variant="ghost" icon="i-lucide-images" @click="showAvatarPicker = true">图片库</UButton>
          </div>
          <div
            class="h-44 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all overflow-hidden group"
            @click="!uploadingAvatar && avatarInputRef?.click()"
          >
            <template v-if="uploadingAvatar">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-gray-400 mb-1 animate-spin" />
              <span class="text-sm text-gray-500">上传中...</span>
            </template>
            <template v-else-if="displayAvatar">
              <img :key="displayAvatar" :src="displayAvatar" alt="头像" loading="lazy" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <UIcon name="i-lucide-user-circle" class="w-10 h-10 text-gray-400 mb-2 group-hover:text-primary-500 transition-colors" />
              <span class="text-sm text-gray-500 group-hover:text-primary-500 transition-colors">点击上传头像</span>
            </template>
          </div>
        </div>
        <input
          ref="avatarInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarUpload"
        >
      </div>

      <!-- 封面图上传 -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">封面图</label>
          <UButton size="xs" variant="ghost" icon="i-lucide-images" @click="showCoverPicker = true">图片库</UButton>
        </div>
        <div
          class="w-64 h-80 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all overflow-hidden group"
          @click="!uploadingCover && coverInputRef?.click()"
        >
          <template v-if="uploadingCover">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-gray-400 mb-2 animate-spin" />
            <span class="text-sm text-gray-500">上传中...</span>
          </template>
          <template v-else-if="localState.coverImage">
            <img :key="localState.coverImage" :src="localState.coverImage" alt="封面" loading="lazy" class="w-full h-full object-cover" />
          </template>
          <template v-else>
            <UIcon name="i-lucide-image-plus" class="w-10 h-10 text-gray-400 mb-2 group-hover:text-primary-500 transition-colors" />
            <span class="text-sm text-gray-500 group-hover:text-primary-500 transition-colors">点击上传封面图</span>
          </template>
        </div>
        <input
          ref="coverInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleCoverUpload"
        >
      </div>

      <!-- 图片合集 -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">图片合集</label>
          <UButton size="xs" variant="ghost" icon="i-lucide-images" @click="showGalleryPicker = true">图片库</UButton>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div v-for="(img, idx) in localState.images" :key="idx" class="relative group h-32 rounded-lg overflow-hidden">
            <img :src="img" class="w-full h-full object-cover" />
            <button @click="removeGalleryImage(idx)" class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>
          <div class="h-32 rounded-lg bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all group" @click="galleryInputRef?.click()">
            <UIcon name="i-lucide-plus" class="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </div>
        <input ref="galleryInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleGalleryUpload" />
      </div>

      <!-- 设置开关 -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">发布设置</span>
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <span class="text-sm text-gray-600 dark:text-gray-400">转载</span>
              <USwitch v-model="localState.isRepost" size="sm" />
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <span class="text-sm text-gray-600 dark:text-gray-400">隐私</span>
              <USwitch v-model="localState.isPrivate" size="sm" />
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <span class="text-sm text-gray-600 dark:text-gray-400">NSFW</span>
              <USwitch v-model="localState.isNsfw" size="sm" />
            </label>
          </div>
        </div>
        <div v-if="localState.isRepost" class="flex items-center gap-3">
          <UIcon name="i-lucide-link" class="w-4 h-4 text-gray-400 shrink-0" />
          <UInput
            v-model="localState.sourceUrl"
            placeholder="请输入原作品链接..."
            class="flex-1"
          />
        </div>
      </div>

      <!-- 导出按钮 -->
      <div class="flex gap-3">
        <button
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm"
          @click="handleExportJson"
        >
          <UIcon name="i-lucide-file-json" class="w-4 h-4 text-blue-500" />
          导出 JSON
        </button>
        <button
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm disabled:opacity-50"
          :disabled="exporting"
          @click="handleExportPng"
        >
          <UIcon v-if="exporting" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-lucide-image" class="w-4 h-4 text-green-500" />
          {{ exporting ? '导出中...' : '导出 PNG' }}
        </button>
      </div>

      <!-- Token 统计 -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4 text-gray-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Token 统计</span>
        </div>
        <div class="grid grid-cols-5 gap-3">
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {{ tokenStats.total }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              总计
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ tokenStats.settings }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              设定
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ tokenStats.worldBook }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              世界书
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ tokenStats.regex }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              正则
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ tokenStats.guide }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              引导词
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏统计 -->
      <div v-if="localState.amusementId" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-activity" class="w-4 h-4 text-gray-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">数据统计</span>
        </div>
        <div class="grid grid-cols-4 gap-3 mb-3">
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-orange-500">
              {{ localState.stats.battery }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              妖力
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-pink-500">
              {{ localState.stats.praiseCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              点赞
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-blue-500">
              {{ localState.stats.collectCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              收藏
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-green-500">
              {{ localState.stats.commentCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              评论
            </div>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-3">
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-purple-500">
              {{ localState.stats.dialogueCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              对话数
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-cyan-500">
              {{ localState.stats.playCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              游玩数
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-blue-500">
              {{ localState.stats.browseCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              浏览量
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-yellow-500">
              {{ localState.stats.score }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              评分
            </div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-900 rounded-lg text-center shadow-sm">
            <div class="text-xl font-semibold text-gray-600 dark:text-gray-400">
              {{ localState.stats.scoreCount }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              评分人数
            </div>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div v-if="localState.amusementId" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>创作时间: {{ formatDate(localState.createdAt) }}</span>
          <span>更新时间: {{ formatDate(localState.updatedAt) }}</span>
        </div>
      </div>

      <!-- 状态标记 -->
      <div v-if="localState.amusementId" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-tags" class="w-4 h-4 text-gray-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">状态标记</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <!-- 发布状态 -->
          <UBadge
            :color="localState.amusementState === 2 ? 'success' : 'warning'"
            variant="soft"
          >
            {{ localState.amusementState === 2 ? '已发布' : localState.amusementState === 0 ? '待审核' : '未通过' }}
          </UBadge>
          <!-- 推荐 -->
          <UBadge
            v-if="localState.recommend === 2"
            color="primary"
            variant="soft"
          >
            推荐
          </UBadge>
          <!-- 日推 -->
          <UBadge
            v-if="localState.dayRecommend === 2"
            color="info"
            variant="soft"
          >
            日推
          </UBadge>
          <!-- 周推 -->
          <UBadge
            v-if="localState.weekRecommend && (Array.isArray(localState.weekRecommend) ? localState.weekRecommend.length > 0 : localState.weekRecommend !== '')"
            color="cyan"
            variant="soft"
          >
            周推{{ formatWeekRecommend(localState.weekRecommend) }}
          </UBadge>
          <!-- 月推 -->
          <UBadge
            v-if="localState.monthRecommend && (Array.isArray(localState.monthRecommend) ? localState.monthRecommend.length > 0 : localState.monthRecommend !== '')"
            color="purple"
            variant="soft"
          >
            月推{{ formatMonthRecommend(localState.monthRecommend) }}
          </UBadge>
          <!-- 推荐时间 -->
          <UBadge
            v-if="localState.recommendTime && formatDate(localState.recommendTime)"
            color="neutral"
            variant="soft"
          >
            {{ formatDate(localState.recommendTime) }}
          </UBadge>
          <!-- 隐私 -->
          <UBadge
            v-if="localState.isPrivate"
            color="neutral"
            variant="soft"
          >
            隐私
          </UBadge>
          <!-- NSFW -->
          <UBadge
            v-if="localState.isNsfw"
            color="error"
            variant="soft"
          >
            NSFW
          </UBadge>
          <!-- 转载 -->
          <UBadge
            v-if="localState.isRepost"
            color="warning"
            variant="soft"
          >
            转载
          </UBadge>
          <!-- 草稿 -->
          <UBadge
            v-if="localState.amusementDraft === 2"
            color="neutral"
            variant="outline"
          >
            草稿
          </UBadge>
        </div>
      </div>
    </div>
  </div>

  <CommonImagePicker v-model:dialog="showBgPicker" @select="handleBgSelect" />
  <CommonImagePicker v-model:dialog="showAvatarPicker" @select="handleAvatarSelect" />
  <CommonImagePicker v-model:dialog="showCoverPicker" @select="handleCoverSelect" />
  <CommonImagePicker v-model:dialog="showGalleryPicker" @select="handleGallerySelect" />
</template>
