import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, string]> = {
  1: ['正常', 'success'],
  9: ['删除', 'neutral']
}

const vipEnum: Record<number, [string, string]> = {
  0: ['普通语音', 'neutral'],
  1: ['VIP语音', 'warning']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600 dark:text-gray-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'name',
    header: '声优名称',
    searchPlaceholder: '声优名称',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const { name, avatar } = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: avatar, size: 'sm' }),
        h('span', { class: 'text-sm font-medium truncate' }, name || '-')
      ])
    }
  },
  // {
  //   accessorKey: 'provider_voice_key',
  //   header: 'voice_id',
  //   meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
  //   cell: ({ row }) => {
  //     const key = row.original.provider_voice_key
  //     if (!key) return h('span', { class: 'text-gray-400' }, '-')
  //     return h(UTooltip, { text: key }, {
  //       default: () => h('span', { class: 'font-mono text-xs text-gray-600 dark:text-gray-400 truncate max-w-[160px]' }, key)
  //     })
  //   }
  // },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '状态',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '正常', value: 1 },
          { label: '删除', value: 9 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'vip',
    header: '语音类型',
    meta: { class: { th: 'w-[110px]', td: 'w-[110px]' } },
    cell: ({ row }) => {
      const [label, color] = vipEnum[row.original.vip] || ['普通语音', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'sort',
    header: '排序权重',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-medium text-gray-700 dark:text-gray-300' }, Number(row.original.sort) || 0)
  },
  {
    accessorKey: 'use_count',
    header: '使用次数',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, Number(row.original.use_count) || 0)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[170px]', td: 'w-[170px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.created_at))
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: { class: { th: 'w-[170px]', td: 'w-[170px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.updated_at))
  }
]
