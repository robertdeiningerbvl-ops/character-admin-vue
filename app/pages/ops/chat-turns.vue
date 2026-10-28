<script setup lang="ts">
import { h } from 'vue'
import { getChatTurnStats } from '@/api'

const UBadge = resolveComponent('UBadge')

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsChatTurns' })

const range = opsRecentRange(7)
const state = reactive({
  loading: false,
  start: range.start,
  end: range.end,
  page: 1,
  pageSize: 30,
  summary: {} as any,
  days: [] as any[],
  buckets: [] as any[],
  list: [] as any[],
  count: 0,
  cardRows: [] as any[],
  models: [] as any[],
  outcomes: [] as any[],
  cardSort: 'conversations' as 'conversations' | 'one_turn_rate' | 'avg_turns_per_conversation'
})

async function loadData(resetPage = true) {
  if (resetPage) state.page = 1
  state.loading = true
  try {
    const { data } = await getChatTurnStats({
      start_time: state.start,
      end_time: state.end,
      page: state.page,
      pagesize: state.pageSize
    })
    state.summary = data?.summary || {}
    state.days = data?.days || []
    state.buckets = data?.buckets || []
    state.list = data?.list || []
    state.count = data?.count || 0
    state.cardRows = data?.cards || []
    state.models = data?.models || []
    state.outcomes = data?.outcomes || []
  } finally {
    state.loading = false
  }
}

onMounted(() => loadData())

function onPageChange(page: number) {
  state.page = page
  loadData(false)
}

const cards = computed(() => [
  { label: '聊天用户数', value: opsNum(state.summary.users), hint: '有成功回复的用户', icon: 'lucide:users' },
  { label: '聊天轮次', value: opsNum(state.summary.turns), hint: `另有重新生成 ${opsNum(state.summary.regens)} 次（不计入）`, icon: 'lucide:messages-square' },
  { label: '人均轮次', value: opsNum(state.summary.avg_turns), hint: '聊天轮次 ÷ 聊天用户数', icon: 'lucide:user-round' },
  { label: '每个会话平均轮次', value: opsNum(state.summary.avg_turns_per_conversation), hint: `${opsNum(state.summary.conversations)} 个会话`, icon: 'lucide:message-circle' },
  { label: '被聊到的角色卡', value: opsNum(state.summary.cards), hint: '去重后的角色卡数', icon: 'lucide:id-card' }
])

const pct = (v: any) => `${opsNum(v ?? 0)}%`

const cards2 = computed(() => [
  { label: '用户轮次中位数', value: opsNum(state.summary.median_turns), hint: '一半用户聊不到这么多轮', icon: 'lucide:chart-no-axes-column' },
  { label: '会话轮次中位数', value: opsNum(state.summary.median_turns_per_conversation), hint: '一半会话聊不到这么多轮', icon: 'lucide:messages-square' },
  { label: '只聊 1 轮的用户', value: pct(state.summary.one_turn_user_rate), hint: `${opsNum(state.summary.one_turn_users)} 人`, icon: 'lucide:user-x' },
  { label: '只聊 1 轮的会话', value: pct(state.summary.one_turn_conversation_rate), hint: `${opsNum(state.summary.one_turn_conversations)} 个会话`, icon: 'lucide:message-circle-x' },
  { label: '重新生成率', value: pct(state.summary.regen_rate), hint: '重新生成 ÷ 聊天轮次', icon: 'lucide:refresh-cw' }
])

const cardSorts = [
  { key: 'conversations', label: '按会话数' },
  { key: 'one_turn_rate', label: '按 1 轮流失率' },
  { key: 'avg_turns_per_conversation', label: '按每会话轮次' }
] as const

// 按流失率 / 轮次排序时，会话太少的卡波动大，排在后面
const CARD_MIN_CONVS = 5
const sortedCards = computed(() => {
  const k = state.cardSort
  return [...state.cardRows].sort((a, b) => {
    if (k !== 'conversations') {
      const ea = a.conversations >= CARD_MIN_CONVS ? 1 : 0
      const eb = b.conversations >= CARD_MIN_CONVS ? 1 : 0
      if (ea !== eb) return eb - ea
    }
    if (k === 'avg_turns_per_conversation') return (a[k] || 0) - (b[k] || 0)
    return (b[k] || 0) - (a[k] || 0) || b.conversations - a.conversations
  })
})

const noOpeningCount = computed(() => state.cardRows.filter(c => !c.has_opening).length)

const cardColumns = [
  { id: 'name', header: '角色卡', cell: ({ row }: any) => h('div', { class: 'max-w-56 truncate' }, [
    h('span', row.original.name || '—'),
    h('span', { class: 'ml-2 text-xs text-(--ui-text-dimmed)' }, `#${row.original.biz_id}`)
  ]) },
  { id: 'conversations', header: '会话', cell: ({ row }: any) => opsNum(row.original.conversations) },
  { id: 'users', header: '用户', cell: ({ row }: any) => opsNum(row.original.users) },
  { id: 'avg', header: '每会话平均', cell: ({ row }: any) => opsNum(row.original.avg_turns_per_conversation) },
  { id: 'median', header: '每会话中位', cell: ({ row }: any) => opsNum(row.original.median_turns_per_conversation) },
  { id: 'one', header: '只聊 1 轮', cell: ({ row }: any) => h('span', {
    class: row.original.conversations >= CARD_MIN_CONVS && row.original.one_turn_rate >= 50 ? 'text-(--ui-error) font-medium' : ''
  }, pct(row.original.one_turn_rate)) },
  { id: 'regen', header: '重新生成率', cell: ({ row }: any) => pct(row.original.regen_rate) },
  { id: 'opening', header: '开场白', cell: ({ row }: any) => row.original.has_opening
    ? (row.original.opening_chars ? `${opsNum(row.original.opening_chars)} 字` : '有')
    : h(UBadge, { color: 'error', variant: 'subtle', size: 'sm' }, () => '无') }
]

const modelColumns = [
  { id: 'name', header: '模型', cell: ({ row }: any) => row.original.name || `#${row.original.model_id}` },
  { id: 'turns', header: '轮次', cell: ({ row }: any) => opsNum(row.original.turns) },
  { id: 'users', header: '用户', cell: ({ row }: any) => opsNum(row.original.users) },
  { id: 'avg', header: '每会话轮次', cell: ({ row }: any) => opsNum(row.original.avg_turns_per_conversation) },
  { id: 'regen', header: '重新生成率', cell: ({ row }: any) => pct(row.original.regen_rate) },
  { id: 'trunc', header: '被截断', cell: ({ row }: any) => pct(row.original.truncated_rate) }
]

const outcomeTotal = computed(() => state.outcomes.reduce((n, o) => n + (o.calls || 0), 0))
const outcomeColumns = [
  { accessorKey: 'label', header: '结果' },
  { id: 'calls', header: '次数', cell: ({ row }: any) => opsNum(row.original.calls) },
  { id: 'share', header: '占比', cell: ({ row }: any) => pct(outcomeTotal.value ? Math.round(row.original.calls / outcomeTotal.value * 1000) / 10 : 0) },
  { id: 'users', header: '遇到的用户', cell: ({ row }: any) => opsNum(row.original.users) }
]

const bucketMax = computed(() => Math.max(1, ...state.buckets.map(b => b.users || 0)))

const dayColumns = [
  { accessorKey: 'day', header: '日期' },
  { id: 'users', header: '聊天用户', cell: ({ row }: any) => opsNum(row.original.users) },
  { id: 'turns', header: '轮次', cell: ({ row }: any) => opsNum(row.original.turns) },
  { id: 'avg', header: '人均轮次', cell: ({ row }: any) => opsNum(row.original.avg_turns) }
]

const userColumns = [
  { id: 'rank', header: '#', cell: ({ row }: any) => (state.page - 1) * state.pageSize + row.index + 1 },
  { accessorKey: 'uid', header: '用户 ID' },
  { id: 'username', header: '用户名', cell: ({ row }: any) => row.original.username || '—' },
  { id: 'turns', header: '轮次', cell: ({ row }: any) => opsNum(row.original.turns) },
  { id: 'conversations', header: '会话数', cell: ({ row }: any) => opsNum(row.original.conversations) },
  { id: 'cards', header: '角色卡数', cell: ({ row }: any) => opsNum(row.original.cards) },
  { accessorKey: 'last_at', header: '最后聊天时间' }
]
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6">
      <OpsRangeFilter
        v-model:start="state.start"
        v-model:end="state.end"
        :loading="state.loading"
        :max-days="31"
        @search="loadData()"
      />

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <OpsStatCard
          v-for="c in cards"
          :key="c.label"
          v-bind="c"
          :loading="state.loading"
        />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <OpsStatCard
          v-for="c in cards2"
          :key="c.label"
          v-bind="c"
          :loading="state.loading"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <UCard>
          <template #header>
            <p class="font-medium">
              用户按轮次分布
            </p>
          </template>
          <div class="space-y-2">
            <div
              v-for="b in state.buckets"
              :key="b.label"
              class="flex items-center gap-3 text-sm"
            >
              <span class="w-24 shrink-0 text-(--ui-text-muted)">{{ b.label }}</span>
              <div class="h-3 flex-1 rounded bg-(--ui-bg-elevated)">
                <div
                  class="h-3 rounded bg-(--ui-primary)"
                  :style="{ width: `${((b.users || 0) / bucketMax) * 100}%` }"
                />
              </div>
              <span class="w-16 shrink-0 text-right tabular-nums">{{ opsNum(b.users) }}</span>
            </div>
          </div>
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <p class="font-medium">
              按天
            </p>
          </template>
          <UTable
            :data="state.days"
            :columns="dayColumns"
            :loading="state.loading"
            empty="这段时间没有聊天"
            :ui="{ th: 'py-2 whitespace-nowrap', td: 'whitespace-nowrap' }"
          />
        </UCard>
      </div>

      <UCard
        class="mb-6"
        :ui="{ body: 'p-0 sm:p-0' }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="font-medium">
                按角色卡（会话数最多的 {{ opsNum(state.cardRows.length) }} 张）
              </p>
              <p
                v-if="noOpeningCount"
                class="text-xs text-(--ui-error) mt-1"
              >
                其中 {{ noOpeningCount }} 张没有开场白
              </p>
            </div>
            <div class="flex gap-1">
              <UButton
                v-for="s in cardSorts"
                :key="s.key"
                size="xs"
                :variant="state.cardSort === s.key ? 'solid' : 'outline'"
                color="neutral"
                @click="state.cardSort = s.key"
              >
                {{ s.label }}
              </UButton>
            </div>
          </div>
        </template>
        <UTable
          :data="sortedCards"
          :columns="cardColumns"
          :loading="state.loading"
          empty="这段时间没有聊天"
          :ui="{ th: 'py-2 whitespace-nowrap', td: 'whitespace-nowrap' }"
        />
      </UCard>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <p class="font-medium">
              按模型
            </p>
          </template>
          <UTable
            :data="state.models"
            :columns="modelColumns"
            :loading="state.loading"
            empty="这段时间没有聊天"
            :ui="{ th: 'py-2 whitespace-nowrap', td: 'whitespace-nowrap' }"
          />
        </UCard>

        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <template #header>
            <p class="font-medium">
              聊天调用结果（含重新生成）
            </p>
          </template>
          <UTable
            :data="state.outcomes"
            :columns="outcomeColumns"
            :loading="state.loading"
            empty="这段时间没有聊天"
            :ui="{ th: 'py-2 whitespace-nowrap', td: 'whitespace-nowrap' }"
          />
        </UCard>
      </div>

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <template #header>
          <p class="font-medium">
            每个用户的聊天轮次（{{ opsNum(state.count) }} 人，按轮次从多到少）
          </p>
        </template>
        <UTable
          :data="state.list"
          :columns="userColumns"
          :loading="state.loading"
          empty="这段时间没有聊天（统计从 2026-10-19 上线后开始记录）"
          :ui="{ th: 'py-3 whitespace-nowrap', td: 'whitespace-nowrap' }"
        />
        <div
          v-if="state.count > state.pageSize"
          class="flex justify-end p-4"
        >
          <UPagination
            show-edges
            :page="state.page"
            :items-per-page="state.pageSize"
            :total="state.count"
            @update:page="onPageChange"
          />
        </div>
      </UCard>

      <p class="mt-4 text-xs text-(--ui-text-dimmed) leading-5">
        一轮 = 用户发一句、角色成功回复一次；重新生成不算新的一轮，失败、取消、余额不足的也不算。
        按天的用户数是当天去重，各天相加会大于整段时间的用户数；日期按北京时间。
        中位数比平均值更能反映大多数人：少数聊上百轮的用户会把平均值拉高。
        按角色卡按流失率 / 轮次排序时，会话少于 5 个的卡排在后面（样本太少）。开场白只看卡片的 first_mes。
      </p>
    </div>
  </DashboardLayout>
</template>
