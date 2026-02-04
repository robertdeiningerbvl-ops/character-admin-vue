import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: any = {
  4: ['删除', 'error'],
  2: ['待审核', 'warning'],
  1: ['正常', 'success']
}

const tyEnum: any = {
  1: ['正则', 'info'],
  2: ['世界观', 'warning']
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
    accessorKey: 'name',
    searchPlaceholder: '名称标题',
    header: '名称'
  },
  {
    accessorKey: 'content',
    header: '内容',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) => h(UTooltip, {
      text: row.original.content,
      ui: { content: 'max-w-[150px] h-auto', text: 'whitespace-pre-wrap break-all select-text' }
    }, () => {
      return h('div', {
        class: 'truncate'
      }, row.original.content)
    }
    )
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  },
  {
    accessorKey: 'ty',
    header: '类型',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '正则',
            value: 1
          },
          {
            label: '世界观',
            value: 2
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
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '删除',
            value: 4
          },
          {
            label: '待审核',
            value: 2
          },
          {
            label: '正常',
            value: 1
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
