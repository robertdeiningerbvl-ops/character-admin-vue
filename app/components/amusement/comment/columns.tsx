import type { DataTableColumn } from '@/types/table'
import { useCommentReplies } from './commentreply'

export type TableColumnList = DataTableColumn<any>[]

const { expandedIds, loadingIds, replyMap, toggle } = useCommentReplies()
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'warning' | 'success' | 'error']> = {
  2: ['待审核', 'warning'],
  1: ['启用', 'success'],
  4: ['已删除', 'error']
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
    accessorKey: 'content',
    header: '内容名称',
    cell: ({ row }) => {
      const id = row.original.id
      const expanded = expandedIds.value.has(id)
      const loading = loadingIds.value.has(id)
      const replies = replyMap.value[id] || []

      return h('div', { class: 'space-y-2' }, [
        h(
          UTooltip,
          {
            text: row.original.content,
            ui: {
              content: 'max-w-[200px] h-auto',
              text: 'whitespace-pre-wrap break-all select-text'
            }
          },
          () =>
            h(
              'div',
              { class: 'truncate font-medium' },
              row.original.content
            )
        ),
        h(
          UButton,
          {
            size: 'xs',
            variant: 'ghost',
            loading,
            icon: expanded
              ? 'i-heroicons-chevron-up'
              : 'i-heroicons-chevron-down',
            onClick: () => toggle(row.original)
          },
          () => (expanded ? '收起回复' : '查看回复')
        ),

        // 回复列表
        expanded
        && h(
          'div',
          { class: 'pl-3 border-l space-y-2 text-sm' },
          replies.length
            ? replies.map(reply =>
                h('div', { key: reply.id }, [
                  h(
                    'div',
                    { class: 'font-medium' },
                    reply.member.username
                  ),
                  h(
                    'div',
                    { class: 'text-gray-600' },
                    reply.content
                  )
                ])
              )
            : h(
                'div',
                { class: 'text-gray-400' },
                '暂无回复'
              )
        )
      ])
    }
  },
  {
    accessorKey: 'member.username',
    header: '评论用户',
    cell: ({ row }) => {
      return h('div', undefined, [
        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.member.username),
        h('p', { class: 'text-xs text-gray-500' }, `ID: ${row.original.member.id}`)
      ])
    }
  },
  {
    accessorKey: 'created_at',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
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
            value: 2
          },
          {
            label: '启用',
            value: 1
          },
          {
            label: '已删除',
            value: 4
          }
        ]
      }
    },
    cell: ({ row }) => {
      const state = row.original.state
      const [label, color] = stateEnum[state] || ['未知', 'neutral']

      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color
      },
      () => label
      )
    }
  }
]
