<script setup lang="ts">
import { h } from 'vue'
import { getMemberInviteChannelCohortDetail } from '@/api'
import TrendChart from './TrendChart.vue'

/** 单个渠道：质量评估 + 图表 + 每日批次 */
const props = defineProps<{ code: string, start: string, end: string }>()

const state = reactive({ loading: true, detail: null as any })

async function load() {
  state.loading = true
  try {
    const { data } = await getMemberInviteChannelCohortDetail({ invite_code: props.code, start: props.start, end: props.end })
    state.detail = data || null
  } finally {
    state.loading = false
  }
}
watch(() => [props.code, props.start, props.end], load, { immediate: true })

const ev = computed(() => state.detail?.evaluation)
const summary = computed(() => state.detail?.summary)
const baseline = computed(() => state.detail?.baseline)
const daily = computed<any[]>(() => state.detail?.daily || [])
const today = computed(() => state.detail?.today || '')

const C = { primary: '#6366f1', green: '#22c55e', sky: '#0ea5e9', red: '#ef4444', amber: '#f59e0b', gray: '#94a3b8' }

// 每日获客
const acquisition = computed(() => daily.value.map(d => ({
  date: d.reg_date, new_accounts: d.new_accounts, valid_users: d.valid_users, real_register: d.real_register, suspect_users: d.suspect_users
})))

// 留存曲线：本渠道 vs 全站
const retention = computed(() => {
  const r = summary.value?.rates || {}
  const b = baseline.value?.rates || {}
  return [
    { day: '第 0 天', me: 1, all: 1 },
    { day: '第 1 天', me: r.ret_d1, all: b.ret_d1 },
    { day: '第 3 天', me: r.ret_d3, all: b.ret_d3 },
    { day: '第 7 天', me: r.ret_d7, all: b.ret_d7 },
    { day: '第 30 天', me: r.ret_d30, all: b.ret_d30 }
  ].filter((p, i) => i === 0 || (p.me !== null && p.me !== undefined) || (p.all !== null && p.all !== undefined))
})

// 每日比率（未成熟的天不画）
const dailyRates = computed(() => daily.value.map(d => ({
  date: d.reg_date,
  activation: cqMatured(d.reg_date, today.value, 1) ? cqRatio(d.d0_chat_users, d.new_accounts) : null,
  suspect: cqMatured(d.reg_date, today.value, 1) ? cqRatio(d.suspect_users, d.new_accounts) : null,
  ret_d1: cqMatured(d.reg_date, today.value, 2) ? cqRatio(d.ret_d1, d.d0_chat_users) : null,
  pay_d7: cqMatured(d.reg_date, today.value, 7) ? cqRatio(d.pay_users_d7, d.d0_chat_users) : null
})))

// 每日充值
const dailyRevenue = computed(() => daily.value.map(d => ({
  date: d.reg_date, revenue_d0: d.revenue_d0, revenue_d7: d.revenue_d7, revenue_d30: d.revenue_d30
})))

const levelIcon: Record<string, string> = { good: 'lucide:circle-check', warn: 'lucide:triangle-alert', bad: 'lucide:circle-x', info: 'lucide:info' }
const levelClass: Record<string, string> = {
  good: 'text-green-600 dark:text-green-400',
  warn: 'text-amber-600 dark:text-amber-400',
  bad: 'text-red-600 dark:text-red-400',
  info: 'text-(--ui-text-muted)'
}

const dash = () => h('span', { class: 'text-(--ui-text-dimmed)' }, '—')
const pctCell = (num: number, den: number, ok: boolean) => (ok && den > 0 ? cqPct(Math.min(num / den, 1)) : dash())
const columns = computed(() => [
  { id: 'date', header: '注册日', cell: ({ row }: any) => h('span', { class: 'font-medium' }, row.original.reg_date) },
  { id: 'new', header: '新增账号', cell: ({ row }: any) => opsNum(row.original.new_accounts) },
  { id: 'valid', header: '有效新用户', cell: ({ row }: any) => opsNum(row.original.valid_users) },
  { id: 'real', header: '真实注册', cell: ({ row }: any) => opsNum(row.original.real_register) },
  {
    id: 'suspect',
    header: '可疑',
    cell: ({ row }: any) => {
      const d = row.original
      const rate = d.new_accounts ? d.suspect_users / d.new_accounts : 0
      return h('span', { class: rate >= 0.3 ? 'text-red-600 dark:text-red-400 font-medium' : '' }, `${d.suspect_users}（${cqPct(rate)}）`)
    }
  },
  { id: 'act', header: '首日聊天', cell: ({ row }: any) => opsNum(row.original.d0_chat_users) },
  { id: 'r1', header: '次日留存', cell: ({ row }: any) => pctCell(row.original.ret_d1, row.original.d0_chat_users, cqMatured(row.original.reg_date, today.value, 2)) },
  { id: 'r7', header: '7 日留存', cell: ({ row }: any) => pctCell(row.original.ret_d7, row.original.d0_chat_users, cqMatured(row.original.reg_date, today.value, 8)) },
  { id: 'p7', header: '7 日付费', cell: ({ row }: any) => (cqMatured(row.original.reg_date, today.value, 7) ? `${row.original.pay_users_d7} 人` : dash()) },
  { id: 'rev7', header: '7 日充值', cell: ({ row }: any) => (cqMatured(row.original.reg_date, today.value, 7) ? cqMoney(row.original.revenue_d7) : dash()) },
  { id: 'rev30', header: '30 天内充值（至今）', cell: ({ row }: any) => cqMoney(row.original.revenue_d30) }
])
</script>

<template>
  <div class="space-y-5">
    <USkeleton v-if="state.loading" class="h-40 rounded-xl" />

    <template v-else-if="ev && summary">
      <!-- 结论 -->
      <div class="rounded-xl border border-(--ui-border) p-4 md:p-5 flex flex-col md:flex-row gap-5">
        <div class="flex items-center gap-4 md:w-56 shrink-0">
          <div class="relative size-20 shrink-0">
            <svg viewBox="0 0 36 36" class="size-20 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="var(--ui-border)"
                stroke-width="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                :class="cqScoreClass(ev.score)"
                :stroke-dasharray="`${(ev.score ?? 0) * 0.974} 97.4`"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl font-semibold" :class="cqScoreClass(ev.score)">{{ ev.score === null ? '—' : Math.round(ev.score) }}</span>
              <span class="text-[10px] text-(--ui-text-dimmed)">/ 100</span>
            </div>
          </div>
          <div>
            <UBadge
              :color="ev.grade_level"
              variant="soft"
              size="lg"
              :label="ev.grade"
            />
            <p class="text-xs text-(--ui-text-dimmed) mt-2">
              可信度：{{ ev.confidence }}
            </p>
            <p class="text-xs text-(--ui-text-dimmed)">
              {{ summary.days }} 个注册日
            </p>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-(--ui-text-highlighted) mb-3">
            {{ ev.summary }}
          </p>
          <ul class="space-y-1.5">
            <li v-for="(f, i) in ev.findings" :key="i" class="flex gap-2 text-sm leading-5">
              <UIcon :name="levelIcon[f.level] || 'lucide:dot'" class="size-4 mt-0.5 shrink-0" :class="levelClass[f.level]" />
              <span>{{ f.text }}</span>
            </li>
            <li v-if="!ev.findings?.length" class="text-sm text-(--ui-text-muted)">
              各项都在正常范围内，没有明显问题。
            </li>
          </ul>
        </div>
      </div>

      <!-- 四个维度 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="d in ev.dimensions" :key="d.key" class="rounded-xl border border-(--ui-border) p-4">
          <div class="flex items-baseline justify-between mb-2">
            <span class="text-sm font-semibold text-(--ui-text-highlighted)">{{ d.name }}</span>
            <span class="text-xs text-(--ui-text-dimmed)">权重 {{ Math.round(d.weight * 100) }}%</span>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <div class="h-1.5 flex-1 rounded-full bg-(--ui-bg-elevated) overflow-hidden">
              <div class="h-full rounded-full" :class="cqScoreBg(d.score)" :style="{ width: `${d.score ?? 0}%` }" />
            </div>
            <span class="text-sm font-semibold w-8 text-right" :class="cqScoreClass(d.score)">{{ d.score === null ? '—' : Math.round(d.score) }}</span>
          </div>
          <div class="space-y-2">
            <UTooltip
              v-for="m in d.metrics"
              :key="m.key"
              :text="m.note || `参考线：优 ${m.good_text}，差 ${m.bad_text}${m.baseline_text ? `；全站 ${m.baseline_text}` : ''}`"
              :ui="{ content: 'max-w-72 h-auto whitespace-normal py-1.5' }"
            >
              <div class="flex items-center justify-between gap-2 text-xs cursor-help">
                <span class="text-(--ui-text-muted) truncate">{{ m.name }}</span>
                <span class="flex items-center gap-2 shrink-0">
                  <span v-if="m.baseline_text" class="text-(--ui-text-dimmed)">全站 {{ m.baseline_text }}</span>
                  <span class="font-medium min-w-12 text-right" :class="m.score === null ? 'text-(--ui-text-dimmed)' : cqScoreClass(m.score)">{{ m.display }}</span>
                </span>
              </div>
            </UTooltip>
          </div>
        </div>
      </div>

      <!-- 图表 -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div class="rounded-xl border border-(--ui-border) p-4">
          <p class="text-sm font-semibold mb-1">
            每日获客
          </p>
          <p class="text-xs text-(--ui-text-dimmed) mb-3">
            可疑账号一路上升、有效新用户不涨，基本就是刷量
          </p>
          <TrendChart
            :data="acquisition"
            x-key="date"
            :series="[
              { key: 'new_accounts', name: '新增账号', color: C.gray },
              { key: 'valid_users', name: '有效新用户', color: C.green },
              { key: 'real_register', name: '真实注册', color: C.sky },
              { key: 'suspect_users', name: '可疑账号', color: C.red }
            ]"
          />
        </div>
        <div class="rounded-xl border border-(--ui-border) p-4">
          <p class="text-sm font-semibold mb-1">
            留存曲线（对比全站）
          </p>
          <p class="text-xs text-(--ui-text-dimmed) mb-3">
            注册当天聊过天的人里，第 N 天又来聊天的比例；只算已满 N 天的批次
          </p>
          <TrendChart
            :data="retention"
            x-key="day"
            format="pct"
            points
            :series="[
              { key: 'me', name: cqCodeLabel(code), color: C.primary },
              { key: 'all', name: '全站', color: C.gray, dashed: true }
            ]"
          />
        </div>
        <div class="rounded-xl border border-(--ui-border) p-4">
          <p class="text-sm font-semibold mb-1">
            每日比率
          </p>
          <p class="text-xs text-(--ui-text-dimmed) mb-3">
            按注册日看质量有没有变化；还没满天数的日期不画
          </p>
          <TrendChart
            :data="dailyRates"
            x-key="date"
            format="pct"
            :series="[
              { key: 'activation', name: '首日聊天率', color: C.green },
              { key: 'suspect', name: '可疑占比', color: C.red },
              { key: 'ret_d1', name: '次日留存', color: C.primary },
              { key: 'pay_d7', name: '7 日付费率', color: C.amber }
            ]"
          />
        </div>
        <div class="rounded-xl border border-(--ui-border) p-4">
          <p class="text-sm font-semibold mb-1">
            每日充值（按注册日）
          </p>
          <p class="text-xs text-(--ui-text-dimmed) mb-3">
            这批人注册当天 / 前 7 天 / 前 30 天累计充值（元），近期的批次还在增长
          </p>
          <TrendChart
            :data="dailyRevenue"
            x-key="date"
            format="money"
            :series="[
              { key: 'revenue_d0', name: '当天', color: C.sky },
              { key: 'revenue_d7', name: '前 7 天', color: C.amber },
              { key: 'revenue_d30', name: '前 30 天', color: C.green }
            ]"
          />
        </div>
      </div>

      <!-- 每日明细 -->
      <div class="rounded-xl border border-(--ui-border) overflow-hidden">
        <UTable
          :data="[...daily].reverse()"
          :columns="columns"
          :ui="{ base: 'min-w-[1100px]', th: 'py-2.5 whitespace-nowrap', td: 'whitespace-nowrap py-2' }"
        />
      </div>

      <p class="text-xs text-(--ui-text-dimmed) leading-5">
        评分规则：真实性 25%、激活 20%、留存 25%、变现 30%，每项按参考线打 0~100 分（达到「优」得 100 分，差于「差」得 0 分），没成熟或样本少于 10 人的指标不打分。
        可疑占比 ≥ 50% 或与邀请人同 IP / 设备 ≥ 30% 直接判「可疑」；新增少于 30 个或首日聊天少于 10 人判「样本不足」。参考线是经验值，鼠标放在指标上可以看到。
      </p>
    </template>

    <div v-else class="py-16 text-center text-(--ui-text-muted)">
      这个渠道在所选时间内没有数据
    </div>
  </div>
</template>
