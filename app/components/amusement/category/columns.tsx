import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  1: ['启用', 'success'],
  2: ['待审核', 'error'],
  4: ['已删除', 'error']
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
    searchPlaceholder: '类型名称',
    header: '类型名称',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => h(UTooltip, {
      text: row.original.name,
      ui: { content: 'max-w-[100px] h-auto', text: 'whitespace-pre-wrap break-all select-text' }
    }, () => {
      return h('div', {
        class: 'truncate'
      }, row.original.name)
    }
    )
  },
  {
    accessorKey: 'rating',
    header: '可评分值',
    cell: ({ row }) => {
      return h(UBadge,
        { variant: 'outline', color: 'info' },
        () => row.original.rating
      )
    }
  },
  {
    accessorKey: 'hint',
    header: '提示限制',
    cell: ({ row }) => {
      return h(UBadge,
        { variant: 'outline', color: 'primary' },
        () => row.original.hint
      )
    }
  },
  {
    accessorKey: 'content',
    header: '规则',
    meta: {
      class: {
        th: 'w-[250px]',
        td: 'w-[250px]'
      }
    },
    cell: ({ row }) => h(UTooltip, {
      text: row.original.content,
      ui: { content: 'max-w-[250px] h-auto', text: 'whitespace-pre-wrap break-all select-text' }
    }, () => {
      return h('div', {
        class: 'truncate'
      }, row.original.content)
    }
    )
  },
  {
    accessorKey: 'created_at',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
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
    searchPlaceholder: '筛选状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '待审核',
            value: 2
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '已删除',
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
  }
]
