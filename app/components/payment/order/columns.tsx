import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  0: ['待支付', 'warning'],
  2: ['已支付', 'success']
}

const tyEnum: any = {
  4: ['自建', 'primary'],
  3: ['支付宝', 'info'],
  2: ['微信', 'success'],
  1: ['USDT', 'warning']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
    }),
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600 dark:text-gray-400' }, `#${row.original.id}`),
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'member.username',
    searchPlaceholder: '请输入用户名',
    header: '用户信息',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      const username = row.original.member?.username
      const uid = row.original.uid
      if (!username) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'space-y-0.5' }, [
        h('div', { class: 'font-medium text-gray-900 dark:text-white text-sm' }, username),
        h('div', { class: 'text-xs text-gray-500' }, `ID: ${uid || '-'}`)
      ])
    }
  },
  {
    accessorKey: 'order_sn',
    searchPlaceholder: '请输入订单号',
    header: '订单号',
    cell: ({ row }) => {
      const orderSn = row.original.order_sn
      if (!orderSn) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, orderSn)
    },
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    }
  },
  {
    accessorKey: 'trade_no',
    searchPlaceholder: '请输入支付单号',
    header: '支付单号',
    cell: ({ row }) => {
      const tradeNo = row.original.trade_no
      if (!tradeNo) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'font-mono text-xs text-gray-600 dark:text-gray-400' }, tradeNo)
    },
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    }
  },
  {
    accessorKey: 'coins',
    header: '能量',
    cell: ({ row }) => {
      const coins = row.original.coins || 0
      return h('span', { class: 'font-semibold text-yellow-600 dark:text-yellow-400' }, coins)
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'order_amount',
    header: '订单金额',
    cell: ({ row }) => {
      const amount = row.original.order_amount || 0
      return h('span', { class: 'font-semibold text-gray-900 dark:text-white' }, `¥${amount}`)
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'real_amount',
    header: '实付金额',
    cell: ({ row }) => {
      const realAmount = row.original.real_amount || 0
      return h('span', { class: 'font-semibold text-green-600 dark:text-green-400' }, `¥${realAmount}`)
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
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
      if (!remark) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'text-sm text-gray-600 dark:text-gray-300 truncate' }, remark)
    }
  },
  {
    accessorKey: 'payment_type_name',
    header: '支付类型',
    cell: ({ row }) => {
      const typeName = row.original.payment_type_name
      if (!typeName) return h('span', { class: 'text-gray-400' }, '-')
      return h(UBadge, { variant: 'subtle', color: 'neutral' }, () => typeName)
    },
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'payment_ty',
    header: '支付方式',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '自建', value: 4 },
          { label: '支付宝', value: 3 },
          { label: '微信', value: 2 },
          { label: 'USDT', value: 1 }
        ]
      }
    },
    cell: ({ row }) => {
      const paymentTy = row.original.payment_ty
      const [label, color] = tyEnum[paymentTy] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'state',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '待支付', value: 0 },
          { label: '已支付', value: 2 }
        ]
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(time))
    }
  }
]
