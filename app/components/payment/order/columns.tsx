import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const stateEnum: any = {
  0: ['待支付', 'warning'],
  2: ['已支付', 'success']
}

const tyEnum: any = {
  1: ['支付宝', 'info'],
  2: ['微信', 'success'],
  3: ['USDT', 'warning'],
  4: ['自建', 'neutral']
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
    accessorKey: 'uid',
    header: '用户信息',
    searchPlaceholder: '用户ID',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const member = row.original.member
      if (!member || !member.id) return h('span', { class: 'text-gray-400' }, row.original.uid || '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: member.avatar, size: 'sm' }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'text-sm font-medium truncate' }, member.username),
          h('span', { class: 'text-xs text-(--ui-text-muted)' }, `ID: ${member.id}`)
        ])
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
      const amount = (row.original.order_amount || 0) / 100
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
      const realAmount = (row.original.real_amount || 0) / 100
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
    searchPlaceholder: '支付方式',
    header: '支付方式',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '支付宝', value: 1 },
          { label: '微信', value: 2 },
          { label: 'USDT', value: 3 },
          { label: '自建', value: 4 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = tyEnum[row.original.payment_ty] || ['未知', 'neutral']
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
    searchPlaceholder: '请输入状态',
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
