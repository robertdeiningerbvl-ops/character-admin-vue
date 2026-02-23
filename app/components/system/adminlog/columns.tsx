import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const getModuleColor = (module: string): string => {
  if (module?.includes('edit')) return 'warning'
  if (module?.includes('add') || module?.includes('create')) return 'success'
  if (module?.includes('del') || module?.includes('remove')) return 'error'
  if (module?.includes('login')) return 'info'
  return 'neutral'
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'username',
    searchPlaceholder: '筛选管理员',
    header: '操作人',
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: 'w-8 h-8 rounded-full bg-(--ui-bg-elevated) flex items-center justify-center' }, [
          h('span', { class: 'text-sm font-medium text-(--ui-text-muted)' }, row.original.username?.charAt(0) || 'U')
        ]),
        h('div', { class: 'flex flex-col' }, [
          h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.username || '-'),
          h('span', { class: 'text-xs text-(--ui-text-muted)' }, `UID: ${row.original.uid || '-'}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'content',
    header: '操作内容',
    searchPlaceholder: '筛选操作内容',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color: getModuleColor(row.original.module)
      }, () => row.original.content || '-')
    }
  },
  {
    accessorKey: 'module',
    header: '操作模块',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, row.original.module || '-')
    }
  },
  {
    accessorKey: 'params',
    header: '操作参数',
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      const params = row.original.params || '-'
      if (params === '-') return h('span', { class: 'text-(--ui-text-muted)' }, '-')

      const shortParams = params.length > 50 ? params.substring(0, 50) + '...' : params
      return h(UTooltip, {
        text: params,
        class: 'max-w-md'
      }, () => h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted) truncate block max-w-[180px] cursor-help'
      }, shortParams))
    }
  },
  {
    accessorKey: 'ip',
    header: 'IP地址',
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-globe w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'font-mono text-sm' }, row.original.ip || '-')
      ])
    }
  },
  {
    accessorKey: 'ctime',
    header: '操作时间',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.ctime || row.original.created_at
      if (!time || time === '0001-01-01T00:00:00Z') {
        return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      }
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-clock w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(time))
      ])
    }
  }
]
