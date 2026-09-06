<script setup lang="ts">
import { baseColumns } from '@/components/member/invite-code-statistics/columns'
import { getMemberInviteChannelStatisticsList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberInviteCodeStatistics' })

const route = useRoute()

const requestInviteCodeStatistics = (params: any) => {
  const nextParams = { ...params }
  if (route.query.uid && nextParams.uid === undefined) {
    nextParams.uid = route.query.uid
  }
  return getMemberInviteChannelStatisticsList(nextParams)
}
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      :key="String(route.query.uid || '')"
      :data-request="requestInviteCodeStatistics"
      :columns="baseColumns"
      scroll-x="min-w-[1800px]"
    />
  </DashboardLayout>
</template>
