<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { getMemberInviteChannelCohortList } from '@/api'
import ChannelDetail from './ChannelDetail.vue'

/** 渠道质量：各邀请码按注册日汇总 + 评级，点「图表」看单个渠道 */
const props = defineProps<{ inviterUid?: string | number }>()

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const range = opsRecentRange(30)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  keyword: '',
  sort: 'new_accounts',
  page: 1,
  pagesize: 20,
  count: 0,
  list: [] as any[],
  baseline: null as any,
  detailCode: '',
  detailOpen: false
})

const sortOptions = [
  { label: '按新增账号', value: 'new_accounts' },
  { label: '按质量分', value: 'score' },
  { label: '按累计充值', value: 'revenue' },
  { label: '按有效新用户', value: 'valid_users' }
]

async function loadData(resetPage = false) {
  if (resetPage) state.page = 1
  state.loading = true
  try {
    const { data } = await getMemberInviteChannelCohortList({
      start: state.start,
      end: state.end,
      invite_code: state.keyword.trim(),
      uid: props.inviterUid || undefined,
      sort: state.sort,
      page: state.page,
      pagesize: state.pagesize
    })
    state.list = data?.list || []
    state.count = data?.count || 0
    state.baseline = data?.baseline || null
  } finally {
    state.loading = false
  }
}
onMounted(() => loadData())

function openDetail(code: string) {
  state.detailCode = code
  state.detailOpen = true
}

const r = computed(() => state.baseline?.rates || {})
const cards = computed(() => [
  { label: '全站新增账号', value: opsNum(state.baseline?.new_accounts), hint: `${state.start} ~ ${state.end}`, icon: 'lucide:user-plus' },
  { label: '有效新用户占比', value: cqPct(r.value.valid_rate), hint: '首日聊天 ≥ 3 次', icon: 'lucide:user-check' },
  { label: '次日 / 7 日留存', value: `${cqPct(r.value.ret_d1)} / ${cqPct(r.value.ret_d7)}`, hint: '首日聊过天的人', icon: 'lucide:repeat' },
  { label: '7 日付费率 / 人均', value: `${cqPct(r.value.pay_d7_rate)} / ${cqMoney(r.value.ltv_d7)}`, hint: '首日聊过天的人', icon: 'lucide:wallet' }
])

const gradeOrder = ['优质', '良好', '一般', '较差', '可疑', '样本不足']
const gradeCounts = computed(() => {
  const m: Record<string, { n: number, level: string }> = {}
  for (const it of state.list) {
    m[it.grade] = m[it.grade] || { n: 0, level: it.grade_level }
    m[it.grade]!.n++
  }
  return gradeOrder.filter(g => m[g]).map(g => ({ grade: g, ...m[g]! }))
})

const rateCell = (v: number | null | undefined, cls = '') => h('span', { class: v === null || v === undefined ? 'text-(--ui-text-dimmed)' : cls }, cqPct(v))
const columns = computed(() => [
  {
    id: 'code',
    header: '渠道（点击看图表）',
    cell: ({ row }: any) => h('button', {
      type: 'button',
      class: 'group text-left leading-5 cursor-pointer',
      onClick: () => openDetail(row.original.invite_code)
    }, [
      h('div', { class: 'font-medium text-(--ui-primary) group-hover:underline flex items-center gap-1' }, [
        cqCodeLabel(row.original.invite_code),
        h(UIcon, { name: 'lucide:chart-line', class: 'size-3.5 opacity-70' })
      ]),
      h('div', { class: 'text-xs text-(--ui-text-dimmed)' }, row.original.inviter_uid ? `邀请人 ${row.original.inviter_uid}` : row.original.invite_code === CQ_PLATFORM_CODE ? '没有邀请码' : '—')
    ])
  },
  {
    id: 'grade',
    header: '质量',
    cell: ({ row }: any) => h('div', { class: 'flex items-center gap-2', title: row.original.verdict }, [
      h(UBadge, { color: row.original.grade_level, variant: 'soft', label: row.original.grade }),
      h('span', { class: `text-sm font-semibold ${cqScoreClass(row.original.score)}` }, row.original.score === null ? '' : Math.round(row.original.score))
    ])
  },
  { id: 'new', header: '新增账号', cell: ({ row }: any) => opsNum(row.original.new_accounts) },
  {
    id: 'valid',
    header: '有效新用户',
    cell: ({ row }: any) => h('span', {}, [opsNum(row.original.valid_users), h('span', { class: 'text-xs text-(--ui-text-dimmed) ml-1' }, cqPct(row.original.rates?.valid_rate))])
  },
  {
    id: 'real',
    header: '真实注册',
    cell: ({ row }: any) => h('span', {}, [opsNum(row.original.real_register), h('span', { class: 'text-xs text-(--ui-text-dimmed) ml-1' }, cqPct(row.original.rates?.real_rate))])
  },
  { id: 'suspect', header: '可疑占比', cell: ({ row }: any) => rateCell(row.original.rates?.suspect_rate, opsRateClass(row.original.rates?.suspect_rate, [0.1, 0.3], false)) },
  { id: 'r1', header: '次日留存', cell: ({ row }: any) => rateCell(row.original.rates?.ret_d1, opsRateClass(row.original.rates?.ret_d1, [0.15, 0.3])) },
  { id: 'r7', header: '7 日留存', cell: ({ row }: any) => rateCell(row.original.rates?.ret_d7, opsRateClass(row.original.rates?.ret_d7, [0.05, 0.12])) },
  { id: 'p7', header: '7 日付费率', cell: ({ row }: any) => rateCell(row.original.rates?.pay_d7_rate, opsRateClass(row.original.rates?.pay_d7_rate, [0.01, 0.04])) },
  { id: 'ltv7', header: '7 日人均充值', cell: ({ row }: any) => cqMoney(row.original.rates?.ltv_d7) },
  { id: 'rev', header: '累计充值', cell: ({ row }: any) => cqMoney(row.original.revenue) }
])
</script>

<template>
  <div>
    <OpsRangeFilter
      v-model:start="state.start"
      v-model:end="state.end"
      :loading="state.loading"
      :max-days="186"
      :presets="[7, 30, 90]"
      @search="loadData(true)"
    >
      <UFormField label="邀请码" class="w-[160px]">
        <UInput v-model="state.keyword" placeholder="包含即可" @keyup.enter="loadData(true)" />
      </UFormField>
      <UFormField label="排序" class="w-[150px]">
        <USelect v-model="state.sort" :items="sortOptions" @change="loadData(true)" />
      </UFormField>
    </OpsRangeFilter>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <OpsStatCard
        v-for="c in cards"
        :key="c.label"
        v-bind="c"
        :loading="state.loading"
      />
    </div>

    <div v-if="gradeCounts.length" class="flex flex-wrap items-center gap-2 mb-4 text-sm">
      <span class="text-(--ui-text-muted)">本页评级：</span>
      <UBadge
        v-for="g in gradeCounts"
        :key="g.grade"
        :color="(g.level as any)"
        variant="subtle"
        :label="`${g.grade} ${g.n}`"
      />
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <UTable
        :data="state.list"
        :columns="columns"
        :loading="state.loading"
        empty="这段时间没有数据。新表上线后需要先回填（见部署说明）。"
        :ui="{ base: 'min-w-[1100px]', th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap py-2.5' }"
      />
    </UCard>

    <div v-if="state.count > state.pagesize" class="flex justify-end mt-4">
      <UPagination
        v-model:page="state.page"
        :total="state.count"
        :items-per-page="state.pagesize"
        @update:page="loadData()"
      />
    </div>

    <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
      时间范围是注册日期，按「哪天注册的那批人」跟踪后续表现，不同渠道可以直接比较。留存、付费率的分母是注册当天聊过天的人；7 日指标只算注册满 7~8 天的批次，30 日指标只算满 30 天的。
      新增账号含自动建的访客号；有效新用户 = 注册当天聊天 ≥ 3 次；可疑 = 没聊天、没绑定，且同 IP 当天建号 ≥ 5 个或 UA 像程序。数据每小时更新今天、昨天，每天凌晨补齐最近 31 天。
    </p>

    <UModal
      v-model:open="state.detailOpen"
      :title="`渠道质量：${cqCodeLabel(state.detailCode)}`"
      :description="`注册日 ${state.start} ~ ${state.end}`"
      fullscreen
    >
      <template #body>
        <ChannelDetail
          v-if="state.detailOpen && state.detailCode"
          :code="state.detailCode"
          :start="state.start"
          :end="state.end"
        />
      </template>
    </UModal>
  </div>
</template>
