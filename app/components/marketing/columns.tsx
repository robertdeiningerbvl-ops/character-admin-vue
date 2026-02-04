import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'error' | 'success']> = {
  0: ['关闭', 'error'],
  2: ['启用', 'success']
}

const showEnum: Record<number, [string, 'warning' | 'info']> = {
  0: ['隐藏', 'warning'],
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
    accessorKey: 'id',
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
      })
    },
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'name',
    header: '任务名称',
    meta: {
      class: {
        th: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const name = row.original.name
      return h(
        'div',
        { class: 'font-medium text-gray-900 dark:text-white' },
        name || '-'
      )
    }
  },
  {
    accessorKey: 'code',
    header: '编码',
    searchPlaceholder: '搜索任务编码',
    meta: {
      class: {
        th: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const code = row.original.code
      return h(
        'code',
        { class: 'px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300' },
        code || '-'
      )
    }
  },
  {
    accessorKey: 'battery',
    header: '奖励电量',
    meta: {
      class: {
        th: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const battery = row.original.battery
      if (!battery) return '-'
      return h(
        'div',
        { class: 'flex items-center gap-1' },
        [
          h('span', { class: 'text-yellow-600 font-semibold' }, battery),
          h('span', { class: 'text-xs text-gray-500 dark:text-gray-400' }, '⚡')
        ]
      )
    }
  },
  {
    accessorKey: 'num',
    header: '需要次数',
    meta: {
      class: {
        th: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const num = row.original.num
      return h(
        'div',
        { class: 'text-center' },
        h(UBadge, {
          variant: 'soft',
          color: 'neutral'
        }, () => num || 0)
      )
    }
  },
  {
    accessorKey: 'amount',
    header: '奖励金额',
    meta: {
      class: {
        th: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      const amount = row.original.amount
      if (!amount) return '-'
      return h(
        'div',
        { class: 'flex items-center gap-1' },
        [
          h('span', { class: 'text-green-600 font-semibold' }, `¥${amount}`)
        ]
      )
    }
  },
  {
    accessorKey: 'remark',
    header: '任务描述',
    meta: {
      class: {
        th: 'w-[300px]'
      }
    },
    cell: ({ row }) => {
      const remark = row.original.remark
      if (!remark) return h('span', { class: 'text-gray-400 dark:text-gray-500' }, '无描述')

      return h(
        UTooltip,
        { text: remark },
        {
          default: () => h('div', {
            class: 'truncate max-w-[280px] cursor-help text-gray-600 dark:text-gray-400'
          }, remark)
        }
      )
    }
  },
  {
    accessorKey: 'show',
    header: '显示状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: showOptions
      }
    },
    meta: {
      class: {
        th: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const show = row.original.show
      const [label, color] = showEnum[show] || ['未知', 'warning']

      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color
      }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '任务状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: stateOptions
      }
    },
    meta: {
      class: {
        th: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'error']

      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color
      }, () => label)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.updated_at
      return h('div', { class: 'text-gray-500 dark:text-gray-400 text-sm' }, formatToDateTime(time))
    }
  }
]
