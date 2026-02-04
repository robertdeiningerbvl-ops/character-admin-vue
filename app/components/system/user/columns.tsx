import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')

const groupEnum: any = {
  1: ['管理员', 'warning'],
  5: ['运营', 'info'],
  99: ['超级管理员', 'error']
}

const stateEnum: any = {
  1: ['禁用', 'error'],
  2: ['正常', 'success'],
  4: ['已删除', 'error']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-(--ui-text-highlighted) font-semibold'
      })
    }
  },
  {
    accessorKey: 'username',
    header: '账号',
    searchPlaceholder: '筛选账号',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.avatar,
          alt: row.original.username,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.username)
        ])
      ])
    }
  },
  {
    accessorKey: 'created_at',
    header: '注册时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'ip',
    header: '登录IP'
  },
  {
    accessorKey: 'group_id',
    header: '角色',
    searchPlaceholder: '筛选角色',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '管理员',
            value: 1
          },
          {
            label: '运营',
            value: 5
          },
          {
            label: '超级管理员',
            value: 99
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: groupEnum[row.original.group_id]?.[1] }, () =>
        groupEnum[row.original.group_id]?.[0]
      )
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '筛选状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '正常',
            value: 2
          },
          {
            label: '禁用',
            value: 1
          },
          {
            label: '已删除',
            value: 4
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: stateEnum[row.original.state]?.[1] }, () =>
        stateEnum[row.original.state]?.[0]
      )
    }
  }
]
