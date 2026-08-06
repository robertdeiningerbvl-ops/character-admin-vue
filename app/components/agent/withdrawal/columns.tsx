import { h, resolveComponent } from 'vue'
import type { DataTableColumn } from '@/types/table'
import type { AgentWithdrawalItem } from '@/api/modules/agent'
import { formatToDateTime } from '@/utils/common/date'

export type TableColumnList = DataTableColumn<AgentWithdrawalItem>[]

const UBadge = resolveComponent('UBadge')

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateEnum: Record<number, { label: string, color: BadgeColor }> = {
  1: { label: '待审核', color: 'warning' },
  2: { label: '审核通过', color: 'info' },
  3: { label: '已打款', color: 'primary' },
  4: { label: '已完成', color: 'success' },
  '-1': { label: '审核拒绝', color: 'error' },
  '-2': { label: '已取消', color: 'neutral' }
}

const withdrawTypeEnum: Record<number, string> = {
  1: '银行卡',
  2: '支付宝',
  3: '微信'
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'order_no',
    header: '订单号',
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm text-blue-600 dark:text-blue-400'
    }, row.original.order_no || '-'),
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    }
  },
  {
    accessorKey: 'agent_code',
    header: '代理编码',
    cell: ({ row }) => h('span', {
      class: 'font-mono text-sm'
    }, row.original.agent_code || '-'),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'amount',
    header: '提现金额',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-green-600 dark:text-green-400'
    }, `¥${row.original.amount?.toFixed(2) || '0.00'}`),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'actual_amount',
    header: '实际到账',
    cell: ({ row }) => h('span', {
      class: 'font-medium text-sm text-blue-600 dark:text-blue-400'
    }, `¥${row.original.actual_amount?.toFixed(2) || '0.00'}`),
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'withdraw_type',
    header: '提现方式',
    cell: ({ row }) => h('span', {
      class: 'text-sm'
    }, withdrawTypeEnum[row.original.withdraw_type] || '-'),
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
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => h('span', {
      class: 'text-sm text-gray-600 dark:text-gray-400'
    }, formatToDateTime(row.original.created_at) || '-'),
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    }
  }
]
