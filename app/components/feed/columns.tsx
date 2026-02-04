import type { DataTableColumn } from '@/types/table'
import dayjs from 'dayjs'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const stateEnum: Record<number, [string, 'warning' | 'success' | 'error' | 'info']> = {
  0: ['待处理', 'warning'],
  1: ['已回复', 'success'],
  2: ['已关闭', 'info']
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
    accessorKey: 'username',
    header: '用户名',
    searchPlaceholder: '请输入用户名',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    },
    cell: ({ row }) => {
      const username = row.original.username || '-'
      return h('div', { class: 'font-medium' }, username)
    }
  },
  {
    accessorKey: 'title',
    header: '标题',
    searchPlaceholder: '请输入标题',
    meta: {
      class: {
        th: 'min-w-[180px]',
        td: 'min-w-[180px]'
      }
    },
    cell: ({ row }) => {
      const title = row.original.title || '-'
      return h('div', { class: 'font-medium text-gray-900 dark:text-white' }, title)
    }
  },
  {
    accessorKey: 'content',
    header: '内容',
    meta: {
      class: {
        th: 'min-w-[200px]',
        td: 'min-w-[200px]'
      }
    },
    cell: ({ row }) => {
      const content = row.original.content || '-'
      return h('div', {
        class: 'text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px]',
        title: content
      }, content)
    }
  },
  {
    accessorKey: 'reply',
    header: '回复',
    meta: {
      class: {
        th: 'min-w-[200px]',
        td: 'min-w-[200px]'
      }
    },
    cell: ({ row }) => {
      const reply = row.original.reply
      if (!reply) {
        return h('span', { class: 'text-xs text-gray-400 dark:text-gray-500' }, '未回复')
      }
      return h('div', {
        class: 'text-sm text-gray-600 dark:text-gray-400 truncate max-w-[250px]',
        title: reply
      }, reply)
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
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'info']
      return h(UBadge, {
        color,
        variant: 'subtle',
        label
      })
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
      return h('span', { class: 'text-sm text-gray-600 dark:text-gray-400' },
        dayjs(row.original.created_at).format('YYYY-MM-DD HH:mm')
      )
    }
  }
]
