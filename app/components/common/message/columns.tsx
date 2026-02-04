import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: any = {
  2: ['启用', 'success'],
  4: ['禁用', 'error']
}
// 类型 1 互动 2 系统 3 公告 4 营销
const typeEnum: any = {
  1: ['互动消息', 'secondary'],
  2: ['系统消息', 'primary'],
  3: ['公告', 'info'],
  4: ['营销', 'neutral']
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
    accessorKey: 'title',
    searchPlaceholder: '筛选标题',
    header: '标题'
  },
  {
    accessorKey: 'image',
    header: '宣传图',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      if (row.original.image) {
        return h('div', { class: 'flex items-center' }, [
          h('img', {
            src: row.original.image,
            alt: '宣传图',
            class: 'w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
          })
        ])
      }
      return h('span', { class: 'text-gray-400 text-sm' }, '无图片')
    }
  },
  {
    accessorKey: 'content',
    header: '内容',
    cell: ({ row }) => {
      const content = row.original.content || ''
      return h('div', { class: 'truncate max-w-[300px]', title: content }, content)
    }
  },
  {
    accessorKey: 'ty',
    searchPlaceholder: '筛选类型',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '互动消息',
            value: 1
          },
          {
            label: '系统',
            value: 2
          },
          {
            label: '公告',
            value: 3
          },
          {
            label: '营销',
            value: 4
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: typeEnum[row.original.ty]?.[1] }, () =>
        typeEnum[row.original.ty]?.[0]
      )
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
            label: '启用',
            value: 2
          },
          {
            label: '禁用',
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
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  }
]
