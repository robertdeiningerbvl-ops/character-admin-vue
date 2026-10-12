import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')

// 灵丹单位 1/10000；USDT 单位 1/100
export const formatLingdan = (v: number) => (Number(v || 0) / 10000).toLocaleString(undefined, { maximumFractionDigits: 4 })
export const formatUsdt = (v: number) => (Number(v || 0) / 100).toFixed(2)

const statusEnum: Record<number, [string, string]> = {
  0: ['待打款', 'warning'],
  1: ['已打款', 'success'],
  2: ['已驳回', 'error']
}

const copyText = (text: string) => {
  if (!text) return
  navigator.clipboard?.writeText(text)
  useToast().add({ title: '已复制', color: 'success' })
}

const copyable = (text: string, href?: string) => h('div', { class: 'flex items-center gap-1 max-w-[220px]' }, [
  href
    ? h('a', { href, target: '_blank', rel: 'noopener noreferrer', class: 'truncate text-xs font-mono text-(--ui-primary) hover:underline' }, text)
    : h('span', { class: 'truncate text-xs font-mono' }, text),
  h('button', { class: 'shrink-0 text-(--ui-text-muted) hover:text-(--ui-primary)', title: '复制', onClick: () => copyText(text) },
    h(resolveComponent('UIcon'), { name: 'i-lucide-copy', class: 'w-3.5 h-3.5' }))
])

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'order_no',
    header: '提取单号',
    searchPlaceholder: '提取单号',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } },
    cell: ({ row }) => h('span', { class: 'text-xs font-mono' }, row.original.order_no)
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
    header: '灵丹',
    cell: ({ row }) => h('span', { class: 'font-medium' }, formatLingdan(row.original.amount))
  },
  {
    accessorKey: 'usdt_amount',
    header: '应付 USDT',
    cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
      h('span', { class: 'font-semibold text-green-600' }, formatUsdt(row.original.usdt_amount)),
      Number(row.original.fee) > 0 ? h('span', { class: 'text-xs text-(--ui-text-muted)' }, `手续费 ${formatUsdt(row.original.fee)}`) : null
    ])
  },
  {
    accessorKey: 'address',
    header: '收款地址',
    searchPlaceholder: '收款地址',
    meta: { class: { th: 'w-[260px]', td: 'w-[260px]' } },
    cell: ({ row }) => {
      const uids: number[] = row.original.address_uids || []
      return h('div', { class: 'flex flex-col gap-1' }, [
        h('span', { class: 'text-xs text-(--ui-text-muted)' }, row.original.network || 'TRC20'),
        copyable(row.original.address),
        uids.length > 0
          ? h(UTooltip, { text: `用过同一收款地址的其他账号：${uids.join('、')}` }, () =>
              h(UBadge, { color: 'error', variant: 'solid', size: 'sm' }, () => `疑似同一人多号（${uids.length}）`))
          : null
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
          { label: '待打款', value: 0 },
          { label: '已打款', value: 1 },
          { label: '已驳回', value: 2 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = statusEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'tx_hash',
    header: '交易哈希 / 备注',
    meta: { class: { th: 'w-[240px]', td: 'w-[240px]' } },
    cell: ({ row }) => h('div', { class: 'flex flex-col gap-1' }, [
      row.original.tx_hash ? copyable(row.original.tx_hash, `https://tronscan.org/#/transaction/${row.original.tx_hash}`) : null,
      row.original.remark ? h('span', { class: 'text-xs text-(--ui-text-muted) break-all' }, row.original.remark) : null,
      !row.original.tx_hash && !row.original.remark ? h('span', {}, '-') : null
    ])
  },
  {
    accessorKey: 'created_at',
    header: '申请时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'processed_at',
    header: '处理时间',
    cell: ({ row }) => {
      const t = row.original.processed_at
      if (!t || t === '0001-01-01T00:00:00Z') return '-'
      return h('div', { class: 'flex flex-col' }, [
        h('span', {}, formatToDateTime(t)),
        row.original.admin_uid ? h('span', { class: 'text-xs text-(--ui-text-muted)' }, `管理员 ${row.original.admin_uid}`) : null
      ])
    }
  }
]
