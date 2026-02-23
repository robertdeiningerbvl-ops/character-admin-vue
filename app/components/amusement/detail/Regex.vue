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
const expandedIds = ref<Set<string>>(new Set())

const toggleExpand = (id: string) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

// 添加条目
const addEntry = () => {
  const newId = String(Date.now())
  localState.value.regexEntries.push({
    id: newId,
    scriptName: '',
    findRegex: '',
    replaceString: '',
    placement: [],
    disabled: false,
    markdownOnly: false,
    promptOnly: false,
    trimStrings: []
  })
  expandedIds.value.add(newId)
}

// 删除条目
const removeEntry = (id: string) => {
  const idx = localState.value.regexEntries.findIndex((e: any) => e.id === id)
  if (idx > -1) {
    localState.value.regexEntries.splice(idx, 1)
  }
}

// 更新条目
const updateEntry = (id: string, field: string, value: any) => {
  const entry = localState.value.regexEntries.find((e: any) => e.id === id)
  if (entry) {
    entry[field] = value
  }
}

// 切换 placement
const togglePlacement = (id: string, val: number, checked: boolean) => {
  const entry = localState.value.regexEntries.find((e: any) => e.id === id)
  if (!entry) return
  if (!Array.isArray(entry.placement)) entry.placement = []
  if (checked) {
    if (!entry.placement.includes(val)) {
      entry.placement.push(val)
    }
  } else {
    entry.placement = entry.placement.filter((x: number) => x !== val)
  }
}

// 过滤后的条目
const filteredEntries = computed(() => {
  if (!localState.value.regexSearch) {
    return localState.value.regexEntries
  }
  const search = localState.value.regexSearch.toLowerCase()
  return localState.value.regexEntries.filter((e: any) => {
    return (e.scriptName || '').toLowerCase().includes(search)
      || (e.findRegex || '').toLowerCase().includes(search)
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
    } else {
      toast.add({ title: '无效的JSON格式', color: 'error' })
      return
    }
    const validEntries = rawEntries.map((e, i) => ({
      id: e.id || String(Date.now() + i),
      scriptName: e.scriptName || '',
      findRegex: e.findRegex || '',
      replaceString: e.replaceString || '',
      placement: Array.isArray(e.placement) ? e.placement : [],
      disabled: Boolean(e.disabled),
      markdownOnly: Boolean(e.markdownOnly),
      promptOnly: Boolean(e.promptOnly),
      trimStrings: Array.isArray(e.trimStrings) ? e.trimStrings : []
    }))
    if (validEntries.length > 0) {
      localState.value.regexEntries = validEntries
      toast.add({ title: `成功导入 ${validEntries.length} 个正则`, color: 'success' })
    }
  } catch (err) {
    toast.add({ title: '文件解析失败', color: 'error' })
  }
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
      正则脚本
    </h1>

    <!-- 搜索和操作 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
        <UIcon name="i-lucide-regex" class="w-5 h-5" />
        <span class="font-medium">正则管理</span>
      </div>

      <div class="flex items-center gap-3">
        <UInput
          v-model="localState.regexSearch"
          placeholder="搜索正则..."
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
          添加正则
        </UButton>
      </div>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleImportFile"
    >

    <!-- 条目列表 -->
    <div class="space-y-3">
      <!-- 空状态 -->
      <div v-if="filteredEntries.length === 0" class="p-16 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <UIcon name="i-lucide-regex" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>暂无正则脚本，点击上方添加</p>
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
          <UIcon name="i-lucide-grip-vertical" class="w-5 h-5 text-gray-400" />
          <USwitch
            :model-value="!entry.disabled"
            size="sm"
            @click.stop
            @update:model-value="updateEntry(entry.id, 'disabled', !$event)"
          />
          <UIcon
            :name="expandedIds.has(entry.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            class="w-4 h-4 text-gray-400"
          />
          <span class="font-medium text-gray-900 dark:text-gray-100 flex-1">
            {{ entry.scriptName || '未命名规则' }}
          </span>
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
        <div v-if="expandedIds.has(entry.id)" class="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
          <!-- 规则ID 和 脚本名称 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500 mb-2">规则ID</label>
              <UInput :model-value="entry.id" disabled class="w-full bg-gray-100 dark:bg-gray-900" />
            </div>
            <div>
              <label class="block text-sm text-gray-500 mb-2">脚本名称</label>
              <UInput
                :model-value="entry.scriptName"
                placeholder="Script Name"
                class="w-full"
                @update:model-value="updateEntry(entry.id, 'scriptName', $event)"
              />
            </div>
          </div>

          <!-- 查找正则 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">查找正则 *</label>
            <UInput
              :model-value="entry.findRegex"
              placeholder="\*([\\s\\S]*?)\*"
              class="w-full font-mono"
              @update:model-value="updateEntry(entry.id, 'findRegex', $event)"
            />
          </div>

          <!-- 替换内容 -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">替换内容 *</label>
            <UTextarea
              :model-value="entry.replaceString"
              placeholder="<span class=&quot;highlight&quot;>$1</span>"
              :rows="4"
              class="w-full font-mono"
              @update:model-value="updateEntry(entry.id, 'replaceString', $event)"
            />
          </div>

          <!-- 作用范围 -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
              作用范围
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">用户输入</span>
                  <p class="text-xs text-gray-400">
                    应用于用户输入内容
                  </p>
                </div>
                <USwitch :model-value="(entry.placement || []).includes(1)" size="sm" @update:model-value="togglePlacement(entry.id, 1, $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">AI输出</span>
                  <p class="text-xs text-gray-400">
                    应用于AI输出内容
                  </p>
                </div>
                <USwitch :model-value="(entry.placement || []).includes(2)" size="sm" @update:model-value="togglePlacement(entry.id, 2, $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">快捷命令</span>
                  <p class="text-xs text-gray-400">
                    应用于快捷命令
                  </p>
                </div>
                <USwitch :model-value="(entry.placement || []).includes(3)" size="sm" @update:model-value="togglePlacement(entry.id, 3, $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">世界信息</span>
                  <p class="text-xs text-gray-400">
                    应用于世界书内容
                  </p>
                </div>
                <USwitch :model-value="(entry.placement || []).includes(4)" size="sm" @update:model-value="togglePlacement(entry.id, 4, $event)" />
              </div>
            </div>
          </div>

          <!-- 其他选项 -->
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
              其他选项
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">是否启用</span>
                  <p class="text-xs text-gray-400">
                    启用或禁用此正则规则
                  </p>
                </div>
                <USwitch :model-value="!entry.disabled" size="sm" @update:model-value="updateEntry(entry.id, 'disabled', !$event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">仅改变显示</span>
                  <p class="text-xs text-gray-400">
                    仅影响显示，不影响发送内容
                  </p>
                </div>
                <USwitch :model-value="entry.markdownOnly || false" size="sm" @update:model-value="updateEntry(entry.id, 'markdownOnly', $event)" />
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">仅改变发送</span>
                  <p class="text-xs text-gray-400">
                    仅影响发送内容，不影响显示
                  </p>
                </div>
                <USwitch :model-value="entry.promptOnly || false" size="sm" @update:model-value="updateEntry(entry.id, 'promptOnly', $event)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
