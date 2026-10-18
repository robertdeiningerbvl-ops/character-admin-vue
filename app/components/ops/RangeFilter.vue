<script setup lang="ts">
import dayjs from 'dayjs'

/** 运营统计页的筛选栏：开始 / 结束日期 + 快捷范围 + 额外筛选（插槽） */
const props = withDefaults(defineProps<{
  loading?: boolean
  /** 快捷范围（天） */
  presets?: number[]
  /** 后端允许的最大跨度（天） */
  maxDays?: number
  /** 快捷范围截止到昨天（报告类数据当天不完整） */
  untilYesterday?: boolean
}>(), {
  loading: false,
  presets: () => [7, 14, 30],
  maxDays: 31,
  untilYesterday: false
})

const start = defineModel<string>('start', { required: true })
const end = defineModel<string>('end', { required: true })
const emit = defineEmits<{ search: [] }>()

const toast = useToast()

const span = computed(() => {
  if (!start.value || !end.value) return 0
  return dayjs(end.value).diff(dayjs(start.value), 'day') + 1
})

function applyPreset(days: number) {
  const r = opsRecentRange(days, props.untilYesterday)
  start.value = r.start
  end.value = r.end
  emit('search')
}

function search() {
  if (!start.value || !end.value) {
    toast.add({ title: '请选择开始和结束日期', color: 'warning' })
    return
  }
  if (span.value <= 0) {
    toast.add({ title: '结束日期不能早于开始日期', color: 'warning' })
    return
  }
  if (span.value > props.maxDays) {
    toast.add({ title: `一次最多查询 ${props.maxDays} 天`, color: 'warning' })
    return
  }
  emit('search')
}
</script>

<template>
  <UCard :ui="{ body: 'p-4' }" class="mb-6">
    <div class="flex flex-wrap items-end gap-4">
      <UFormField label="开始日期" class="w-[150px]">
        <UInput v-model="start" type="date" />
      </UFormField>
      <UFormField label="结束日期" class="w-[150px]">
        <UInput v-model="end" type="date" />
      </UFormField>
      <slot />
      <div class="flex items-center gap-2">
        <UButton
          :loading="loading"
          label="查询"
          icon="i-lucide-search"
          @click="search"
        />
        <UButton
          v-for="d in presets"
          :key="d"
          :disabled="loading"
          :label="`近 ${d} 天`"
          color="neutral"
          variant="outline"
          size="sm"
          @click="applyPreset(d)"
        />
      </div>
    </div>
  </UCard>
</template>
