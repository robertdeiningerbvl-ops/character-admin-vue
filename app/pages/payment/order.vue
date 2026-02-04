<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/payment/order/columns'
import { getPaymentOrderList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'PaymentOrderList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditCoins = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = { state: 2 }
  }
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEditCoins(row.original)
      }
    }

  ]
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
      :data-request="getPaymentOrderList"
      :columns="columns"
      scroll-x="min-w-[1800px]"
    />
  </DashboardLayout>
  <PaymentOrderEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
