import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')

const stateEnum: Record<number, [string, 'success' | 'error' | 'neutral']> = {
  1: ['正常', 'success'],
  2: ['删除', 'error']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'uid',
    header: 'UID',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => h('span', { class: 'font-mono text-(--ui-text-muted)' }, `#${row.original.uid}`)
  },
  {
    accessorKey: 'title',
    header: '标题',
    cell: ({ row }) => h('span', { class: 'text-sm font-medium text-(--ui-text-highlighted)' }, row.original.title)
  },
  {
    accessorKey: 'state',
    header: '状态',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[190px]',
        td: 'w-[190px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  }
]
