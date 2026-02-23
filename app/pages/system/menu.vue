<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/system/menu/columns'
import { getMenuList, deleteMenu } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'SystemMenu'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const { hasPermission } = usePermission()

const state = reactive({
  isDialog: false,
  currentForm: {},
  menu: [] as any,
  pidOptions: [] as any
})

const sortMenu = (routes: any[]) => {
  return routes
    .sort(
      (next, pre) => (next.sort ? Number(next.sort) : 0) - (pre.sort ? Number(pre.sort) : 0)
    )
    .map((i) => {
      if (i.children) sortMenu(i.children)
      return i
    })
}

const loadTableData = async () => {
  const { data } = await getMenuList()
  if (data) {
    state.menu = [
      {
        value: 0,
        label: '一级菜单',
        children: sortMenu(formatMenu2Tree(
          cloneDeep(data.list).filter((n: { ty: number }) => n.ty !== 2),
          null
        ))
      }
    ]
    state.pidOptions = [
      { value: 0,
        label: '一级菜单'
      }, ...cloneDeep(data.list).map((item: any) => {
        return {
          value: item.id,
          label: item.name
        }
      })]
    return {
      error: null,
      data: { list: sortMenu(formatMenu2Tree(cloneDeep(data.list), null)) }
    }
  }

  return {
    error: null,
    data: {
      list: []
    }
  }
}

const openEditModal = async (record: any) => {
  state.isDialog = true
  if (record) {
    const currentForm = cloneDeep(record)
    currentForm.pid = currentForm.pid ?? 0
    currentForm.perms = currentForm.perms ? currentForm.perms.split(',') : []
    state.currentForm = currentForm
  } else {
    state.currentForm = { ty: 0, pid: 0, sort: 0, keepalive: 1, is_show: 1 }
  }
}

const refresh = async () => {
  state.isDialog = false
  tableRef.value.reload()
}

const delRowConfirm = async (record: any) => {
  const { error } = await deleteMenu({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      disabled: !hasPermission('rbac-menu-edit'),
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
      disabled: !hasPermission('rbac-menu-remove'),
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
      <div v-permission="'rbac-menu-add'">
        <UButton
          label="新增"
          icon="i-lucide-plus"
          color="neutral"
          @click="openEditModal(null)"
        />
      </div>
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="loadTableData"
      :columns="columns"
      :default-page-size="100"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
  <SystemMenuEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :menu="state.menu"
    :pid-options="state.pidOptions"
    @refresh="refresh"
  />
</template>
