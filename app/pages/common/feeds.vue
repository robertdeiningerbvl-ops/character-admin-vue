<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/feed/columns'
import { getCommonFeedList, removeCommonFeed } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'FeedList'
})
const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = async (record: any) => {
  state.isDialog = true
  state.currentForm = cloneDeep(record)
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeCommonFeed({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  return [
    {
      label: '回复',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEditModal(row.original)
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
          title: '删除反馈',
          description: '您确定要删除这条反馈吗？',
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
    cell: ({ row }: any) => {
      return h(
        'div',
        { class: 'text-right' },
        h(UDropdownMenu, {
          items: getRowItems(row)
        }, {
          default: () => h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            icon: 'lucide:more-vertical'
          })
        })
      )
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <DynamicTable
      ref="tableRef"
      :data-request="getCommonFeedList"
      :columns="columns"
      scroll-x="min-w-[800px]"
    />
  </DashboardLayout>
  <FeedEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
