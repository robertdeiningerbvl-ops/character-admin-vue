<script setup lang="ts">
import { baseColumns, getInviteStatisticsList, type TableColumnList } from '@/components/member/invite-statistics/columns'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'InviteStatistics'
})

const columns: TableColumnList = [...baseColumns]
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getInviteStatisticsList"
      :columns="columns"
    />
  </DashboardLayout>
</template>
