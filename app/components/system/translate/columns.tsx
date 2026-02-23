import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'name',
    header: '中文名称',
    searchPlaceholder: '筛选名称',
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-languages w-4 h-4 text-(--ui-primary)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.name || '-')
      ])
    }
  },
  {
    accessorKey: 'content',
    header: '翻译内容',
    searchPlaceholder: '筛选翻译内容',
    cell: ({ row }) => {
      const content = row.original.content
      if (!content) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, content)
    }
  },
  {
    accessorKey: 'nation',
    header: '菜单标识',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => {
      const nation = row.original.nation
      if (!nation) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, {
        variant: 'subtle',
        color: 'info'
      }, () => nation)
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.updated_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-clock w-4 h-4 text-(--ui-text-muted)' }),
        h('span', { class: 'text-sm' }, formatToDateTime(time))
      ])
    }
  }
]
