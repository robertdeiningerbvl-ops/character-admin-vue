<script setup lang="ts">
import { createRenderer } from '@/utils/messageRenderer'

interface ChatMessage {
  role: string
  content: string
}

interface Props {
  name?: string
  backgroundImage?: string
  avatarImage?: string
  greetings?: string[]
  chatHistory?: ChatMessage[]
  loading?: boolean
  showToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '未命名角色',
  backgroundImage: '',
  avatarImage: '',
  greetings: () => [],
  chatHistory: () => [],
  loading: false,
  showToggle: false
})

// 预览状态
const showPreview = ref(!props.showToggle)

// 显示的头像
const displayAvatar = computed(() => props.avatarImage || props.backgroundImage)

// 创建 blob URL 用于 iframe 完全隔离
const createBlobUrl = (html: string) => {
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

// 渲染后的消息
const renderedMessages = computed(() => {
  if (!props.chatHistory || props.chatHistory.length === 0) return []

  return props.chatHistory.map((msg) => {
    const result = createRenderer({ role: msg.role, content: msg.content })
    if (result.kind === 'iframe' || result.kind === 'mixed') {
      return {
        role: msg.role,
        raw: msg.content,
        kind: result.kind,
        html: result.html,
        blobUrl: createBlobUrl(result.html),
        text: result.text || ''
      }
    }
    return {
      role: msg.role,
      raw: msg.content,
      kind: result.kind,
      html: result.html,
      text: result.text || ''
    }
  })
})

// 点击预览
const handlePreview = () => {
  showPreview.value = true
}

// 关闭预览
const closePreview = () => {
  showPreview.value = false
}

// 暴露方法给父组件
defineExpose({
  showPreview,
  handlePreview,
  closePreview
})
</script>

<template>
  <div class="shrink-0 flex flex-col h-full max-h-full overflow-hidden">
    <!-- 未预览状态（仅在 showToggle 为 true 时显示） -->
    <div
      v-if="showToggle && !showPreview"
      class="flex-1 min-h-[500px] max-h-[700px] rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:border-gray-400 dark:hover:border-gray-600"
    >
      <UIcon name="i-lucide-eye" class="w-12 h-12 text-gray-400 mb-4" />
      <span class="text-gray-500 dark:text-gray-400 mb-5 text-sm">点击预览聊天效果</span>
      <UButton size="sm" :loading="loading" @click="handlePreview">
        <template #leading>
          <UIcon name="i-lucide-eye" class="w-4 h-4" />
        </template>
        {{ loading ? '加载中...' : '预览' }}
      </UButton>
    </div>

    <!-- 预览状态 -->
    <template v-else>
      <div class="flex-1 min-h-[500px] max-h-[700px] rounded-[2rem] border-[6px] border-gray-800 dark:border-gray-900 bg-gray-800 shadow-2xl overflow-hidden flex flex-col">
        <div
          class="flex-1 min-h-0 flex flex-col relative"
          :style="{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        >
          <!-- 默认渐变背景 -->
          <div v-if="!backgroundImage" class="absolute inset-0 bg-gradient-to-b from-cyan-100 to-cyan-50 dark:from-gray-700 dark:to-gray-800" />

          <!-- 顶部栏 -->
          <div class="relative z-10 flex items-center justify-center px-4 py-3 bg-black/40 backdrop-blur-sm shrink-0">
            <div class="text-center">
              <div class="font-medium text-white text-sm drop-shadow-md">
                {{ name || '未命名角色' }}
              </div>
              <div class="text-xs text-cyan-300 flex items-center justify-center gap-1 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                24小时在线
              </div>
            </div>
          </div>

          <!-- 聊天内容区 -->
          <div class="flex-1 min-h-0 relative z-10 p-3 overflow-y-auto space-y-3">
            <!-- 加载中 -->
            <div v-if="loading" class="flex items-center justify-center h-full">
              <UIcon name="i-lucide-loader-2" class="animate-spin text-white text-2xl" />
            </div>

            <!-- 有聊天记录 -->
            <template v-else-if="renderedMessages.length > 0">
              <div
                v-for="(msg, idx) in renderedMessages"
                :key="idx"
                :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
              >
                <!-- 头像 - 非用户消息始终显示 -->
                <template v-if="msg.role !== 'user'">
                  <img
                    v-if="displayAvatar"
                    :src="displayAvatar"
                    alt=""
                    class="w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start"
                  >
                  <div v-else class="w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start">
                    <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-500" />
                  </div>
                </template>

                <!-- iframe 消息 -->
                <div v-if="msg.kind === 'iframe'" class="iframe-wrap flex-1">
                  <iframe
                    class="iframe"
                    :src="msg.blobUrl"
                    sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                    allow="autoplay"
                    referrerpolicy="no-referrer"
                    @load="(e: Event) => {
                      const iframe = e.target as HTMLIFrameElement
                      try {
                        const h = iframe.contentWindow?.document?.body?.scrollHeight || 400
                        iframe.style.height = Math.max(h, 400) + 'px'
                      }
                      catch {}
                    }"
                  />
                </div>

                <!-- mixed 消息 -->
                <div v-else-if="msg.kind === 'mixed'" class="flex-1">
                  <div v-if="msg.text" class="bg-white/80 backdrop-blur rounded-lg p-2 text-sm text-gray-700 mb-2 message-content" v-html="msg.text"></div>
                  <div class="iframe-wrap">
                    <iframe
                      class="iframe"
                      :src="msg.blobUrl"
                      sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                      allow="autoplay"
                      referrerpolicy="no-referrer"
                      @load="(e: Event) => {
                        const iframe = e.target as HTMLIFrameElement
                        try {
                          const h = iframe.contentWindow?.document?.body?.scrollHeight || 400
                          iframe.style.height = Math.max(h, 400) + 'px'
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
                    'flex-1 max-w-[75%] rounded-lg p-2 text-sm',
                    msg.role === 'user' ? 'bg-cyan-500 text-white' : 'bg-white/80 backdrop-blur text-gray-700'
                  ]"
                >
                  <span v-if="msg.kind === 'text'">{{ msg.raw }}</span>
                  <div v-else class="message-content" v-html="msg.html" />
                </div>
              </div>
            </template>

            <!-- 无聊天记录，显示第一句话 -->
            <template v-else-if="greetings && greetings[0]">
              <div class="flex justify-start">
                <img
                  v-if="displayAvatar"
                  :src="displayAvatar"
                  alt=""
                  class="w-8 h-8 rounded-full mr-2 shrink-0 object-cover self-start"
                >
                <div v-else class="w-8 h-8 rounded-full mr-2 shrink-0 bg-gray-300 flex items-center justify-center self-start">
                  <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-500" />
                </div>
                <div class="bg-white/80 backdrop-blur rounded-lg p-3 text-sm text-gray-700 leading-relaxed max-w-[75%]">
                  {{ greetings[0].slice(0, 200) }}{{ greetings[0].length > 200 ? '...' : '' }}
                </div>
              </div>
            </template>

            <!-- 无内容 -->
            <div v-else class="flex items-center justify-center h-full">
              <span class="text-white/60 text-sm">暂无聊天记录</span>
            </div>
          </div>

          <!-- 底部输入框 -->
          <div class="relative z-10 p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shrink-0">
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

      <!-- 关闭预览按钮（仅在 showToggle 为 true 时显示） -->
      <button
        v-if="showToggle"
        class="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1.5"
        @click="closePreview"
      >
        <UIcon name="i-lucide-eye-off" class="w-3.5 h-3.5" />
        关闭预览
      </button>
    </template>
  </div>
</template>

<style scoped>
/* iframe 样式 - 与 uni-app 前端保持一致 */
.iframe-wrap {
  width: 100% !important;
  max-width: 100%;
  overflow: hidden;
  border-radius: 8px;
  min-height: 400px;
  border: none;
  background: transparent;
  box-sizing: border-box;
}
.iframe {
  width: 100% !important;
  max-width: 100%;
  min-height: 400px;
  border: 0;
  display: block;
  background: transparent;
  box-sizing: border-box;
}

/* Markdown 内容样式 */
.message-content {
  white-space: normal;
  word-break: break-word;
}
.message-content :deep(p) {
  margin: 0 0 8px 0;
}
.message-content :deep(p:last-child) {
  margin-bottom: 0;
}
.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4),
.message-content :deep(h5),
.message-content :deep(h6) {
  font-weight: 600;
  margin: 12px 0 8px 0;
}
.message-content :deep(h1) { font-size: 1.5em; }
.message-content :deep(h2) { font-size: 1.3em; }
.message-content :deep(h3) { font-size: 1.1em; }
.message-content :deep(ul),
.message-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}
.message-content :deep(li) {
  margin: 4px 0;
}
.message-content :deep(code) {
  background-color: rgba(0,0,0,0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}
.message-content :deep(pre) {
  background-color: rgba(0,0,0,0.05);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 10px 0;
}
.message-content :deep(pre code) {
  background: none;
  padding: 0;
}
.message-content :deep(strong),
.message-content :deep(b) {
  font-weight: 700;
}
.message-content :deep(em),
.message-content :deep(i) {
  font-style: italic;
}
.message-content :deep(blockquote) {
  border-left: 3px solid #ccc;
  margin: 8px 0;
  padding-left: 12px;
  color: #666;
}
</style>
