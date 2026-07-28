import { h, resolveComponent } from 'vue'
import type { DataTableColumn } from '@/types/table'
import type { AgentChannelAttrsItem } from '@/api/modules/agent'

export type TableColumnList = DataTableColumn<AgentChannelAttrsItem>[]

const UButton = resolveComponent('UButton')

/**
 * 汇总统计表格列配置
 */
export const summaryColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
    }),
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-gray-600 dark:text-gray-400'
    }, `#${row.original.id}`),
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm'
    }, row.original.agent_code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'channel_id',
    header: '渠道ID',
    cell: ({ row }) => h('span', {
      class: 'text-sm'
    }, row.original.channel_id || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'consume_amount',
    header: '消费金额',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-blue-600 dark:text-blue-400'
    }, `¥${row.original.consume_amount || '0.00'}`),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'profit',
    header: '利润',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-green-600 dark:text-green-400'
    }, `¥${row.original.profit || '0.00'}`),
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => h('span', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, row.original.created_at || '-'),
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    }
  }
]

/**
 * 每日明细表格列配置
 */
export const dailyColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
    }),
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-gray-600 dark:text-gray-400'
    }, `#${row.original.id}`),
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm'
    }, row.original.agent_code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'channel_id',
    header: '渠道ID',
    cell: ({ row }) => h('span', {
      class: 'text-sm'
    }, row.original.channel_id || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'consume_amount',
    header: '消费金额',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-blue-600 dark:text-blue-400'
    }, `¥${row.original.consume_amount || '0.00'}`),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'profit',
    header: '利润',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-green-600 dark:text-green-400'
    }, `¥${row.original.profit || '0.00'}`),
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'day_time',
    header: '日期',
    cell: ({ row }) => h('span', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, row.original.day_time || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  }
]
