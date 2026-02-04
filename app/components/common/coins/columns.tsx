import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['启用', 'success'],
  4: ['删除', 'error']
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
    accessorKey: 'title',
    searchPlaceholder: '筛选标题',
    header: '标题'
  },
  {
    accessorKey: 'coins',
    header: '能量数'
  },
  {
    accessorKey: 'amount',
    header: '原价'
  },
  {
    accessorKey: 'sort',
    header: '排序'
  },
  {
    accessorKey: 'content',
    header: '描述'
  },
  {
    accessorKey: 'state',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[80px]'
      }
    },
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启动',
            value: 2
          },
          {
            label: '关闭',
            value: 4
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: stateEnum[row.original.state]?.[1] }, () =>
        stateEnum[row.original.state]?.[0]
      )
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  }
]
