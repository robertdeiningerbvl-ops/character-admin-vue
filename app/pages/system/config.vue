<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getConfig, updateConfig } from '@/api'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'SystemConfig' })

const toast = useToast()

/* ================= 状态 ================= */
interface IPItem {
  addr: string
  remarks: string
}
interface HelpItem {
  id: number
  title: string
  content: string
}
interface ConfigForm {
  open?: any
  content?: any
  remarks?: string
  key?: string
  secret?: string
  url?: string
  ip?: IPItem[]
  desc?: any | HelpItem[]
  [prop: string]: any
}
interface SmsRow {
  id: number
  username: string
  password: string
}

const state = reactive({
  currentForm: {} as ConfigForm,
  configs: {} as Record<string, ConfigForm>,
  activeConfigKey: 'SMS'
})

/* ================= 左侧菜单 ================= */
const configGroups = reactive([
  {
    label: '基础能力',
    items: [
      { key: 'SMS', label: '短信服务', icon: 'lucide:message-square' },
      { key: 'GOOGLE_AUTH', label: 'Google 认证', icon: 'lucide:shield-check' }
    ]
  },
  {
    label: '安全策略',
    items: [
      { key: 'IP_S', label: 'IP 白名单(后台)', icon: 'lucide:server' },
      { key: 'IP_SS', label: 'IP 白名单(前台)', icon: 'lucide:monitor' }
    ]
  },
  {
    label: '存储与资源',
    items: [
      { key: 'MINIO', label: '对象存储', icon: 'lucide:database' }
    ]
  },
  {
    label: '文档与协议',
    items: [
      { key: 'HELP', label: '帮助中心', icon: 'lucide:circle-help' },
      { key: 'PRIVACY', label: '隐私政策', icon: 'lucide:eye-off' },
      { key: 'PROVISION', label: '服务条款', icon: 'lucide:scroll-text' }
    ]
  },
  {
    label: '业务配置',
    items: [
      { key: 'PAY', label: '支付配置', icon: 'lucide:credit-card' },
      { key: 'INVITE', label: '邀请配置', icon: 'lucide:user-plus' },
      { key: 'OS', label: '系统优化', icon: 'lucide:cpu' }
    ]
  }
])

/* ================= 获取配置 ================= */
const fetchConfig = async (key: string) => {
  try {
    const { data, error } = await getConfig({ key })
    if (!error) {
      const form: ConfigForm = {
        ...cloneDeep(data),
        open: Boolean(data.open),
        ip: Array.isArray(data.ip) ? data.ip : [],
        desc: data.desc
          ? typeof data.desc === 'string' || Array.isArray(data.desc)
            ? data.desc
            : { ...data.desc }
          : '',
        content: data.content
          ? typeof data.content === 'string' || Array.isArray(data.content)
            ? data.content
            : { ...data.content }
          : '',
        key: data.key || '',
        secret: data.secret || '',
        url: data.url || ''
      }
      state.configs[key] = form
      state.currentForm = form
    }
  } catch (err) {
    console.error(err)
    toast.add({ title: '获取配置失败', color: 'error' })
  }
}

/* ================= 保存配置 ================= */
const saving = ref(false)
const saveConfig = async () => {
  try {
    saving.value = true
    const formCopy: ConfigForm = {
      ...state.currentForm,
      open: typeof state.currentForm.open === 'boolean' ? (state.currentForm.open ? 1 : 0) : state.currentForm.open,
      content: state.currentForm.content,
      ip: Array.isArray(state.currentForm.ip) ? state.currentForm.ip : [],
      desc: state.currentForm.desc
    }
    const payload = {
      key: state.activeConfigKey,
      content: JSON.stringify(formCopy),
      remarks: formCopy.remarks || ''
    }
    const { error } = await updateConfig(payload)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      state.configs[state.activeConfigKey] = cloneDeep(formCopy)
      state.currentForm = cloneDeep(formCopy)
    } else {
      toast.add({ title: '保存失败', color: 'error' })
    }
  } catch (err) {
    console.error(err)
    toast.add({ title: '请求出错', color: 'error' })
  } finally {
    saving.value = false
  }
}

/* ================= 切换配置 ================= */
const selectConfig = async (key: string) => {
  state.activeConfigKey = key
  if (!state.configs[key]) {
    await fetchConfig(key)
  } else {
    const data = state.configs[key]
    state.currentForm = {
      ...cloneDeep(data),
      open: Boolean(data.open),
      remarks: data.remarks || '',
      ip: Array.isArray(data.ip) ? data.ip : [],
      desc: data.desc
        ? typeof data.desc === 'string' || Array.isArray(data.desc)
          ? data.desc
          : { ...data.desc }
        : '',
      content: data.content
        ? typeof data.content === 'string' || Array.isArray(data.content)
          ? data.content
          : { ...data.content }
        : ''
    }
  }
  // 同步到 TipTap
  if (editor.value && typeof state.currentForm.content === 'string') {
    editor.value.commands.setContent(state.currentForm.content, {
      parseOptions: {},
      emitUpdate: false
    })
  }
}

/* ================= SMS 列表操作 ================= */
const newSMS = reactive({
  username: '',
  password: ''
})

const confirmAddSMS = () => {
  if (!newSMS.username || !newSMS.password) return
  state.currentForm.content.push({
    id: Date.now(),
    ...newSMS
  })
  newSMS.username = ''
  newSMS.password = ''
}

const delSMSItem = (id: number) => {
  const content = state.currentForm.content as SmsRow[]
  state.currentForm.content = content.filter(i => i.id !== id)
}

/* ================= IP / 帮助中心操作 ================= */
const addIP = (): void => {
  if (!state.currentForm.ip) state.currentForm.ip = []
  state.currentForm.ip.push({ addr: '', remarks: '' })
}
const delIP = (index: number) => state.currentForm.ip?.splice(index, 1)

const addHelpItem = (): void => {
  if (!state.currentForm.desc) state.currentForm.desc = []
  state.currentForm.desc.push({ id: Date.now(), title: '', content: '' })
}
const delHelpItem = (id: number) => {
  state.currentForm.desc = state.currentForm.desc?.filter((i: HelpItem) => i.id !== id)
}

/* ================= 富文本编辑器 ================= */
const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  onUpdate({ editor }) {
    state.currentForm.content = editor.getHTML()
  }
})

/* ================= 当前菜单项标签 ================= */
const activeLabel = computed(() => {
  for (const group of configGroups) {
    const item = group.items.find(i => i.key === state.activeConfigKey)
    if (item) return item.label
  }
  return state.activeConfigKey
})

/* ================= 初始化 ================= */
const init = async () => {
  await selectConfig(state.activeConfigKey)
}

onActivated(() => init())
</script>

<template>
  <DashboardLayout>
    <div class="flex gap-6 p-4">
      <!-- 左侧导航 -->
      <nav class="w-56 shrink-0 space-y-1">
        <template v-for="group in configGroups" :key="group.label">
          <p class="px-3 pt-4 pb-1 text-xs font-semibold text-(--ui-text-dimmed) uppercase tracking-wider">
            {{ group.label }}
          </p>
          <button
            v-for="item in group.items"
            :key="item.key"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            :class="state.activeConfigKey === item.key
              ? 'bg-(--ui-bg-elevated) text-(--ui-text-highlighted) font-medium shadow-sm'
              : 'text-(--ui-text-muted) hover:text-(--ui-text) hover:bg-(--ui-bg-elevated)/50'"
            @click="selectConfig(item.key)"
          >
            <UIcon :name="item.icon" class="size-4 shrink-0" />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </nav>

      <!-- 右侧内容 -->
      <div class="flex-1 min-w-0">
        <!-- 卡片头部：标题 + 开关 -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-(--ui-text-highlighted)">
              {{ activeLabel }}
            </h2>
            <p v-if="state.currentForm.remarks" class="mt-0.5 text-sm text-(--ui-text-muted)">
              {{ state.currentForm.remarks }}
            </p>
          </div>
          <USwitch
            v-if="state.currentForm.open !== undefined"
            v-model="state.currentForm.open"
          />
        </div>

        <USeparator class="mb-6" />

        <!-- SMS -->
        <div v-if="state.activeConfigKey === 'SMS'" class="space-y-4">
          <div v-for="row in state.currentForm.content" :key="row.id" class="flex items-center gap-3">
            <UInput v-model="row.username" placeholder="邮箱 / 账号" class="flex-1" />
            <UInput v-model="row.password" placeholder="密码" class="flex-1" />
            <UButton
              size="sm"
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              @click="delSMSItem(row.id)"
            />
          </div>

          <div class="rounded-lg border border-dashed border-(--ui-border) p-4 space-y-3">
            <div class="flex gap-3">
              <UInput v-model="newSMS.username" placeholder="邮箱 / 账号" class="flex-1" />
              <UInput v-model="newSMS.password" placeholder="密码" class="flex-1" />
            </div>
            <div class="flex justify-end">
              <UButton
                size="sm"
                color="neutral"
                variant="soft"
                icon="i-lucide-plus"
                label="新增账号"
                @click="confirmAddSMS"
              />
            </div>
          </div>

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注" class="w-full" />
          </UFormField>
        </div>

        <!-- GOOGLE_AUTH -->
        <div v-if="state.activeConfigKey === 'GOOGLE_AUTH'" class="space-y-4">
          <UFormField label="Client ID">
            <UInput
              v-model="state.currentForm.content"
              placeholder="Google OAuth Client ID"
              class="w-full"
            />
          </UFormField>
          <UFormField label="说明">
            <UTextarea
              v-model="state.currentForm.remarks"
              placeholder="请输入说明内容"
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- IP 白名单 (IP_S / IP_SS) -->
        <div v-if="state.activeConfigKey === 'IP_S' || state.activeConfigKey === 'IP_SS'" class="space-y-3">
          <div
            v-for="(row, index) in state.currentForm.ip"
            :key="index"
            class="flex items-center gap-3"
          >
            <UInput v-model="row.addr" placeholder="IP 地址" class="flex-1" />
            <UInput v-model="row.remarks" placeholder="备注" class="flex-1" />
            <UButton
              size="sm"
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              @click="delIP(index)"
            />
          </div>
          <UButton
            size="sm"
            color="neutral"
            variant="soft"
            icon="i-lucide-plus"
            label="新增 IP"
            @click="addIP"
          />
        </div>

        <!-- MINIO -->
        <div v-if="state.activeConfigKey === 'MINIO'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Access Key">
              <UInput v-model="state.currentForm.key" placeholder="请输入 Access Key" class="w-full" />
            </UFormField>
            <UFormField label="Secret Key">
              <UInput v-model="state.currentForm.secret" placeholder="请输入 Secret Key" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="访问域名">
            <UInput v-model="state.currentForm.url" placeholder="例如 xxx.com" class="w-full" />
          </UFormField>
          <UFormField label="说明">
            <UInput v-model="state.currentForm.remarks" placeholder="说明信息" class="w-full" />
          </UFormField>
        </div>

        <!-- 帮助中心 / PAY -->
        <div v-if="state.activeConfigKey === 'HELP' || state.activeConfigKey === 'PAY'" class="space-y-3">
          <div
            v-for="row in state.currentForm.desc"
            :key="row.id"
            class="flex items-start gap-3"
          >
            <UInput v-model="row.title" placeholder="标题" class="w-48 shrink-0" />
            <UTextarea
              v-model="row.content"
              :rows="2"
              placeholder="内容"
              class="flex-1"
            />
            <UButton
              size="sm"
              color="error"
              variant="soft"
              icon="i-lucide-trash-2"
              class="mt-1"
              @click="delHelpItem(row.id)"
            />
          </div>
          <UButton
            size="sm"
            color="neutral"
            variant="soft"
            icon="i-lucide-plus"
            label="新增条目"
            @click="addHelpItem"
          />
          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注" class="w-full" />
          </UFormField>
        </div>

        <!-- 富文本协议 (PRIVACY / PROVISION) -->
        <div v-if="['PRIVACY', 'PROVISION'].includes(state.activeConfigKey)" class="space-y-4">
          <div v-if="editor" class="rounded-lg border border-(--ui-border) overflow-hidden">
            <div class="border-b border-(--ui-border) bg-(--ui-bg-elevated) px-3 py-2 flex gap-1 flex-wrap">
              <button
                v-for="btn in [
                  { action: () => editor!.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'B', cls: 'font-bold' },
                  { action: () => editor!.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'I', cls: 'italic' },
                  { action: () => editor!.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), label: 'S', cls: 'line-through' }
                ]"
                :key="btn.label"
                class="px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                :class="btn.active
                  ? 'bg-(--ui-primary) text-(--ui-bg)'
                  : 'text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80'"
                @click="btn.action"
              >
                <span :class="btn.cls">{{ btn.label }}</span>
              </button>

              <div class="w-px bg-(--ui-border) mx-1" />

              <button
                v-for="level in [1, 2, 3]"
                :key="level"
                class="px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                :class="editor.isActive('heading', { level })
                  ? 'bg-(--ui-primary) text-(--ui-bg)'
                  : 'text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80'"
                @click="editor!.chain().focus().toggleHeading({ level: level as any }).run()"
              >
                H{{ level }}
              </button>

              <div class="w-px bg-(--ui-border) mx-1" />

              <button
                class="px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                :class="editor.isActive('bulletList')
                  ? 'bg-(--ui-primary) text-(--ui-bg)'
                  : 'text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80'"
                @click="editor!.chain().focus().toggleBulletList().run()"
              >
                &bull; 列表
              </button>
              <button
                class="px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                :class="editor.isActive('orderedList')
                  ? 'bg-(--ui-primary) text-(--ui-bg)'
                  : 'text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80'"
                @click="editor!.chain().focus().toggleOrderedList().run()"
              >
                1. 列表
              </button>
              <button
                class="px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                :class="editor.isActive('blockquote')
                  ? 'bg-(--ui-primary) text-(--ui-bg)'
                  : 'text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80'"
                @click="editor!.chain().focus().toggleBlockquote().run()"
              >
                引用
              </button>

              <div class="w-px bg-(--ui-border) mx-1" />

              <button
                class="px-3 py-1 rounded text-sm text-(--ui-text-muted) hover:bg-(--ui-bg-elevated)/80 transition-colors cursor-pointer"
                @click="editor!.chain().focus().setHorizontalRule().run()"
              >
                分割线
              </button>
            </div>
            <div class="editor-content p-4 min-h-[300px]">
              <EditorContent :editor="editor" />
            </div>
          </div>

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="请输入备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- INVITE 邀请配置 -->
        <div v-if="state.activeConfigKey === 'INVITE'" class="space-y-5">
          <UFormField label="概要">
            <UInput v-model="state.currentForm.summary" placeholder="请输入概要" class="w-full" />
          </UFormField>

          <UFormField label="详细说明">
            <UTextarea
              v-model="state.currentForm.desc"
              placeholder="请输入详细说明"
              :rows="4"
              class="w-full"
            />
          </UFormField>

          <div class="space-y-2">
            <label class="text-sm font-medium text-(--ui-text)">相关链接</label>
            <div
              v-for="(url, index) in state.currentForm.link"
              :key="index"
              class="flex items-center gap-3"
            >
              <UInput v-model="state.currentForm.link[index]" placeholder="请输入链接" class="flex-1" />
              <UButton
                size="sm"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="state.currentForm.link.splice(index, 1)"
              />
            </div>
            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              icon="i-lucide-plus"
              label="新增链接"
              @click="state.currentForm.link.push('')"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-(--ui-text)">奖励规则条目</label>
            <div
              v-for="(item, index) in state.currentForm.regular"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-lg border border-(--ui-border)"
            >
              <UInput v-model="item.content" placeholder="条目内容" class="flex-1" />
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-sm text-(--ui-text-muted)">重点</span>
                <USwitch v-model="item.is_big" />
              </div>
              <UButton
                size="sm"
                color="error"
                variant="soft"
                icon="i-lucide-trash-2"
                @click="state.currentForm.regular.splice(index, 1)"
              />
            </div>
            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              icon="i-lucide-plus"
              label="新增条目"
              @click="state.currentForm.regular.push({ content: '', is_big: false })"
            />
          </div>

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- OS 系统优化 -->
        <div v-if="state.activeConfigKey === 'OS'" class="space-y-4">
          <UFormField label="客户端缓存（秒）">
            <UInput
              v-model="state.currentForm.client_cache"
              type="number"
              placeholder="请输入客户端缓存时间"
              class="w-full"
            />
          </UFormField>
          <UFormField label="服务器缓存（秒）">
            <UInput
              v-model="state.currentForm.server_cache"
              type="number"
              placeholder="请输入服务器缓存时间"
              class="w-full"
            />
          </UFormField>
          <UFormField label="公开数量限制">
            <UInput
              v-model="state.currentForm.publish"
              type="number"
              placeholder="请输入公开数量限制"
              class="w-full"
            />
          </UFormField>
          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- 底部保存按钮 -->
        <USeparator class="mt-6 mb-4" />
        <div class="flex justify-end">
          <UButton
            color="primary"
            icon="i-lucide-save"
            label="保存配置"
            :loading="saving"
            @click="saveConfig"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* TipTap 编辑器样式 */
.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 300px;
}

.editor-content :deep(.ProseMirror) h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.editor-content :deep(.ProseMirror) h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.editor-content :deep(.ProseMirror) h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
}

.editor-content :deep(.ProseMirror) p {
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror) ul,
.editor-content :deep(.ProseMirror) ol {
  padding-left: 2em;
  margin: 1em 0;
}

.editor-content :deep(.ProseMirror) ul {
  list-style-type: disc;
}

.editor-content :deep(.ProseMirror) ol {
  list-style-type: decimal;
}

.editor-content :deep(.ProseMirror) li {
  margin: 0.5em 0;
}

.editor-content :deep(.ProseMirror) blockquote {
  border-left: 3px solid var(--ui-border);
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: var(--ui-text-muted);
}

.editor-content :deep(.ProseMirror) hr {
  border: none;
  border-top: 2px solid var(--ui-border);
  margin: 2em 0;
}

.editor-content :deep(.ProseMirror) strong {
  font-weight: bold;
}

.editor-content :deep(.ProseMirror) em {
  font-style: italic;
}

.editor-content :deep(.ProseMirror) s {
  text-decoration: line-through;
}
</style>
