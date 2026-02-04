<script setup lang="ts">
// import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/wallet/columns'
import { getMemberWalletLogList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberWalletLogList'
})

const tableRef = ref()
// const UDropdownMenu = resolveComponent('UDropdownMenu')
// const UButton = resolveComponent('UButton')

// const state = reactive({
//   isDialog: false,
//   currentForm: {}
// })

const columns: TableColumnList = [
  ...baseColumns
  // {
  //   id: 'actions',
  //   meta: {
  //     class: {
  //       th: 'w-[80px]',
  //       td: 'w-[80px]'
  //     }
  //   },
  //   cell: ({ row }) => {
  //     return h(
  //       'div',
  //       { class: 'text-right' },
  //       h(
  //         UDropdownMenu,
  //         {
  //           content: {
  //             align: 'end'
  //           }
  //           // items: getRowItems(row)
  //         },
  //         () =>
  //           h(UButton, {
  //             icon: 'i-lucide-ellipsis-vertical',
  //             color: 'neutral',
  //             variant: 'ghost',
  //             class: 'ml-auto'
  //           })
  //       )
  //     )
  //   }
  // }
]
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getMemberWalletLogList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
</template>
