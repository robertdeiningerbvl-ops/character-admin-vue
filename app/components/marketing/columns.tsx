import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'error' | 'success']> = {
  0: ['关闭', 'error'],
  2: ['启用', 'success']
}

const showEnum: Record<number, [string, 'neutral' | 'info']> = {
  0: ['隐藏', 'neutral'],
  2: ['显示', 'info']
}

const stateOptions = [
  { label: '关闭', value: 0 },
  { label: '启用', value: 2 }
]

const showOptions = [
  { label: '隐藏', value: 0 },
  { label: '显示', value: 2 }
]

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'name',
    header: '任务名称',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-zap w-4 h-4 text-(--ui-warning)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.name || '-')
      ])
    }
  },
  {
    accessorKey: 'code',
    header: '编码',
    searchPlaceholder: '搜索任务编码',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      const code = row.original.code
      if (!code) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, code)
    }
  },
  {
    accessorKey: 'battery',
    header: '奖励电量',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const battery = row.original.battery
      if (!battery) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-battery-charging w-4 h-4 text-(--ui-warning)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, battery)
      ])
    }
  },
  {
    accessorKey: 'num',
    header: '需要次数',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const num = row.original.num
      return h(UBadge, {
        variant: 'subtle',
        color: 'neutral'
      }, () => `${num || 0} 次`)
    }
  },
  {
    accessorKey: 'amount',
    header: '奖励金额',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const amount = row.original.amount
      if (!amount) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-coins w-4 h-4 text-(--ui-success)' }),
        h('span', { class: 'font-medium text-(--ui-success)' }, `¥${amount}`)
      ])
    }
  },
  {
    accessorKey: 'remark',
    header: '任务描述',
    cell: ({ row }) => {
      const remark = row.original.remark
      if (!remark) return h('span', { class: 'text-(--ui-text-muted)' }, '无描述')
      return h(UTooltip, { text: remark }, {
        default: () => h('div', {
          class: 'truncate max-w-[200px] cursor-help text-(--ui-text-muted)'
        }, remark)
      })
    }
  },
  {
    accessorKey: 'show',
    header: '显示状态',
    formItemProps: {
      component: 'Select',
      componentProps: { options: showOptions }
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = showEnum[row.original.show] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '任务状态',
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
      const [label, color] = stateEnum[row.original.state] || ['未知', 'error']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
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
