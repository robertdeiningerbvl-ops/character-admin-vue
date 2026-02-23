import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const stateEnum: Record<number, [string, string]> = {
  2: ['启用', 'success'],
  4: ['已删除', 'error']
}

const tyEnum: Record<number, [string, string, string]> = {
  0: ['系统', 'info', 'i-lucide-settings'],
  1: ['业务', 'success', 'i-lucide-tag']
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
    header: '名称',
    searchPlaceholder: '标签名称',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } },
    cell: ({ row }) => {
      const { name, ty } = row.original
      const tyInfo = tyEnum[ty] || ['未知', 'neutral', 'i-lucide-tag']
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: `w-7 h-7 rounded-lg flex items-center justify-center bg-${tyInfo[1]}-500/10` }, [
          h(UIcon, { name: tyInfo[2], class: `w-4 h-4 text-${tyInfo[1]}-500` })
        ]),
        h('span', { class: 'font-medium' }, name || '-')
      ])
    }
  },
  {
    accessorKey: 'ty',
    header: '类型',
    searchPlaceholder: '筛选类型',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '系统', value: 0 },
          { label: '业务', value: 1 }
        ]
      }
    },
    cell: ({ row }) => {
      const tyInfo = tyEnum[row.original.ty]
      if (!tyInfo) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, { variant: 'subtle', color: tyInfo[1] }, () => tyInfo[0])
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
          { label: '启用', value: 2 },
          { label: '已删除', value: 4 }
        ]
      }
    },
    cell: ({ row }) => {
      const stateInfo = stateEnum[row.original.state]
      if (!stateInfo) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, { variant: 'subtle', color: stateInfo[1] }, () => stateInfo[0])
    }
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
  }
]
