<script setup lang="ts">
import { getAgentChannelAttrs, getAgentChannelAttrsDay } from '@/api'
import type { AgentChannelAttrsParams } from '@/api/modules/agent'
import { summaryColumns, dailyColumns } from '@/components/agent/channel-attrs/columns'
import FilterForm from '@/components/agent/channel-attrs/FilterForm.vue'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'AgentChannelAttrs' })

// 当前激活的标签页：'summary' | 'daily'
const activeTab = ref<'summary' | 'daily'>('summary')

// 共享的筛选条件
const filterParams = reactive<AgentChannelAttrsParams>({
  agent_code: '',
  channel_id: '',
  start_time: '',
  end_time: ''
})

// 汇总统计数据状态
const summaryData = reactive({
  list: [] as any[],
  count: 0,
  loading: false,
  page: 1,
  pagesize: 10
})

// 每日明细数据状态
const dailyData = reactive({
  list: [] as any[],
  count: 0,
  loading: false,
  page: 1,
  pagesize: 10
})

// 当前表格列配置
const currentColumns = computed(() => {
  return activeTab.value === 'summary' ? summaryColumns : dailyColumns
})

// 当前数据状态
const currentData = computed(() => {
  return activeTab.value === 'summary' ? summaryData : dailyData
})

// 加载汇总统计数据
const loadSummaryData = async () => {
  summaryData.loading = true
  try {
    const params = {
      ...filterParams,
      page: summaryData.page,
      pagesize: summaryData.pagesize
    }
    const { data } = await getAgentChannelAttrs(params)
    summaryData.list = data?.list || []
    summaryData.count = data?.count || 0
  } catch (error) {
    console.error('加载汇总统计数据失败:', error)
  } finally {
    summaryData.loading = false
  }
}

// 加载每日明细数据
const loadDailyData = async () => {
  dailyData.loading = true
  try {
    const params = {
      ...filterParams,
      page: dailyData.page,
      pagesize: dailyData.pagesize
    }
    const { data } = await getAgentChannelAttrsDay(params)
    dailyData.list = data?.list || []
    dailyData.count = data?.count || 0
  } catch (error) {
    console.error('加载每日明细数据失败:', error)
  } finally {
    dailyData.loading = false
  }
}

// 加载当前标签页数据
const loadCurrentData = () => {
  if (activeTab.value === 'summary') {
    loadSummaryData()
  } else {
    loadDailyData()
  }
}

// 处理筛选查询
const handleSearch = (params: AgentChannelAttrsParams) => {
  Object.assign(filterParams, params)
  // 重置两个标签页的分页到第一页
  summaryData.page = 1
  dailyData.page = 1
  // 加载当前标签页数据
  loadCurrentData()
}

// 处理重置筛选
const handleReset = () => {
  Object.assign(filterParams, {
    agent_code: '',
    channel_id: '',
    start_time: '',
    end_time: ''
  })
  // 重置两个标签页的分页到第一页
  summaryData.page = 1
  dailyData.page = 1
  // 加载当前标签页数据
  loadCurrentData()
}

// 处理标签页切换
const handleTabChange = (tab: 'summary' | 'daily') => {
  activeTab.value = tab
  // 如果切换后的标签页还没有数据，则加载
  if (tab === 'summary' && summaryData.list.length === 0) {
    loadSummaryData()
  } else if (tab === 'daily' && dailyData.list.length === 0) {
    loadDailyData()
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  if (activeTab.value === 'summary') {
    summaryData.page = page
    loadSummaryData()
  } else {
    dailyData.page = page
    loadDailyData()
  }
}

// 初始化加载
onMounted(() => {
  loadSummaryData()
})
</script>

<template>
  <DashboardLayout>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-(--ui-text-highlighted)">代理渠道属性统计</h1>
      <p class="text-sm text-(--ui-text-muted) mt-1">查看代理渠道的消费和利润数据</p>
    </div>

    <!-- 筛选表单 -->
    <FilterForm
      class="mb-4"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 标签页切换 -->
    <div class="mb-4">
      <UTabs
        :model-value="activeTab"
        @update:model-value="handleTabChange"
      >
        <UTab value="summary" label="汇总统计" />
        <UTab value="daily" label="每日明细" />
      </UTabs>
    </div>

    <!-- 加载中状态 -->
    <div v-if="currentData.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 数据表格 -->
    <div v-else class="bg-(--ui-bg-elevated) rounded-lg border border-(--ui-border) overflow-hidden">
      <DataTable
        :columns="currentColumns"
        :data="currentData.list"
      />
    </div>

    <!-- 分页器 -->
    <div v-if="currentData.count > 0" class="mt-4 flex justify-end">
      <UPagination
        :model-value="currentData.page"
        :total="Math.ceil(currentData.count / currentData.pagesize)"
        @update:model-value="handlePageChange"
      />
    </div>
  </DashboardLayout>
</template>


