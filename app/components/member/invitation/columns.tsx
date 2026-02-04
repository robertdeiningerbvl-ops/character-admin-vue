import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

/* ================= Components ================= */
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

/* ================= Enums ================= */
const stateEnum: Record<number, [string, 'warning' | 'success']> = {
  0: ['未使用', 'warning'],
  2: ['已使用', 'success']
}

const stateOptions = [
  { label: '未使用', value: 0 },
  { label: '已使用', value: 2 }
]

/* ================= Columns ================= */
export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
      })
    },
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    }
  },
  {
    accessorKey: 'uid',
    header: '用户ID',
    searchPlaceholder: '请输入用户ID'
  },
  {
    accessorKey: 'order_sn',
    header: '订单号',
    searchPlaceholder: '请输入订单号',
    meta: {
      class: {
        th: 'w-[280px]'
      }
    }
  },
  {
    accessorKey: 'code',
    header: '兑换码'
  },
  {
    accessorKey: 'coins',
    header: '能量'
  },
  {
    accessorKey: 'limit',
    header: '使用次数'
  },
  {
    accessorKey: 'state',
    header: '使用状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: stateOptions
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'warning']

      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color
      }, () => label)
    }
  },
  {
    accessorKey: 'expire',
    header: '有效期',
    meta: {
      class: {
        th: 'w-[180px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.expire)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[180px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  }
]
