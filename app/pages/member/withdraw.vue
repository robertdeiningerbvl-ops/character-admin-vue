<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/withdraw/columns'
import { getMemberWithdrawList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberWithdrawList'
})

const route = useRoute()
const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const state = reactive({
  isDialogAudit: false,
  currentForm: {}
})

const openAuditModal = (record: any) => {
  state.isDialogAudit = true
  state.currentForm = cloneDeep(record)
}

const refresh = () => {
  tableRef.value.reload()
  state.isDialogAudit = false
}

function getRowItems(row: any) {
  return [
    {
      label: '审核',
      icon: 'material-symbols:check-circle-outline',
      onSelect() {
        openAuditModal(row.original)
      }
    }
  ]
}

const extraParams = computed(() => {
  const params: any = {}
  if (route.query.uid) {
    params.uid = route.query.uid
  }
  return params
})

const defaultSearchParams = computed(() => {
  const params: any = {}
  if (route.query.uid) {
    params.uid = route.query.uid
  }
  return params
})

watch(() => route.query.uid, () => {
  tableRef.value?.reload()
})

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
      if (row.original.state !== 0) return null
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
      :data-request="getMemberWithdrawList"
      :columns="columns"
      :default-search-params="defaultSearchParams"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
  <MemberWithdrawAudit
    v-model:dialog="state.isDialogAudit"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
