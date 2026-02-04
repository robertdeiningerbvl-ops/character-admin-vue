import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['启用', 'success'],
  4: ['关闭', 'error']
}

const tyEnum: any = {
  4: ['自建', 'success'],
  3: ['支付宝', 'success'],
  2: ['微信', 'success'],
  1: ['usdt', 'success']
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
    searchPlaceholder: '名称标题',
    header: '名称'
  },
  {
    accessorKey: 'ty',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '自建',
            value: 4
          },
          {
            label: 'usdt',
            value: 3
          },
          {
            label: '微信',
            value: 2
          },
          {
            label: '支付宝',
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
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.updated_at))
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.created_at))
  }
]
