import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const menuEnum: any = {
  0: ['目录', 'info', 'i-lucide-folder'],
  1: ['菜单', 'success', 'i-lucide-file-text'],
  2: ['权限', 'warning', 'i-lucide-key']
}

export const baseColumns: TableColumnList = [
  {
    id: 'expand',
    meta: {
      class: {
        th: 'w-[140px]',
        td: 'w-[140px]'
      }
    },
    cell: ({ row }) => {
      if (row.original.children) {
        return h(UButton, {
          'color': 'neutral',
          'variant': 'ghost',
          'icon': 'i-lucide-chevron-down',
          'square': true,
          'aria-label': 'Expand',
          'style': `margin-left:${row.original.level * 32}px`,
          'ui': {
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : ''
            ]
          },
          'onClick': () => row.toggleExpanded()
        })
      }

      return ''
    }
  },
  {
    accessorKey: 'name',
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: '名称',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-(--ui-text-highlighted) font-semibold'
      })
    },
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      const level = row.original.level || 0
      const ty = row.original.ty
      const [, color, icon] = menuEnum[ty] || ['未知', 'neutral', 'i-lucide-circle']

      return h('div', {
        class: 'flex items-center gap-2',
        style: `padding-left: ${level * 24}px`
      }, [
        h(UIcon, {
          name: icon,
          class: `w-4 h-4 text-(--ui-${color})`
        }),
        h('span', {
          class: 'font-medium text-(--ui-text-highlighted)'
        }, row.original.name)
      ])
    }
  },
  {
    accessorKey: 'ty',
    header: '类型',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = menuEnum[row.original.ty] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'router',
    header: '节点路由',
    meta: {
      class: {
        th: 'w-[200px]',
        td: 'w-[200px]'
      }
    },
    cell: ({ row }) => {
      const router = row.original.router
      if (!router) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, router)
    }
  },
  {
    accessorKey: 'icon',
    header: '图标',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      if (row.original.icon) {
        return h('div', {
          class: 'w-8 h-8 rounded bg-(--ui-bg-elevated) flex items-center justify-center'
        }, [
          h(UIcon, { name: row.original.icon, class: 'w-4 h-4 text-(--ui-text-muted)' })
        ])
      }
      return h('span', { class: 'text-(--ui-text-muted)' }, '-')
    }
  },
  {
    accessorKey: 'perms',
    header: '权限标识',
    cell: ({ row }) => {
      const perms = row.original.perms
      if (!perms) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('code', {
        class: 'px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-text-muted)'
      }, perms)
    }
  },
  {
    accessorKey: 'is_show',
    header: '显示状态',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const isShow = row.original.is_show === 1
      return h(UBadge, {
        variant: 'subtle',
        color: isShow ? 'success' : 'neutral'
      }, () => isShow ? '显示' : '隐藏')
    }
  }
]
