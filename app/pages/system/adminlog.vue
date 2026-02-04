<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/system/adminlog/columns'
import { getAdminLogList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AdminLogList'
})

const tableRef = ref()

const columns: TableColumnList = [
  ...baseColumns
]
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
  </DashboardLayout>
</template>
