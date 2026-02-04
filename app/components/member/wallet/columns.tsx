import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const _UAvatar = resolveComponent('UAvatar')

const wayEnum: any = {
  1: ['入账', 'success'],
  2: ['出账', 'error']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
      })
    }
  },
  {
    accessorKey: 'uid',
    header: '用户id'
  },
  {
    accessorKey: 'before_battery',
    header: '帐变前余额'
  },
  {
    accessorKey: 'battery',
    header: '帐变金额'
  },
  {
    accessorKey: 'after_battery',
    header: '帐变后余额'
  },
  {
    accessorKey: 'type',
    header: '帐变类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '充值购买',
            value: 1
          },
          {
            label: '兑换码兑换',
            value: 2
          },
          {
            label: '签到',
            value: 3
          },
          {
            label: '裂变返佣',
            value: 4
          },
          {
            label: '任务获取',
            value: 5
          },
          {
            label: '角色卡消费',
            value: 6
          },
          {
            label: '能量打赏',
            value: 2
          },
          {
            label: '兑换码兑换',
            value: 7
          },
          {
            label: '系统充值',
            value: 8
          }
        ]
      }
    }
  },
  {
    accessorKey: 'way',
    header: '帐变方式',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '入账',
            value: 1
          },
          {
            label: '出账',
            value: 2
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: wayEnum[row.original.way]?.[1] }, () =>
        wayEnum[row.original.way]?.[0]
      )
    }
  },
  {
    accessorKey: 'remark',
    header: '备注'
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  }
]
