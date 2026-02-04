import request from '../request'
import apiRoute from '../router'

/** 获取统计数据 */
export function getCommonStatistics(params?: any) {
  return request.get<any>(apiRoute.commonStatistics, params)
}
/** 刷新统计数据 */
export function refreshCommonStatistics() {
  return request.get<ApiBase.List>(apiRoute.commonStatisticsRefresh)
}

/** 获取邀请统计数据 */
export function getCommonInviteStatistics(params?: any) {
  return request.get<any>(apiRoute.commonInviteStatistics, params)
}
