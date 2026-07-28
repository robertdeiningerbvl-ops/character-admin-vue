<script setup lang="ts">
import { baseColumns } from '@/components/member/invite-code-statistics/columns'
import { getMemberInviteChannelStatisticsList } from '@/api'
import ChartModal from '@/components/member/invite-code-statistics/ChartModal.vue'
import LineChart from '@/components/member/invite-code-statistics/LineChart.vue'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberInviteCodeStatistics' })

// 弹窗状态
const inviteCodeChartOpen = ref(false)
const agentChartOpen = ref(false)

// 当前选中的数据
const currentRow = ref<any>(null)

// 图表数据
const inviteCodeChartData = ref<any[]>([])
const agentChartData = ref<any[]>([])

// 加载状态
const inviteCodeLoading = ref(false)
const agentLoading = ref(false)

// 查询表单
const inviteCodeFilters = ref({
  start_date: '',
  end_date: ''
})

const agentFilters = ref({
  start_date: '',
  end_date: ''
})

// 图表指标配置
const inviteCodeMetrics = [
  { key: 'consume_battery', label: '消耗积分', color: '#3b82f6' },
  { key: 'signin_user_count', label: '签到用户数', color: '#10b981' },
  { key: 'chat_once_user_count', label: '1次对话用户', color: '#f59e0b' },
  { key: 'chat_ten_user_count', label: '10次+对话用户', color: '#8b5cf6' },
  { key: 'first_topup_count', label: '首充用户数', color: '#ec4899' },
  { key: 'repeat_topup_count', label: '复充用户数', color: '#06b6d4' }
]

const agentMetrics = [
  { key: 'consume_battery', label: '消耗积分', color: '#3b82f6' },
  { key: 'signin_user_count', label: '签到用户数', color: '#10b981' },
  { key: 'first_topup_count', label: '首充用户数', color: '#ec4899' }
]

// 处理邀请码图表按钮点击
const handleShowInviteCodeChart = (row: any) => {
  currentRow.value = row
  inviteCodeChartOpen.value = true
  loadInviteCodeChartData()
}

// 处理代理图表按钮点击
const handleShowAgentChart = (row: any) => {
  currentRow.value = row
  agentChartOpen.value = true
  loadAgentChartData()
}

// 加载邀请码图表数据
const loadInviteCodeChartData = async () => {
  if (!currentRow.value?.invite_code) return

  inviteCodeLoading.value = true
  try {
    const params: any = {
      invite_code: currentRow.value.invite_code,
      page: 1,
      pagesize: 100
    }

    // 如果有日期筛选，添加日期参数
    if (inviteCodeFilters.value.start_date) {
      params.start_date = inviteCodeFilters.value.start_date
    }
    if (inviteCodeFilters.value.end_date) {
      params.end_date = inviteCodeFilters.value.end_date
    }

    const result = await getMemberInviteChannelStatisticsList(params)
    if (result.data?.list) {
      inviteCodeChartData.value = result.data.list
    }
  } finally {
    inviteCodeLoading.value = false
  }
}

// 加载代理图表数据
const loadAgentChartData = async () => {
  if (!currentRow.value?.uid) return

  agentLoading.value = true
  try {
    const params: any = {
      uid: currentRow.value.uid,
      page: 1,
      pagesize: 100
    }

    // 如果有日期筛选，添加日期参数
    if (agentFilters.value.start_date) {
      params.start_date = agentFilters.value.start_date
    }
    if (agentFilters.value.end_date) {
      params.end_date = agentFilters.value.end_date
    }

    const result = await getMemberInviteChannelStatisticsList(params)
    if (result.data?.list) {
      agentChartData.value = result.data.list
    }
  } finally {
    agentLoading.value = false
  }
}

// 表格meta配置，用于传递事件处理函数
const tableMeta = {
  onShowInviteCodeChart: handleShowInviteCodeChart,
  onShowAgentChart: handleShowAgentChart
}
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      :data-request="getMemberInviteChannelStatisticsList"
      :columns="baseColumns"
      :meta="tableMeta"
      scroll-x="min-w-[1800px]"
    />

    <!-- 邀请码图表弹窗 -->
    <ChartModal
      v-model:open="inviteCodeChartOpen"
      title="邀请码图表"
      :loading="inviteCodeLoading"
    >
      <template #filters>
        <div class="space-y-3">
          <div class="text-sm">
            邀请码: <span class="font-mono font-semibold text-primary">{{ currentRow?.invite_code }}</span>
          </div>
          <div class="flex gap-3 items-end">
            <UFormGroup label="开始日期" class="flex-1">
              <UInput
                v-model="inviteCodeFilters.start_date"
                type="date"
                placeholder="选择开始日期"
              />
            </UFormGroup>
            <UFormGroup label="结束日期" class="flex-1">
              <UInput
                v-model="inviteCodeFilters.end_date"
                type="date"
                placeholder="选择结束日期"
              />
            </UFormGroup>
            <UButton
              color="primary"
              icon="i-lucide-search"
              @click="loadInviteCodeChartData"
            >
              查询
            </UButton>
          </div>
        </div>
      </template>
      <template #chart>
        <div v-if="inviteCodeChartData.length === 0" class="text-center text-gray-500 py-8">
          暂无数据
        </div>
        <LineChart v-else :data="inviteCodeChartData" :metrics="inviteCodeMetrics" />
      </template>
    </ChartModal>

    <!-- 代理图表弹窗 -->
    <ChartModal
      v-model:open="agentChartOpen"
      title="代理图表"
      :loading="agentLoading"
    >
      <template #filters>
        <div class="space-y-3">
          <div class="text-sm">
            用户ID: <span class="font-mono font-semibold text-primary">#{{ currentRow?.uid }}</span>
          </div>
          <div class="flex gap-3 items-end">
            <UFormGroup label="开始日期" class="flex-1">
              <UInput
                v-model="agentFilters.start_date"
                type="date"
                placeholder="选择开始日期"
              />
            </UFormGroup>
            <UFormGroup label="结束日期" class="flex-1">
              <UInput
                v-model="agentFilters.end_date"
                type="date"
                placeholder="选择结束日期"
              />
            </UFormGroup>
            <UButton
              color="primary"
              icon="i-lucide-search"
              @click="loadAgentChartData"
            >
              查询
            </UButton>
          </div>
        </div>
      </template>
      <template #chart>
        <div v-if="agentChartData.length === 0" class="text-center text-gray-500 py-8">
          暂无数据
        </div>
        <LineChart v-else :data="agentChartData" :metrics="agentMetrics" />
      </template>
    </ChartModal>
  </DashboardLayout>
</template>
