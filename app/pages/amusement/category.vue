<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '~/components/amusement/category/columns'
import { getAmusementCategoryList, removeAmusementCategory } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AmusementCategoryList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const state = reactive({
  isDialog: false,
  currentForm: {},
  totalCount: 0
})

const openEditCoins = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    // 新增时获取当前总数
    const { data } = await getAmusementCategoryList({ page: 1, pagesize: 1 })
    state.totalCount = data?.count || 0
    state.currentForm = { state: 2 }
  }
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeAmusementCategory({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEditCoins(row.original)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '删除',
      icon: 'material-symbols:contract-delete-outline-rounded',
      color: 'error',
      onSelect() {
        dialog.open({
          color: 'error',
          title: '删除数据',
          description: '您确定要删除吗？',
          onPositiveClick() {
            delRowConfirm(row.original)
          }
        })
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
    <template #actions>
      <UButton
        label="新增"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditCoins(null)"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getAmusementCategoryList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
  <AmusementCategoryEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :total-count="state.totalCount"
    @refresh="refresh"
  />
</template>
