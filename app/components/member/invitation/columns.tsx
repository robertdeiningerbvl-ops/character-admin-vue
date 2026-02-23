import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'warning' | 'success']> = {
  0: ['未使用', 'warning'],
  2: ['已使用', 'success']
}

const stateOptions = [
  { label: '未使用', value: 0 },
  { label: '已使用', value: 2 }
]

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      return h('span', { class: 'text-(--ui-text-muted) font-mono text-sm' }, `#${row.original.id}`)
    }
  },
  {
    accessorKey: 'uid',
    header: '用户',
    searchPlaceholder: '请输入用户ID',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const member = row.original.member
      const uid = row.original.uid
      if (!uid || !member?.id) {
        return h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'text-sm text-(--ui-text-muted)' }, '系统'),
          h(UTooltip, { text: '受限领次数限制' }, {
            default: () => h(UBadge, { variant: 'subtle', color: 'primary', class: 'w-fit mt-1 cursor-help' }, () => '系统邀请码')
          })
        ])
      }
      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'text-sm font-medium text-(--ui-text-highlighted) truncate max-w-[120px]' }, member.username || '未知'),
        h(UTooltip, { text: '不受限领次数限制' }, {
          default: () => h(UBadge, { variant: 'subtle', color: 'success', class: 'w-fit mt-0.5 cursor-help' }, () => '个人邀请码')
        })
      ])
    }
  },
  {
    accessorKey: 'code',
    searchPlaceholder: '请输入兑换码',
    header: '兑换码',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const code = row.original.code
      if (!code) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-primary)'
      }, code)
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
      const coins = row.original.coins
      if (!coins) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-zap w-4 h-4 text-(--ui-warning)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, coins)
      ])
    }
  },
  {
    accessorKey: 'num',
    header: '张数',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const num = row.original.num
      return h(UBadge, { variant: 'subtle', color: 'info' }, () => `${num || 0} 张`)
    }
  },
  {
    accessorKey: 'limit',
    header: '限领次数',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const limit = row.original.limit
      return h(UBadge, { variant: 'subtle', color: 'neutral' }, () => `${limit || 0} 次`)
    }
  },
  {
    accessorKey: 'state',
    header: '使用状态',
    formItemProps: {
      component: 'Select',
      componentProps: { options: stateOptions }
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'warning']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'remark',
    header: '备注',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      const remark = row.original.remark
      if (!remark) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UTooltip, { text: remark }, {
        default: () => h('div', { class: 'truncate max-w-[140px] text-(--ui-text-muted)' }, remark)
      })
    }
  },
  {
    accessorKey: 'expire',
    header: '有效期',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.expire
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-calendar w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(time))
      ])
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-clock w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(time))
      ])
    }
  }
]
