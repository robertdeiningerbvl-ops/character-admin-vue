<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/system/adminlog/columns'
import { getAdminLogList } from '@/api'
import ParamsModal from '@/components/system/adminlog/ParamsModal.vue'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AdminLogList'
})

const tableRef = ref()
const state = reactive({
  isDialogParams: false,
  currentParams: ''
})

const columns: TableColumnList = [
  ...baseColumns
]

const handleParamsClick = (e: Event) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'CODE' && target.hasAttribute('data-params')) {
    state.currentParams = target.getAttribute('data-params') || ''
    state.isDialogParams = true
  }
}

onMounted(() => {
  document.addEventListener('click', handleParamsClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleParamsClick)
})
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="subtle" size="lg">
          <template #leading>
            <UIcon name="i-material-symbols-info-outline" class="w-4 h-4" />
          </template>
          只读日志
        </UBadge>
      </div>
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getAdminLogList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />

    <ParamsModal
      v-model:dialog="state.isDialogParams"
      :params="state.currentParams"
    />
  </DashboardLayout>
</template>
