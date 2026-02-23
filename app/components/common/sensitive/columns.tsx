import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['开启', 'success'],
  4: ['删除', 'error']
}

const tyEnum: any = {
  0: ['系统', 'info'],
  1: ['业务', 'success']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => h('span', { class: 'font-mono text-(--ui-text-muted)' }, row.original.id)
  },
  {
    accessorKey: 'name',
    searchPlaceholder: '筛选敏感词',
    header: '敏感词',
    cell: ({ row }) => {
      const word = row.original.name
      if (!word) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('span', { class: 'font-medium text-red-600 dark:text-red-400' }, word)
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
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '系统', value: 0 },
          { label: '业务', value: 1 }
        ]
      }
    },
    cell: ({ row }) => {
      const ty = row.original.ty
      const [label, color] = tyEnum[ty] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
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
          { label: '开启', value: 2 },
          { label: '删除', value: 4 }
        ]
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
      }
    },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('span', { class: 'text-(--ui-text-muted)' }, formatToDateTime(time))
    }
  }
]
