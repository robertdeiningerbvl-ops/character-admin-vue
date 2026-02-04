import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['启用', 'success'],
  4: ['删除', 'error']
}

const tyEnum: any = {
  1: ['业务', 'success'],
  0: ['系统', 'error']
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
    accessorKey: 'name',
    searchPlaceholder: '筛选名称',
    header: '名称'
  },
  {
    accessorKey: 'ty',
    searchPlaceholder: '筛选类型',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '系统',
            value: 0
          },
          {
            label: '业务',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: tyEnum[row.original.ty]?.[1] }, () =>
        tyEnum[row.original.ty]?.[0]
      )
    }
  },
  {
    accessorKey: 'state',
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
