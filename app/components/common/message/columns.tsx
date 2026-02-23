import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')
const ImagePreview = resolveComponent('ImagePreview')

const stateEnum: Record<number, [string, 'success' | 'error']> = {
  2: ['启用', 'success'],
  4: ['禁用', 'error']
}

const typeEnum: Record<number, [string, 'secondary' | 'primary' | 'info' | 'neutral']> = {
  1: ['互动消息', 'secondary'],
  2: ['系统消息', 'primary'],
  3: ['公告', 'info'],
  4: ['营销', 'neutral']
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
    cell: ({ row }) => {
      return h('span', { class: 'text-(--ui-text-muted) font-mono text-sm' }, `#${row.original.id}`)
    }
  },
  {
    accessorKey: 'title',
    searchPlaceholder: '筛选标题',
    header: '标题',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'i-lucide-message-square w-4 h-4 text-(--ui-primary)' }),
        h('span', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.title || '-')
      ])
    }
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
        return h(ImagePreview, {
          src: row.original.image,
          alt: '宣传图'
        })
      }
      return h('span', { class: 'text-(--ui-text-muted) text-sm' }, '无图片')
    }
  },
  {
    accessorKey: 'content',
    header: '内容',
    cell: ({ row }) => {
      const content = row.original.content || ''
      const plainText = content.replace(/<[^>]*>/g, '').substring(0, 50)
      if (!plainText) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UTooltip, { text: plainText }, {
        default: () => h('div', { class: 'truncate max-w-[200px] text-(--ui-text-muted)' }, plainText)
      })
    }
  },
  {
    accessorKey: 'ty',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '互动消息', value: 1 },
          { label: '系统', value: 2 },
          { label: '公告', value: 3 },
          { label: '营销', value: 4 }
        ]
      }
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = typeEnum[row.original.ty] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '启用', value: 2 },
          { label: '禁用', value: 4 }
        ]
      }
    },
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'error']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'tm',
    header: '弹框间隔',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const tm = row.original.tm
      if (!tm || tm <= 0) {
        return h('span', { class: 'text-(--ui-text-muted)' }, '不弹框')
      }
      return h('div', { class: 'flex items-center gap-1' }, [
        h('span', { class: 'i-lucide-timer w-4 h-4 text-(--ui-warning)' }),
        h('span', { class: 'text-(--ui-text-highlighted)' }, `${tm}秒`)
      ])
    }
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    meta: {
      class: {
        th: 'w-[160px]',
        td: 'w-[160px]'
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
