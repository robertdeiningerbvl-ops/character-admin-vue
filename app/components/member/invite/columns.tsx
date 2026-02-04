import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const stateEnum: Record<number, [string, string]> = {
  1: ['待领取', 'warning'],
  2: ['已发放', 'success'],
  3: ['已失效', 'neutral']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'uid',
    header: '邀请人ID',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'target_uid',
    header: '被邀请人ID',
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    }
  },
  {
    accessorKey: 'invitation_code',
    header: '邀请码',
    cell: ({ row }) => {
      const code = row.original.invitation_code
      if (!code) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'i-material-symbols-qr-code-2 w-4 h-4 text-primary-500' }),
        h('span', { class: 'font-mono text-sm font-medium text-gray-900 dark:text-white' }, code)
      ])
    },
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    }
  },
  {
    accessorKey: 'amount',
    searchPlaceholder: '筛选充值金额',
    header: '充值金额',
    cell: ({ row }) => {
      const amount = row.original.amount
      if (!amount || amount === 0) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-monetization-on-outline w-4 h-4 text-green-600' }),
        h('span', { class: 'font-semibold text-green-700 dark:text-green-400' }, `¥${amount}`)
      ])
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'battery',
    header: '奖励电量',
    cell: ({ row }) => {
      const battery = row.original.battery
      if (!battery || battery === 0) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-bolt w-4 h-4 text-yellow-600' }),
        h('span', { class: 'font-semibold text-yellow-700 dark:text-yellow-400' }, battery)
      ])
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'grant_amount',
    header: '奖励金额',
    cell: ({ row }) => {
      const grantAmount = row.original.grant_amount
      if (!grantAmount || grantAmount === 0) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-card-giftcard w-4 h-4 text-blue-600' }),
        h('span', { class: 'font-semibold text-blue-700 dark:text-blue-400' }, `¥${grantAmount}`)
      ])
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge')
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'neutral']
      return h(UBadge, { color, variant: 'subtle', size: 'md' }, () => label)
    },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '待领取',
            value: 1
          },
          {
            label: '已发放',
            value: 2
          },
          {
            label: '已失效',
            value: 3
          }
        ]
      }
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
    meta: {
      class: {
        th: 'w-[180px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  }
]
