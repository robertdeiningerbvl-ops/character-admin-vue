import type { DataTableColumn } from '@/types/table'
import dayjs from 'dayjs'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const stateEnum: Record<number, [string, 'warning' | 'success' | 'error' | 'info']> = {
  0: ['待处理', 'warning'],
  1: ['已回复', 'success'],
  2: ['已关闭', 'info']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'w-[60px]',
        td: 'w-[60px]'
      }
    }
  },
  {
    accessorKey: 'member',
    header: '用户',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
      }
    },
    cell: ({ row }) => {
      const member = row.original.member
      if (!member) return h('span', { class: 'text-gray-400' }, '-')
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, {
          src: member.avatar,
          alt: member.username,
          size: 'sm'
        }),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'font-medium text-gray-900 dark:text-white truncate' }, member.username || '-'),
          h('div', { class: 'text-xs text-gray-500 truncate' }, member.email || '')
        ])
      ])
    }
  },
  {
    accessorKey: 'title',
    header: '标题',
    meta: {
      class: {
        th: 'min-w-[150px]',
        td: 'min-w-[150px]'
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
        th: 'min-w-[180px]',
        td: 'min-w-[180px]'
      }
    },
    cell: ({ row }) => {
      const content = row.original.content || '-'
      return h('div', {
        class: 'text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]',
        title: content
      }, content)
    }
  },
  {
    accessorKey: 'reply',
    header: '回复',
    meta: {
      class: {
        th: 'min-w-[180px]',
        td: 'min-w-[180px]'
      }
    },
    cell: ({ row }) => {
      const reply = row.original.reply
      if (!reply) {
        return h(UBadge, {
          color: 'neutral',
          variant: 'subtle',
          label: '未回复'
        })
      }
      return h('div', {
        class: 'text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]',
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
