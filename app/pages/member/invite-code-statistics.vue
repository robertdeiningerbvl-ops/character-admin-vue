<script setup lang="ts">
import { baseColumns } from '@/components/member/invite-code-statistics/columns'
import { getMemberInviteChannelStatisticsList } from '@/api'
import ChannelList from '@/components/member/channel-quality/ChannelList.vue'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberInviteCodeStatistics' })

const route = useRoute()
const tab = ref<string>('quality')

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
    <div class="px-4 md:px-6 pt-4">
      <UTabs
        v-model="tab"
        :content="false"
        variant="link"
        :items="[
          { value: 'quality', label: '渠道质量', icon: 'lucide:gauge' },
          { value: 'daily', label: '每日明细（旧）', icon: 'lucide:table' }
        ]"
      />
    </div>
    <div v-if="tab === 'quality'" class="p-4 md:p-6">
      <ChannelList :key="String(route.query.uid || '')" :inviter-uid="(route.query.uid as string) || undefined" />
    </div>
    <DynamicTable
      v-else
      :key="String(route.query.uid || '')"
      :data-request="requestInviteCodeStatistics"
      :columns="baseColumns"
      scroll-x="min-w-[1800px]"
    />
  </DashboardLayout>
</template>
