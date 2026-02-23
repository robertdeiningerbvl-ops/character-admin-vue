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

interface WorldBookEntry {
  _key: string
  id: number
  keys: string[]
  secondary_keys: string[]
  comment: string
  content: string
  constant: boolean
  selective: boolean
  insertion_order: number
  enabled: boolean
  position: string
  use_regex: boolean
  extensions: {
    position: number
    probability: number
    depth: number
    scan_depth: number | null
    role: number
  }
}

const positionOptions = [
  { label: '角色定义前', value: 'before_char' },
  { label: '角色定义后', value: 'after_char' },
  { label: '示例消息前', value: 'before_example' },
  { label: '示例消息后', value: 'after_example' },
  { label: '作者注释前', value: 'before_author' },
  { label: '作者注释后', value: 'after_author' }
]

const triggerModeOptions = [
  { label: '始终触发', value: 'always' },
  { label: '关键词触发', value: 'keyword' }
]

const scanDepthOptions = [
  { label: '默认 (Null)', value: 'null' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' }
]

const createDefaultEntry = (id: number): WorldBookEntry => ({
  _key: crypto.randomUUID(),
  id,
  keys: [],
  secondary_keys: [],
  comment: '',
  content: '',
  constant: false,
  selective: true,
  insertion_order: 0,
  enabled: true,
  position: 'after_char',
  use_regex: false,
  extensions: {
    position: 4,
    probability: 100,
    depth: 1,
    scan_depth: null,
    role: 0
  }
})

const state = reactive({
  loading: false,
  configName: '',
  configState: 1,
  entries: [] as WorldBookEntry[],
  expandedKeys: [] as string[],
  fullscreenOpen: false,
  fullscreenContent: ''
})

const configStateSwitch = computed({
  get: () => state.configState === 2,
  set: (val: boolean) => { state.configState = val ? 2 : 4 }
})

const isExpanded = (key: string) => state.expandedKeys.includes(key)

const toggleExpand = (key: string) => {
  const idx = state.expandedKeys.indexOf(key)
  if (idx > -1) {
    state.expandedKeys.splice(idx, 1)
  } else {
    state.expandedKeys.push(key)
  }
}

const addEntry = () => {
  const newId = state.entries.length > 0 ? Math.max(...state.entries.map(e => e.id)) + 1 : 0
  const newEntry = createDefaultEntry(newId)
  state.entries.push(newEntry)
  state.expandedKeys.push(newEntry._key)
}

const deleteEntry = (key: string) => {
  state.entries = state.entries.filter(e => e._key !== key)
  state.expandedKeys = state.expandedKeys.filter(k => k !== key)
}

// 导入 JSON (SillyTavern 格式)
const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      let entries: any[] = []

      // SillyTavern 格式: { entries: { "0": {...}, "1": {...} } }
      if (json.entries && typeof json.entries === 'object' && !Array.isArray(json.entries)) {
        entries = Object.values(json.entries)
      } else if (Array.isArray(json.entries)) {
        entries = json.entries
      } else if (Array.isArray(json)) {
        entries = json
      } else {
        toast.add({ title: '无效的世界书格式', color: 'error' })
        return
      }

      state.entries = entries.map((entry: any, idx: number) => ({
        ...createDefaultEntry(idx),
        ...entry,
        _key: crypto.randomUUID()
      }))
      toast.add({ title: `成功导入 ${entries.length} 条世界书条目`, color: 'success' })
    } catch {
      toast.add({ title: 'JSON解析失败，请检查文件格式', color: 'error' })
    }
  }
  reader.readAsText(file)
  ;(event.target as HTMLInputElement).value = ''
}

// 导出 JSON
const handleExport = () => {
  const cleanEntries = state.entries.map(({ _key, ...rest }) => rest)
  const blob = new Blob([JSON.stringify({ entries: cleanEntries }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${state.configName || 'worldbook'}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: '导出成功', color: 'success' })
}

const getTriggerMode = (entry: WorldBookEntry) => entry.constant ? 'always' : 'keyword'

const setTriggerMode = (entry: WorldBookEntry, value: string) => {
  entry.constant = value === 'always'
}

const getScanDepth = (entry: WorldBookEntry) => {
  return entry.extensions.scan_depth === null ? 'null' : String(entry.extensions.scan_depth)
}

const setScanDepth = (entry: WorldBookEntry, value: string) => {
  entry.extensions.scan_depth = value === 'null' ? null : parseInt(value)
}

const openFullscreen = (entry: WorldBookEntry) => {
  state.fullscreenOpen = true
  state.fullscreenContent = entry.content
}

const closeFullscreen = () => {
  state.fullscreenOpen = false
}

const saveFullscreen = () => {
  state.fullscreenOpen = false
}

async function onSubmit() {
  if (!state.configName.trim()) {
    toast.add({ title: '请输入配置名称', color: 'error' })
    return
  }
  state.loading = true
  try {
    const cleanEntries = state.entries.map(({ _key, ...rest }) => rest)
    const postForm = {
      id: props.currentForm?.id,
      name: state.configName,
      ty: 2,
      state: state.configState,
      content: JSON.stringify(cleanEntries)
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
    state.entries = []
    state.expandedKeys = []
    state.fullscreenOpen = false
    if (props.currentForm?.content) {
      try {
        const parsed = JSON.parse(props.currentForm.content)
        if (Array.isArray(parsed)) {
          state.entries = parsed.map((e, idx) => ({
            ...createDefaultEntry(idx),
            ...e,
            _key: crypto.randomUUID()
          }))
        }
      } catch {}
    }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" title="世界书" :ui="{ content: 'sm:max-w-4xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-globe" class="w-5 h-5 text-purple-500" />
        <span class="font-semibold">{{ currentForm.id ? '编辑世界书' : '新建世界书' }}</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-4">
            <UFormField label="世界书名称" required class="flex-1">
              <UInput v-model.trim="state.configName" placeholder="输入世界书名称" size="lg" />
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

        <div class="space-y-4">
          <div
            v-for="entry in state.entries"
            :key="entry._key"
            class="rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) border-l-4 border-l-purple-500"
          >
            <div class="flex items-center gap-3 p-4">
              <USwitch v-model="entry.enabled" />
              <UButton
                :icon="isExpanded(entry._key) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="toggleExpand(entry._key)"
              />
              <span class="font-medium">{{ entry.comment || '未命名条目' }}</span>
              <UBadge :color="entry.constant ? 'info' : 'success'" variant="subtle" size="xs">
                {{ entry.constant ? '始终' : '选择性' }}
              </UBadge>
              <div class="flex-1" />
              <UButton
                icon="i-lucide-trash-2"
                size="xs"
                color="error"
                variant="ghost"
                @click="deleteEntry(entry._key)"
              />
            </div>

            <div v-if="isExpanded(entry._key)" class="px-4 pb-4 space-y-4">
              <UFormField label="标题 (注释)">
                <UInput v-model="entry.comment" placeholder="输入条目标题" />
              </UFormField>

              <UFormField label="触发模式">
                <USelect
                  :model-value="getTriggerMode(entry)"
                  :items="triggerModeOptions"
                  @update:model-value="setTriggerMode(entry, $event)"
                />
              </UFormField>

              <UFormField label="内容">
                <div class="space-y-2">
                  <div class="flex justify-end">
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="i-lucide-maximize-2"
                      label="全屏编辑"
                      @click="openFullscreen(entry)"
                    />
                  </div>
                  <UTextarea
                    v-model="entry.content"
                    placeholder="输入条目内容"
                    :rows="6"
                    class="font-mono w-full"
                  />
                </div>
              </UFormField>

              <div class="grid grid-cols-4 gap-4">
                <UFormField label="插入位置">
                  <USelect v-model="entry.position" :items="positionOptions" />
                </UFormField>
                <UFormField label="插入顺序">
                  <UInput v-model.number="entry.insertion_order" type="number" />
                </UFormField>
                <UFormField label="激活概率 (%)">
                  <UInput
                    v-model.number="entry.extensions.probability"
                    type="number"
                    :min="0"
                    :max="100"
                  />
                </UFormField>
                <UFormField label="扫描深度">
                  <USelect
                    :model-value="getScanDepth(entry)"
                    :items="scanDepthOptions"
                    @update:model-value="setScanDepth(entry, $event)"
                  />
                </UFormField>
              </div>
            </div>
          </div>

          <div v-if="state.entries.length === 0" class="p-12 text-center rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
            <UIcon name="i-lucide-globe" class="w-10 h-10 mx-auto mb-2 text-(--ui-text-dimmed)" />
            <p class="text-sm text-(--ui-text-muted)">
              暂无条目，点击下方按钮添加
            </p>
          </div>

          <UButton
            variant="outline"
            block
            icon="i-lucide-plus"
            label="添加条目"
            @click="addEntry"
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

  <UModal v-model:open="state.fullscreenOpen" :ui="{ content: 'sm:max-w-4xl' }">
    <template #header>
      <span class="font-semibold">内容编辑</span>
    </template>
    <template #body>
      <UTextarea v-model="state.fullscreenContent" class="font-mono w-full" :rows="20" />
    </template>
    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeFullscreen"
      />
      <UButton label="保存" @click="saveFullscreen" />
    </template>
  </UModal>
</template>
