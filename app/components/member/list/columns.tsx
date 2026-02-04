import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  2: ['启用', 'success'],
  1: ['待审核', 'warning'],
  4: ['已删除', 'error']
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
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600 dark:text-gray-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'avatar',
    header: '头像',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const logo = row.original.avatar
      if (!logo) {
        return h('div', {
          class: 'w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center'
        }, h('i', { class: 'i-material-symbols-person w-6 h-6 text-primary-600 dark:text-primary-400' }))
      }
      return h(UAvatar, {
        src: logo,
        alt: 'avatar',
        size: 'lg',
        class: 'ring-2 ring-primary-200 dark:ring-primary-800'
      })
    }
  },
  {
    accessorKey: 'username',
    header: '客户昵称',
    searchPlaceholder: '筛选昵称',
    cell: ({ row }) => {
      const username = row.original.username
      if (!username) return h('span', { class: 'text-gray-400 dark:text-gray-500' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'i-material-symbols-person-outline w-4 h-4 text-primary-500' }),
        h('span', { class: 'font-medium text-gray-900 dark:text-white' }, username)
      ])
    },
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    }
  },
  {
    accessorKey: 'is_admin',
    header: '官方号？',
    meta: {
      class: {
        th: 'w-[90px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const isAdmin = row.original.is_admin
      if (isAdmin === 2) {
        return h(UBadge, {
          variant: 'solid',
          color: 'orange',
          class: 'font-bold'
        }, () => h('div', { class: 'flex items-center gap-1' }, [
          h('i', { class: 'i-material-symbols-verified w-4 h-4' }),
          h('span', '官方')
        ]))
      }
      return h('span', { class: 'text-gray-400 dark:text-gray-500' }, '-')
    }
  },
  {
    accessorKey: 'battery',
    header: '账户电量',
    cell: ({ row }) => {
      const battery = row.original.battery || 0
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
    accessorKey: 'income_battery',
    header: '收益电量',
    cell: ({ row }) => {
      const incomeBattery = row.original.income_battery || 0
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-trending-up w-4 h-4 text-green-600' }),
        h('span', { class: 'font-semibold text-green-700 dark:text-green-400' }, incomeBattery)
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
    accessorKey: 'gift_battery',
    header: '赠送电量',
    cell: ({ row }) => {
      const giftBattery = row.original.gift_battery || 0
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-card-giftcard w-4 h-4 text-blue-600' }),
        h('span', { class: 'font-semibold text-blue-700 dark:text-blue-400' }, giftBattery)
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
    accessorKey: 'source',
    searchPlaceholder: '来源',
    header: '来源',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      const source = row.original.source
      if (!source) return h('span', { class: 'text-gray-400' }, '-')
      return h(UBadge, { variant: 'subtle', color: 'primary' }, () => source)
    }
  },
  {
    accessorKey: 'code',
    header: '邀请码',
    cell: ({ row }) => {
      const code = row.original.code
      if (!code) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'i-material-symbols-qr-code-2 w-4 h-4 text-blue-500' }),
        h('span', { class: 'font-mono text-sm font-medium text-gray-900 dark:text-white' }, code)
      ])
    },
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    }
  },
  {
    accessorKey: 'invite',
    header: '邀请人数',
    cell: ({ row }) => {
      const invite = row.original.invite || 0
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-person-add-outline w-4 h-4 text-purple-600' }),
        h('span', { class: 'font-semibold text-purple-700 dark:text-purple-400' }, invite)
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
    accessorKey: 'income_amount',
    header: '累计收益',
    cell: ({ row }) => {
      const incomeAmount = row.original.income_amount || 0
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-monetization-on-outline w-4 h-4 text-green-600' }),
        h('span', { class: 'font-semibold text-green-700 dark:text-green-400' }, `¥${incomeAmount}`)
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
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-schedule-outline w-4 h-4 text-gray-400 dark:text-gray-500' }),
        h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(time))
      ])
    }
  },
  {
    accessorKey: 'remarks',
    header: '备注',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const remarks = row.original.remarks
      if (!remarks) return h('span', { class: 'text-gray-400' }, '-')
      return h(UTooltip, {
        text: remarks,
        ui: { content: 'max-w-xs', text: 'whitespace-pre-wrap break-all select-text' }
      }, () =>
        h('div', { class: 'flex items-center gap-2' }, [
          h('i', { class: 'i-material-symbols-note-outline w-4 h-4 text-gray-400 dark:text-gray-500' }),
          h('div', { class: 'truncate text-gray-600 dark:text-gray-300' }, remarks)
        ])
      )
    }
  },
  {
    accessorKey: 'summary',
    header: '简介',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const summary = row.original.summary
      const fetish = row.original.fetish
      if (!summary && !fetish) return h('span', { class: 'text-gray-400' }, '-')
      return h(
        UTooltip,
        { text: `${summary || ''}\n${fetish || ''}` },
        () =>
          h('div', { class: 'cursor-pointer space-y-1' }, [
            summary && h('p', { class: 'truncate text-gray-700 dark:text-gray-300' }, summary),
            fetish && h('p', { class: 'truncate text-xs text-gray-500 dark:text-gray-400' }, fetish)
          ])
      )
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    searchPlaceholder: '筛选状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '待审核', value: 1 },
          { label: '启用', value: 2 },
          { label: '已删除', value: 4 }
        ]
      }
    },
    cell: ({ row }) => h(UBadge, {
      class: 'capitalize',
      variant: 'subtle',
      color: stateEnum[row.original.state]?.[1]
    }, () => stateEnum[row.original.state]?.[0])
  }
]
