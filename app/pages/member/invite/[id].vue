<script setup lang="ts">
import { baseColumns, type TableColumnList } from '~/components/member/invite/columns'
import { getMemberMarketingInviteList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberMarketingInvite'
})

const columns: TableColumnList = [...baseColumns]
const route = useRoute()

const uid = computed(() => route.params.id as string)
const fetchMarketingInviteList = (params: any) => {
  return getMemberMarketingInviteList({
    ...params,
    uid: uid.value
  })
}
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="fetchMarketingInviteList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
</template>
