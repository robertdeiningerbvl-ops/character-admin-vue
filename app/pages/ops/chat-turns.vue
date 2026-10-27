<script setup lang="ts">
import { getChatTurnStats } from '@/api'

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
  count: 0
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
        按天的用户数是当天去重，各天相加会大于整段时间的用户数。
      </p>
    </div>
  </DashboardLayout>
</template>
