import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: () => {
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'ID',
        class: '-mx-2.5 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-(--ui-text-highlighted) font-semibold'
      })
    }
  },
  {
    accessorKey: 'name',
    header: '名称'
  },
  {
    accessorKey: 'group_id',
    header: '标识'
  }
]
