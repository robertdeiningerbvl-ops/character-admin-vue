<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/lingdan-withdraw/columns'
import { getLingdanWithdrawList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberLingdanWithdraw'
})

const route = useRoute()
const tableRef = ref()
const UButton = resolveComponent('UButton')

const state = reactive({
  isDialogProcess: false,
  currentForm: {}
})

const openProcessModal = (record: any) => {
  state.isDialogProcess = true
  state.currentForm = cloneDeep(record)
}

const refresh = () => {
  tableRef.value.reload()
  state.isDialogProcess = false
}

// 搜索条件由 DynamicTable 从地址栏读取（如从用户列表跳转带 ?uid=）
watch(() => route.query.uid, () => {
  tableRef.value?.reload()
})

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    cell: ({ row }) => {
      if (row.original.state !== 0) return null
      return h(UButton, {
        size: 'sm',
        color: 'primary',
        variant: 'soft',
        label: '处理',
        onClick: () => openProcessModal(row.original)
      })
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getLingdanWithdrawList"
      :columns="columns"
      scroll-x="min-w-[1400px]"
    />
  </DashboardLayout>
  <MemberLingdanWithdrawProcess
    v-model:dialog="state.isDialogProcess"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
