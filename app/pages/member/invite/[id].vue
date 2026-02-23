<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/member/invite/columns'
import { getMemberMarketingInviteList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberMarketingInvite' })

const route = useRoute()
const uid = computed(() => route.params.id as string)

const fetchList = (params: any) => {
  return getMemberMarketingInviteList({ ...params, uid: uid.value })
}

const columns: TableColumnList = [...baseColumns]
</script>

<template>
  <DashboardLayout>
    <div class="mb-4 flex items-center gap-2">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        to="/member/list"
      />
      <h2 class="text-lg font-semibold">
        邀请记录
      </h2>
    </div>
    <DynamicTable
      :data-request="fetchList"
      :columns="columns"
      :show-search="false"
      scroll-x="min-w-[900px]"
    />
  </DashboardLayout>
</template>
