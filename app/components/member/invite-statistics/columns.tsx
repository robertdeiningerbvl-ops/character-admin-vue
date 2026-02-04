import type { DataTableColumn } from '@/types/table'
import { getCommonInviteStatistics } from '@/api'
import type { Service } from '@/types'

import dayjs from 'dayjs'

export type TableColumnList = DataTableColumn<any>[]

export const baseColumns: TableColumnList = [
  {
    accessorKey: 'start',
    header: '开始日期',
    searchPlaceholder: '开始日期',
    hideInTable: true,
    formItemProps: {
      field: 'start',
      component: 'DateInput',
      defaultValue: dayjs().subtract(6, 'day').format('YYYY-MM-DD')
    }
  },
  {
    accessorKey: 'end',
    header: '结束日期',
    searchPlaceholder: '结束日期',
    hideInTable: true,
    formItemProps: {
      field: 'end',
      component: 'DateInput',
      defaultValue: dayjs().format('YYYY-MM-DD')
    }
  },
  {
    accessorKey: 'invitation_code',
    header: '邀请码',
    searchPlaceholder: '筛选邀请码',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    }
  },
  {
    accessorKey: 'tm',
    header: '日期',
    meta: {
      class: {
        th: 'w-[120px]',
        td: 'w-[120px]'
      }
    }
  },
  {
    accessorKey: 'name',
    header: '用户名',
    meta: {
      class: {
        th: 'w-[150px]',
        td: 'w-[150px]'
      }
    }
  },
  {
    accessorKey: 'num',
    header: '邀请人数',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  },
  {
    accessorKey: 'uid',
    header: '用户ID',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    }
  }
]

/** 获取邀请统计数据（展平后的列表） */
export async function getInviteStatisticsList(params?: any): Promise<Service.RequestResult<ApiBase.List<any[]>>> {
  const { data, error } = await getCommonInviteStatistics(params)
  if (error || !data?.list) {
    const errorResult: Service.FailedResult = {
      error: error || { type: 'backend', code: 'NO_DATA', msg: '无数据' },
      data: null
    }
    return errorResult
  }
  const rows: any[] = []
  data.list.forEach((item: any) => {
    const code = item.invitation_code
    item.days?.forEach((day: any) => {
      day.stats?.forEach((stat: any) => {
        rows.push({
          invitation_code: code,
          tm: day.tm,
          name: stat.name,
          num: stat.num,
          uid: stat.uid
        })
      })
    })
  })
  const successResult: Service.SuccessResult<ApiBase.List<any[]>> = {
    error: null,
    data: { list: rows, count: 0 }
  }
  return successResult
}
