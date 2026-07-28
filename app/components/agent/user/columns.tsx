import { h, resolveComponent } from 'vue'
import type { DataTableColumn } from '@/types/table'
import type { AgentUserItem } from '@/api/modules/agent'

export type TableColumnList = DataTableColumn<AgentUserItem>[]

const UBadge = resolveComponent('UBadge')

const stateEnum: Record<number, { label: string, color: string }> = {
  1: { label: '开放', color: 'success' },
  2: { label: '冻结', color: 'neutral' }
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'username',
    header: '用户名',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm'
    }, row.original.username || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'code',
    header: '代理编码',
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-blue-600 dark:text-blue-400'
    }, row.original.code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'parent_code',
    header: '上级代理',
    cell: ({ row }) => h('span', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, row.original.parent_code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'balance',
    header: '余额',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-green-600 dark:text-green-400'
    }, `¥${row.original.balance?.toFixed(2) || '0.00'}`),
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    cell: ({ row }) => {
      const stateInfo = stateEnum[row.original.state] || { label: '未知', color: 'neutral' }
      return h(UBadge, {
        label: stateInfo.label,
        color: stateInfo.color,
        size: 'sm'
      })
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'commission_ratio',
    header: '佣金比例',
    cell: ({ row }) => h('span', {
      class: 'text-sm'
    }, `${row.original.commission_ratio || 0}%`),
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
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => h('span', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, row.original.updated_at || '-'),
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    }
  }
]
