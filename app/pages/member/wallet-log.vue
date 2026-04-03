<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/member/wallet/columns'
import { getMemberWalletLogList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberWalletLogList'
})

const route = useRoute()
const tableRef = ref()

const columns: TableColumnList = [
  ...baseColumns
]

const defaultSearchParams = computed(() => {
  const params: any = {}
  if (route.query.uid) {
    params.uid = route.query.uid
  }
  return params
})

watch(() => route.query.uid, () => {
  tableRef.value?.reload()
})
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getMemberWalletLogList"
      :columns="columns"
      :default-search-params="defaultSearchParams"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
</template>
