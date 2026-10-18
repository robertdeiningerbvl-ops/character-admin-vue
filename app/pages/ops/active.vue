<script setup lang="ts">
import { getActiveDaily } from '@/api'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from '@unovis/vue'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsActive' })

const range = opsRecentRange(30)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  list: [] as any[]
})

async function loadData() {
  state.loading = true
  try {
    const { data } = await getActiveDaily({ start_time: state.start, end_time: state.end })
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

// 图表按日期升序
const chartData = computed(() => [...state.list].sort((a, b) => a.day - b.day))
const series = [
  { key: 'active', name: '活跃', color: 'var(--ui-primary)' },
  { key: 'new_active', name: '新用户', color: '#22c55e' },
  { key: 'returning', name: '老用户', color: '#3b82f6' }
]
const x = (_: any, i: number) => i
const xTicks = (i: number) => opsDay(chartData.value[i]?.day).slice(5)
const tooltip = (d: any) => d
  ? `<div class="text-sm space-y-1"><div class="font-medium">${opsDay(d.day)}</div>${series
    .map(s => `<div class="flex items-center gap-2"><span class="size-2 rounded-full" style="background:${s.color}"></span>${s.name}: ${opsNum(d[s.key])}</div>`)
    .join('')}</div>`
  : ''

const cards = computed(() => {
  const rows = state.list
  const avg = rows.length ? rows.reduce((s, r) => s + r.active, 0) / rows.length : 0
  const latest = chartData.value[chartData.value.length - 1]
  const newShare = rows.reduce((s, r) => s + r.active, 0)
    ? rows.reduce((s, r) => s + r.new_active, 0) / rows.reduce((s, r) => s + r.active, 0)
    : -1
  return [
    { label: '日均活跃', value: opsNum(Math.round(avg)), hint: `${rows.length} 天`, icon: 'lucide:users' },
    { label: '最近一天活跃', value: latest ? opsNum(latest.active) : '—', hint: latest ? opsDay(latest.day) : '', icon: 'lucide:calendar' },
    { label: '新用户占比', value: opsPct(newShare), hint: '当天注册的活跃用户', icon: 'lucide:user-plus' }
  ]
})

function hostsText(hosts: Record<string, number>) {
  return Object.entries(hosts || {})
    .sort((a, b) => b[1] - a[1])
    .map(([h, n]) => `${h === '(unknown)' ? '未知' : h} ${opsNum(n)}`)
    .join('、')
}

const columns = [
  { id: 'day', header: '日期', cell: ({ row }: any) => opsDay(row.original.day) },
  { id: 'active', header: '活跃', cell: ({ row }: any) => opsNum(row.original.active) },
  { id: 'new', header: '新用户', cell: ({ row }: any) => opsNum(row.original.new_active) },
  { id: 'returning', header: '老用户', cell: ({ row }: any) => opsNum(row.original.returning) },
  { id: 'hosts', header: '按站点域名', cell: ({ row }: any) => hostsText(row.original.hosts) }
]
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6">
      <OpsRangeFilter
        v-model:start="state.start"
        v-model:end="state.end"
        :loading="state.loading"
        :max-days="92"
        :presets="[7, 30, 90]"
        @search="loadData"
      />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <OpsStatCard
          v-for="c in cards"
          :key="c.label"
          v-bind="c"
          :loading="state.loading"
        />
      </div>

      <UCard class="mb-6">
        <div class="flex items-center gap-4 mb-4 text-sm">
          <span v-for="s in series" :key="s.key" class="flex items-center gap-1.5">
            <span class="size-2.5 rounded-full" :style="{ background: s.color }" />{{ s.name }}
          </span>
        </div>
        <USkeleton v-if="state.loading" class="h-72" />
        <div v-else-if="chartData.length > 1" class="h-72">
          <VisXYContainer :data="chartData" :padding="{ top: 10 }">
            <VisLine
              v-for="s in series"
              :key="s.key"
              :x="x"
              :y="(d: any) => d[s.key] || 0"
              :color="s.color"
              :line-width="2"
            />
            <VisAxis type="x" :tick-format="xTicks" :grid-line="false" />
            <VisAxis type="y" :tick-format="(v: number) => opsNum(v)" />
            <VisCrosshair :template="tooltip" />
            <VisTooltip />
          </VisXYContainer>
        </div>
        <div v-else class="h-72 flex items-center justify-center text-(--ui-text-muted)">
          数据不足，选择更长的时间范围
        </div>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="state.list"
          :columns="columns"
          :loading="state.loading"
          empty="还没有活跃记录（2026-10-19 上线后开始记录，可执行 active-backfill 回填）"
          :ui="{ th: 'py-3 whitespace-nowrap', td: 'py-2' }"
        />
      </UCard>

      <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
        当天调用过需要登录的接口（访客账号也算）即为活跃，含测试号。站点域名取当天第一次请求的来源，用来发现某个域名上还挂着旧前端之类的问题。
      </p>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.unovis-xy-container {
  width: 100%;
  height: 100%;
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
