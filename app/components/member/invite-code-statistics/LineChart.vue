<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisTooltip, VisCrosshair } from '@unovis/vue'

interface ChartDataPoint {
  date: string
  [key: string]: number | string
}

interface Props {
  data: ChartDataPoint[]
  metrics: { key: string; label: string; color?: string }[]
}

const props = defineProps<Props>()

// 转换数据格式供图表使用
const chartData = computed(() => {
  return props.data.map(item => {
    // 支持 date 或 stat_date 字段
    const dateValue = item.date || item.stat_date
    return {
      x: new Date(dateValue).getTime(),
      ...item
    }
  })
})

// 创建X轴访问器
const x = (d: any) => d.x

// 为每个指标创建Y轴访问器
const yAccessors = computed(() => {
  return props.metrics.map(metric => (d: any) => d[metric.key])
})

// 颜色配置
const colors = computed(() => {
  return props.metrics.map(metric => metric.color || '#3b82f6')
})
</script>

<template>
  <div class="w-full h-96">
    <VisXYContainer :data="chartData" :height="384">
      <VisLine
        :x="x"
        :y="yAccessors"
        :color="colors"
      />
      <VisAxis type="x" :label="'日期'" />
      <VisAxis type="y" :label="'数值'" />
      <VisTooltip />
      <VisCrosshair :template="(d: any) => {
        const date = new Date(d.x).toLocaleDateString('zh-CN')
        return `<div class='text-sm'><strong>${date}</strong></div>`
      }" />
    </VisXYContainer>
  </div>
</template>
