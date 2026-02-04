import type { DataTableColumn } from '@/types/table'

export type TableColumnList = DataTableColumn<any>[]

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UTooltip = resolveComponent('UTooltip')

const stateEnum: Record<number, [string, 'warning' | 'success' | 'error' | 'info']> = {
  0: ['提交', 'info'],
  1: ['待审核', 'warning'],
  2: ['启用', 'success'],
  4: ['已删除', 'error']
}

const dayEnum: any = {
  2: ['是', 'success'],
  0: ['否', 'error']
}
const anonymousEnum: any = {
  2: ['隐私', 'success'],
  0: ['公开', 'info']
}

// 图片预览函数
const previewImage = (imageUrl: string) => {
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer'
  overlay.onclick = () => overlay.remove()

  const imgContainer = document.createElement('div')
  imgContainer.className = 'relative max-w-[90vw] max-h-[90vh] p-4'

  const closeBtn = document.createElement('button')
  closeBtn.innerHTML = '✕'
  closeBtn.className = 'absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-xl font-bold z-10 text-gray-900 dark:text-white'
  closeBtn.onclick = (e) => {
    e.stopPropagation()
    overlay.remove()
  }

  const img = document.createElement('img')
  img.src = imageUrl
  img.className = 'max-w-full max-h-[85vh] rounded-lg shadow-2xl'
  img.onclick = e => e.stopPropagation()

  imgContainer.appendChild(closeBtn)
  imgContainer.appendChild(img)
  overlay.appendChild(imgContainer)
  document.body.appendChild(overlay)
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
    accessorKey: 'image',
    header: '封面图',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      const logo = row.original.image
      if (!logo) {
        return h('div', {
          class: 'w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400'
        }, 'N/A')
      }

      return h('div', {
        class: 'cursor-pointer hover:opacity-80 transition-opacity',
        onClick: () => previewImage(logo)
      }, [
        h(UAvatar, {
          src: logo,
          alt: '卡片封面图',
          size: 'lg',
          class: 'ring-1 ring-gray-200 dark:ring-gray-700'
        })
      ])
    }
  },
  {
    accessorKey: 'name',
    searchPlaceholder: '筛选名称',
    header: '卡片名称',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    },
    cell: ({ row }) =>
      h(
        UTooltip,
        { text: row.original.name },
        {
          default: () =>
            h('div', { class: 'space-y-0.5 cursor-help' }, [
              h('p', { class: 'font-medium truncate text-gray-900 dark:text-white' }, row.original.name),
              h(
                UBadge,
                { size: 'xs', color: 'neutral', variant: 'soft' },
                () => `作者： ${row.original.member?.username || '-'}`
              )
            ])
        }
      )
  },
  {
    accessorKey: 'battery',
    header: '已获电量',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'collect_count',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: '收藏数'
  },
  {
    accessorKey: 'comment_count',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: '评论数'
  },
  {
    accessorKey: 'score',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: '评分'
  },
  {
    accessorKey: 'score_count',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '评分人数'
  },
  {
    accessorKey: 'word_count',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
    },
    header: '字数'
  },
  {
    accessorKey: 'created_at',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '创建时间',
    cell: ({ row }) => formatToDateTime(row.original.created_at)
  },
  {
    accessorKey: 'updated_at',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '更新时间',
    cell: ({ row }) => formatToDateTime(row.original.updated_at)
  },
  {
    accessorKey: 'anonymous',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '是否隐私',
    searchPlaceholder: '隐私筛选',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '隐私',
            value: 2
          },
          {
            label: '公开',
            value: 0
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: anonymousEnum[row.original.anonymous]?.[1] }, () =>
        anonymousEnum[row.original.anonymous]?.[0]
      )
    }
  },
  {
    accessorKey: 'day_recommend',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    header: '是否日推',
    searchPlaceholder: '筛选状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '是',
            value: 2
          },
          {
            label: '否',
            value: 0
          }
        ]
      }
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle', color: dayEnum[row.original.day_recommend]?.[1] }, () =>
        dayEnum[row.original.day_recommend]?.[0]
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
    searchPlaceholder: '筛选状态',
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '待审核',
            value: 1
          },
          {
            label: '正常',
            value: 2
          },
          {
            label: '已删除',
            value: 4
          },
          {
            label: '提交',
            value: 0
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
