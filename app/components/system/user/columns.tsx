import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const groupEnum: any = {
  1: ['管理员', 'warning'],
  5: ['运营', 'info'],
  99: ['超级管理员', 'error']
}

const stateEnum: any = {
  1: ['禁用', 'error'],
  2: ['正常', 'success'],
  4: ['已删除', 'neutral']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'username',
    header: '用户信息',
    searchPlaceholder: '筛选账号',
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      const { username, avatar, id, email } = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: avatar,
          alt: username,
          size: 'lg',
          class: 'shrink-0'
        }),
        h('div', { class: 'flex flex-col min-w-0' }, [
          h('span', { class: 'font-medium text-(--ui-text-highlighted) truncate' }, username),
          h('span', { class: 'text-xs text-(--ui-text-muted)' }, `ID: ${id}`),
          email && h('span', { class: 'text-xs text-(--ui-text-dimmed) truncate' }, email)
        ])
      ])
    }
  },
  {
    accessorKey: 'created_at',
    header: '注册时间',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-calendar w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(row.original.created_at))
      ])
    }
  },
  {
    accessorKey: 'last_ip',
    header: '登录IP',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      const lastIp = row.original.last_ip || row.original.ip
      if (!lastIp) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-globe w-4 h-4 text-(--ui-text-muted)' }),
        h('code', { class: 'text-xs font-mono bg-(--ui-bg-elevated) px-2 py-1 rounded' }, lastIp)
      ])
    }
  },
  {
    accessorKey: 'group_id',
    header: '角色',
    searchPlaceholder: '筛选角色',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '管理员', value: 1 },
          { label: '运营', value: 5 },
          { label: '超级管理员', value: 99 }
        ]
      }
    },
    cell: ({ row }) => {
      const group = groupEnum[row.original.group_id]
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color: group?.[1] || 'neutral'
      }, () => group?.[0] || '未知')
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '筛选状态',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '正常', value: 2 },
          { label: '禁用', value: 1 },
          { label: '已删除', value: 4 }
        ]
      }
    },
    cell: ({ row }) => {
      const state = stateEnum[row.original.state]
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color: state?.[1] || 'neutral'
      }, () => state?.[0] || '未知')
    }
  }
]
