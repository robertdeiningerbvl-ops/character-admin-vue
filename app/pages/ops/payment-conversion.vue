<script setup lang="ts">
import { h } from 'vue'
import { getPaymentConversion } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsPaymentConversion' })

const range = opsRecentRange(30, true)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  groupBy: 'day',
  within: [0, 1, 7, 30] as number[],
  newUser: [] as any[],
  paywall: [] as any[]
})

async function loadData() {
  state.loading = true
  try {
    const { data } = await getPaymentConversion({ start_time: state.start, end_time: state.end, group_by: state.groupBy })
    state.newUser = data?.new_user || []
    state.paywall = data?.paywall || []
    state.within = data?.within || state.within
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

const withinLabel = (n: number) => (n === 0 ? '当天' : `${n} 天内`)

function weighted(rows: any[], within: number) {
  let eligible = 0
  let payers = 0
  for (const r of rows) {
    const p = r.points?.find((x: any) => x.within === within)
    if (p) {
      eligible += p.eligible
      payers += p.payers
    }
  }
  return eligible ? payers / eligible : -1
}

const paywallTotal = computed(() => {
  let users = 0
  let converted = 0
  let pending = 0
  for (const r of state.paywall) {
    users += r.users - r.pending
    converted += r.converted
    pending += r.pending
  }
  return { users, converted, pending, rate: users ? converted / users : -1 }
})

const cards = computed(() => [
  { label: '新用户当天首充', value: opsPct(weighted(state.newUser, 0)), hint: `${opsNum(state.newUser.reduce((s, r) => s + r.cohort, 0))} 个新用户`, icon: 'lucide:user-plus' },
  { label: '7 天内首充', value: opsPct(weighted(state.newUser, 7)), hint: '注册已满 7 天的用户', icon: 'lucide:calendar-check' },
  {
    label: '付费墙 24 小时转化',
    value: opsPct(paywallTotal.value.rate),
    hint: `${opsNum(paywallTotal.value.converted)} / ${opsNum(paywallTotal.value.users)} 人${paywallTotal.value.pending ? `，${paywallTotal.value.pending} 人未满 24 小时` : ''}`,
    icon: 'lucide:lock-keyhole-open'
  }
])

const newUserColumns = computed(() => [
  { id: 'key', header: state.groupBy === 'day' ? '注册日期' : '分组', cell: ({ row }: any) => h('span', { class: 'font-medium' }, opsCohortKey(state.groupBy, row.original.key)) },
  { id: 'cohort', header: '新注册', cell: ({ row }: any) => opsNum(row.original.cohort) },
  ...state.within.map(n => ({
    id: `w${n}`,
    header: `${withinLabel(n)}首充`,
    cell: ({ row }: any) => {
      const p = row.original.points?.find((x: any) => x.within === n)
      if (!p || p.rate < 0) return h('span', { class: 'text-(--ui-text-dimmed)' }, '—')
      return h('div', { class: 'leading-4' }, [
        h('div', { class: 'font-semibold' }, opsPct(p.rate)),
        h('div', { class: 'text-[11px] text-(--ui-text-dimmed)' }, `${p.payers}/${p.eligible}`)
      ])
    }
  })),
  { id: 'payers', header: '至今付费', cell: ({ row }: any) => opsNum(row.original.payers) },
  { id: 'hours', header: '注册到首充（中位数）', cell: ({ row }: any) => row.original.payers ? `${row.original.hours_to_pay_p50} 小时` : '—' }
])

const featureCell = (r: any, key: string) => {
  const f = r.features?.[key]
  if (!f || !f.users) return '—'
  return `${opsPct(f.rate)}（${f.converted}/${f.users}）`
}

const paywallColumns = [
  { id: 'day', header: '日期', cell: ({ row }: any) => opsDay(row.original.day) },
  { id: 'users', header: '碰到余额不足', cell: ({ row }: any) => `${opsNum(row.original.users)} 人` },
  { id: 'converted', header: '24 小时内付款', cell: ({ row }: any) => `${opsNum(row.original.converted)} 人` },
  {
    id: 'rate',
    header: '转化率',
    cell: ({ row }: any) => h('span', { class: `font-semibold ${opsRateClass(row.original.rate, [0.05, 0.15], true)}` }, opsPct(row.original.rate))
  },
  { id: 'pending', header: '未满 24 小时', cell: ({ row }: any) => row.original.pending ? `${row.original.pending} 人` : '—' },
  { id: 'chat', header: '聊天', cell: ({ row }: any) => featureCell(row.original, 'chat') },
  { id: 'tts', header: '语音', cell: ({ row }: any) => featureCell(row.original, 'tts') },
  { id: 'scene', header: '插图', cell: ({ row }: any) => featureCell(row.original, 'scene_image') }
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
        until-yesterday
        @search="loadData"
      >
        <UFormField label="新用户分组" class="w-[160px]">
          <USelect v-model="state.groupBy" :items="opsCohortGroupOptions" @change="loadData" />
        </UFormField>
      </OpsRangeFilter>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <OpsStatCard
          v-for="c in cards"
          :key="c.label"
          v-bind="c"
          :loading="state.loading"
        />
      </div>

      <h2 class="text-base font-semibold mb-2">
        新用户首充
      </h2>
      <p class="text-xs text-(--ui-text-dimmed) mb-3">
        时间范围是注册时间；「N 天内」还没过完的用户不计入分母。测试号、官方号不计入。
      </p>
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="mb-8">
        <UTable
          :data="state.newUser"
          :columns="newUserColumns"
          :loading="state.loading"
          empty="这段时间没有新注册用户"
          :ui="{ th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap py-2' }"
        />
      </UCard>

      <h2 class="text-base font-semibold mb-2">
        付费墙转化
      </h2>
      <p class="text-xs text-(--ui-text-dimmed) mb-3">
        每个用户每天第一次碰到「妖力不足」（聊天、语音、插图）起 24 小时内付款算转化；还没满 24 小时且没付款的单列「未满 24 小时」，不计入转化率。数据从 2026-10-19 模型统计上线后开始。
      </p>
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <UTable
          :data="state.paywall"
          :columns="paywallColumns"
          :loading="state.loading"
          empty="这段时间没有人碰到余额不足"
          :ui="{ th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap py-2' }"
        />
      </UCard>
    </div>
  </DashboardLayout>
</template>
