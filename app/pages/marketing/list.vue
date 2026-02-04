<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '~/components/marketing/columns'
import { getMarketingList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MarketingList' })

const tableRef = ref()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : {}
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'i-lucide-edit',
      onSelect() {
        openEditModal(row.original)
      }
    }
  ]
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    header: '操作',
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
      :data-request="getMarketingList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>

  <MarketingEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
