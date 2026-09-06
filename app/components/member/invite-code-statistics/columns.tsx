import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'stat_date',
    header: '统计日期',
    searchPlaceholder: '统计日期',
    cell: ({ row }) => {
      const date = row.original.stat_date
      // 格式化日期：YYYY-MM-DD
      const formatted = date ? new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-') : '-'
      return h('span', { class: 'font-medium text-gray-700 dark:text-gray-300' }, formatted)
    }
  },
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
    accessorKey: 'consume_battery',
    header: '日消耗积分',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => {
      const v = row.original.consume_battery
      return h('span', { class: v > 0 ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'signin_user_count',
    header: '签到用户数',
    meta: { class: { th: 'w-[110px]', td: 'w-[110px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.signin_user_count)
  },
  {
    accessorKey: 'chat_once_user_count',
    header: '1次对话用户',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.chat_once_user_count)
  },
  {
    accessorKey: 'chat_ten_user_count',
    header: '10次+对话用户',
    meta: { class: { th: 'w-[130px]', td: 'w-[130px]' } },
    cell: ({ row }) => {
      const v = row.original.chat_ten_user_count
      return h('span', { class: v > 0 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'first_topup_count',
    header: '首充用户数',
    meta: { class: { th: 'w-[110px]', td: 'w-[110px]' } },
    cell: ({ row }) => {
      const v = row.original.first_topup_count
      return h('span', { class: v > 0 ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'repeat_topup_count',
    header: '复充用户数',
    meta: { class: { th: 'w-[110px]', td: 'w-[110px]' } },
    cell: ({ row }) => {
      const v = row.original.repeat_topup_count
      return h('span', { class: v > 0 ? 'font-semibold text-purple-600 dark:text-purple-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'first_topup_amount',
    header: '首充用户金额',
    meta: { class: { th: 'w-[130px]', td: 'w-[130px]' } },
    cell: ({ row }) => {
      const v = Number(row.original.first_topup_amount ?? 0) || 0
      return h('span', { class: 'font-semibold text-amber-600 dark:text-amber-400' }, `¥${v.toFixed(2)}`)
    }
  },
  {
    accessorKey: 'repeat_topup_amount',
    header: '复充用户金额',
    meta: { class: { th: 'w-[130px]', td: 'w-[130px]' } },
    cell: ({ row }) => {
      const v = Number(row.original.repeat_topup_amount ?? 0) || 0
      return h('span', { class: 'font-semibold text-purple-600 dark:text-purple-400' }, `¥${v.toFixed(2)}`)
    }
  },
  {
    accessorKey: 'retention_day1',
    header: '1日留存',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const v = row.original.retention_day1
      return h('span', { class: v > 0 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'retention_day3',
    header: '3日留存',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const v = row.original.retention_day3
      return h('span', { class: v > 0 ? 'font-semibold text-teal-600 dark:text-teal-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'retention_day7',
    header: '7日留存',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const v = row.original.retention_day7
      return h('span', { class: v > 0 ? 'font-semibold text-cyan-600 dark:text-cyan-400' : 'text-gray-400' }, v || '-')
    }
  },
  {
    accessorKey: 'retention_day30',
    header: '30日留存',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => {
      const v = row.original.retention_day30
      return h('span', { class: v > 0 ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-400' }, v || '-')
    }
  },
]
