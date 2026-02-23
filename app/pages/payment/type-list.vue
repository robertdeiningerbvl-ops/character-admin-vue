<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/payment/type/columns'
import { getPaymentTypeList, removePaymentType } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'PaymentTypeList' })

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2, limit_type: 1 }
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

const delConfirm = (record: any) => {
  dialog.open({
    color: 'error',
    title: '删除通道',
    description: `确定要删除「${record.name}」吗？`,
    onPositiveClick: async () => {
      const { error } = await removePaymentType({ id: record.id })
      if (!error) tableRef.value?.reload()
    }
  })
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'i-lucide-pencil',
      onSelect() {
        openEditModal(row.original)
      }
    },
    { type: 'separator' },
    {
      label: '删除',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect() {
        delConfirm(row.original)
      }
    }
  ]
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    header: '操作',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => h('div', { class: 'text-right' },
      h(UDropdownMenu, { content: { align: 'end' }, items: getRowItems(row) },
        () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', class: 'ml-auto' })
      )
    )
  }
]
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton
        label="新增"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditModal()"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getPaymentTypeList"
      :columns="columns"
      scroll-x="min-w-[1500px]"
    />
  </DashboardLayout>
  <PaymentTypeEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
