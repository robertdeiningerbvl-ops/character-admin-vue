<script setup lang="ts">
import { columns } from '~/components/agent/channel-list/columns'
import { getAgentChannelList } from '@/api/modules/agent'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AgentChannelList'
})

const tableRef = ref()
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getAgentChannelList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
</template>
