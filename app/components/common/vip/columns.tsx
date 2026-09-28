import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')

const stateEnum: Record<number, [string, string]> = {
  0: ['关闭', 'error'],
  2: ['开启', 'success']
}

function formatMoney(value: any, symbol: string) {
  const num = Number(value)
  if (Number.isNaN(num)) {
    return `${symbol}0.00`
  }
  return `${symbol}${num.toFixed(2)}`
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[70px]', td: 'w-[70px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-(--ui-text-muted)' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'title',
    header: '套餐名称',
    meta: { class: { th: 'w-[130px]', td: 'w-[130px]' } },
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
      h(UIcon, { name: 'i-lucide-crown', class: 'w-4 h-4 text-(--ui-warning)' }),
      h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.title || '-')
    ])
  },
  {
    accessorKey: 'amount',
    header: '价格（人民币）',
    meta: { class: { th: 'w-[100]', td: 'w-[100]' } },
    cell: ({ row }) => h('span', { class: 'font-medium text-(--ui-primary)' }, formatMoney(row.original.amount, '¥'))
  },
  {
    accessorKey: 'us_amount',
    header: '价格（美元）',
    meta: { class: { th: 'w-[100]', td: 'w-[100]' } },
    cell: ({ row }) => h('span', { class: 'text-(--ui-text)' }, formatMoney(row.original.us_amount, '$'))
  },
  {
    accessorKey: 'free_battery',
    header: '首次赠送妖力',
    meta: { class: { th: 'w-[100]', td: 'w-[100]' } },
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(UIcon, { name: 'i-lucide-zap', class: 'w-4 h-4 text-(--ui-warning)' }),
      h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, Number(row.original.free_battery) || 0)
    ])
  },
  {
    accessorKey: 'battery',
    header: '每月赠送妖力',
    meta: { class: { th: 'w-[140px]', td: 'w-[140px]' } },
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(UIcon, { name: 'i-lucide-battery-charging', class: 'w-4 h-4 text-(--ui-success)' }),
      h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, Number(row.original.battery) || 0)
    ])
  },
  {
    accessorKey: 'vip_time',
    header: 'VIP 时长',
    meta: { class: { th: 'w-[110px]', td: 'w-[110px]' } },
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1' }, [
      h(UIcon, { name: 'i-lucide-clock', class: 'w-4 h-4 text-(--ui-primary)' }),
      h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, Number(row.original.vip_time) || 0)
    ])
  },
  {
    accessorKey: 'state',
    header: '状态',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: { class: { th: 'w-[170px]', td: 'w-[170px]' } },
    cell: ({ row }) => {
      const time = row.original.updated_at
      if (!time) {
        return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      }
      return h('span', { class: 'text-xs text-(--ui-text-muted)' }, formatToDateTime(time))
    }
  }
]
