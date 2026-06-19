import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')

const tyMap: Record<number, [string, string]> = {
  1: ['bt', 'warning'],
  2: ['web', 'info']
}

const fmt = (v: number) => `¥${(v / 100).toFixed(2)}`

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'uid',
    header: '用户ID',
    searchPlaceholder: '用户ID',
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600 dark:text-gray-400' }, `#${row.original.uid}`)
  },
  {
    accessorKey: 'invite_code',
    header: '邀请码',
    searchPlaceholder: '邀请码',
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-700 dark:text-gray-300' }, row.original.invite_code)
  },
  {
    accessorKey: 'ty',
    header: '类型',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const [label, color] = tyMap[row.original.ty] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'today_user_count',
    header: '当日注册用户',
    meta: { class: { th: 'w-[120px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.today_user_count)
  },
  {
    accessorKey: 'user_count',
    header: '注册总用户',
    meta: { class: { th: 'w-[120px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.user_count)
  },
  {
    accessorKey: 'top_up_user_count',
    header: '充值用户',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const v = row.original.top_up_user_count
      return h('span', { class: v > 0 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'first_commission',
    header: '首充佣金',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const v = row.original.first_commission
      return h('span', { class: v > 0 ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-400' }, v > 0 ? fmt(v) : '-')
    }
  },
  {
    accessorKey: 'first_topup_amount',
    header: '首充金额',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const v = row.original.first_topup_amount
      return h('span', { class: v > 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400' }, v > 0 ? fmt(v) : '-')
    }
  },
  {
    accessorKey: 'total_commission',
    header: '总佣金',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const v = row.original.total_commission
      return h('span', { class: v > 0 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-400' }, v > 0 ? fmt(v) : '-')
    }
  },
  {
    accessorKey: 'total_topup_amount',
    header: '总充值',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const v = row.original.total_topup_amount
      return h('span', { class: v > 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400' }, v > 0 ? fmt(v) : '-')
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.created_at))
  }
]
