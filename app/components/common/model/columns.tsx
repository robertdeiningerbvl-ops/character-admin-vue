import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['启用', 'success'],
  1: ['关闭', 'error']
}

const streamEnum: any = {
  2: ['是', 'success'],
  1: ['否', 'error']
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
    searchPlaceholder: '筛选模型名称',
    header: '模型名称'
  },
  {
    accessorKey: 'f',
    header: '模型标识'
  },
  {
    accessorKey: 'm',
    header: 'm'
  },
  {
    accessorKey: 'description',
    header: '描述'
  },
  {
    accessorKey: 'uri',
    header: '请求地址'
  },
  {
    accessorKey: 'preset_name',
    header: '模型预设名称'
  },
  {
    accessorKey: 'stream',
    header: '是否流式',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '是',
            value: 2
          },
          {
            label: '否',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: streamEnum[row.original.stream]?.[1] }, () =>
        streamEnum[row.original.stream]?.[0]
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
            value: 1
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
