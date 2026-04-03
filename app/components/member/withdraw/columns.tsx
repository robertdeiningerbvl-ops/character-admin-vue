import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const statusEnum: any = {
  0: ['待审核', 'warning'],
  2: ['已通过', 'success'],
  3: ['已拒绝', 'error']
}

const accountTypeEnum: any = {
  1: '支付宝',
  2: '微信',
  3: '银行卡'
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
    header: '提现金额',
    cell: ({ row }) => h('span', { class: 'font-medium' }, `¥${(row.original.amount || 0) / 100}`)
  },
  {
    accessorKey: 'fee',
    header: '手续费',
    cell: ({ row }) => h('span', { class: 'text-red-500' }, `¥${(row.original.fee || 0) / 100}`)
  },
  {
    accessorKey: 'real_amount',
    header: '实际到账',
    cell: ({ row }) => h('span', { class: 'font-medium text-green-600' }, `¥${(row.original.real_amount || 0) / 100}`)
  },
  {
    accessorKey: 'account',
    header: '提现账户',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } },
    cell: ({ row }) => {
      const account = row.original.account
      if (!account) return h('span', {}, '-')
      return h('div', { class: 'text-xs' }, [
        h('div', {}, `${accountTypeEnum[account.ty] || '-'} - ${account.account_name}`),
        h('div', { class: 'text-(--ui-text-muted)' }, account.account_no)
      ])
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '状态',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '待审核', value: 0 },
          { label: '已通过', value: 2 },
          { label: '已拒绝', value: 3 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = statusEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'remark',
    header: '备注'
  },
  {
    accessorKey: 'created_at',
    header: '申请时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'audit_at',
    header: '审核时间',
    cell: ({ row }) => {
      const time = row.original.audit_at
      if (!time || time === '0001-01-01T00:00:00Z') return '-'
      return formatToDateTime(time)
    }
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
