<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip, VisScatter } from '@unovis/vue'

/** 渠道质量页的折线图：x 为类别（日期 / 第 N 天），每条线一个系列 */
const props = withDefaults(defineProps<{
  data: Record<string, any>[]
  series: { key: string, name: string, color: string, dashed?: boolean }[]
  xKey: string
  /** 纵轴格式：count 数字 / pct 百分比 / money 金额 */
  format?: 'count' | 'pct' | 'money'
  height?: string
  points?: boolean
}>(), { format: 'count', height: 'h-64', points: false })

const fmt = (v: number | null | undefined) => {
  if (v === null || v === undefined) return '—'
  if (props.format === 'pct') return cqPct(v)
  if (props.format === 'money') return cqMoney(v)
  return Number(v).toLocaleString('en-US', { maximumFractionDigits: 1 })
}
const x = (_: any, i: number) => i
const y = (key: string) => (d: any) => (d[key] === null || d[key] === undefined ? undefined : d[key])
const xTicks = (i: number) => {
  const v = props.data[i]?.[props.xKey]
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.slice(5) : String(v ?? '')
}
const template = (d: any) => {
  if (!d) return ''
  const rows = props.series.map(s => `<div class="flex items-center gap-2">
      <span class="size-2 rounded-full" style="background:${s.color}"></span>
      <span>${s.name}：${fmt(d[s.key])}</span></div>`)
  return `<div class="text-xs space-y-1"><div class="font-medium">${d[props.xKey]}</div>${rows.join('')}</div>`
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs text-(--ui-text-muted)">
      <span v-for="s in series" :key="s.key" class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-0.5 rounded" :style="{ background: s.color, opacity: s.dashed ? 0.6 : 1 }" />
        {{ s.name }}
      </span>
    </div>
    <div v-if="data.length > 1" :class="height">
      <VisXYContainer :data="data" :padding="{ top: 8, right: 8 }">
        <VisLine
          v-for="s in series"
          :key="s.key"
          :x="x"
          :y="y(s.key)"
          :color="s.color"
          :line-width="2"
          curve-type="linear"
          :line-dash-array="s.dashed ? [5, 4] : undefined"
        />
        <template v-if="points">
          <VisScatter
            v-for="s in series"
            :key="'p-' + s.key"
            :x="x"
            :y="y(s.key)"
            :color="s.color"
            :size="7"
          />
        </template>
        <VisAxis
          type="x"
          :tick-format="xTicks"
          :grid-line="false"
          :num-ticks="Math.min(data.length, 8)"
        />
        <VisAxis type="y" :tick-format="(v: number) => fmt(v)" :num-ticks="4" />
        <VisCrosshair :template="template" />
        <VisTooltip />
      </VisXYContainer>
    </div>
    <div v-else :class="[height, 'flex items-center justify-center text-sm text-(--ui-text-muted)']">
      数据不足，选更长的时间范围再看
    </div>
  </div>
</template>

<style scoped>
.unovis-xy-container {
  width: 100%;
  height: 100%;
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
