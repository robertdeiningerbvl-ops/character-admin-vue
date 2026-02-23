import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')

const groupColorMap: any = {
  1: ['warning', 'i-lucide-shield'],
  5: ['info', 'i-lucide-user-cog'],
  99: ['error', 'i-lucide-crown']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'name',
    header: '角色名称',
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      const { name, group_id } = row.original
      const [color, icon] = groupColorMap[group_id] || ['neutral', 'i-lucide-user']
      return h('div', { class: 'flex items-center gap-3' }, [
        h('div', {
          class: `w-10 h-10 rounded-lg bg-(--ui-bg-elevated) flex items-center justify-center`
        }, [
          h('span', { class: `${icon} w-5 h-5 text-(--ui-${color})` })
        ]),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, name)
      ])
    }
  },
  {
    accessorKey: 'group_id',
    header: '角色标识',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, `group_${row.original.group_id}`)
    }
  },
  {
    accessorKey: 'level',
    header: '权限等级',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      const { group_id } = row.original
      const levelMap: any = { 1: '普通', 5: '中级', 99: '最高' }
      const [color] = groupColorMap[group_id] || ['neutral']
      return h(UBadge, {
        variant: 'subtle',
        color
      }, () => levelMap[group_id] || '未知')
    }
  }
]
