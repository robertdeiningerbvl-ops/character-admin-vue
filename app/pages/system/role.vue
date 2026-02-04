<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/system/role/columns'
import { getMenuList, getAdminGroupMenuList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'SystemRole'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const { hasPermission } = usePermission()

const state = reactive({
  isDialog: false,
  currentForm: {},
  menu: [] as any
})

// 列表数据
const loadTableData = async () => {
  const list = [
    { id: 1, name: '管理员', group_id: 1 },
    { id: 2, name: '运营', group_id: 5 },
    { id: 3, name: '超级管理员', group_id: 99 }
  ]
  return {
    error: null,
    data: {
      list
    }
  }
}

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

const getCheckedKeys = (checkedList: number[], options: any[], total = []): any => {
  return options.reduce<number[]>((prev, curr) => {
    if (checkedList.includes(curr.key)) {
      prev.push(curr.key)
    }
    if (curr.children?.length) {
      getCheckedKeys(checkedList, curr.children, total)
    }
    return prev
  }, total)
}

const getMenu = (routes: any[], checkedKeys: any[], parentRoute: any = null): any => {
  const globalMenu: any[] = []
  routes.forEach((route) => {
    let menuChildren: any | undefined
    if (route.children && route.children.length > 0) {
      menuChildren = getMenu(route.children, checkedKeys, route)
    }

    globalMenu.push({
      label: route.name,
      value: route.id,
      checked: menuChildren ? menuChildren.checked : checkedKeys.includes(route.id),
      children: menuChildren ? menuChildren.children : undefined
    })
  })

  let _checked: boolean | 'indeterminate' = 'indeterminate'
  if (parentRoute) {
    let checkedNum = 0
    globalMenu.forEach((item: any) => {
      if (item.checked === true) {
        checkedNum++
      }
    })
    if (checkedNum === globalMenu.length) {
      _checked = true
    } else if (checkedNum === 0) {
      _checked = false
    }
  }

  return {
    checked: _checked,
    children: globalMenu
  }
}

const openEditModal = async (record: any) => {
  state.isDialog = true
  state.currentForm = { name: record.name, group_id: String(record.group_id) }
  state.menu = []
  const res = await Promise.allSettled([getMenuList(), getAdminGroupMenuList({ group_id: record.group_id })])
  if (res[0].status === 'fulfilled' && res[0].value.data && res[1].status === 'fulfilled' && res[1].value.data) {
    const menuTree = sortMenu(formatMenu2Tree(res[0].value.data.list))
    const checkedMenu = res[1].value.data.menus.map((n: { id: any }) => n.id)
    const checkedKeys = getCheckedKeys(checkedMenu, menuTree)
    state.menu = getMenu(menuTree, checkedKeys).children
  }
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

function getRowItems(row: any) {
  return [
    {
      label: '分配权限',
      icon: 'material-symbols:edit-square-outline',
      disabled: !hasPermission('rbac-group-add'),
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
      :data-request="loadTableData"
      :columns="columns"
      :default-page-size="100"
    />
  </DashboardLayout>
  <SystemRoleEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :menu="state.menu"
    @refresh="refresh"
  />
</template>
