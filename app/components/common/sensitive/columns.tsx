import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['开启', 'success'],
  4: ['删除', 'error']
}

const tyEnum: any = {
  0: ['系统', 'primary', 'i-material-symbols-settings-outline'],
  1: ['业务', 'green', 'i-material-symbols-business-center']
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
    header: () => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: 'ID',
      class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
    }),
    cell: ({ row }) => h('span', { class: 'font-mono text-sm font-semibold text-primary-600 dark:text-primary-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'name',
    searchPlaceholder: '筛选敏感词',
    header: '敏感词',
    cell: ({ row }) => {
      const word = row.original.name
      if (!word) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-warning w-5 h-5 text-red-600 dark:text-red-400' }),
        h('span', { class: 'font-semibold text-red-700 dark:text-red-300' }, word)
      ])
    }
  },
  {
    accessorKey: 'ty',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '系统',
            value: 0
          },
          {
            label: '业务',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      const ty = row.original.ty
      const [label, color] = tyEnum[ty] || ['未知', 'gray']
      return h(UBadge, {
        variant: 'subtle',
        color,
        class: 'font-medium'
      }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '开启',
            value: 2
          },
          {
            label: '删除',
            value: 4
          }
        ]
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'gray']
      return h(UBadge, {
        variant: 'subtle',
        color,
        class: 'font-medium'
      }, () => label)
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('i', { class: 'i-material-symbols-schedule-outline w-4 h-4 text-gray-400' }),
        h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(time))
      ])
    }
  }
]
