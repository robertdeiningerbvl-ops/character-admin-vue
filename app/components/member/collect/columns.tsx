import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  1: ['启用', 'success'],
  2: ['待审核', 'warning'],
  4: ['已删除', 'error']
}
const tyEnum: any = {
  1: ['游戏', 'success'],
  0: ['其他', 'error']
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
    accessorKey: 'image',
    header: '封面图',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    cell: ({ row }) => {
      const logo = row.original.image
      if (!logo) {
        return h('div', {
          class: 'w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500'
        }, 'N/A')
      }
      return h(UAvatar, {
        src: logo,
        alt: 'image',
        size: 'lg',
        class: 'ring-1 ring-gray-200'
      })
    }
  },
  {
    accessorKey: 'name',
    header: '卡片名称',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const text = row.original.name || ''
      return h(
        UTooltip,
        { text },
        {
          default: () =>
            h(
              'div',
              {
                class: 'truncate max-w-[100px] cursor-pointer'
              },
              text
            )
        }
      )
    }
  },
  {
    accessorKey: 'battery',
    header: '所需电量',
    cell: ({ row }) => {
      return h(UBadge,
        { variant: 'outline', color: 'primary' }, // 统一颜色
        () => row.original.battery
      )
    }
  },
  {
    accessorKey: 'collect_count',
    header: '收藏数'
  },
  {
    accessorKey: 'comment_count',
    header: '评论数'
  },
  {
    accessorKey: 'play_count',
    header: '播放数'
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: {
      class: {
        th: 'w-[110px]',
        td: 'w-[110px]'
      }
    },
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'summary',
    header: '简介',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) =>
      h(
        UTooltip,
        { text: `${row.original.summary}\n${row.original.fetish}` },
        () =>
          h('div', { class: 'cursor-pointer' }, [
            h('p', { class: 'truncate' }, row.original.summary),
            h('p', { class: 'truncate text-xs' }, row.original.fetish)
          ])
      )
  },
  {
    accessorKey: 'ty',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[80px]'
      }
    },
    header: '类型',
    searchPlaceholder: '筛选类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '游戏',
            value: 1
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: tyEnum[row.original.ty]?.[1] }, () =>
        tyEnum[row.original.ty]?.[0]
      )
    }
  },
  {
    accessorKey: 'state',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[80px]'
      }
    },
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
