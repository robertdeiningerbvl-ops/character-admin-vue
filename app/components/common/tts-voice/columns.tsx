import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const genderEnum: Record<number, string> = {
  0: '未知',
  1: '男',
  2: '女',
  3: '其他'
}

const visibilityEnum: Record<number, [string, string]> = {
  1: ['公有', 'success'],
  2: ['私有', 'neutral']
}

const sourceEnum: Record<number, [string, string]> = {
  1: ['系统内置', 'info'],
  2: ['用户克隆', 'warning'],
  3: ['第三方导入', 'neutral']
}

const stateEnum: Record<number, [string, string]> = {
  1: ['正常', 'success'],
  2: ['待审核', 'warning'],
  3: ['禁用', 'error'],
  9: ['删除', 'neutral']
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-gray-600 dark:text-gray-400' }, `#${row.original.id}`)
  },
  {
    accessorKey: 'name',
    header: '声优名称',
    searchPlaceholder: '声优名称',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const { name, avatar } = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h(UAvatar, { src: avatar, size: 'sm' }),
        h('span', { class: 'text-sm font-medium truncate' }, name)
      ])
    }
  },
  {
    accessorKey: 'gender',
    header: '性别',
    searchPlaceholder: '性别',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '全部', value: 0 },
          { label: '男', value: 1 },
          { label: '女', value: 2 },
          { label: '其他', value: 3 }
        ]
      }
    },
    cell: ({ row }) => h('span', { class: 'text-sm' }, genderEnum[row.original.gender] || '-')
  },
  {
    accessorKey: 'language',
    header: '语言',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.language || '-')
  },
  {
    accessorKey: 'visibility',
    header: '可见性',
    searchPlaceholder: '可见性',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '公有', value: 1 },
          { label: '私有', value: 2 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = visibilityEnum[row.original.visibility] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'source',
    header: '来源',
    searchPlaceholder: '来源',
    meta: { class: { th: 'w-[120px]', td: 'w-[120px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '系统内置', value: 1 },
          { label: '用户克隆', value: 2 },
          { label: '第三方导入', value: 3 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = sourceEnum[row.original.source] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '状态',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '正常', value: 1 },
          { label: '待审核', value: 2 },
          { label: '禁用', value: 3 }
        ]
      }
    },
    cell: ({ row }) => {
      const [label, color] = stateEnum[row.original.state] || ['未知', 'neutral']
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  {
    accessorKey: 'is_hot',
    header: '热门',
    meta: { class: { th: 'w-[80px]', td: 'w-[80px]' } },
    cell: ({ row }) => {
      const isHot = row.original.is_hot
      return h(UBadge, { variant: 'subtle', color: isHot ? 'warning' : 'neutral' }, () => isHot ? '热门' : '普通')
    }
  },
  {
    accessorKey: 'use_count',
    header: '使用次数',
    meta: { class: { th: 'w-[100px]', td: 'w-[100px]' } },
    cell: ({ row }) => h('span', { class: 'font-semibold' }, row.original.use_count || 0)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[160px]', td: 'w-[160px]' } },
    cell: ({ row }) => h('span', { class: 'text-sm text-gray-600 dark:text-gray-300' }, formatToDateTime(row.original.created_at))
  }
]
