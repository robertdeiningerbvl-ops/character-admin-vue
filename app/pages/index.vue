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
  range: 0,
  rangeOptions: [
    { label: '今日', value: 0 },
    { label: '昨天', value: 1 },
    { label: '近3天', value: 3 },
    { label: '近7天', value: 7 },
    { label: '近30天', value: 30 }
  ] as any[],
  summary: {} as Record<string, number>,
  rawList: [] as any[],
  chartData: [] as any[]
})

// 指标配置（f 与后端 task/service/common_statistics.go 对应；desc 为口径说明，鼠标悬停卡片可见）
type Metric = { f: string, name: string, icon: string, color: string, desc: string }

const metrics: Metric[] = [
  { f: 'ZC_NUM', name: '新增账号', icon: 'lucide:user-plus', color: 'primary', desc: '当天新建的账号数。新设备第一次打开网站会自动建访客号，所以约等于新设备数，含换浏览器、无痕、清缓存和爬虫' },
  { f: 'ZC_VALID_NUM', name: '有效新用户', icon: 'lucide:user-check', color: 'success', desc: '当天新建、且当天聊天 ≥ 3 次的账号' },
  { f: 'ZC_REAL_NUM', name: '真实注册', icon: 'lucide:badge-check', color: 'info', desc: '当天新建、且已绑定邮箱 / 账号 / Telegram / Google / Discord 的账号' },
  { f: 'ZC_SUSPECT_NUM', name: '可疑新账号', icon: 'lucide:shield-alert', color: 'error', desc: '当天新建、没聊过天、没绑定登录方式，且同一 IP 当天建号 ≥ 5 个，或 UA 为空 / 像程序（bot、爬虫、脚本）' },
  { f: 'LT_NUM', name: '聊天用户', icon: 'lucide:message-square-text', color: 'success', desc: '当天发起过聊天的不重复用户（DAU），新老用户都算' },
  { f: 'HY_NUM', name: '访问用户', icon: 'lucide:users', color: 'primary', desc: '当天打开过首页的不重复登录用户（含访客号）' },
  { f: 'HY_YK_NUM', name: '未登录访问', icon: 'lucide:user', color: 'info', desc: '当天打开首页时还没登录的设备数' },
  { f: 'DH_NUM', name: '对话数', icon: 'lucide:message-circle', color: 'primary', desc: '当天聊天消息条数（不是人数）' },
  { f: 'XF_NUM', name: '消费妖力', icon: 'lucide:zap', color: 'warning', desc: '当天聊天消耗的妖力' },
  { f: 'XD_NUM', name: '下单人数', icon: 'lucide:shopping-cart', color: 'warning', desc: '当天创建过订单的不重复用户，不论是否支付' },
  { f: 'CZ_NUM', name: '充值人数', icon: 'lucide:wallet', color: 'warning', desc: '当天支付成功的不重复用户' },
  { f: 'CZ_PRICE', name: '充值金额', icon: 'lucide:banknote', color: 'error', desc: '当天支付成功订单的实付金额合计' },
  { f: 'CZ_SUCCESS', name: '成功订单', icon: 'lucide:check-circle', color: 'success', desc: '当天支付成功的订单数' },
  { f: 'CZ_ERROR', name: '未付款单', icon: 'lucide:x-circle', color: 'error', desc: '当天创建、还没支付的订单数' },
  { f: 'AQ_NUM', name: '邀请人数', icon: 'lucide:share-2', color: 'secondary', desc: '当天通过邀请注册的人数' }
]
const metricMap = Object.fromEntries(metrics.map(m => [m.f, m])) as Record<string, Metric>

// 比率：num / den，分母为 0 时不显示
type Rate = { label: string, num: string, den: string, desc: string, warnBelow?: number, warnAbove?: number }

// 卡片分组；rates 显示在卡片下方
const groups: { title: string, desc: string, items: { f: string, rate?: Rate }[] }[] = [
  {
    title: '新用户',
    desc: '新增账号 → 有效新用户 → 真实注册，可疑新账号单独看',
    items: [
      { f: 'ZC_NUM' },
      { f: 'ZC_VALID_NUM', rate: { label: '有效率', num: 'ZC_VALID_NUM', den: 'ZC_NUM', desc: '有效新用户 ÷ 新增账号' } },
      { f: 'ZC_REAL_NUM', rate: { label: '注册转化', num: 'ZC_REAL_NUM', den: 'ZC_NUM', desc: '真实注册 ÷ 新增账号' } },
      { f: 'ZC_SUSPECT_NUM', rate: { label: '占新增', num: 'ZC_SUSPECT_NUM', den: 'ZC_NUM', desc: '可疑新账号 ÷ 新增账号', warnAbove: 30 } },
      { f: 'AQ_NUM' }
    ]
  },
  {
    title: '活跃',
    desc: '以聊天用户为准；访问用户只统计打开过首页的人',
    items: [
      { f: 'LT_NUM' },
      { f: 'HY_NUM' },
      { f: 'HY_YK_NUM' },
      { f: 'DH_NUM', rate: { label: '人均', num: 'DH_NUM', den: 'LT_NUM', desc: '对话数 ÷ 聊天用户（条/人）' } },
      { f: 'XF_NUM' }
    ]
  },
  {
    title: '付费',
    desc: '聊天用户 → 下单人数 → 充值人数',
    items: [
      { f: 'XD_NUM', rate: { label: '下单率', num: 'XD_NUM', den: 'LT_NUM', desc: '下单人数 ÷ 聊天用户' } },
      { f: 'CZ_NUM', rate: { label: '付费率', num: 'CZ_NUM', den: 'LT_NUM', desc: '充值人数 ÷ 聊天用户' } },
      { f: 'CZ_PRICE' },
      { f: 'CZ_SUCCESS', rate: { label: '支付成功率', num: 'CZ_SUCCESS', den: '_ORDERS', desc: '成功订单 ÷（成功订单 + 未付款单）', warnBelow: 50 } },
      { f: 'CZ_ERROR' }
    ]
  }
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
const selectedCharts = ref(['ZC_NUM', 'ZC_VALID_NUM', 'LT_NUM'])

// 趋势图可选的指标
const chartMetrics = metrics.filter(m => ['ZC_NUM', 'ZC_VALID_NUM', 'ZC_REAL_NUM', 'ZC_SUSPECT_NUM', 'LT_NUM', 'HY_NUM', 'XD_NUM', 'CZ_NUM', 'CZ_PRICE'].includes(m.f))

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
    state.summary = {}
    state.chartData = []
    return
  }

  const summaryMap = new Map<string, number>()
  state.rawList.forEach((item: any) => {
    item.stats?.forEach((stat: any) => {
      const value = stat.f === 'XF_NUM' ? stat.num / 100 : stat.num
      summaryMap.set(stat.f, (summaryMap.get(stat.f) || 0) + value)
    })
  })

  // 新口径 2026-10-22 起才有，之前的日期没有这些字段：summary 里没有的 f 显示「—」
  state.summary = Object.fromEntries(summaryMap)

  state.chartData = [...state.rawList]
    .sort((a, b) => dayjs(a.tm).valueOf() - dayjs(b.tm).valueOf())
    .map((item) => {
      const result: any = { date: item.tm }
      item.stats?.forEach((stat: any) => {
        result[stat.f] = stat.f === 'XF_NUM' ? +(stat.num / 100).toFixed(2) : stat.num
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
    const metric = metricMap[f]
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
  if (Number.isInteger(num)) return num.toString()
  return num.toFixed(2)
}

const hasValue = (f: string) => f in state.summary
const valueOf = (f: string) => {
  if (f === '_ORDERS') return (state.summary.CZ_SUCCESS || 0) + (state.summary.CZ_ERROR || 0)
  return state.summary[f] || 0
}

// 某天某个指标的值；_ORDERS = 成功订单 + 未付款单。这天没有这个指标时返回 undefined
const dayValue = (row: any, f: string): number | undefined => {
  if (f === '_ORDERS') {
    if (!('CZ_SUCCESS' in row) && !('CZ_ERROR' in row)) return undefined
    return (row.CZ_SUCCESS || 0) + (row.CZ_ERROR || 0)
  }
  return f in row ? row[f] || 0 : undefined
}

// 比率文本：只用分子、分母都有数据的那些天相加后再除（新指标 10-22 起才有，避免拿 1 天的分子除 7 天的分母）。
// 分母为 0 或没有可比的天时返回 null
const rateText = (r: Rate) => {
  let num = 0
  let den = 0
  for (const row of state.chartData) {
    const n = dayValue(row, r.num)
    const d = dayValue(row, r.den)
    if (n === undefined || d === undefined) continue
    num += n
    den += d
  }
  if (!den) return null
  const v = num / den
  if (r.label === '人均') return { text: v.toFixed(1), warn: false }
  const pct = v * 100
  const warn = (r.warnBelow !== undefined && pct < r.warnBelow) || (r.warnAbove !== undefined && pct > r.warnAbove)
  return { text: `${pct < 10 ? pct.toFixed(1) : Math.round(pct)}%`, warn }
}

const iconClass = (color: string) => ({
  'bg-primary/10 text-primary': color === 'primary',
  'bg-green-500/10 text-green-500': color === 'success',
  'bg-amber-500/10 text-amber-500': color === 'warning',
  'bg-red-500/10 text-red-500': color === 'error',
  'bg-blue-500/10 text-blue-500': color === 'info',
  'bg-purple-500/10 text-purple-500': color === 'secondary'
})

const isMultiDay = computed(() => state.range > 1)

// 计算环比变化
const getChange = (f: string) => {
  if (state.chartData.length < 2) return null
  const cur = state.chartData[state.chartData.length - 1]
  const prev = state.chartData[state.chartData.length - 2]
  // 前一天没有这个指标（新口径上线前）就不比较
  if (!cur || !prev || !(f in cur) || !(f in prev)) return null
  const current = cur[f] || 0
  const previous = prev[f] || 0
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

        <!-- 统计卡片：按 新用户 / 活跃 / 付费 分组 -->
        <p v-if="isMultiDay" class="text-xs text-(--ui-text-dimmed) mb-4">
          多天时人数为每天人数相加（同一个人多天都来会重复计算），比率按相加后的数计算
        </p>

        <div v-if="state.loading" class="space-y-6 mb-8">
          <div v-for="g in groups" :key="g.title" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <USkeleton v-for="i in g.items.length" :key="i" class="h-28 rounded-xl" />
          </div>
        </div>

        <div v-else class="space-y-6 mb-8">
          <section v-for="g in groups" :key="g.title">
            <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-3">
              <h2 class="text-sm font-semibold text-(--ui-text-highlighted) shrink-0">
                {{ g.title }}
              </h2>
              <span class="text-xs text-(--ui-text-dimmed)">{{ g.desc }}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <UTooltip
                v-for="it in g.items"
                :key="it.f"
                :text="metricMap[it.f]?.desc"
                :content="{ side: 'top' }"
                :ui="{ content: 'max-w-72 h-auto whitespace-normal py-1.5' }"
              >
                <div class="relative p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg) hover:bg-(--ui-bg-elevated) transition-colors cursor-help">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-sm text-(--ui-text-muted) mb-1 flex items-center gap-1 whitespace-nowrap">
                        {{ metricMap[it.f]?.name }}
                        <UIcon name="lucide:info" class="size-3.5 opacity-50" />
                      </p>
                      <p class="text-2xl font-semibold text-(--ui-text-highlighted)">
                        {{ hasValue(it.f) ? formatNumber(valueOf(it.f)) : '—' }}
                      </p>
                    </div>
                    <div class="size-10 rounded-lg hidden sm:flex items-center justify-center shrink-0" :class="iconClass(metricMap[it.f]?.color || 'primary')">
                      <UIcon :name="metricMap[it.f]?.icon || 'lucide:circle'" class="size-5" />
                    </div>
                  </div>

                  <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs min-h-4">
                    <!-- 转化率 -->
                    <span v-if="it.rate && rateText(it.rate)" :title="it.rate.desc" class="flex items-center gap-1">
                      <span class="text-(--ui-text-dimmed)">{{ it.rate.label }}</span>
                      <span class="font-medium" :class="rateText(it.rate)!.warn ? 'text-red-500' : 'text-(--ui-text-highlighted)'">
                        {{ rateText(it.rate)!.text }}
                      </span>
                    </span>
                    <!-- 环比变化 -->
                    <span v-if="hasValue(it.f) && getChange(it.f) !== null && state.chartData.length > 1" class="flex items-center gap-1">
                      <UIcon
                        :name="getChange(it.f)! >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'"
                        class="size-3.5"
                        :class="getChange(it.f)! >= 0 ? 'text-green-500' : 'text-red-500'"
                      />
                      <span :class="getChange(it.f)! >= 0 ? 'text-green-500' : 'text-red-500'">
                        {{ Math.abs(getChange(it.f)!) }}%
                      </span>
                      <span class="text-(--ui-text-dimmed)">较前一天</span>
                    </span>
                  </div>
                </div>
              </UTooltip>
            </div>
          </section>
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
                v-for="metric in chartMetrics"
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
                :color="chartColors[metricMap[f]?.color as keyof typeof chartColors] || chartColors.primary"
                :opacity="0.1"
                :curve-type="'linear'"
              />
              <VisLine
                v-for="(f) in selectedCharts"
                :key="'line-' + f"
                :x="x"
                :y="(d: any) => d[f] || 0"
                :color="chartColors[metricMap[f]?.color as keyof typeof chartColors] || chartColors.primary"
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
                  cell: ({ row }: any) => (m.f in row.original ? formatNumber(row.original[m.f] || 0) : '—')
                }))
              ]"
              :ui="{
                base: 'min-w-[1600px]',
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
