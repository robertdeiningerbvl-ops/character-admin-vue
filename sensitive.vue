<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/common/sensitive/columns'
import { getCommonSensitiveList, removeCommonSensitive } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'SensitiveList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEdit = async (record: any) => {
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

const delRowConfirm = async (record: any) => {
  const { error } = await removeCommonSensitive({ id: record.id })
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
        openEdit(row.original)
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
          title: '删除敏感词',
          description: '您确定要删除这个敏感词吗？',
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
        color="success"
        @click="openEdit(null)"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getCommonSensitiveList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
  <CommonSensitiveEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
