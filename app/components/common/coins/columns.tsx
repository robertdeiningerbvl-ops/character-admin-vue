import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'success' | 'error']> = {
  2: ['启用', 'success'],
  4: ['删除', 'error']
}

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '关闭', value: 4 }
]

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-[60px]',
        td: 'w-[60px]'
      }
    },
    cell: ({ row }) => {
      return h('span', { class: 'text-(--ui-text-muted) font-mono text-sm' }, `#${row.original.id}`)
    }
  },
  {
    accessorKey: 'title',
    header: '套餐名称',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-package w-4 h-4 text-(--ui-primary)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.title || '-')
      ])
    }
  },
  {
    accessorKey: 'coins',
    header: '能量',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-zap w-4 h-4 text-(--ui-warning)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.coins || 0)
      ])
    }
  },
  {
    accessorKey: 'gift_coins',
    header: '赠送能量',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const gift = row.original.gift_coins
      if (!gift) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-gift w-4 h-4 text-(--ui-success)' }),
        h('span', { class: 'font-medium text-(--ui-success)' }, `+${gift}`)
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: '价格',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      return h('span', { class: 'font-medium text-(--ui-primary)' }, `¥${row.original.amount || 0}`)
    }
  },
  {
    accessorKey: 'recommend_desc',
    header: '推荐标签',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const desc = row.original.recommend_desc
      if (!desc) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, { variant: 'subtle', color: 'warning' }, () => desc)
    }
  },
  {
    accessorKey: 'sort',
    header: '排序',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      return h('span', { class: 'text-(--ui-text-muted)' }, row.original.sort || 0)
    }
  },
  {
    accessorKey: 'content',
    header: '描述',
    cell: ({ row }) => {
      const content = row.original.content
      if (!content) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UTooltip, { text: content }, {
        default: () => h('div', { class: 'truncate max-w-[180px] text-(--ui-text-muted)' }, content)
      })
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: { options: stateOptions }
    },
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'error']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.updated_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-clock w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(time))
      ])
    }
  }
]
