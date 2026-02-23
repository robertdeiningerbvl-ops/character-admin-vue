<script setup lang="ts">
import { uploadFile, getChatHistory } from '@/api'

const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state', 'save'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

// 预览状态
const showPreview = ref(false)
const loadingHistory = ref(false)
const chatHistory = ref<{ role: string, raw: string, kind: 'text' | 'html' | 'iframe' | 'mixed', html: string, text?: string }[]>([])
const chatContentRef = ref<HTMLDivElement | null>(null)

// 检测是否包含HTML
const containsHTML = (str: string): boolean => {
  return /<[^>]+>/.test(str || '')
}

// 渲染消息
const renderMessage = (content: string): { kind: 'text' | 'html' | 'iframe' | 'mixed', html: string, text?: string } => {
  if (!content) return { kind: 'text', html: '' }

  // 检测是否是完整HTML文档（iframe）
  const isFullDoc = /<!DOCTYPE|<html[^>]*>|<head[^>]*>|<body[^>]*>/i.test(content)
  if (isFullDoc) {
    const m = content.match(/(<!DOCTYPE[\s\S]*|<html[\s\S]*)/i)
    if (m && m.index !== undefined && m.index > 0) {
      let cleanText = content.slice(0, m.index)
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/```html\s*$/gm, '')
        .replace(/<\/?content>/gi, '')
        .trim()
      return { kind: 'mixed', text: cleanText, html: m[0] }
    }
    return { kind: 'iframe', html: content }
  }

  // 检测是否包含HTML标签
  if (containsHTML(content)) {
    return { kind: 'html', html: content }
  }

  // 纯文本
  return { kind: 'text', html: '' }
}

// 加载聊天历史
const loadChatHistory = async () => {
  if (!localState.value.amusementId) {
    chatHistory.value = []
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
      chatHistory.value = history.map((msg: any) => {
        const rendered = renderMessage(msg.content || '')
        return {
          role: msg.role || 'assistant',
          raw: msg.content || '',
          kind: rendered.kind,
          html: rendered.html,
          text: rendered.text || ''
        }
      })
    } else {
      chatHistory.value = []
    }
  } catch {
    chatHistory.value = []
  } finally {
    loadingHistory.value = false
  }
}

// 点击预览
const handlePreview = async () => {
  showPreview.value = true
  await loadChatHistory()
}

// 上传状态
const uploadingBg = ref(false)
const uploadingAvatar = ref(false)
const exporting = ref(false)

// 文件上传
const bgInputRef = ref<HTMLInputElement | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)

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
      source: localState.value.isRepost,
      source_url: localState.value.sourceUrl,
      summary: localState.value.summary,
      anonymous: localState.value.isPrivate,
      nsfw: localState.value.isNsfw,
      guide: localState.value.quickReplies.filter((r: any) => (r.content || '').trim())
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
    const binaryString = atob(dataUrl.split(',')[1])
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
      crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
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
    const len = (pngData[insertPos] << 24) | (pngData[insertPos + 1] << 16)
      | (pngData[insertPos + 2] << 8) | pngData[insertPos + 3]
    const type = String.fromCharCode(
      pngData[insertPos + 4], pngData[insertPos + 5],
      pngData[insertPos + 6], pngData[insertPos + 7]
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
    <!-- 左侧：手机预览 -->
    <div class="w-72 shrink-0 flex flex-col">
      <!-- 未预览状态 -->
      <div
        v-if="!showPreview"
        class="flex-1 min-h-[500px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:border-gray-400 dark:hover:border-gray-600"
      >
        <UIcon name="i-lucide-eye" class="w-12 h-12 text-gray-400 mb-4" />
        <span class="text-gray-500 dark:text-gray-400 mb-5 text-sm">点击预览聊天效果</span>
        <UButton size="sm" :loading="loadingHistory" @click="handlePreview">
          <template #leading>
            <UIcon name="i-lucide-eye" class="w-4 h-4" />
          </template>
          {{ loadingHistory ? '加载中...' : '预览' }}
        </UButton>
      </div>

      <!-- 预览状态 -->
      <template v-else>
        <div class="flex-1 min-h-[500px] rounded-[2rem] border-[6px] border-gray-800 dark:border-gray-900 bg-gray-800 shadow-2xl overflow-hidden flex flex-col">
          <div
            class="flex-1 min-h-0 flex flex-col relative"
            :style="{
              backgroundImage: localState.backgroundImage ? `url(${localState.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >
            <!-- 默认渐变背景 -->
            <div v-if="!localState.backgroundImage" class="absolute inset-0 bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-gray-700 dark:to-gray-800" />

            <!-- 顶部栏 -->
            <div class="relative z-10 flex items-center justify-center px-4 py-3 bg-black/40 backdrop-blur-sm shrink-0">
              <div class="text-center">
                <div class="font-medium text-white text-sm drop-shadow-md">
                  {{ localState.name || '未命名角色' }}
                </div>
                <div class="text-xs text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  24小时在线
                </div>
              </div>
            </div>

            <!-- 聊天内容区 -->
            <div ref="chatContentRef" class="flex-1 min-h-0 relative z-10 p-3 overflow-y-auto space-y-3">
              <!-- 加载中 -->
              <div v-if="loadingHistory" class="flex items-center justify-center h-full">
                <span class="text-gray-400 text-sm">加载聊天记录中...</span>
              </div>

              <!-- 有聊天记录 -->
              <template v-else-if="chatHistory.length > 0">
                <div
                  v-for="(msg, idx) in chatHistory"
                  :key="idx"
                  :class="['flex', (msg.kind === 'iframe' || msg.kind === 'mixed') ? 'w-full' : (msg.role === 'user' ? 'justify-end' : 'justify-start')]"
                >
                  <!-- 头像 -->
                  <img
                    v-if="msg.role !== 'user' && msg.kind !== 'iframe' && msg.kind !== 'mixed' && displayAvatar"
                    :src="displayAvatar"
                    alt=""
                    class="w-8 h-8 rounded-full mr-2 shrink-0 object-cover"
                  >

                  <!-- iframe 消息 -->
                  <div v-if="msg.kind === 'iframe'" class="w-full rounded-lg overflow-hidden">
                    <iframe
                      class="w-full border-0"
                      style="min-height: 300px"
                      :srcdoc="msg.html"
                      sandbox="allow-scripts allow-same-origin allow-modals"
                      @load="(e: Event) => {
                        const iframe = e.target as HTMLIFrameElement
                        try {
                          const h = iframe.contentWindow?.document?.body?.scrollHeight || 300
                          iframe.style.height = h + 'px'
                        }
                        catch {}
                      }"
                    />
                  </div>

                  <!-- mixed 消息 -->
                  <div v-else-if="msg.kind === 'mixed'" class="w-full">
                    <div class="bg-white/80 backdrop-blur rounded-lg p-2 text-sm text-gray-700 mb-2">{{ msg.text }}</div>
                    <div class="rounded-lg overflow-hidden">
                      <iframe
                        class="w-full border-0"
                        style="min-height: 300px"
                        :srcdoc="msg.html"
                        sandbox="allow-scripts allow-same-origin allow-modals"
                        @load="(e: Event) => {
                          const iframe = e.target as HTMLIFrameElement
                          try {
                            const h = iframe.contentWindow?.document?.body?.scrollHeight || 300
                            iframe.style.height = h + 'px'
                          }
                          catch {}
                        }"
                      />
                    </div>
                  </div>

                  <!-- 普通消息 -->
                  <div
                    v-else
                    :class="[
                      'max-w-[75%] rounded-lg p-2 text-sm',
                      msg.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-white/80 backdrop-blur text-gray-700'
                    ]"
                  >
                    <span v-if="msg.kind === 'text'">{{ msg.raw }}</span>
                    <div v-else-if="msg.kind === 'html'" class="message-content" v-html="msg.html" />
                  </div>
                </div>
              </template>

              <!-- 无聊天记录，显示第一句话 -->
              <template v-else-if="localState.greetings[0]">
                <div class="flex justify-start">
                  <img
                    v-if="displayAvatar"
                    :src="displayAvatar"
                    alt=""
                    class="w-8 h-8 rounded-full mr-2 shrink-0 object-cover"
                  >
                  <div class="bg-white/80 backdrop-blur rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-w-[75%]">
                    {{ localState.greetings[0].slice(0, 200) }}{{ localState.greetings[0].length > 200 ? '...' : '' }}
                  </div>
                </div>
              </template>

              <!-- 无内容 -->
              <div v-else class="flex items-center justify-center h-full">
                <span class="text-gray-400 text-sm">暂无聊天记录</span>
              </div>
            </div>

            <!-- 底部输入框 -->
            <div class="relative z-10 p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-400">
                  说点什么...
                </div>
                <div class="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-md">
                  <UIcon name="i-lucide-send" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          class="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1.5"
          @click="showPreview = false"
        >
          <UIcon name="i-lucide-eye-off" class="w-3.5 h-3.5" />
          关闭预览
        </button>
      </template>
    </div>

    <!-- 右侧：信息区 -->
    <div class="flex-1 space-y-6 overflow-auto pr-2">
      <!-- 图片上传区 -->
      <div class="flex gap-5">
        <!-- 背景图上传 -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">背景图</label>
          <div
            class="h-44 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all overflow-hidden group"
            @click="!uploadingBg && bgInputRef?.click()"
          >
            <template v-if="uploadingBg">
              <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-gray-400 mb-2 animate-spin" />
              <span class="text-sm text-gray-500">上传中...</span>
            </template>
            <template v-else-if="localState.backgroundImage">
              <img :src="localState.backgroundImage" alt="背景" class="w-full h-full object-cover">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">头像</label>
          <div
            class="h-44 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 transition-all overflow-hidden group"
            @click="!uploadingAvatar && avatarInputRef?.click()"
          >
            <template v-if="uploadingAvatar">
              <UIcon name="i-lucide-loader-2" class="w-6 h-6 text-gray-400 mb-1 animate-spin" />
              <span class="text-sm text-gray-500">上传中...</span>
            </template>
            <template v-else-if="displayAvatar">
              <img :src="displayAvatar" alt="头像" class="w-full h-full object-cover">
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
              电量
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
        <div class="grid grid-cols-4 gap-3">
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
</template>
