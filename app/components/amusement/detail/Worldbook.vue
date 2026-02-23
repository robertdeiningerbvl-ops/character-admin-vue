<script setup lang="ts">
const props = defineProps<{
  state: any
}>()

const emit = defineEmits(['update:state'])
const toast = useToast()

const localState = computed({
  get: () => props.state,
  set: val => emit('update:state', val)
})

// 展开的条目
const expandedIds = ref<Set<number | string>>(new Set())

const toggleExpand = (id: number | string) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

// 添加条目
const addEntry = () => {
  const newId = Date.now()
  localState.value.worldBookEntries.push({
    id: newId,
    keys: [],
    secondary_keys: [],
    content: '',
    comment: '',
    enabled: true,
    constant: false,
    selective: false,
    insertion_order: 100,
    position: 'after_char',
    use_regex: false,
    extensions: {
      position: 4,
      probability: 100,
      depth: 4,
      case_sensitive: false,
      match_whole_words: false,
      prevent_recursion: false
    }
  })
  expandedIds.value.add(newId)
}

// 删除条目
const removeEntry = (id: number | string) => {
  const idx = localState.value.worldBookEntries.findIndex((e: any) => e.id === id)
  if (idx > -1) {
    localState.value.worldBookEntries.splice(idx, 1)
  }
}

// 更新条目
const updateEntry = (id: number | string, field: string, value: any) => {
  const entry = localState.value.worldBookEntries.find((e: any) => e.id === id)
  if (entry) {
    entry[field] = value
  }
}

// 更新扩展字段
const updateExtension = (id: number | string, field: string, value: any) => {
  const entry = localState.value.worldBookEntries.find((e: any) => e.id === id)
  if (entry) {
    if (!entry.extensions) entry.extensions = {}
    entry.extensions[field] = value
  }
}

// 过滤后的条目
const filteredEntries = computed(() => {
  if (!localState.value.worldBookSearch) {
    return localState.value.worldBookEntries
  }
  const search = localState.value.worldBookSearch.toLowerCase()
  return localState.value.worldBookEntries.filter((e: any) => {
    const comment = (e.comment || '').toLowerCase()
    const keys = (e.keys || []).join(',').toLowerCase()
    const content = (e.content || '').toLowerCase()
    return comment.includes(search) || keys.includes(search) || content.includes(search)
  })
})

// 文件导入
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleImportFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const parsed = JSON.parse(text)
    let rawEntries: any[] = []
    if (Array.isArray(parsed)) {
      rawEntries = parsed
    } else if (parsed.entries && Array.isArray(parsed.entries)) {
      rawEntries = parsed.entries
      if (parsed.name) localState.value.worldBookName = parsed.name
    } else {
      toast.add({ title: '无效的JSON格式', color: 'error' })
      return
    }
    const validEntries: any[] = []
    for (let i = 0; i < rawEntries.length; i++) {
      const entry = rawEntries[i]
      if (!entry || typeof entry !== 'object') continue
      const hasContent = typeof entry.content === 'string' && entry.content.trim() !== ''
      const hasKeys = Array.isArray(entry.keys) && entry.keys.length > 0
      if (!hasContent && !hasKeys) continue
      validEntries.push({
        id: entry.id ?? Date.now() + i,
        keys: Array.isArray(entry.keys) ? entry.keys : [],
        secondary_keys: Array.isArray(entry.secondary_keys) ? entry.secondary_keys : [],
        comment: String(entry.comment || ''),
        content: String(entry.content || ''),
        enabled: entry.enabled !== false,
        constant: Boolean(entry.constant),
        selective: entry.selective !== false,
        insertion_order: Number(entry.insertion_order) || 0,
        position: String(entry.position || 'after_char'),
        use_regex: Boolean(entry.use_regex),
        extensions: entry.extensions || { position: 4, probability: 100, depth: 4 }
      })
    }
    if (validEntries.length > 0) {
      localState.value.worldBookEntries = validEntries
      toast.add({ title: `成功导入 ${validEntries.length} 个条目`, color: 'success' })
    } else {
      toast.add({ title: '未找到有效的世界书条目', color: 'error' })
    }
  } catch (err) {
    toast.add({ title: '文件解析失败', color: 'error' })
  }
  ;(e.target as HTMLInputElement).value = ''
}

// 插入位置选项
const positionOptions = [
  { label: '角色定义之前', value: 'before_char|0|0' },
  { label: '角色定义之后', value: 'after_char|1|0' },
  { label: '作者注释之前', value: 'after_char|2|0' },
  { label: '作者注释之后', value: 'after_char|3|0' },
  { label: '智能插入', value: 'after_char|4|0' },
  { label: '智能插入-User', value: 'after_char|4|1' },
  { label: '智能插入-AI', value: 'after_char|4|2' },
  { label: '智能插入-System', value: 'after_char|4|3' }
]

// 触发模式选项
const triggerOptions = [
  { label: '始终触发', value: 'always' },
  { label: '关键词触发', value: 'keyword' }
]

// 获取位置值
const getPositionValue = (entry: any) => {
  const pos = entry.position || 'after_char'
  const extPos = entry.extensions?.position ?? 4
  const role = entry.extensions?.role ?? 0
  return `${pos}|${extPos}|${role}`
}

// 设置位置值
const setPositionValue = (entry: any, value: string) => {
  const parts = value.split('|')
  entry.position = parts[0]
  if (!entry.extensions) entry.extensions = {}
  entry.extensions.position = parseInt(parts[1])
  entry.extensions.role = parseInt(parts[2])
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
      角色专属世界书
    </h1>

    <!-- 搜索和操作 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
        <UIcon name="i-lucide-globe" class="w-5 h-5" />
        <span class="font-medium">世界书管理</span>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <UInput
          v-model="localState.worldBookSearch"
          placeholder="搜索条目..."
          class="flex-1 max-w-md"
        >
          <template #leading>
            <UIcon name="i-lucide-search" class="w-4 h-4 text-gray-400" />
          </template>
        </UInput>
        <UButton variant="outline" @click="fileInputRef?.click()">
          <template #leading>
            <UIcon name="i-lucide-upload" class="w-4 h-4" />
          </template>
          导入
        </UButton>
        <UButton @click="addEntry">
          <template #leading>
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
          </template>
          添加条目
        </UButton>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleImportFile"
      >

      <div>
        <label class="block text-sm text-gray-500 mb-2">世界书名称</label>
        <UInput v-model="localState.worldBookName" placeholder="给世界书起个名字..." class="w-full" />
      </div>
    </div>

    <!-- 条目列表 -->
    <div class="space-y-3">
      <!-- 空状态 -->
      <div v-if="filteredEntries.length === 0" class="p-16 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <UIcon name="i-lucide-globe" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>暂无世界书条目，点击上方添加</p>
      </div>

      <!-- 条目卡片 -->
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden"
      >
        <!-- 条目头部 -->
        <div
          class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="toggleExpand(entry.id)"
        >
          <USwitch
            :model-value="entry.enabled"
            size="sm"
            @click.stop
            @update:model-value="updateEntry(entry.id, 'enabled', $event)"
          />
          <UIcon
            :name="expandedIds.has(entry.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            class="w-4 h-4 text-gray-400"
          />
          <span class="font-medium text-gray-900 dark:text-gray-100 flex-1">
            {{ entry.comment || '未命名条目' }}
          </span>
          <UBadge :color="entry.constant ? 'primary' : 'neutral'" variant="soft" size="xs">
            {{ entry.constant ? '始终' : '选择性' }}
          </UBadge>
          <UButton
            variant="ghost"
            size="xs"
            color="error"
            @click.stop="removeEntry(entry.id)"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
          </UButton>
        </div>

        <!-- 条目内容（展开时显示） -->
        <div v-if="expandedIds.has(entry.id)" class="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">标题</label>
            <UInput
              :model-value="entry.comment"
              placeholder="条目标题"
              class="w-full"
              @update:model-value="updateEntry(entry.id, 'comment', $event)"
            />
          </div>

          <!-- 主要关键词 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">主要关键词</label>
            <UInput
              :model-value="(entry.keys || []).join(', ')"
              placeholder="输入关键词，用逗号分隔"
              class="w-full"
              @update:model-value="updateEntry(entry.id, 'keys', ($event || '').split(',').map((s: string) => s.trim()).filter(Boolean))"
            />
          </div>

          <!-- 次要关键词 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">次要关键词</label>
            <UInput
              :model-value="(entry.secondary_keys || []).join(', ')"
              placeholder="输入次要关键词，用逗号分隔"
              class="w-full"
              @update:model-value="updateEntry(entry.id, 'secondary_keys', ($event || '').split(',').map((s: string) => s.trim()).filter(Boolean))"
            />
          </div>

          <!-- 触发模式 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">触发模式</label>
            <USelectMenu
              :model-value="entry.constant ? 'always' : 'keyword'"
              :items="triggerOptions"
              value-key="value"
              class="w-full"
              @update:model-value="updateEntry(entry.id, 'constant', $event === 'always')"
            />
          </div>

          <!-- 插入位置 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">插入位置</label>
            <USelectMenu
              :model-value="getPositionValue(entry)"
              :items="positionOptions"
              value-key="value"
              class="w-full"
              @update:model-value="setPositionValue(entry, $event)"
            />
          </div>

          <!-- 内容 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">内容</label>
            <UTextarea
              :model-value="entry.content"
              placeholder="输入世界书内容..."
              :rows="6"
              class="w-full font-mono text-sm"
              @update:model-value="updateEntry(entry.id, 'content', $event)"
            />
          </div>

          <!-- 优先级、触发概率、扫描深度 -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-2">优先级</label>
              <UInput
                type="number"
                :model-value="entry.insertion_order"
                class="w-full"
                @update:model-value="updateEntry(entry.id, 'insertion_order', Number($event))"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-2">触发概率 (%)</label>
              <UInput
                type="number"
                :model-value="entry.extensions?.probability ?? 100"
                min="0"
                max="100"
                class="w-full"
                @update:model-value="updateExtension(entry.id, 'probability', Number($event))"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-2">扫描深度</label>
              <UInput
                type="number"
                :model-value="entry.extensions?.depth || 0"
                min="0"
                class="w-full"
                @update:model-value="updateExtension(entry.id, 'depth', Number($event))"
              />
            </div>
          </div>

          <!-- 高级设置 -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
              高级设置
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">启用</span>
                  <p class="text-xs text-gray-400">
                    是否让该条目生效
                  </p>
                </div>
                <USwitch :model-value="entry.enabled" size="sm" @update:model-value="updateEntry(entry.id, 'enabled', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">大小写敏感</span>
                  <p class="text-xs text-gray-400">
                    匹配时区分大小写
                  </p>
                </div>
                <USwitch :model-value="entry.extensions?.case_sensitive || false" size="sm" @update:model-value="updateExtension(entry.id, 'case_sensitive', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">正则匹配</span>
                  <p class="text-xs text-gray-400">
                    keys 用正则匹配
                  </p>
                </div>
                <USwitch :model-value="entry.use_regex" size="sm" @update:model-value="updateEntry(entry.id, 'use_regex', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">全词匹配</span>
                  <p class="text-xs text-gray-400">
                    类似精确匹配
                  </p>
                </div>
                <USwitch :model-value="entry.extensions?.match_whole_words || false" size="sm" @update:model-value="updateExtension(entry.id, 'match_whole_words', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">选择性注入</span>
                  <p class="text-xs text-gray-400">
                    按系统规则选择插入
                  </p>
                </div>
                <USwitch :model-value="entry.selective" size="sm" @update:model-value="updateEntry(entry.id, 'selective', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">恒定注入</span>
                  <p class="text-xs text-gray-400">
                    始终插入（按系统定义）
                  </p>
                </div>
                <USwitch :model-value="entry.constant" size="sm" @update:model-value="updateEntry(entry.id, 'constant', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">阻止递归</span>
                  <p class="text-xs text-gray-400">
                    防止AI跟自己对话
                  </p>
                </div>
                <USwitch :model-value="entry.extensions?.prevent_recursion || false" size="sm" @update:model-value="updateExtension(entry.id, 'prevent_recursion', $event)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
