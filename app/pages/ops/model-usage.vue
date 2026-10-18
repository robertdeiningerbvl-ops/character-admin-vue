<script setup lang="ts">
import { h } from 'vue'
import { getModelUsageStats } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsModelUsage' })

const UBadge = resolveComponent('UBadge')

const range = opsRecentRange(7)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  feature: 'chat',
  groupBy: 'model',
  list: [] as any[]
})

const featureOptions = [
  { label: '全部功能', value: 'all' },
  { label: '聊天', value: 'chat' },
  { label: '语音朗读', value: 'tts' },
  { label: '场景插图', value: 'scene_image' }
]
const groupOptions = [
  { label: '按模型（语音按音色）', value: 'model' },
  { label: '按实际渠道', value: 'backend' },
  { label: '按天', value: 'day' }
]

async function loadData() {
  state.loading = true
  try {
    const { data } = await getModelUsageStats({
      start_time: state.start,
      end_time: state.end,
      feature: state.feature === 'all' ? '' : state.feature,
      group_by: state.groupBy
    })
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

function rowName(r: any): string {
  if (state.groupBy === 'day') return r.day
  if (state.groupBy === 'backend') return r.backend_name || (r.backend_id ? `渠道 ${r.backend_id}` : '未知渠道（调用失败 / 语音）')
  if (r.feature === 'tts') return r.voice_name || `音色 ${r.voice_id}`
  return r.model_name || (r.model_id ? `模型 ${r.model_id}` : '—')
}

function topEntries(obj: Record<string, number> | undefined, labels: Record<string, string>, limit = 3): string {
  if (!obj) return ''
  return Object.entries(obj)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, n]) => `${labels[k] || k} ${n}`)
    .join('、')
}

// 汇总卡片
const summary = computed(() => {
  const rows = state.list
  const sum = (k: string) => rows.reduce((s, r) => s + (r[k] || 0), 0)
  const attempts = sum('attempts')
  const ok = sum('ok')
  const chatRows = rows.filter(r => r.feature === 'chat')
  const chatOk = chatRows.reduce((s, r) => s + (r.ok || 0), 0)
  const chatRegen = chatRows.reduce((s, r) => s + Math.round((r.regen_rate || 0) * (r.ok || 0)), 0)
  const up = sum('ratings_up')
  const down = sum('ratings_down')
  return {
    calls: sum('calls'),
    success: attempts ? ok / attempts : -1,
    regen: chatOk ? chatRegen / chatOk : -1,
    balance: rows.reduce((s, r) => s + (r.outcomes?.balance || 0), 0),
    battery: sum('cost_battery'),
    radish: sum('cost_radish'),
    rating: up + down ? up / (up + down) : -1,
    ratings: up + down
  }
})

const cards = computed(() => [
  { label: '调用次数', value: opsNum(summary.value.calls), hint: `其中余额不足 ${opsNum(summary.value.balance)} 次`, icon: 'lucide:activity' },
  { label: '成功率', value: opsPct(summary.value.success), hint: '不含余额不足', icon: 'lucide:circle-check' },
  { label: '重新生成率（聊天）', value: opsPct(summary.value.regen), hint: '成功回复中被重新生成的比例', icon: 'lucide:refresh-ccw' },
  { label: '实收', value: `${opsCents(summary.value.battery)} 妖力`, hint: `萝卜 ${opsCents(summary.value.radish)}`, icon: 'lucide:zap' },
  { label: '好评率', value: opsPct(summary.value.rating), hint: `${opsNum(summary.value.ratings)} 条评分`, icon: 'lucide:thumbs-up' }
])

const cellRate = (rate: number, thresholds: [number, number], higherIsBetter: boolean) =>
  h('span', { class: `font-medium ${opsRateClass(rate, thresholds, higherIsBetter)}` }, opsPct(rate))

const columns = computed(() => [
  {
    id: 'name',
    header: state.groupBy === 'day' ? '日期' : state.groupBy === 'backend' ? '渠道' : '模型 / 音色',
    cell: ({ row }: any) => h('div', { class: 'flex items-center gap-2 text-left' }, [
      h(UBadge, { color: 'neutral', variant: 'subtle', size: 'sm' }, () => opsFeatureLabel[row.original.feature] || row.original.feature),
      h('span', { class: 'font-medium' }, rowName(row.original))
    ])
  },
  { id: 'calls', header: '调用 / 用户', cell: ({ row }: any) => `${opsNum(row.original.calls)} / ${opsNum(row.original.users)}` },
  { id: 'success', header: '成功率', cell: ({ row }: any) => cellRate(row.original.success_rate, [0.9, 0.97], true) },
  {
    id: 'error',
    header: '失败 / 拒答',
    cell: ({ row }: any) => h('div', { class: 'text-xs leading-5' }, [
      h('div', [cellRate(row.original.error_rate, [0.02, 0.05], false), ' / ', cellRate(row.original.refusal_rate, [0.01, 0.03], false)]),
      h('div', { class: 'text-(--ui-text-dimmed)' }, topEntries(row.original.error_kinds, opsErrorKindLabel))
    ])
  },
  {
    id: 'regen',
    header: '重新生成',
    cell: ({ row }: any) => row.original.feature !== 'chat'
      ? '—'
      : h('div', { class: 'text-xs leading-5' }, [
          cellRate(row.original.regen_rate, [0.02, 0.04], false),
          h('div', { class: 'text-(--ui-text-dimmed)' }, `中间 ${opsPct(row.original.regen_mid_rate)}`)
        ])
  },
  { id: 'trunc', header: '截断率', cell: ({ row }: any) => row.original.feature === 'chat' ? cellRate(row.original.truncation_rate, [0.01, 0.05], false) : '—' },
  {
    id: 'latency',
    header: '首字 P50 / P90',
    cell: ({ row }: any) => `${opsMs(row.original.first_token_p50_ms)} / ${opsMs(row.original.first_token_p90_ms)}`
  },
  { id: 'total', header: '总耗时 P50 / P90', cell: ({ row }: any) => `${opsMs(row.original.total_p50_ms)} / ${opsMs(row.original.total_p90_ms)}` },
  {
    id: 'tokens',
    header: 'Token 入 / 出',
    cell: ({ row }: any) => row.original.feature === 'chat'
      ? `${opsNum(row.original.input_tokens)} / ${opsNum(row.original.output_tokens)}`
      : `${opsNum(row.original.units)} ${row.original.feature === 'tts' ? '字' : '张'}`
  },
  {
    id: 'income',
    header: '实收 妖力 / 萝卜',
    cell: ({ row }: any) => h('div', { class: 'text-xs leading-5' }, [
      h('div', `${opsCents(row.original.cost_battery)} / ${opsCents(row.original.cost_radish)}`),
      row.original.free_calls ? h('div', { class: 'text-(--ui-text-dimmed)' }, `免费 ${opsNum(row.original.free_calls)} 次`) : null
    ])
  },
  {
    id: 'rating',
    header: '好评率',
    cell: ({ row }: any) => {
      const r = row.original
      const n = (r.ratings_up || 0) + (r.ratings_down || 0)
      if (!n) return '—'
      return h('div', { class: 'text-xs leading-5' }, [
        h('div', [cellRate(r.rating_up_rate, [0.6, 0.8], true), ` (${n})`]),
        h('div', { class: 'text-(--ui-text-dimmed)' }, topEntries(r.down_reasons, opsReasonLabel, 2))
      ])
    }
  }
])
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6">
      <OpsRangeFilter
        v-model:start="state.start"
        v-model:end="state.end"
        :loading="state.loading"
        :max-days="31"
        @search="loadData"
      >
        <UFormField label="功能" class="w-[140px]">
          <USelect v-model="state.feature" :items="featureOptions" @change="loadData" />
        </UFormField>
        <UFormField label="分组" class="w-[200px]">
          <USelect v-model="state.groupBy" :items="groupOptions" @change="loadData" />
        </UFormField>
      </OpsRangeFilter>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <OpsStatCard
          v-for="c in cards"
          :key="c.label"
          v-bind="c"
          :loading="state.loading"
        />
      </div>

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="state.list"
          :columns="columns"
          :loading="state.loading"
          empty="这段时间没有数据（统计从 2026-10-19 上线后开始记录）"
          :ui="{ base: 'min-w-[1300px]', th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap' }"
        />
      </UCard>

      <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
        成功率 / 失败率 / 拒答率的分母是实际调用模型的次数（不含余额不足）；重新生成率、截断率的分母是成功次数，「中间」是从中间某条回复重新生成的比例。
        首字耗时只算流式成功的调用。场景插图的模型是写画面描述的聊天模型，出图模型按渠道看。好评率按评分时间统计。
      </p>
    </div>
  </DashboardLayout>
</template>
