import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UBadge = resolveComponent('UBadge')
const UIcon = resolveComponent('UIcon')

export const videoStateEnum: Record<number, [string, string]> = {
  1: ['上架', 'success'],
  2: ['下架', 'neutral']
}

/** 秒数格式化为 m:ss / h:mm:ss */
export function formatDuration(sec: number) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

function stat(icon: string, value: number) {
  return h('span', { class: 'inline-flex items-center gap-1' }, [
    h(UIcon, { name: icon, class: 'w-3.5 h-3.5 text-(--ui-text-muted)' }),
    h('span', value || 0)
  ])
}

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { class: { th: 'w-[70px]', td: 'w-[70px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm text-(--ui-text-muted)' }, row.original.id)
  },
  {
    accessorKey: 'cover',
    header: '封面',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    cell: ({ row }) => {
      const { cover, duration } = row.original
      return h('div', { class: 'relative w-[54px] h-[72px] rounded-md overflow-hidden bg-(--ui-bg-elevated)' }, [
        cover
          ? h('img', { src: cover, class: 'w-full h-full object-cover', loading: 'lazy' })
          : h('div', { class: 'w-full h-full flex items-center justify-center' }, h(UIcon, { name: 'i-lucide-film', class: 'w-5 h-5 text-(--ui-text-muted)' })),
        duration
          ? h('span', { class: 'absolute right-0.5 bottom-0.5 px-1 rounded bg-black/60 text-white text-[10px] leading-4 font-mono' }, formatDuration(duration))
          : null
      ])
    }
  },
  {
    accessorKey: 'title',
    header: '标题',
    searchPlaceholder: '标题关键词',
    formItemProps: { field: 'keywords' },
    meta: { class: { th: 'min-w-[220px]', td: 'min-w-[220px]' } },
    cell: ({ row }) => {
      const { title, description, width, height } = row.original
      return h('div', { class: 'min-w-0 space-y-1' }, [
        h('div', { class: 'font-medium truncate max-w-[320px]' }, title || '-'),
        description ? h('div', { class: 'text-xs text-(--ui-text-muted) line-clamp-2 max-w-[320px]' }, description) : null,
        width && height ? h('div', { class: 'text-[11px] text-(--ui-text-dimmed) font-mono' }, `${width}×${height}`) : null
      ])
    }
  },
  {
    accessorKey: 'tags',
    header: '标签',
    meta: { class: { th: 'w-[180px]', td: 'w-[180px]' } },
    cell: ({ row }) => {
      const tags = String(row.original.tags || '').split(',').map(t => t.trim()).filter(Boolean)
      if (!tags.length) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('div', { class: 'flex flex-wrap gap-1' }, tags.map(t => h(UBadge, { variant: 'soft', color: 'neutral', size: 'sm' }, () => t)))
    }
  },
  {
    accessorKey: 'state',
    header: '状态',
    searchPlaceholder: '筛选状态',
    meta: { class: { th: 'w-[90px]', td: 'w-[90px]' } },
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          { label: '上架', value: 1 },
          { label: '下架', value: 2 }
        ]
      }
    },
    cell: ({ row }) => {
      const info = videoStateEnum[row.original.state]
      if (!info) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h(UBadge, { variant: 'subtle', color: info[1] }, () => info[0])
    }
  },
  {
    accessorKey: 'stats',
    header: '数据',
    meta: { class: { th: 'w-[200px]', td: 'w-[200px]' } },
    cell: ({ row }) => {
      const r = row.original
      return h('div', { class: 'grid grid-cols-3 gap-x-3 gap-y-1 text-xs' }, [
        stat('i-lucide-play', r.play_count),
        stat('i-lucide-heart', r.like_count),
        stat('i-lucide-star', r.collect_count),
        stat('i-lucide-message-circle', r.comment_count),
        stat('i-lucide-share-2', r.share_count)
      ])
    }
  },
  {
    accessorKey: 'sort',
    header: '排序',
    meta: { class: { th: 'w-[70px]', td: 'w-[70px]' } },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.original.sort ?? 0)
  },
  {
    accessorKey: 'created_at',
    header: '创建时间',
    meta: { class: { th: 'w-[150px]', td: 'w-[150px]' } },
    cell: ({ row }) => {
      const time = row.original.created_at
      if (!time) return h('span', { class: 'text-(--ui-text-muted)' }, '-')
      return h('span', { class: 'text-xs text-(--ui-text-muted)' }, formatToDateTime(time))
    }
  }
]
