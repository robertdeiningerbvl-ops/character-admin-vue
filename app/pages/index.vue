<script setup lang="ts">
import { getCommonStatistics, refreshCommonStatistics } from '@/api'
import dayjs from 'dayjs'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip, VisArea } from '@unovis/vue'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'Home'
})

const state = reactive({
  loading: true,
  range: 7,
  rangeOptions: [
    { label: '今日', value: 0 },
    { label: '昨天', value: 1 },
    { label: '近3天', value: 3 },
    { label: '近7天', value: 7 },
    { label: '近30天', value: 30 }
  ] as any[],
  summaryList: [] as { name: string, f: string, num: number, icon: string, color: string }[],
  rawList: [] as any[],
  chartData: [] as any[]
})

// 指标配置
const metrics = [
  { f: 'ZC_NUM', name: '注册人数', icon: 'lucide:user-plus', color: 'primary' },
  { f: 'HY_NUM', name: '活跃人数', icon: 'lucide:users', color: 'success' },
  { f: 'CZ_NUM', name: '充值人数', icon: 'lucide:wallet', color: 'warning' },
  { f: 'CZ_PRICE', name: '充值金额', icon: 'lucide:banknote', color: 'error' },
  { f: 'HY_YK_NUM', name: '游客人数', icon: 'lucide:user', color: 'info' },
  { f: 'AQ_NUM', name: '邀请人数', icon: 'lucide:share-2', color: 'secondary' },
  { f: 'DH_NUM', name: '对话数', icon: 'lucide:message-circle', color: 'primary' },
  { f: 'XF_NUM', name: '消费电量', icon: 'lucide:zap', color: 'warning' },
  { f: 'CZ_SUCCESS', name: '成功订单', icon: 'lucide:check-circle', color: 'success' },
  { f: 'CZ_ERROR', name: '未付款单', icon: 'lucide:x-circle', color: 'error' }
]

// 图表颜色
const chartColors = {
  primary: 'var(--ui-primary)',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  secondary: '#8b5cf6'
}

// 当前选中的图表指标
const selectedCharts = ref(['ZC_NUM', 'HY_NUM', 'CZ_PRICE'])

const getDateRangeParams = () => {
  const today = dayjs()
  if (state.range === 0) {
    const d = today.format('YYYY-MM-DD')
    return { start: d, end: d }
  }
  if (state.range === 1) {
    const d = today.subtract(1, 'day').format('YYYY-MM-DD')
    return { start: d, end: d }
  }
  return {
    start: today.subtract(state.range - 1, 'day').format('YYYY-MM-DD'),
    end: today.format('YYYY-MM-DD')
  }
}

const processData = () => {
  if (!state.rawList.length) {
    state.summaryList = []
    state.chartData = []
    return
  }

  const summaryMap = new Map<string, number>()
  state.rawList.forEach((item: any) => {
    item.stats?.forEach((stat: any) => {
      summaryMap.set(stat.f, (summaryMap.get(stat.f) || 0) + stat.num)
    })
  })

  state.summaryList = metrics.map(m => ({
    ...m,
    num: summaryMap.get(m.f) || 0
  }))

  state.chartData = [...state.rawList]
    .sort((a, b) => dayjs(a.tm).valueOf() - dayjs(b.tm).valueOf())
    .map((item) => {
      const result: any = { date: item.tm }
      item.stats?.forEach((stat: any) => {
        result[stat.f] = stat.num
      })
      return result
    })
}

const loadStatistics = async () => {
  const { data } = await getCommonStatistics(getDateRangeParams())
  if (data && data.list) {
    state.rawList = data.list
    processData()
  }
}

const getData = async () => {
  state.loading = true
  await loadStatistics()
  state.loading = false
}

const handleRefresh = async () => {
  state.loading = true
  await refreshCommonStatistics()
  await loadStatistics()
  state.loading = false
}

async function init() {
  getData()
}

onActivated(() => {
  init()
})

// 图表配置
const x = (_: any, i: number) => i
const xTicks = (i: number) => state.chartData[i]?.date?.slice(5) || ''
const template = (d: any) => {
  if (!d) return ''
  const lines = selectedCharts.value.map((f) => {
    const metric = metrics.find(m => m.f === f)
    return `<div class="flex items-center gap-2">
      <span class="size-2 rounded-full" style="background: ${chartColors[metric?.color as keyof typeof chartColors] || chartColors.primary}"></span>
      <span>${metric?.name || f}: ${d[f] ?? 0}</span>
    </div>`
  })
  return `<div class="text-sm space-y-1">
    <div class="font-medium mb-1">${d.date}</div>
    ${lines.join('')}
  </div>`
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 计算环比变化
const getChange = (f: string) => {
  if (state.chartData.length < 2) return null
  const current = state.chartData[state.chartData.length - 1]?.[f] || 0
  const previous = state.chartData[state.chartData.length - 2]?.[f] || 0
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <div class="p-4 md:p-6 lg:p-8">
        <!-- 顶部操作栏 -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-semibold text-(--ui-text-highlighted)">
              数据概览
            </h1>
            <UBadge v-if="!state.loading" color="neutral" variant="subtle">
              {{ state.rangeOptions.find(o => o.value === state.range)?.label }}
            </UBadge>
          </div>
          <div class="flex items-center gap-2">
            <USelect
              v-model="state.range"
              :disabled="state.loading"
              icon="lucide:calendar"
              size="sm"
              :items="state.rangeOptions"
              class="w-28"
              @change="getData"
            />
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="lucide:refresh-cw"
              :loading="state.loading"
              @click="handleRefresh"
            />
            <UColorModeButton size="sm" />
          </div>
        </div>

        <!-- 统计卡片 -->
        <div v-if="state.loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <USkeleton v-for="i in 10" :key="i" class="h-24 rounded-xl" />
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div
            v-for="item in state.summaryList"
            :key="item.f"
            class="relative p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg) hover:bg-(--ui-bg-elevated) transition-colors group"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-(--ui-text-muted) mb-1">
                  {{ item.name }}
                </p>
                <p class="text-2xl font-semibold text-(--ui-text-highlighted)">
                  {{ formatNumber(item.num) }}
                </p>
              </div>
              <div
                class="size-10 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-primary/10 text-primary': item.color === 'primary',
                  'bg-green-500/10 text-green-500': item.color === 'success',
                  'bg-amber-500/10 text-amber-500': item.color === 'warning',
                  'bg-red-500/10 text-red-500': item.color === 'error',
                  'bg-blue-500/10 text-blue-500': item.color === 'info',
                  'bg-purple-500/10 text-purple-500': item.color === 'secondary'
                }"
              >
                <UIcon :name="item.icon" class="size-5" />
              </div>
            </div>
            <!-- 环比变化 -->
            <div v-if="getChange(item.f) !== null && state.chartData.length > 1" class="mt-2 flex items-center gap-1 text-xs">
              <UIcon
                :name="getChange(item.f)! >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                class="size-3.5"
                :class="getChange(item.f)! >= 0 ? 'text-green-500' : 'text-red-500'"
              />
              <span :class="getChange(item.f)! >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ Math.abs(getChange(item.f)!) }}%
              </span>
              <span class="text-(--ui-text-dimmed)">较前一天</span>
            </div>
          </div>
        </div>

        <!-- 趋势图区域 -->
        <div class="rounded-xl border border-(--ui-border) bg-(--ui-bg) p-4 md:p-6 mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 class="text-lg font-semibold text-(--ui-text-highlighted)">
                数据趋势
              </h2>
              <p class="text-sm text-(--ui-text-muted)">
                查看各项指标的变化趋势
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="metric in metrics.slice(0, 6)"
                :key="metric.f"
                size="xs"
                :color="selectedCharts.includes(metric.f) ? 'primary' : 'neutral'"
                :variant="selectedCharts.includes(metric.f) ? 'solid' : 'outline'"
                @click="selectedCharts.includes(metric.f)
                  ? selectedCharts = selectedCharts.filter(f => f !== metric.f)
                  : selectedCharts.push(metric.f)"
              >
                {{ metric.name }}
              </UButton>
            </div>
          </div>

          <USkeleton v-if="state.loading" class="h-80 rounded-lg" />

          <div v-else-if="state.chartData.length > 1" class="h-80">
            <VisXYContainer :data="state.chartData" :padding="{ top: 10 }">
              <VisArea
                v-for="(f) in selectedCharts"
                :key="'area-' + f"
                :x="x"
                :y="(d: any) => d[f] || 0"
                :color="chartColors[metrics.find(m => m.f === f)?.color as keyof typeof chartColors] || chartColors.primary"
                :opacity="0.1"
                :curve-type="'linear'"
              />
              <VisLine
                v-for="(f) in selectedCharts"
                :key="'line-' + f"
                :x="x"
                :y="(d: any) => d[f] || 0"
                :color="chartColors[metrics.find(m => m.f === f)?.color as keyof typeof chartColors] || chartColors.primary"
                :line-width="2"
                :curve-type="'linear'"
              />
              <VisAxis type="x" :tick-format="xTicks" :grid-line="false" />
              <VisAxis type="y" :tick-format="(v: number) => formatNumber(v)" />
              <VisCrosshair :template="template" />
              <VisTooltip />
            </VisXYContainer>
          </div>

          <div v-else class="h-80 flex items-center justify-center text-(--ui-text-muted)">
            <div class="text-center">
              <UIcon name="lucide:bar-chart-3" class="size-12 mb-2 opacity-50" />
              <p>数据不足，无法显示趋势图</p>
              <p class="text-sm">
                请选择更长的时间范围
              </p>
            </div>
          </div>
        </div>

        <!-- 详细数据表格 -->
        <div class="rounded-xl border border-(--ui-border) bg-(--ui-bg) p-4 md:p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-(--ui-text-highlighted)">
              详细数据
            </h2>
            <UBadge color="neutral" variant="subtle">
              共 {{ state.chartData.length }} 条记录
            </UBadge>
          </div>

          <USkeleton v-if="state.loading" class="h-60 rounded-lg" />

          <div v-else-if="state.chartData.length" class="overflow-x-auto">
            <UTable
              :data="state.chartData"
              :columns="[
                { accessorKey: 'date', header: '日期' },
                ...metrics.map(m => ({
                  accessorKey: m.f,
                  header: m.name,
                  cell: ({ row }: any) => formatNumber(row.original[m.f] || 0)
                }))
              ]"
              :ui="{
                base: 'min-w-[1200px]',
                thead: '[&>tr]:bg-(--ui-bg-elevated)/50',
                th: 'py-3 text-center font-medium',
                td: 'text-center'
              }"
            />
          </div>

          <div v-else class="py-12 text-center text-(--ui-text-muted)">
            <UIcon name="lucide:inbox" class="size-10 mb-2 opacity-50" />
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<style scoped>
.unovis-xy-container {
  width: 100%;
  height: 100%;

  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
