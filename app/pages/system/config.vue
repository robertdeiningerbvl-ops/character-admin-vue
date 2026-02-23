<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { getConfig, updateConfig, getCommonModelList } from '@/api'

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
      { key: 'OS', label: '系统优化', icon: 'lucide:cpu' },
      { key: 'KNOT', label: '聊天总结', icon: 'lucide:message-circle' },
      { key: 'DOCTOR_CONFIG', label: '创作管理', icon: 'lucide:pen-tool' }
    ]
  }
])

/* ================= 获取配置 ================= */
const fetchConfig = async (key: string) => {
  try {
    const { data, error } = await getConfig({ key })
    if (!error) {
      const useNumericOpen = ['KNOT', 'DOCTOR_CONFIG'].includes(key)
      const form: ConfigForm = {
        ...cloneDeep(data),
        open: useNumericOpen ? Number(data.open) : Boolean(data.open),
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
    const useNumericOpen = ['KNOT', 'DOCTOR_CONFIG'].includes(key)
    state.currentForm = {
      ...cloneDeep(data),
      open: useNumericOpen ? Number(data.open) : Boolean(data.open),
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

/* ================= 模型列表 ================= */
const modelOptions = ref<{ label: string; value: number }[]>([])
const modelOptionsTy1 = ref<{ label: string; value: number }[]>([])
const fetchModelList = async () => {
  const [res0, res1] = await Promise.all([getCommonModelList({ ty: 0 }), getCommonModelList({ ty: 1 })])
  if (res0.data?.list) modelOptions.value = res0.data.list.map((m: any) => ({ label: m.name, value: m.id }))
  if (res1.data?.list) modelOptionsTy1.value = res1.data.list.map((m: any) => ({ label: m.name, value: m.id }))
}

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
  await fetchModelList()
  await selectConfig(state.activeConfigKey)
}

onActivated(() => init())
</script>

<template>
  <ConfigLayout>
    <div class="flex gap-6 p-6">
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
            v-if="state.currentForm.open !== undefined && !['DOCTOR_CONFIG', 'KNOT'].includes(state.activeConfigKey)"
            v-model="state.currentForm.open"
          />
        </div>

        <USeparator class="mb-6" />

        <!-- SMS -->
        <div v-if="state.activeConfigKey === 'SMS'" class="space-y-4">
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  短信服务配置说明
                </p>
                <p>配置短信服务商账号信息，用于发送验证码、通知等短信。支持配置多个账号实现负载均衡和故障转移。</p>
              </div>
            </div>
          </div>

          <div v-for="row in state.currentForm.content" :key="row.id" class="flex items-center gap-3">
            <UInput v-model="row.username" placeholder="邮箱 / 账号" class="flex-1" />
            <UInput
              v-model="row.password"
              placeholder="密码"
              type="password"
              class="flex-1"
            />
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
              <UInput
                v-model="newSMS.password"
                placeholder="密码"
                type="password"
                class="flex-1"
              />
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
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted) space-y-2">
                <p class="font-medium text-(--ui-text-highlighted)">
                  Google 认证配置说明
                </p>
                <p>用于实现 Google 第三方登录功能。需要在 Google Cloud Console 创建 OAuth 2.0 凭据获取 Client ID。</p>
                <div class="mt-2 p-3 rounded bg-(--ui-bg) text-xs space-y-1">
                  <p class="font-medium text-(--ui-text)">
                    获取步骤：
                  </p>
                  <p>1. 访问 Google Cloud Console (console.cloud.google.com)</p>
                  <p>2. 创建项目或选择已有项目</p>
                  <p>3. 进入「API 和服务」→「凭据」</p>
                  <p>4. 创建 OAuth 2.0 客户端 ID</p>
                  <p>5. 配置授权重定向 URI</p>
                </div>
              </div>
            </div>
          </div>

          <UFormField label="Client ID" hint="Google OAuth 2.0 客户端 ID">
            <UInput
              v-model="state.currentForm.content"
              placeholder="例如: xxxxx.apps.googleusercontent.com"
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
        <div v-if="state.activeConfigKey === 'IP_S' || state.activeConfigKey === 'IP_SS'" class="space-y-4">
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-shield-alert" class="w-5 h-5 text-(--ui-warning) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  {{ state.activeConfigKey === 'IP_S' ? 'IP 白名单（后台）' : 'IP 白名单（前台）' }}配置说明
                </p>
                <p v-if="state.activeConfigKey === 'IP_S'">
                  限制后台管理系统的访问 IP，只有白名单内的 IP 才能访问管理后台。留空则不限制。
                </p>
                <p v-else>
                  限制前台接口的访问 IP，用于 API 调用限制。留空则不限制。
                </p>
                <p class="mt-2 text-xs text-(--ui-text-dimmed)">
                  支持单个 IP（如 192.168.1.1）或 IP 段（如 192.168.1.0/24）
                </p>
              </div>
            </div>
          </div>

          <div
            v-for="(row, index) in state.currentForm.ip"
            :key="index"
            class="flex items-center gap-3"
          >
            <UInput v-model="row.addr" placeholder="IP 地址，如 192.168.1.1" class="flex-1" />
            <UInput v-model="row.remarks" placeholder="备注，如：办公室" class="flex-1" />
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
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted) space-y-2">
                <p class="font-medium text-(--ui-text-highlighted)">
                  对象存储配置说明
                </p>
                <p>配置 MinIO 或兼容 S3 协议的对象存储服务，用于存储图片、文件等静态资源。</p>
                <div class="mt-2 p-3 rounded bg-(--ui-bg) text-xs space-y-1">
                  <p class="font-medium text-(--ui-text)">
                    配置说明：
                  </p>
                  <p>• Access Key: 访问密钥 ID，用于身份验证</p>
                  <p>• Secret Key: 访问密钥密码，请妥善保管</p>
                  <p>• 访问域名: 对外访问的 CDN 或存储桶域名</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Access Key" hint="访问密钥 ID">
              <UInput v-model="state.currentForm.key" placeholder="请输入 Access Key" class="w-full" />
            </UFormField>
            <UFormField label="Secret Key" hint="访问密钥密码">
              <UInput
                v-model="state.currentForm.secret"
                placeholder="请输入 Secret Key"
                type="password"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="访问域名" hint="对外访问的域名地址">
            <UInput v-model="state.currentForm.url" placeholder="例如 https://cdn.example.com" class="w-full" />
          </UFormField>
          <UFormField label="说明">
            <UInput v-model="state.currentForm.remarks" placeholder="说明信息" class="w-full" />
          </UFormField>
        </div>

        <!-- 帮助中心 / PAY -->
        <div v-if="state.activeConfigKey === 'HELP' || state.activeConfigKey === 'PAY'" class="space-y-4">
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  {{ state.activeConfigKey === 'HELP' ? '帮助中心' : '支付配置' }}说明
                </p>
                <p v-if="state.activeConfigKey === 'HELP'">
                  配置帮助中心的常见问题列表，用户可在 App 内查看。建议添加常见问题及解答。
                </p>
                <p v-else>
                  配置支付相关的说明信息，如支付方式、注意事项等，展示给用户。
                </p>
              </div>
            </div>
          </div>

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
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  {{ state.activeConfigKey === 'PRIVACY' ? '隐私政策' : '服务条款' }}配置说明
                </p>
                <p v-if="state.activeConfigKey === 'PRIVACY'">
                  配置应用的隐私政策内容，说明如何收集、使用和保护用户数据。根据法规要求必须提供。
                </p>
                <p v-else>
                  配置应用的服务条款/用户协议，明确用户使用服务的权利和义务。
                </p>
              </div>
            </div>
          </div>

          <RichTextEditor v-model="state.currentForm.content" min-height="300px" />

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="请输入备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- INVITE 邀请配置 -->
        <div v-if="state.activeConfigKey === 'INVITE'" class="space-y-5">
          <!-- 说明卡片 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  邀请配置说明
                </p>
                <p>配置邀请活动的展示内容和奖励规则，用户可通过分享邀请链接获得奖励。</p>
              </div>
            </div>
          </div>

          <UFormField label="概要" hint="邀请活动的简短描述">
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
        <div v-if="state.activeConfigKey === 'OS'" class="space-y-5">
          <!-- 缓存配置说明 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  缓存配置说明
                </p>
                <p>缓存默认开启，可有效减少服务器压力，提升响应速度。如需调试可临时关闭。</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-between p-4 rounded-lg border border-(--ui-border)">
              <div>
                <p class="font-medium text-(--ui-text-highlighted)">
                  关闭客户端缓存
                </p>
                <p class="text-xs text-(--ui-text-muted)">
                  开启后将禁用客户端缓存
                </p>
              </div>
              <USwitch
                :model-value="state.currentForm.client_cache === 0"
                @update:model-value="state.currentForm.client_cache = $event ? 0 : 60"
              />
            </div>
            <div class="flex items-center justify-between p-4 rounded-lg border border-(--ui-border)">
              <div>
                <p class="font-medium text-(--ui-text-highlighted)">
                  关闭服务器缓存
                </p>
                <p class="text-xs text-(--ui-text-muted)">
                  开启后将禁用服务器缓存
                </p>
              </div>
              <USwitch
                :model-value="state.currentForm.server_cache === 0"
                @update:model-value="state.currentForm.server_cache = $event ? 0 : 60"
              />
            </div>
          </div>

          <UFormField label="公开数量限制" hint="限制用户可公开发布的内容数量">
            <UInput
              v-model="state.currentForm.publish"
              type="number"
              placeholder="请输入公开数量限制"
              class="w-full"
            />
          </UFormField>

          <USeparator />

          <!-- 费率配置说明 -->
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-percent" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">
                  费率配置说明
                </p>
                <p>配置各类业务的费率百分比，数值范围 0-100。</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <UFormField label="邀请费率 (%)" hint="邀请奖励分成比例">
              <UInput
                v-model="state.currentForm.invite_rate"
                type="number"
                placeholder="例如 50"
                class="w-full"
              />
            </UFormField>
            <UFormField label="游戏费率 (%)" hint="游戏收益分成比例">
              <UInput
                v-model="state.currentForm.game_rate"
                type="number"
                placeholder="例如 90"
                class="w-full"
              />
            </UFormField>
            <UFormField label="游戏提现费率 (%)" hint="提现手续费比例">
              <UInput
                v-model="state.currentForm.game_tx_rate"
                type="number"
                placeholder="例如 50"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- KNOT 聊天总结 -->
        <div v-if="state.activeConfigKey === 'KNOT'" class="space-y-5">
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">聊天总结设计说明</p>
                <p>配置角色扮演对话的记忆助手，用于将对话压缩成简洁的记忆摘要。</p>
              </div>
            </div>
          </div>

          <UFormField label="模型" hint="选择用于生成摘要的模型">
            <USelect v-model="state.currentForm.model_id" :items="modelOptions" placeholder="请选择模型" class="w-full" />
          </UFormField>

          <UFormField label="提示词" hint="生成摘要时使用的提示词">
            <UTextarea v-model="state.currentForm.prompt" :rows="4" placeholder="请输入提示词" class="w-full" />
          </UFormField>

          <div class="flex items-center justify-between p-4 rounded-lg border border-(--ui-border)">
            <div>
              <p class="font-medium text-(--ui-text-highlighted)">启用</p>
              <p class="text-xs text-(--ui-text-muted)">开启后将启用聊天总结功能</p>
            </div>
            <USwitch
              :model-value="state.currentForm.open === 2"
              @update:model-value="state.currentForm.open = $event ? 2 : 0"
            />
          </div>

          <UFormField label="数量" hint="摘要相关数量配置">
            <UInput v-model="state.currentForm.num" type="number" placeholder="请输入数量" class="w-full" />
          </UFormField>

          <UFormField label="备注">
            <UInput v-model="state.currentForm.remarks" placeholder="备注信息" class="w-full" />
          </UFormField>
        </div>

        <!-- DOCTOR_CONFIG 创作管理 -->
        <div v-if="state.activeConfigKey === 'DOCTOR_CONFIG'" class="space-y-5">
          <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-(--ui-primary) shrink-0 mt-0.5" />
              <div class="text-sm text-(--ui-text-muted)">
                <p class="font-medium text-(--ui-text-highlighted) mb-1">创作管理配置说明</p>
                <p>配置创作审核流程的模型、提示词和迭代次数等参数。</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 rounded-lg border border-(--ui-border)">
            <div>
              <p class="font-medium text-(--ui-text-highlighted)">启用</p>
              <p class="text-xs text-(--ui-text-muted)">开启后将启用创作管理功能</p>
            </div>
            <USwitch
              :model-value="state.currentForm.open === 2"
              @update:model-value="state.currentForm.open = $event ? 2 : 0"
            />
          </div>

          <UFormField label="最大迭代次数">
            <UInput v-model="state.currentForm.max_iterations" type="number" placeholder="请输入最大迭代次数" class="w-full" />
          </UFormField>

          <UFormField label="系统提示词" hint="系统级别的提示词">
            <UTextarea v-model="state.currentForm.system_prompt" :rows="4" placeholder="请输入系统提示词" class="w-full" />
          </UFormField>

          <UFormField label="初始用户消息模板" hint="初始用户消息的模板">
            <UTextarea v-model="state.currentForm.initial_prompt" :rows="4" placeholder="请输入初始用户消息模板" class="w-full" />
          </UFormField>

          <UFormField label="条目注入消息模板" hint="条目注入时使用的消息模板">
            <UTextarea v-model="state.currentForm.inject_prompt" :rows="4" placeholder="请输入条目注入消息模板" class="w-full" />
          </UFormField>

          <UFormField label="强制终审消息模板" hint="强制终审时使用的消息模板">
            <UTextarea v-model="state.currentForm.final_prompt" :rows="4" placeholder="请输入强制终审消息模板" class="w-full" />
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
  </ConfigLayout>
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
