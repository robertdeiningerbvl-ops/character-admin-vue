<script setup lang="ts">
import { h } from 'vue'
import { getRetentionStats } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsRetention' })

const range = opsRecentRange(30, true)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  groupBy: 'day',
  offsets: [1, 3, 7, 14, 30] as number[],
  trackingSince: 0,
  list: [] as any[]
})

async function loadData() {
  state.loading = true
  try {
    const { data } = await getRetentionStats({ start_time: state.start, end_time: state.end, group_by: state.groupBy })
    state.list = data?.list || []
    state.offsets = data?.offsets || state.offsets
    state.trackingSince = data?.tracking_since || 0
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

/** 合计（按人数加权） */
function overall(offset: number) {
  let eligible = 0
  let retained = 0
  for (const r of state.list) {
    const p = r.points?.find((x: any) => x.offset === offset)
    if (p) {
      eligible += p.eligible
      retained += p.retained
    }
  }
  return { eligible, retained, rate: eligible ? retained / eligible : -1 }
}

const cohortTotal = computed(() => state.list.reduce((s, r) => s + (r.cohort || 0), 0))

const cards = computed(() => [
  { label: '新注册', value: opsNum(cohortTotal.value), hint: `${state.start} ~ ${state.end}`, icon: 'lucide:user-plus' },
  ...[1, 7, 30].map(n => ({
    label: `第 ${n} 天留存`,
    value: opsPct(overall(n).rate),
    hint: overall(n).eligible ? `${opsNum(overall(n).retained)} / ${opsNum(overall(n).eligible)} 人` : '还没有人到第 ' + n + ' 天',
    icon: 'lucide:repeat'
  }))
])

const trackingWarning = computed(() => {
  if (!state.trackingSince) return '还没有活跃记录：上线后执行一次 task -job active-backfill -confirm 回填，或等用户访问后再看。'
  const since = opsDay(state.trackingSince)
  if (state.start < since) return `活跃记录从 ${since} 开始，更早注册的用户留存偏低；回填的历史活跃只算「当天发过消息」。`
  return ''
})

/** 留存热力底色 */
function heat(rate: number) {
  if (rate < 0) return ''
  const a = Math.min(0.08 + rate * 0.9, 0.7).toFixed(2)
  return `background-color: color-mix(in oklab, var(--ui-primary) ${Math.round(Number(a) * 100)}%, transparent)`
}

const columns = computed(() => [
  {
    id: 'key',
    header: state.groupBy === 'day' ? '注册日期' : '分组',
    cell: ({ row }: any) => h('span', { class: 'font-medium' }, opsCohortKey(state.groupBy, row.original.key))
  },
  { id: 'cohort', header: '新注册', cell: ({ row }: any) => opsNum(row.original.cohort) },
  ...state.offsets.map(n => ({
    id: `d${n}`,
    header: `第 ${n} 天`,
    cell: ({ row }: any) => {
      const p = row.original.points?.find((x: any) => x.offset === n)
      if (!p || p.rate < 0) return h('span', { class: 'text-(--ui-text-dimmed)' }, '—')
      return h('div', { class: 'rounded-md px-2 py-1 text-center leading-4', style: heat(p.rate) }, [
        h('div', { class: 'font-semibold' }, opsPct(p.rate)),
        h('div', { class: 'text-[11px] opacity-70' }, `${p.retained}/${p.eligible}`)
      ])
    }
  }))
])
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
        <UFormField label="分组" class="w-[160px]">
          <USelect v-model="state.groupBy" :items="opsCohortGroupOptions" @change="loadData" />
        </UFormField>
      </OpsRangeFilter>

      <UAlert
        v-if="trackingWarning && !state.loading"
        class="mb-6"
        color="warning"
        variant="subtle"
        icon="lucide:info"
        :description="trackingWarning"
      />

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          empty="这段时间没有新注册用户"
          :ui="{ th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap py-2' }"
        />
      </UCard>

      <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
        时间范围是注册时间。注册当天为第 0 天，第 N 天当天打开过网站（调用过需要登录的接口）算留存；第 N 天还没过完的用户不计入分母，所以近几天注册的后几列显示「—」。
        测试号、官方号不计入。注册域名取注册当天第一次访问的站点。
      </p>
    </div>
  </DashboardLayout>
</template>
