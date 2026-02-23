import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  2: ['正常', 'success'],
  4: ['删除', 'error'],
  0: ['待审核', 'warning']
}

const tyEnum: any = {
  1: ['支付宝', 'info'],
  2: ['微信', 'success'],
  3: ['USDT', 'warning'],
  4: ['自建', 'neutral']
}

const signTyEnum: any = {
  1: 'MD5-方式1',
  2: 'MD5-方式2',
  3: 'MD5-方式3',
  4: 'MD5-方式4',
  5: 'MD5-方式5'
}

const limitTypeEnum: any = {
  1: ['固定金额', 'info'],
  2: ['范围金额', 'warning']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[60px]', td: 'w-[60px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.original.id)
  },
  {
    accessorKey: 'name',
    header: '名称',
    searchPlaceholder: '筛选名称',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } },
    cell: ({ row }) => h('span', { class: 'font-medium truncate' }, row.original.name || '-')
  },
  {
    accessorKey: 'code',
    header: '编码',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => h('code', { class: 'text-xs' }, row.original.code || '-')
  },
  {
    accessorKey: 'ty',
    header: '类型',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => {
      const [label, color] = tyEnum[row.original.ty] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'mch_id',
    header: '商户号',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.mch_id || '-')
  },
  {
    accessorKey: 'sign_ty',
    header: '签名方式',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, signTyEnum[row.original.sign_ty] || '-')
  },
  {
    accessorKey: 'limit_type',
    header: '限制类型',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    cell: ({ row }) => {
      const [label, color] = limitTypeEnum[row.original.limit_type] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'limit',
    header: '限额',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.limit || '-')
  },
  {
    accessorKey: 'weights',
    header: '权重',
    meta: { class: { th: 'w-[60px]', td: 'w-[60px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm font-medium' }, row.original.weights ?? '-')
  },
  {
    accessorKey: 'f',
    header: '标识',
    meta: { class: { th: 'w-[60px]', td: 'w-[60px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.f || '-')
  },
  {
    accessorKey: 'state',
    header: '状态',
    meta: { class: { th: 'w-[70px]', td: 'w-[70px]' } },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-(--ui-text-muted)' }, formatToDateTime(row.original.updated_at))
  }
]
