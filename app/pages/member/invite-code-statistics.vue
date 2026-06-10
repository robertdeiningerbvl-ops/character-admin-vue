<script setup lang="ts">
import { getMemberInviteStatisticalList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberInviteCodeStatistics' })

const tyMap: Record<number, string> = { 1: 'bt', 2: 'web' }

const fmt = (v: number) => (v / 100).toFixed(2)

const state = reactive({
  loading: false,
  list: [] as any[],
  total: 0,
  summary: null as any,
  uid: '',
  inviteCode: '',
  page: 1,
  pageSize: 20
})

const loadData = async (resetPage = true) => {
  if (resetPage) state.page = 1
  state.loading = true
  try {
    const { data } = await getMemberInviteStatisticalList({
      uid: state.uid ? Number(state.uid) : 0,
      invite_code: state.inviteCode || undefined,
      page: state.page,
      pagesize: state.pageSize
    })
    state.list = data?.list || []
    state.total = data?.count || 0
    state.summary = data?.total || null
  }
  finally {
    state.loading = false
  }
}

const reset = () => {
  state.uid = ''
  state.inviteCode = ''
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <!-- 搜索栏 -->
    <div class="flex flex-wrap items-end gap-3 mb-4">
      <UFormField label="用户ID">
        <UInput v-model="state.uid" placeholder="用户ID" class="w-32" />
      </UFormField>
      <UFormField label="邀请码">
        <UInput v-model="state.inviteCode" placeholder="邀请码" class="w-36" />
      </UFormField>
      <UButton icon="i-lucide-search" label="查询" @click="loadData()" />
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="reset" />
    </div>

    <!-- 汇总行 -->
    <div v-if="state.summary" class="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
      <div v-for="[label, val] in [
        ['注册用户', state.summary.user_count],
        ['充值用户', state.summary.top_up_user_count],
        ['首充佣金', fmt(state.summary.first_commission) + ' 元'],
        ['首充金额', fmt(state.summary.first_topup_amount) + ' 元'],
        ['总佣金', fmt(state.summary.total_commission) + ' 元'],
        ['总充值', fmt(state.summary.total_topup_amount) + ' 元'],
      ]" :key="label" class="p-3 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) text-center">
        <div class="text-xs text-(--ui-text-muted) mb-1">{{ label }}</div>
        <div class="font-semibold text-sm">{{ val }}</div>
      </div>
    </div>

    <!-- 表格 -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-(--ui-bg-elevated)/50 text-(--ui-text-muted)">
              <th class="px-3 py-3 text-left font-semibold">用户ID</th>
              <th class="px-3 py-3 text-left font-semibold">邀请码</th>
              <th class="px-3 py-3 text-right font-semibold">类型</th>
              <th class="px-3 py-3 text-right font-semibold">注册用户</th>
              <th class="px-3 py-3 text-right font-semibold">充值用户</th>
              <th class="px-3 py-3 text-right font-semibold">首充佣金</th>
              <th class="px-3 py-3 text-right font-semibold">首充金额</th>
              <th class="px-3 py-3 text-right font-semibold">总佣金</th>
              <th class="px-3 py-3 text-right font-semibold">总充值</th>
              <th class="px-3 py-3 text-right font-semibold">创建时间</th>
            </tr>
          </thead>
          <tbody v-if="state.loading">
            <tr>
              <td colspan="10" class="px-3 py-8 text-center text-(--ui-text-muted)">
                <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="state.list.length === 0">
            <tr>
              <td colspan="10" class="px-3 py-8 text-center text-(--ui-text-muted)">暂无数据</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr
              v-for="item in state.list"
              :key="item.id"
              class="border-t border-(--ui-border) hover:bg-(--ui-bg-elevated)/30 transition-colors"
            >
              <td class="px-3 py-3">{{ item.uid }}</td>
              <td class="px-3 py-3 font-mono text-(--ui-primary)">{{ item.invite_code }}</td>
              <td class="px-3 py-3 text-right">
                <UBadge color="neutral" variant="subtle" size="xs">{{ tyMap[item.ty] || item.ty }}</UBadge>
              </td>
              <td class="px-3 py-3 text-right">{{ item.user_count }}</td>
              <td class="px-3 py-3 text-right">{{ item.top_up_user_count }}</td>
              <td class="px-3 py-3 text-right">{{ fmt(item.first_commission) }}</td>
              <td class="px-3 py-3 text-right">{{ fmt(item.first_topup_amount) }}</td>
              <td class="px-3 py-3 text-right text-(--ui-primary)">{{ fmt(item.total_commission) }}</td>
              <td class="px-3 py-3 text-right">{{ fmt(item.total_topup_amount) }}</td>
              <td class="px-3 py-3 text-right text-(--ui-text-muted) text-xs">{{ formatToDateTime(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- 分页 -->
    <div class="flex items-center justify-between gap-3 pt-4">
      <div class="text-sm text-(--ui-text-muted)">
        共 <span class="font-medium text-(--ui-text)">{{ state.total }}</span> 条
      </div>
      <UPagination
        show-edges
        :sibling-count="1"
        :page="state.page"
        :items-per-page="state.pageSize"
        :total="state.total"
        @update:page="(p) => { state.page = p; loadData(false) }"
      />
    </div>
  </DashboardLayout>
</template>
