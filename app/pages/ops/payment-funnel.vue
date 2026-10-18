<script setup lang="ts">
import { h } from 'vue'
import { getPaymentFunnel } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsPaymentFunnel' })

const range = opsRecentRange(7)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  groupBy: 'channel',
  list: [] as any[]
})

const groupOptions = [
  { label: '按支付通道', value: 'channel' },
  { label: '按套餐档位', value: 'tier' },
  { label: '按套餐类型', value: 'package' },
  { label: '按天', value: 'day' }
]

async function loadData() {
  state.loading = true
  try {
    const { data } = await getPaymentFunnel({ start_time: state.start, end_time: state.end, group_by: state.groupBy })
    state.list = data?.list || []
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

const totals = computed(() => {
  const sum = (k: string) => state.list.reduce((s, r) => s + (r[k] || 0), 0)
  return {
    orders: sum('orders'),
    paid: sum('paid_orders'),
    crediting: sum('crediting_orders'),
    cny: sum('amount_cny'),
    usd: sum('amount_usd'),
    firstPayers: sum('first_payers')
  }
})

const cards = computed(() => [
  { label: '下单 → 成功', value: `${opsNum(totals.value.orders)} → ${opsNum(totals.value.paid)}`, hint: `订单成功率 ${opsPct(totals.value.orders ? totals.value.paid / totals.value.orders : -1)}`, icon: 'lucide:shopping-cart' },
  { label: '实收（人民币）', value: `¥${opsNum(totals.value.cny)}`, hint: '人民币通道', icon: 'lucide:banknote' },
  { label: '实收（美元）', value: `$${opsNum(Math.round(totals.value.usd * 100) / 100)}`, hint: '美元通道', icon: 'lucide:dollar-sign' },
  // 按天 / 通道分组时同一人可能出现在多行，首充按行相加只是近似
  { label: '首充人数', value: opsNum(totals.value.firstPayers), hint: '这笔之前从没付过款', icon: 'lucide:sparkles' }
])

function rowName(r: any) {
  return state.groupBy === 'day' ? opsDay(r.key) : r.name
}

const columns = computed(() => [
  { id: 'name', header: groupOptions.find(o => o.value === state.groupBy)?.label.replace('按', '') || '分组', cell: ({ row }: any) => h('span', { class: 'font-medium' }, rowName(row.original)) },
  { id: 'orders', header: '下单', cell: ({ row }: any) => opsNum(row.original.orders) },
  { id: 'paid', header: '成功', cell: ({ row }: any) => opsNum(row.original.paid_orders) },
  {
    id: 'orderRate',
    header: '订单成功率',
    cell: ({ row }: any) => h('span', { class: `font-medium ${opsRateClass(row.original.order_success, [0.3, 0.6], true)}` }, opsPct(row.original.order_success))
  },
  { id: 'users', header: '下单人 → 付费人', cell: ({ row }: any) => `${opsNum(row.original.order_users)} → ${opsNum(row.original.payers)}` },
  {
    id: 'userRate',
    header: '人均成功率',
    cell: ({ row }: any) => h('span', { class: `font-medium ${opsRateClass(row.original.user_success, [0.4, 0.7], true)}` }, opsPct(row.original.user_success))
  },
  { id: 'first', header: '首充 / 复购', cell: ({ row }: any) => `${opsNum(row.original.first_payers)} / ${opsNum(row.original.repeat_payers)}` },
  { id: 'amount', header: '实收', cell: ({ row }: any) => [row.original.amount_cny ? `¥${opsNum(row.original.amount_cny)}` : '', row.original.amount_usd ? `$${opsNum(row.original.amount_usd)}` : ''].filter(Boolean).join(' / ') || '—' },
  { id: 'payTime', header: '支付耗时中位数', cell: ({ row }: any) => opsSeconds(row.original.pay_p50_seconds) },
  {
    id: 'crediting',
    header: '未到账',
    cell: ({ row }: any) => row.original.crediting_orders
      ? h('span', { class: 'font-semibold text-red-600 dark:text-red-400' }, `${row.original.crediting_orders} 单`)
      : '0'
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
        :max-days="92"
        :presets="[1, 7, 30]"
        @search="loadData"
      >
        <UFormField label="分组" class="w-[160px]">
          <USelect v-model="state.groupBy" :items="groupOptions" @change="loadData" />
        </UFormField>
      </OpsRangeFilter>

      <UAlert
        v-if="totals.crediting > 0 && !state.loading"
        class="mb-6"
        color="error"
        variant="subtle"
        icon="lucide:triangle-alert"
        :description="`有 ${totals.crediting} 单已付款但还没到账，请到订单列表检查并补单。`"
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
          empty="这段时间没有订单"
          :ui="{ base: 'min-w-[1100px]', th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap py-2' }"
        />
      </UCard>

      <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
        时间范围是下单时间；成功 = 已支付（含到账中）。人均成功率 = 付费人数 / 下单人数，同一人多次重试只算一次，比订单成功率更能反映通道好不好用。
        人民币通道按实付金额（元）、其他通道按美元金额统计。测试号、官方号不计入。
      </p>
    </div>
  </DashboardLayout>
</template>
