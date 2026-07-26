<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { getAgentChannelAttrsDay } from '@/api'
import type { AgentChannelAttrsParams } from '@/api/modules/agent'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

interface Props {
  visible: boolean
  filterParams: AgentChannelAttrsParams
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const state = reactive({
  loading: false,
  chartData: [] as any[]
})

const chartOption = ref({})

// 加载图表数据
const loadChartData = async () => {
  state.loading = true
  try {
    const params = {
      ...props.filterParams,
      page: 1,
      pagesize: 100 // 获取足够多的数据用于图表展示
    }
    const { data } = await getAgentChannelAttrsDay(params)
    state.chartData = data?.list || []
    updateChartOption()
  } catch (error) {
    console.error('加载图表数据失败:', error)
  } finally {
    state.loading = false
  }
}

// 更新图表配置
const updateChartOption = () => {
  const dates = state.chartData.map(item => item.day_time || '')
  const consumeAmounts = state.chartData.map(item => Number.parseFloat(item.consume_amount) || 0)
  const profits = state.chartData.map(item => Number.parseFloat(item.profit) || 0)

  chartOption.value = {
    title: {
      text: '代理渠道属性趋势图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['消费金额', '利润'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: [
      {
        type: 'value',
        name: '消费金额 (¥)',
        position: 'left',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      {
        type: 'value',
        name: '利润 (¥)',
        position: 'right',
        axisLabel: {
          formatter: '¥{value}'
        }
      }
    ],
    series: [
      {
        name: '消费金额',
        type: 'line',
        data: consumeAmounts,
        smooth: true,
        yAxisIndex: 0,
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: '利润',
        type: 'line',
        data: profits,
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: '#10b981'
        }
      }
    ]
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 监听弹窗显示状态，显示时加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadChartData()
  }
})
</script>

<template>
  <UModal
    :model-value="visible"
    :prevent-close="false"
    @update:model-value="handleClose"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">数据趋势图表</h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="handleClose"
          />
        </div>
      </template>

      <!-- 加载中状态 -->
      <div v-if="state.loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
      </div>

      <!-- 图表内容 -->
      <div v-else-if="state.chartData.length > 0" class="w-full h-[500px]">
        <VChart :option="chartOption" class="w-full h-full" autoresize />
      </div>

      <!-- 无数据提示 -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-(--ui-text-muted)">
        <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 mb-3" />
        <p>暂无数据</p>
      </div>
    </UCard>
  </UModal>
</template>


