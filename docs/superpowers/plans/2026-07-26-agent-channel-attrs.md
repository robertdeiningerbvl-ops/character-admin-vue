# 代理渠道属性统计页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建代理渠道属性统计页面，支持汇总统计和每日明细两种数据维度的展示，提供筛选、分页和图表可视化功能。

**Architecture:** 使用标签页组件分离两种数据维度，共享筛选条件和状态管理。独立的组件负责筛选表单、表格列定义和图表展示。遵循项目现有的Vue3 Composition API模式。

**Tech Stack:** Vue 3, TypeScript, Vant UI, Alova, Apache ECharts 5.x, TailwindCSS v4

---

## 文件结构规划

### 新建文件

1. **API层**
   - `app/api/modules/agent.ts` - Agent相关API接口封装

2. **页面层**
   - `app/pages/agent/channel-attrs.vue` - 主页面组件，管理状态和协调子组件

3. **组件层**
   - `app/components/agent/channel-attrs/columns.tsx` - 表格列定义（汇总和每日明细）
   - `app/components/agent/channel-attrs/FilterForm.vue` - 筛选表单组件
   - `app/components/agent/channel-attrs/ChartModal.vue` - 图表弹窗组件

### 修改文件

1. **路由配置**
   - `app/router/index.ts` - 添加新页面路由

### 目录结构

```
app/
├── api/
│   └── modules/
│       └── agent.ts (新建)
├── pages/
│   └── agent/
│       └── channel-attrs.vue (新建)
├── components/
│   └── agent/
│       └── channel-attrs/
│           ├── columns.tsx (新建)
│           ├── FilterForm.vue (新建)
│           └── ChartModal.vue (新建)
└── router/
    └── index.ts (修改)
```

---

## Task 1: 创建API接口层

**Files:**
- Create: `app/api/modules/agent.ts`

**目标**: 封装两个代理渠道属性相关的API接口

- [ ] **Step 1: 创建agent.ts文件并定义接口**

```typescript
import { alova } from '@/api/request'

/**
 * 获取代理渠道属性列表（汇总统计）
 * @param params 查询参数
 */
export const getAgentChannelAttrs = (params: {
  page?: string
  pagesize?: string
  agent_code?: string
  channel_id?: string
  start_time?: string
  end_time?: string
}) => {
  return alova.Get('/admin/agent-channel-attrs', { params })
}

/**
 * 获取代理渠道每日属性列表（每日明细）
 * @param params 查询参数
 */
export const getAgentChannelAttrsDay = (params: {
  page?: string
  pagesize?: string
  agent_code?: string
  channel_id?: string
  start_time?: string
  end_time?: string
}) => {
  return alova.Get('/admin/agent-channel-attrs-day', { params })
}
```

- [ ] **Step 2: 导出API到主入口**

打开 `app/api/index.ts`，在文件末尾添加导出：

```typescript
export * from './modules/agent'
```

- [ ] **Step 3: 验证API接口定义**

检查：
- 文件路径正确
- 导入语句正确
- 参数类型定义完整
- 接口路径与文档一致

- [ ] **Step 4: 提交**

```bash
git add app/api/modules/agent.ts app/api/index.ts
git commit -m "feat: 添加代理渠道属性API接口

- 添加getAgentChannelAttrs接口（汇总统计）
- 添加getAgentChannelAttrsDay接口（每日明细）
- 支持分页、筛选等查询参数

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 创建表格列定义

**Files:**
- Create: `app/components/agent/channel-attrs/columns.tsx`

**目标**: 定义汇总统计和每日明细两种表格列配置

- [ ] **Step 1: 创建目录结构**

```bash
mkdir -p app/components/agent/channel-attrs
```

- [ ] **Step 2: 创建columns.tsx文件并定义汇总列**

创建文件 `app/components/agent/channel-attrs/columns.tsx`，先定义基础导入和汇总统计列：

```typescript
import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')

// 汇总统计列配置
export const summaryColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent'
    }),
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600' }, `#${row.original.id}`),
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.agent_code || '-'),
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'channel_id',
    header: '渠道ID',
    cell: ({ row }) => h('span', {}, row.original.channel_id || '-'),
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } }
  },
  {
    accessorKey: 'consume_amount',
    header: '消耗金额',
    cell: ({ row }) => {
      const amount = row.original.consume_amount || 0
      return h('span', { class: 'font-semibold text-blue-600' }, `¥${amount.toLocaleString()}`)
    },
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'profit',
    header: '利润',
    cell: ({ row }) => {
      const profit = row.original.profit || 0
      const colorClass = profit >= 0 ? 'text-green-600' : 'text-red-600'
      return h('span', { class: `font-semibold ${colorClass}` }, `¥${profit.toLocaleString()}`)
    },
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => h('span', {}, formatToDateTime(row.original.created_at) || '-'),
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } }
  }
]
```

- [ ] **Step 3: 添加每日明细列配置**

在同一文件中继续添加每日明细列配置：

```typescript
// 每日明细列配置
export const dailyColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent'
    }),
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600' }, `#${row.original.id}`),
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.agent_code || '-'),
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'channel_id',
    header: '渠道ID',
    cell: ({ row }) => h('span', {}, row.original.channel_id || '-'),
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } }
  },
  {
    accessorKey: 'day_time',
    header: '统计日期',
    cell: ({ row }) => h('span', { class: 'font-medium' }, formatToDate(row.original.day_time) || '-'),
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'consume_amount',
    header: '消耗金额',
    cell: ({ row }) => {
      const amount = row.original.consume_amount || 0
      return h('span', { class: 'font-semibold text-blue-600' }, `¥${amount.toLocaleString()}`)
    },
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  },
  {
    accessorKey: 'profit',
    header: '利润',
    cell: ({ row }) => {
      const profit = row.original.profit || 0
      const colorClass = profit >= 0 ? 'text-green-600' : 'text-red-600'
      return h('span', { class: `font-semibold ${colorClass}` }, `¥${profit.toLocaleString()}`)
    },
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } }
  }
]
```

- [ ] **Step 4: 验证列定义**

检查：
- summaryColumns 包含6列（不含day_time）
- dailyColumns 包含6列（包含day_time，不含created_at）
- 格式化函数正确（formatToDateTime, formatToDate）

- [ ] **Step 5: 提交**

```bash
git add app/components/agent/channel-attrs/columns.tsx
git commit -m "feat: 添加代理渠道属性表格列定义

- 定义汇总统计表格列（6列）
- 定义每日明细表格列（6列，含day_time）
- 金额和日期格式化处理

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: 创建筛选表单组件

**Files:**
- Create: `app/components/agent/channel-attrs/FilterForm.vue`

**目标**: 创建筛选表单组件，包含代理编码、渠道ID和日期范围筛选

- [ ] **Step 1: 创建FilterForm.vue文件**

```vue
<script setup lang="ts">
interface FilterParams {
  agent_code: string
  channel_id: string
  start_time: string
  end_time: string
}

const props = defineProps<{
  modelValue: FilterParams
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterParams]
  'search': []
  'reset': []
}>()

const localFilters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('update:modelValue', {
    agent_code: '',
    channel_id: '',
    start_time: '',
    end_time: ''
  })
  emit('reset')
}
</script>

<template>
  <div class="bg-(--ui-bg-elevated) rounded-lg p-4 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">代理编码</label>
        <input
          v-model="localFilters.agent_code"
          type="text"
          placeholder="请输入代理编码"
          class="w-full px-3 py-2 border rounded-lg"
        >
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">渠道ID</label>
        <input
          v-model="localFilters.channel_id"
          type="number"
          placeholder="请输入渠道ID"
          class="w-full px-3 py-2 border rounded-lg"
        >
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">开始日期</label>
        <input
          v-model="localFilters.start_time"
          type="date"
          class="w-full px-3 py-2 border rounded-lg"
        >
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">结束日期</label>
        <input
          v-model="localFilters.end_time"
          type="date"
          class="w-full px-3 py-2 border rounded-lg"
        >
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <UButton color="primary" @click="handleSearch">查询</UButton>
      <UButton color="neutral" variant="outline" @click="handleReset">重置</UButton>
    </div>
  </div>
</template>
```

- [ ] **Step 2: 验证组件功能**

检查：
- Props和Emits定义正确
- v-model双向绑定正常
- 日期输入框类型正确

- [ ] **Step 3: 提交**

```bash
git add app/components/agent/channel-attrs/FilterForm.vue
git commit -m "feat: 添加筛选表单组件

- 支持代理编码、渠道ID筛选
- 支持日期范围筛选
- 提供查询和重置功能

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: 创建主页面组件（基础结构和汇总统计）

**Files:**
- Create: `app/pages/agent/channel-attrs.vue`

**目标**: 创建主页面，实现状态管理、数据加载和汇总统计标签页

- [ ] **Step 1: 创建页面目录和基础文件**

```bash
mkdir -p app/pages/agent
```

创建 `app/pages/agent/channel-attrs.vue`，添加基础结构：

```vue
<script setup lang="ts">
import { summaryColumns, dailyColumns } from '@/components/agent/channel-attrs/columns'
import FilterForm from '@/components/agent/channel-attrs/FilterForm.vue'
import { getAgentChannelAttrs, getAgentChannelAttrsDay } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'AgentChannelAttrs' })

const state = reactive({
  activeTab: 'summary',
  filters: {
    agent_code: '',
    channel_id: '',
    start_time: '',
    end_time: ''
  },
  summaryData: {
    list: [],
    count: 0,
    loading: false,
    page: 1,
    pagesize: 10
  },
  dailyData: {
    list: [],
    count: 0,
    loading: false,
    page: 1,
    pagesize: 10
  }
})

// 加载汇总数据
const loadSummaryData = async () => {
  state.summaryData.loading = true
  try {
    const params = {
      page: String(state.summaryData.page),
      pagesize: String(state.summaryData.pagesize),
      ...state.filters
    }
    const { data } = await getAgentChannelAttrs(params)
    state.summaryData.list = data?.list || []
    state.summaryData.count = data?.count || 0
  } catch (error) {
    console.error('加载汇总数据失败:', error)
  } finally {
    state.summaryData.loading = false
  }
}

// 加载每日数据
const loadDailyData = async () => {
  state.dailyData.loading = true
  try {
    const params = {
      page: String(state.dailyData.page),
      pagesize: String(state.dailyData.pagesize),
      ...state.filters
    }
    const { data } = await getAgentChannelAttrsDay(params)
    state.dailyData.list = data?.list || []
    state.dailyData.count = data?.count || 0
  } catch (error) {
    console.error('加载每日数据失败:', error)
  } finally {
    state.dailyData.loading = false
  }
}

const handleSearch = () => {
  if (state.activeTab === 'summary') {
    state.summaryData.page = 1
    loadSummaryData()
  } else {
    state.dailyData.page = 1
    loadDailyData()
  }
}

const handleReset = () => {
  if (state.activeTab === 'summary') {
    state.summaryData.page = 1
    loadSummaryData()
  } else {
    state.dailyData.page = 1
    loadDailyData()
  }
}

const handleTabChange = (tab: string) => {
  state.activeTab = tab
  if (tab === 'daily' && state.dailyData.list.length === 0) {
    loadDailyData()
  }
}

onMounted(() => {
  loadSummaryData()
})
</script>
```

- [ ] **Step 2: 添加模板部分**

在同一文件中添加 `<template>` 部分：

```vue
<template>
  <DashboardLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">代理渠道属性统计</h1>

      <!-- 筛选表单 -->
      <FilterForm
        v-model="state.filters"
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- 标签页 -->
      <UTabs
        v-model="state.activeTab"
        :items="[
          { key: 'summary', label: '汇总统计' },
          { key: 'daily', label: '每日明细' }
        ]"
        @update:model-value="handleTabChange"
      />

      <!-- 汇总统计表格 -->
      <div v-if="state.activeTab === 'summary'">
        <DataTable
          :columns="summaryColumns"
          :data="state.summaryData.list"
          :loading="state.summaryData.loading"
        />
        <UPagination
          v-model="state.summaryData.page"
          :total="state.summaryData.count"
          :page-size="state.summaryData.pagesize"
          @update:model-value="handlePageChange"
        />
      </div>

      <!-- 每日明细表格 -->
      <div v-if="state.activeTab === 'daily'">
        <DataTable
          :columns="dailyColumns"
          :data="state.dailyData.list"
          :loading="state.dailyData.loading"
        />
        <UPagination
          v-model="state.dailyData.page"
          :total="state.dailyData.count"
          :page-size="state.dailyData.pagesize"
          @update:model-value="handlePageChange"
        />
      </div>
    </div>
  </DashboardLayout>
</template>
```

- [ ] **Step 3: 手动测试页面**

在浏览器中访问页面，检查：
- 页面正常渲染
- 筛选表单正常显示
- 标签页切换正常
- 汇总统计表格正常显示数据

- [ ] **Step 4: 提交**

```bash
git add app/pages/agent/channel-attrs.vue
git commit -m "feat: 添加主页面组件

- 实现状态管理
- 实现数据加载函数
- 添加筛选表单集成
- 添加标签页切换
- 添加表格展示和分页

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: 创建图表弹窗组件

**Files:**
- Create: `app/components/agent/channel-attrs/ChartModal.vue`

**目标**: 创建图表弹窗组件，使用ECharts展示时间序列趋势

- [ ] **Step 1: 安装ECharts（如需要）**

```bash
npm install echarts vue-echarts
```

- [ ] **Step 2: 创建ChartModal.vue**

```vue
<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  open: boolean
  agentCode: string
  channelId: number
  data: any[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const chartOption = computed(() => {
  const dates = props.data.map(item => formatToDate(item.day_time))
  const amounts = props.data.map(item => item.consume_amount)
  const profits = props.data.map(item => item.profit)

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['消耗金额', '利润'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: [
      { type: 'value', name: '消耗金额', position: 'left' },
      { type: 'value', name: '利润', position: 'right' }
    ],
    series: [
      {
        name: '消耗金额',
        type: 'line',
        data: amounts,
        yAxisIndex: 0,
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: '利润',
        type: 'line',
        data: profits,
        yAxisIndex: 1,
        itemStyle: { color: '#10b981' }
      }
    ]
  }
})
</script>

<template>
  <UModal :model-value="open" @update:model-value="emit('update:open', $event)">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">代理渠道数据趋势图</h2>
      <div class="mb-4 text-sm text-gray-600">
        <span>代理编码: {{ agentCode }}</span>
        <span class="ml-4">渠道ID: {{ channelId }}</span>
      </div>
      <div class="h-[400px]">
        <VChart :option="chartOption" autoresize />
      </div>
    </div>
  </UModal>
</template>
```

- [ ] **Step 3: 提交**

```bash
git add app/components/agent/channel-attrs/ChartModal.vue
git commit -m "feat: 添加图表弹窗组件

- 使用ECharts展示时间序列趋势
- 双Y轴显示消耗金额和利润

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: 集成图表功能到主页面

**Files:**
- Modify: `app/pages/agent/channel-attrs.vue`
- Modify: `app/components/agent/channel-attrs/columns.tsx`

**目标**: 将图表功能集成到主页面，添加操作按钮

- [ ] **Step 1: 修改主页面添加图表状态**

在 `app/pages/agent/channel-attrs.vue` 的 `<script setup>` 中添加：

```typescript
import ChartModal from '@/components/agent/channel-attrs/ChartModal.vue'

// 图表状态
const chartState = reactive({
  open: false,
  agentCode: '',
  channelId: 0,
  data: [],
  loading: false
})

// 打开图表
const handleShowChart = async (row: any) => {
  chartState.agentCode = row.agent_code
  chartState.channelId = row.channel_id
  chartState.open = true
  chartState.loading = true
  
  try {
    const params = {
      agent_code: row.agent_code,
      channel_id: String(row.channel_id),
      page: '1',
      pagesize: '100'
    }
    const { data } = await getAgentChannelAttrsDay(params)
    chartState.data = data?.list || []
  } catch (error) {
    console.error('加载图表数据失败:', error)
  } finally {
    chartState.loading = false
  }
}
```

- [ ] **Step 2: 修改模板添加图表弹窗**

在 `<template>` 的最后添加：

```vue
<!-- 图表弹窗 -->
<ChartModal
  v-model:open="chartState.open"
  :agent-code="chartState.agentCode"
  :channel-id="chartState.channelId"
  :data="chartState.data"
/>
```

- [ ] **Step 3: 修改列定义添加操作列**

在 `columns.tsx` 中，为 `summaryColumns` 和 `dailyColumns` 都添加操作列：

```typescript
// 在每个列数组的最后添加
{
  accessorKey: 'actions',
  header: '操作',
  cell: ({ row, table }) => {
    return h(UButton, {
      icon: 'i-lucide-bar-chart-2',
      variant: 'ghost',
      size: 'sm',
      onClick: () => {
        // 需要通过table.options传递handleShowChart函数
        const meta = table.options.meta as any
        if (meta?.onShowChart) {
          meta.onShowChart(row.original)
        }
      }
    }, () => '图表')
  },
  meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } }
}
```

- [ ] **Step 4: 修改DataTable传递函数**

在主页面的DataTable组件中传递函数：

```vue
<DataTable
  :columns="summaryColumns"
  :data="state.summaryData.list"
  :loading="state.summaryData.loading"
  :meta="{ onShowChart: handleShowChart }"
/>

<DataTable
  :columns="dailyColumns"
  :data="state.dailyData.list"
  :loading="state.dailyData.loading"
  :meta="{ onShowChart: handleShowChart }"
/>
```

- [ ] **Step 5: 测试图表功能**

测试：
- 点击图表按钮打开弹窗
- 图表正确显示数据
- 关闭弹窗正常

- [ ] **Step 6: 提交**

```bash
git add app/pages/agent/channel-attrs.vue app/components/agent/channel-attrs/columns.tsx
git commit -m "feat: 集成图表功能到主页面

- 添加图表状态管理
- 添加打开图表函数
- 表格列添加图表操作按钮
- 集成图表弹窗组件

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: 添加路由配置

**Files:**
- Modify: `app/router/index.ts`

**目标**: 添加新页面的路由配置

- [ ] **Step 1: 修改路由配置文件**

打开 `app/router/index.ts`，在路由数组中添加新路由：

```typescript
{
  path: '/agent/channel-attrs',
  name: 'AgentChannelAttrs',
  component: () => import('@/pages/agent/channel-attrs.vue'),
  meta: {
    title: '代理渠道属性统计',
    requiresAuth: true
  }
}
```

- [ ] **Step 2: 验证路由配置**

检查：
- 路由路径正确
- 组件导入路径正确
- meta信息完整

- [ ] **Step 3: 在浏览器中访问测试**

访问 `http://localhost:3000/agent/channel-attrs`，确认页面正常加载

- [ ] **Step 4: 提交**

```bash
git add app/router/index.ts
git commit -m "feat: 添加代理渠道属性统计页面路由

- 配置页面路由
- 设置页面标题和认证要求

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: 端到端测试和验证

**目标**: 全面测试所有功能，确保正常工作

- [ ] **Step 1: 测试筛选功能**

测试项：
- 输入代理编码，点击查询，验证数据正确筛选
- 输入渠道ID，点击查询，验证数据正确筛选
- 选择日期范围，点击查询，验证数据正确筛选
- 点击重置，验证筛选条件清空并重新加载数据

- [ ] **Step 2: 测试标签页切换**

测试项：
- 切换到每日明细标签页，验证数据自动加载
- 在每日明细标签页应用筛选，验证数据正确筛选
- 切换回汇总统计标签页，验证筛选条件保持且数据正确

- [ ] **Step 3: 测试分页功能**

测试项：
- 切换页码，验证数据正确加载
- 两个标签页的分页状态独立，互不影响

- [ ] **Step 4: 测试图表功能**

测试项：
- 点击汇总统计表格的图表按钮，验证弹窗打开
- 验证图表显示该代理渠道的每日明细数据
- 验证消耗金额和利润两条线正确显示
- 关闭弹窗，再次打开不同行的图表，验证数据更新

- [ ] **Step 5: 测试响应式布局**

测试项：
- 在不同屏幕尺寸下测试页面布局
- 验证移动端显示正常

- [ ] **Step 6: 最终提交**

如果所有测试通过，最终提交：

```bash
git add .
git commit -m "test: 完成端到端测试验证

- 筛选功能测试通过
- 标签页切换测试通过
- 分页功能测试通过
- 图表功能测试通过
- 响应式布局测试通过

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---



