<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/member/conversation/columns'
import { getMemberConversationList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberChatList' })

const route = useRoute()
const router = useRouter()
const uid = computed(() => route.params.id as string)
const UButton = resolveComponent('UButton')

const openHistory = (item: any) => {
  router.push(`/member/chat-history/${uid.value}/${item.biz_id}?con_id=${item.id}`)
}

const requestConversationList = (params: any) => {
  return getMemberConversationList({
    ...params,
    uid: uid.value
  })
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    header: '操作',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      return h(UButton, {
        label: '查看',
        size: 'xs',
        color: 'primary',
        variant: 'soft',
        onClick: () => openHistory(row.original)
      })
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <div class="mb-4 flex items-center gap-2">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" to="/member/list" />
      <h2 class="text-lg font-semibold">用户聊天会话</h2>
    </div>

    <DynamicTable
      :key="uid"
      :data-request="requestConversationList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
</template>
