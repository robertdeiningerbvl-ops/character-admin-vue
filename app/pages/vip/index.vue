<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/common/vip/columns'
import { getCommonVipList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'VipList' })

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const getSortedVipList = async (params?: any) => {
  const result = await getCommonVipList(params)
  const list = result.data?.list
  if (Array.isArray(list)) {
    list.sort((a: any, b: any) => Number(b.sort ?? 0) - Number(a.sort ?? 0))
  }
  return result
}

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2 }
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'i-lucide-pencil',
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
        label="新增套餐"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditModal()"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getSortedVipList"
      :columns="columns"
      :search="false"
      scroll-x="min-w-[1100px]"
    />
  </DashboardLayout>

  <CommonVipEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
