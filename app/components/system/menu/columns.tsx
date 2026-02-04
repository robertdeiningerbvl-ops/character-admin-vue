import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

const menuEnum: any = {
  0: ['目录', 'blue'],
  1: ['菜单', 'green'],
  2: ['权限', 'purple']
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

      // 根据类型选择图标
      const iconMap: any = {
        0: 'i-material-symbols-folder-outline',
        1: 'i-material-symbols-description-outline',
        2: 'i-material-symbols-key-outline'
      }

      return h('div', {
        class: 'flex items-center gap-2',
        style: `padding-left: ${level * 24}px`
      }, [
        // 类型图标
        h(UIcon, {
          name: iconMap[ty] || 'i-material-symbols-circle-outline',
          class: `w-4 h-4 ${
            ty === 0
              ? 'text-blue-500'
              : ty === 1
                ? 'text-green-500'
                : 'text-purple-500'
          }`
        }),
        // 名称文本
        h('span', {
          class: `font-medium ${
            level === 0
              ? 'text-gray-900 dark:text-white'
              : level === 1
                ? 'text-gray-700 dark:text-gray-200'
                : 'text-gray-600 dark:text-gray-300'
          }`
        }, row.original.name)
      ])
    }
  },
  {
    accessorKey: 'ty',
    header: '类型',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = menuEnum[row.original.ty] || ['未知', 'gray']
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
      if (!router) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, router)
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
        return h(UIcon, { name: row.original.icon, class: 'w-5 h-5 text-gray-600 dark:text-gray-400' })
      }
      return h('span', { class: 'text-gray-400' }, '-')
    }
  },
  {
    accessorKey: 'perms',
    header: '权限',
    cell: ({ row }) => {
      const perms = row.original.perms
      if (!perms) return h('span', { class: 'text-gray-400' }, '-')
      return h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, perms)
    }
  },
  {
    accessorKey: 'is_show',
    header: '是否显示',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const isEnable = row.original.is_show === 1
      return h(UBadge, {
        variant: 'subtle',
        color: isEnable ? 'success' : 'gray'
      }, () => isEnable ? '显示' : '隐藏')
    }
  }
]
