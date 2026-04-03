import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const stateEnum: any = {
  0: ['待审核', 'warning'],
  1: ['已通过', 'neutral'],
  2: ['已完成', 'success']
}

const typeEnum: any = {
  1: '游戏收入',
  2: '邀请收入',
  3: '提现'
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } }
  },
  {
    accessorKey: 'uid',
    header: '用户信息',
    searchPlaceholder: '用户ID',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const member = row.original.member
      if (!member) return h('span', {}, row.original.uid)
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: member.avatar, size: 'sm' }),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'text-sm font-medium truncate max-w-[120px]' }, member.username),
          h('span', { class: 'text-xs text-(--ui-text-muted)' }, `ID: ${member.id}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: '金额',
    cell: ({ row }) => {
      const amount = (row.original.amount || 0) / 100
      const color = amount >= 0 ? 'text-green-600' : 'text-red-600'
      return h('span', { class: `font-medium ${color}` }, `${amount >= 0 ? '+' : ''}¥${amount}`)
    }
  },
  {
    accessorKey: 'battery',
    header: '妖力',
    cell: ({ row }) => {
      const battery = row.original.battery || 0
      return h('span', { class: 'text-yellow-500' }, battery)
    }
  },
  {
    accessorKey: 'num',
    header: '次数',
    cell: ({ row }) => row.original.num || 0
  },
  {
    accessorKey: 'ty',
    header: '类型',
    searchPlaceholder: '类型',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '游戏收入', value: 1 },
          { label: '邀请收入', value: 2 },
          { label: '提现', value: 3 }
        ]
      },
      field: 'ty'
    },
    cell: ({ row }) => h('span', { class: 'text-sm' }, typeEnum[row.original.ty] || '-')
  },
  {
    accessorKey: 'content',
    header: '说明',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } }
  },
  {
    accessorKey: 'tm',
    header: '日期',
    cell: ({ row }) => row.original.tm || '-'
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'start_time',
    header: '开始时间',
    hideInTable: true,
    searchPlaceholder: '开始时间',
    formItemProps: {
      component: 'DateTimeInput',
      field: 'start_time'
    }
  },
  {
    accessorKey: 'end_time',
    header: '结束时间',
    hideInTable: true,
    searchPlaceholder: '结束时间',
    formItemProps: {
      component: 'DateTimeInput',
      field: 'end_time'
    }
  }
]
