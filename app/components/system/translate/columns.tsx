import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    meta: {
      class: {
        th: 'w-[180px]',
        td: 'w-[180px]'
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
    header: '中文名称',
    searchPlaceholder: '筛选名称'
  },
  {
    accessorKey: 'content',
    header: '翻译内容',
    searchPlaceholder: '筛选翻译内容'
  },
  {
    accessorKey: 'nation',
    header: '菜单标识'
  },
  {
    accessorKey: 'updated_at',
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  }
]
