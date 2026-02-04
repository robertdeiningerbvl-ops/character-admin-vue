import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const actionEnum: any = {
  1: ['登录', 'info'],
  2: ['新增', 'success'],
  3: ['修改', 'warning'],
  4: ['删除', 'error'],
  5: ['查看', 'neutral'],
  6: ['导出', 'primary'],
  7: ['其他', 'secondary']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
      })
    }
  },
  {
    accessorKey: 'username',
    searchPlaceholder: '筛选管理员',
    header: '管理员',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.username || '-')
    }
  },
  {
    accessorKey: 'action',
    header: '操作类型',
    searchPlaceholder: '筛选操作类型',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '登录',
            value: 1
          },
          {
            label: '新增',
            value: 2
          },
          {
            label: '修改',
            value: 3
          },
          {
            label: '删除',
            value: 4
          },
          {
            label: '查看',
            value: 5
          },
          {
            label: '导出',
            value: 6
          },
          {
            label: '其他',
            value: 7
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color: actionEnum[row.original.action]?.[1] || 'neutral'
      }, () => actionEnum[row.original.action]?.[0] || row.original.action || '-')
    }
  },
  {
    accessorKey: 'module',
    searchPlaceholder: '筛选模块',
    header: '操作模块',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'description',
    header: '操作详情',
    cell: ({ row }) => {
      const desc = row.original.description || row.original.remark || '-'
      return h('div', {
        class: 'truncate max-w-[300px] text-sm text-(--ui-text-muted)',
        title: desc
      }, desc)
    }
  },
  {
    accessorKey: 'ip',
    searchPlaceholder: '筛选IP',
    header: 'IP地址',
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'font-mono text-sm' }, row.original.ip || '-')
    }
  },
  {
    accessorKey: 'created_at',
    header: '操作时间',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  }
]
