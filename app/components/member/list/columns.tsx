import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UIcon = resolveComponent('UIcon')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  2: ['启用', 'success'],
  1: ['待审核', 'warning'],
  4: ['已删除', 'error']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    searchPlaceholder: 'UID',
    formItemProps: {
      field: 'uid'
    },
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-(--ui-text-muted)' }, row.original.id)
  },
  {
    accessorKey: 'username',
    header: '用户',
    searchPlaceholder: '用户昵称',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const { avatar, username, source, is_admin } = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: avatar, alt: username, size: 'sm' }),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'flex items-center gap-1' }, [
            h('span', { class: 'font-medium truncate' }, username || '-'),
            is_admin === 2 && h(UBadge, { color: 'warning', variant: 'solid', size: 'xs' }, () => '官')
          ]),
          h('div', { class: 'text-xs text-(--ui-text-muted) truncate' }, source || '-')
        ])
      ])
    }
  },
  {
    accessorKey: 'stats',
    header: '数据统计',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => {
      const d = row.original
      return h('div', { class: 'flex flex-col gap-1 text-xs' }, [
        h('div', { class: 'flex items-center gap-3' }, [
          h(UTooltip, { text: '粉丝' }, () => h('span', { class: 'inline-flex items-center gap-1 text-pink-500 cursor-help' }, [h(UIcon, { name: 'i-lucide-heart', class: 'w-3 h-3' }), d.fans || 0])),
          h(UTooltip, { text: '关注' }, () => h('span', { class: 'inline-flex items-center gap-1 text-blue-500 cursor-help' }, [h(UIcon, { name: 'i-lucide-bookmark', class: 'w-3 h-3' }), d.focus || 0])),
          h(UTooltip, { text: '发布' }, () => h('span', { class: 'inline-flex items-center gap-1 text-orange-500 cursor-help' }, [h(UIcon, { name: 'i-lucide-file-text', class: 'w-3 h-3' }), d.publish_count || 0]))
        ]),
        h('div', { class: 'flex items-center gap-3' }, [
          h(UTooltip, { text: '游戏' }, () => h('span', { class: 'inline-flex items-center gap-1 text-teal-500 cursor-help' }, [h(UIcon, { name: 'i-lucide-gamepad-2', class: 'w-3 h-3' }), d.game_num || 0])),
          h(UTooltip, { text: '邀请' }, () => h('span', { class: 'inline-flex items-center gap-1 text-purple-500 cursor-help' }, [h(UIcon, { name: 'i-lucide-user-plus', class: 'w-3 h-3' }), d.invite || 0]))
        ])
      ])
    }
  },
  {
    accessorKey: 'battery',
    header: '电量',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const { battery, income_battery } = row.original
      return h('div', { class: 'flex flex-col text-xs' }, [
        h('span', { class: 'inline-flex items-center gap-1 text-yellow-500' }, [h(UIcon, { name: 'i-lucide-zap', class: 'w-3 h-3' }), battery || 0]),
        h('span', { class: 'inline-flex items-center gap-1 text-green-500' }, [h(UIcon, { name: 'i-lucide-trending-up', class: 'w-3 h-3' }), income_battery || 0])
      ])
    }
  },
  {
    accessorKey: 'income_amount',
    header: '收益',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    cell: ({ row }) => {
      const { income_amount, amount } = row.original
      return h('div', { class: 'text-xs' }, [
        h('div', { class: 'font-medium text-green-600' }, `¥${income_amount || 0}`),
        h('div', { class: 'text-(--ui-text-muted)' }, `可提 ¥${amount || 0}`)
      ])
    }
  },
  {
    accessorKey: 'code',
    header: '邀请码',
    searchPlaceholder: '邀请码',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const { code } = row.original
      return h('code', { class: 'text-xs font-mono bg-(--ui-bg-elevated) px-1.5 py-0.5 rounded' }, code || '-')
    }
  },
  {
    accessorKey: 'email',
    header: '邮箱',
    searchPlaceholder: '邮箱',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const { email } = row.original
      return h('span', { class: 'text-xs' }, email || '-')
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'text-xs text-(--ui-text-muted)' }, formatToDateTime(time))
    }
  },
  {
    accessorKey: 'remarks',
    header: '备注',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const remarks = row.original.remarks
      if (!remarks) return h('span', { class: 'text-gray-400' }, '-')
      const shortText = remarks.length > 6 ? remarks.slice(0, 6) + '...' : remarks
      return h(UTooltip, {
        text: remarks,
        ui: { content: 'max-w-xs' }
      }, () => h('span', { class: 'text-xs cursor-pointer text-(--ui-text-muted) hover:text-(--ui-text)' }, shortText))
    }
  },
  {
    accessorKey: 'summary',
    header: '简介',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const summary = row.original.summary
      if (!summary) return h('span', { class: 'text-gray-400' }, '-')
      const shortText = summary.length > 6 ? summary.slice(0, 6) + '...' : summary
      return h(UTooltip, {
        text: summary,
        ui: { content: 'max-w-xs' }
      }, () => h('span', { class: 'text-xs cursor-pointer text-(--ui-text-muted) hover:text-(--ui-text)' }, shortText))
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
