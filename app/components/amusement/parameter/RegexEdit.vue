<script setup lang="ts">
import { updateAmusementParameter, addAmusementParameter } from '@/api'

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
const toast = useToast()
const fileInputRef = useTemplateRef('fileInputRef')

interface RegexRule {
  _key: string
  id: string
  scriptName: string
  findRegex: string
  replaceString: string
  trimStrings: string[]
  placement: number[]
  disabled: boolean
  markdownOnly: boolean
  promptOnly: boolean
  runOnEdit: boolean
  substituteRegex: number
  minDepth: number | null
  maxDepth: number | null
}

const createDefaultRule = (): RegexRule => ({
  _key: crypto.randomUUID(),
  id: crypto.randomUUID(),
  scriptName: '',
  findRegex: '',
  replaceString: '',
  trimStrings: [],
  placement: [2],
  disabled: false,
  markdownOnly: false,
  promptOnly: false,
  runOnEdit: false,
  substituteRegex: 0,
  minDepth: null,
  maxDepth: null
})

const state = reactive({
  loading: false,
  configName: '',
  configState: 1,
  rules: [] as RegexRule[],
  fullscreenOpen: false,
  fullscreenContent: '',
  fullscreenRuleKey: ''
})

const configStateSwitch = computed({
  get: () => state.configState === 1,
  set: (val: boolean) => { state.configState = val ? 1 : 9 }
})

const addRule = () => {
  state.rules.push(createDefaultRule())
}

const deleteRule = (key: string) => {
  state.rules = state.rules.filter(r => r._key !== key)
}

const openFullscreen = (rule: RegexRule) => {
  state.fullscreenRuleKey = rule._key
  state.fullscreenContent = rule.replaceString
  state.fullscreenOpen = true
}

const saveFullscreen = () => {
  const rule = state.rules.find(r => r._key === state.fullscreenRuleKey)
  if (rule) rule.replaceString = state.fullscreenContent
  state.fullscreenOpen = false
}

// 导入 JSON
const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      if (!Array.isArray(json)) {
        toast.add({ title: '无效的JSON格式，需要数组', color: 'error' })
        return
      }
      const validEntries = json.filter((item: any) =>
        item && typeof item === 'object' && typeof item.findRegex === 'string' && item.findRegex.trim()
      )
      if (validEntries.length === 0) {
        toast.add({ title: '未找到有效的正则条目', color: 'error' })
        return
      }
      state.rules = validEntries.map((entry: any) => ({
        ...createDefaultRule(),
        ...entry,
        _key: crypto.randomUUID()
      }))
      toast.add({ title: `成功导入 ${validEntries.length} 条规则`, color: 'success' })
    } catch {
      toast.add({ title: 'JSON解析失败，请检查文件格式', color: 'error' })
    }
  }
  reader.readAsText(file)
  ;(event.target as HTMLInputElement).value = ''
}

// 导出 JSON
const handleExport = () => {
  const cleanRules = state.rules.map(({ _key, ...rest }) => rest)
  const blob = new Blob([JSON.stringify(cleanRules, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.configName || 'regex-config'}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: '导出成功', color: 'success' })
}

async function onSubmit() {
  if (!state.configName.trim()) {
    toast.add({ title: '请输入配置名称', color: 'error' })
    return
  }
  state.loading = true
  try {
    const cleanRules = state.rules.map(({ _key, ...rest }) => rest)
    const postForm = {
      id: props.currentForm?.id,
      name: state.configName,
      ty: 1,
      state: state.configState,
      content: JSON.stringify(cleanRules)
    }
    const { error } = await (postForm.id ? updateAmusementParameter : addAmusementParameter)(postForm)
    if (!error) {
      toast.add({ title: '保存成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.configName = props.currentForm?.name || ''
    state.configState = props.currentForm?.state ?? 1
    state.rules = []
    if (props.currentForm?.content) {
      try {
        const parsed = JSON.parse(props.currentForm.content)
        if (Array.isArray(parsed)) {
          state.rules = parsed.map(r => ({ ...createDefaultRule(), ...r, _key: crypto.randomUUID() }))
        }
      } catch {
        toast.add({ title: '数据解析失败，JSON格式损坏', color: 'error' })
      }
    }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" title="正则配置" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-regex" class="w-5 h-5 text-orange-500" />
        <span class="font-semibold">{{ currentForm.id ? '编辑正则配置' : '新建正则配置' }}</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- 配置名称 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-4">
            <UFormField label="配置名称" required class="flex-1">
              <UInput v-model.trim="state.configName" placeholder="输入正则配置名称" size="lg" />
            </UFormField>
            <UFormField label="状态">
              <USwitch v-model="configStateSwitch" />
            </UFormField>
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="flex items-center justify-end gap-2">
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          >
          <UButton
            variant="outline"
            icon="i-lucide-upload"
            label="导入 JSON"
            @click="fileInputRef?.click()"
          />
          <UButton
            variant="outline"
            icon="i-lucide-download"
            label="导出 JSON"
            @click="handleExport"
          />
        </div>

        <!-- 规则列表 -->
        <div class="space-y-4">
          <div
            v-for="(rule, index) in state.rules"
            :key="rule._key"
            class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)"
          >
            <!-- 规则头部 -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span class="text-sm font-medium text-orange-500">{{ index + 1 }}</span>
                </div>
                <span class="font-medium">规则 {{ index + 1 }}</span>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                size="xs"
                color="error"
                variant="ghost"
                @click="deleteRule(rule._key)"
              />
            </div>

            <!-- 规则表单 -->
            <div class="space-y-4">
              <div class="grid grid-cols-4 gap-4">
                <UFormField label="规则 ID">
                  <UInput v-model="rule.id" placeholder="default-rule-id" class="font-mono" />
                </UFormField>
                <UFormField label="脚本名称">
                  <UInput v-model="rule.scriptName" placeholder="Script Name" />
                </UFormField>
                <UFormField label="最小深度">
                  <UInput v-model.number="rule.minDepth" type="number" placeholder="最小深度" />
                </UFormField>
                <UFormField label="最大深度">
                  <UInput v-model.number="rule.maxDepth" type="number" placeholder="最大深度" />
                </UFormField>
              </div>

              <UFormField label="查找正则" required>
                <UInput v-model="rule.findRegex" placeholder="\*([\s\S]*?)\*" class="font-mono" />
              </UFormField>

              <UFormField label="替换内容" required>
                <div class="space-y-2">
                  <div class="flex justify-end">
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="i-lucide-maximize-2"
                      label="全屏编辑"
                      @click="openFullscreen(rule)"
                    />
                  </div>
                  <UTextarea
                    v-model="rule.replaceString"
                    placeholder="^^^<span class=&quot;highlight&quot;>$1</span>^^^"
                    :rows="8"
                    class="font-mono w-full"
                  />
                </div>
              </UFormField>

              <!-- 复选框选项 -->
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2 p-3 rounded-lg border border-(--ui-border) cursor-pointer hover:bg-(--ui-bg)">
                  <UCheckbox v-model="rule.disabled" />
                  <span class="text-sm">禁用规则</span>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-lg border border-(--ui-border) cursor-pointer hover:bg-(--ui-bg)">
                  <UCheckbox v-model="rule.markdownOnly" />
                  <span class="text-sm">仅 Markdown</span>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-lg border border-(--ui-border) cursor-pointer hover:bg-(--ui-bg)">
                  <UCheckbox v-model="rule.promptOnly" />
                  <span class="text-sm">仅 Prompt</span>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-lg border border-(--ui-border) cursor-pointer hover:bg-(--ui-bg)">
                  <UCheckbox v-model="rule.runOnEdit" />
                  <span class="text-sm">编辑时运行</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="state.rules.length === 0" class="p-12 text-center rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <UIcon name="i-lucide-regex" class="w-10 h-10 mx-auto mb-2 text-(--ui-text-dimmed)" />
            <p class="text-sm text-(--ui-text-muted)">
              暂无规则，点击下方按钮添加
            </p>
          </div>

          <!-- 添加按钮 -->
          <UButton
            variant="outline"
            block
            icon="i-lucide-plus"
            label="添加规则"
            @click="addRule"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton :loading="state.loading" label="保存" @click="onSubmit" />
    </template>
  </UModal>

  <!-- 全屏编辑弹窗 -->
  <UModal v-model:open="state.fullscreenOpen" title="编辑替换内容" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #body>
      <UTextarea v-model="state.fullscreenContent" :rows="20" class="font-mono w-full" />
    </template>
    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="state.fullscreenOpen = false"
      />
      <UButton label="确定" @click="saveFullscreen" />
    </template>
  </UModal>
</template>
