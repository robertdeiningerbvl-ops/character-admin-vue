import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const wayEnum: any = {
  0: ['出账', 'error'],
  1: ['入账', 'success']
}

const typeEnum: any = {
  1: '充值购买',
  2: '兑换码兑换',
  3: '签到',
  4: '裂变返佣',
  5: '任务获取',
  6: '角色卡消费',
  7: '能量打赏',
  8: '系统充值',
  9: '角色卡创造'
}

export const baseColumns: TableColumnList = [
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
          h('span', { class: 'text-sm font-medium truncate' }, member.username),
          h('span', { class: 'text-xs text-(--ui-text-muted)' }, `ID: ${member.id}`)
        ])
      ])
    }
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
    searchPlaceholder: '帐变类型',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '充值购买', value: 1 },
          { label: '兑换码兑换', value: 2 },
          { label: '签到', value: 3 },
          { label: '裂变返佣', value: 4 },
          { label: '任务获取', value: 5 },
          { label: '角色卡消费', value: 6 },
          { label: '能量打赏', value: 7 },
          { label: '系统充值', value: 8 },
          { label: '角色卡创造', value: 9 }
        ]
      }
    },
    cell: ({ row }) => h('span', { class: 'text-sm' }, typeEnum[row.original.type] || '-')
  },
  {
    accessorKey: 'way',
    header: '帐变方式',
    searchPlaceholder: '帐变方式',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '入账', value: 1 },
          { label: '出账', value: 0 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = wayEnum[row.original.way] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
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
