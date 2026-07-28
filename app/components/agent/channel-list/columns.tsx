import { h } from 'vue'
import type { DataTableColumn } from '@/types/table'
import type { AgentChannelListItem } from '@/api/modules/agent'

export type TableColumnList = DataTableColumn<AgentChannelListItem>[]

export const columns: TableColumnList = [
  {
    accessorKey: 'channel_id',
    header: '渠道编码',
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-blue-600 dark:text-blue-400'
    }, row.original.channel_id?.toString() || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-gray-900 dark:text-gray-100'
    }, row.original.agent_code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
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
