import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const stateEnum: any = {
  2: ['启用', 'success'],
  1: ['待审核', 'warning'],
  4: ['已删除', 'error']
}

const stateDividedEnum: any = {
  0: ['否', 'error'],
  1: ['是', 'success']
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
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent'
      })
    }
  },
  {
    accessorKey: 'logo',
    header: 'Logo',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const logo = row.original.logo
      if (!logo) {
        return h('div', {
          class: 'w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500'
        }, 'N/A')
      }
      return h(UAvatar, {
        src: logo,
        alt: 'logo',
        size: 'lg',
        class: 'ring-1 ring-gray-200'
      })
    }
  },
  {
    accessorKey: 'name',
    header: '等级名称',
    cell: ({ row }) => {
      return h('div', undefined, [
        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.name),
        h('p', { class: 'text-xs' }, row.original.remark)
      ])
    }
  },
  {
    accessorKey: 'battery',
    header: '所需电量'
  },
  {
    accessorKey: 'divided',
    header: '参与分成?',
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: stateDividedEnum[row.original.divided]?.[1] }, () =>
        stateDividedEnum[row.original.divided]?.[0]
      )
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
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
            label: '待审核',
            value: 1
          },
          {
            label: '启用',
            value: 2
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
