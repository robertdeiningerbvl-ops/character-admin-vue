<script setup lang="ts">
import { baseColumns } from '@/components/member/invite-code-statistics/columns'
import { getMemberInviteStatisticalList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberInviteCodeStatistics' })

const summary = ref<any>(null)
const fmt = (v: number) => `¥${(v / 100).toFixed(2)}`

const summaryStats = computed(() => {
  const s = summary.value
  if (!s) return []
  return [
    { label: '注册用户', icon: 'i-lucide-users', color: 'text-blue-500', valueColor: '', value: s.user_count },
    { label: '充值用户', icon: 'i-lucide-wallet', color: 'text-green-500', valueColor: 'text-green-600 dark:text-green-400', value: s.top_up_user_count },
    { label: '首充佣金', icon: 'i-lucide-coins', color: 'text-amber-500', valueColor: 'text-amber-600 dark:text-amber-400', value: fmt(s.first_commission) },
    { label: '首充金额', icon: 'i-lucide-banknote', color: 'text-orange-500', valueColor: 'text-gray-900 dark:text-white', value: fmt(s.first_topup_amount) },
    { label: '总佣金', icon: 'i-lucide-trending-up', color: 'text-green-500', valueColor: 'text-green-600 dark:text-green-400', value: fmt(s.total_commission) },
    { label: '总充值', icon: 'i-lucide-credit-card', color: 'text-purple-500', valueColor: 'text-gray-900 dark:text-white', value: fmt(s.total_topup_amount) }
  ]
})

// 包装API，捕获summary数据
const dataRequest = async (params: any) => {
  const result = await getMemberInviteStatisticalList(params)
  if (result.data?.total) {
    summary.value = result.data.total
  }
  return result
}
</script>

<template>
  <DashboardLayout>
    <!-- 汇总卡片 -->
    <div v-if="summary" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <div v-for="stat in summaryStats" :key="stat.label" class="p-4 rounded-xl border border-(--ui-border) bg-(--ui-bg) flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-(--ui-text-muted) text-xs">
          <UIcon :name="stat.icon" class="size-3.5" :class="stat.color" />{{ stat.label }}
        </div>
        <div class="text-xl font-bold" :class="stat.valueColor || 'text-(--ui-text-highlighted)'">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <DynamicTable
      :data-request="dataRequest"
      :columns="baseColumns"
      scroll-x="min-w-[1400px]"
    />
  </DashboardLayout>
</template>
