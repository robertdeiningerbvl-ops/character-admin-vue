import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  2: ['启用', 'success'],
  1: ['删除', 'error']
}

const tyEnum: any = {
  4: ['自建', 'primary', 'i-material-symbols-build'],
  3: ['支付宝', 'blue', 'i-material-symbols-account-balance-wallet'],
  2: ['微信', 'green', 'i-material-symbols-chat'],
  1: ['USDT', 'orange', 'i-material-symbols-currency-bitcoin']
}

const limitTypeEnum: any = {
  2: ['固定金额', 'purple', 'i-material-symbols-pin'],
  1: ['范围金额', 'cyan', 'i-material-symbols-swap-horiz']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
    }),
    cell: ({ row }) => h('span', { class: 'font-mono text-sm font-semibold text-primary-600 dark:text-primary-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'name',
    searchPlaceholder: '筛选名称',
    header: '名称',
    cell: ({ row }) => {
      const name = row.original.name
      if (!name) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'i-material-symbols-label-outline w-4 h-4 text-blue-500' }),
        h('span', { class: 'font-medium text-gray-900 dark:text-white' }, name)
      ])
    }
  },
  {
    accessorKey: 'code',
    header: '支付编码',
    cell: ({ row }) => {
      const code = row.original.code
      if (!code) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'i-material-symbols-qr-code-2 w-4 h-4 text-purple-500' }),
        h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, code)
      ])
    }
  },
  {
    accessorKey: 'ty',
    header: '支付类型',
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
          {
            label: 'usdt',
            value: 3
          },
          {
            label: '微信',
            value: 2
          },
          {
            label: '支付宝',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      const ty = row.original.ty
      const [label, color, icon] = tyEnum[ty] || ['未知', 'gray', 'i-material-symbols-help-outline']
      return h(UBadge, {
        variant: 'subtle',
        color,
        class: 'whitespace-nowrap'
      }, () => h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: `${icon} w-4 h-4` }),
        h('span', label)
      ]))
    }
  },
  {
    accessorKey: 'limit_type',
    header: '限制类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '金额范围',
            value: 2
          },
          {
            label: '固定金额',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      const limitType = row.original.limit_type
      const [label, color, icon] = limitTypeEnum[limitType] || ['未知', 'gray', 'i-material-symbols-help-outline']
      return h(UBadge, {
        variant: 'subtle',
        color
      }, () => h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: `${icon} w-4 h-4` }),
        h('span', label)
      ]))
    }
  },
  {
    accessorKey: 'limit',
    header: '金额范围',
    cell: ({ row }) => {
      const limit = row.original.limit
      if (!limit) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-attach-money w-4 h-4 text-green-600' }),
        h('span', { class: 'font-medium text-gray-700 dark:text-gray-300' }, limit)
      ])
    }
  },
  {
    accessorKey: 'weights',
    header: '支付权重',
    cell: ({ row }) => {
      const weights = row.original.weights
      if (!weights) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-weight w-4 h-4 text-orange-600' }),
        h('span', { class: 'font-semibold text-orange-700 dark:text-orange-400' }, weights)
      ])
    }
  },
  {
    accessorKey: 'sign_ty',
    header: '签名方式',
    cell: ({ row }) => {
      const signTy = row.original.sign_ty
      if (!signTy) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-verified-outline w-4 h-4 text-indigo-500' }),
        h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, signTy)
      ])
    }
  },
  {
    accessorKey: 'mch_id',
    header: '商户ID',
    cell: ({ row }) => {
      const mchId = row.original.mch_id
      if (!mchId) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-badge-outline w-4 h-4 text-blue-500' }),
        h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, mchId)
      ])
    }
  },
  {
    accessorKey: 'f',
    header: '支付标识',
    cell: ({ row }) => {
      const f = row.original.f
      if (!f) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-fingerprint w-4 h-4 text-purple-500' }),
        h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, f)
      ])
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
      return h(UTooltip, {
        text: remark,
        ui: { content: 'max-w-xs', text: 'whitespace-pre-wrap break-all select-text' }
      }, () =>
        h('div', { class: 'flex items-center gap-2' }, [
          h('i', { class: 'i-material-symbols-note-outline w-4 h-4 text-gray-400' }),
          h('div', { class: 'truncate text-gray-600 dark:text-gray-300' }, remark)
        ])
      )
    }
  },
  {
    accessorKey: 'state',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[80px]'
      }
    },
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启动',
            value: 2
          },
          {
            label: '关闭',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: stateEnum[row.original.state]?.[1] }, () =>
        stateEnum[row.original.state]?.[0]
      )
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.updated_at
      if (!time) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-schedule-outline w-4 h-4 text-gray-400' }),
        h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(time))
      ])
    }
  }
]
