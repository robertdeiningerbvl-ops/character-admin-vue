import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const stateEnum: Record<number, [string, string]> = {
  1: ['启用', 'success'],
  2: ['待审核', 'warning'],
  4: ['已删除', 'error']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-(--ui-text-muted)' }, row.original.id)
  },
  {
    accessorKey: 'name',
    header: '分类名称',
    searchPlaceholder: '分类名称',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: 'w-7 h-7 rounded-lg flex items-center justify-center bg-primary-500/10' }, [
          h(UIcon, { name: 'i-lucide-folder', class: 'w-4 h-4 text-primary-500' })
        ]),
        h('span', { class: 'font-medium' }, row.original.name || '-')
      ])
    }
  },
  {
    accessorKey: 'rating',
    header: '可评分值',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h(UBadge, { variant: 'subtle', color: 'info' }, () => row.original.rating)
  },
  {
    accessorKey: 'hint',
    header: '提示限制',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h(UBadge, { variant: 'subtle', color: 'primary' }, () => row.original.hint)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('span', { class: 'text-xs text-(--ui-text-muted)' }, formatToDateTime(time))
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '筛选状态',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '待审核', value: 2 },
          { label: '已删除', value: 4 }
        ]
      }
    },
    cell: ({ row }) => {
      const stateInfo = stateEnum[row.original.state]
      if (!stateInfo) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, { variant: 'subtle', color: stateInfo[1] }, () => stateInfo[0])
    }
  }
]
