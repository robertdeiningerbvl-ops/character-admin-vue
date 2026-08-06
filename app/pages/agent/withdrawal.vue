<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '~/components/agent/withdrawal/columns'
import { getAgentWithdrawalList } from '@/api/modules/agent'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AgentWithdrawalList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const state = reactive<{
  isDetailDialog: boolean
  isAuditDialog: boolean
  currentRecord: any
}>({
  isDetailDialog: false,
  isAuditDialog: false,
  currentRecord: {}
})

const openDetail = (record: any) => {
  state.isDetailDialog = true
  state.currentRecord = cloneDeep(record)
}

const openAudit = (record: any) => {
  state.isAuditDialog = true
  state.currentRecord = cloneDeep(record)
}

const refresh = () => {
  tableRef.value.reload()
  state.isDetailDialog = false
  state.isAuditDialog = false
}

function getRowItems(row: any) {
  const items = [
    {
      label: '查看详情',
      icon: 'material-symbols:visibility-outline',
      onSelect() {
        openDetail(row.original)
      }
    }
  ]

  // 只有待审核状态才显示审核按钮
  if (row.original.state === 1) {
    items.push({
      label: '审核',
      icon: 'material-symbols:check-circle-outline',
      onSelect() {
        openAudit(row.original)
      }
    })
  }

  return items
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getAgentWithdrawalList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>

  <AgentWithdrawalDetail
    v-model:dialog="state.isDetailDialog"
    :current-record="state.currentRecord"
  />

  <AgentWithdrawalAudit
    v-model:dialog="state.isAuditDialog"
    :current-record="state.currentRecord"
    @refresh="refresh"
  />
</template>
