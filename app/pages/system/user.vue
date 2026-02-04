<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/system/user/columns'
import { getAdminList, removeAdmin } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'SystemUser'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const { hasPermission } = usePermission()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = { group_id: 5, state: 2 }
  }
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeAdmin({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      disabled: !hasPermission('admin-edit'),
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
      disabled: !hasPermission('admin-remove'),
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
        th: 'w-[100px]',
        td: 'w-[100px]'
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
      <div v-permission="'admin-add'">
        <UButton
          label="新增"
          icon="i-lucide-plus"
          @click="openEditModal(null)"
        />
      </div>
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getAdminList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
  <SystemUserEdit v-model:dialog="state.isDialog" :current-form="state.currentForm" @refresh="refresh" />
</template>
