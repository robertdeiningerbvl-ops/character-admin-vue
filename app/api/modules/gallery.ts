import request from '../request'

/**
 * 管理员作品列表
 */
export function getAdminWorkList(params: ApiGallery.WorkListParams) {
  return request.get<ApiGallery.WorkListResult>('gallery-work-list', params)
}

/**
 * 管理员作品详情
 */
export function getAdminWorkDetail(workId: string) {
  return request.get<ApiGallery.Work>('gallery-work-detail', { work_id: workId })
}

/**
 * 管理员查看用户作品列表
 */
export function getAdminUserWorkList(params: ApiGallery.WorkListParams & { uid: number }) {
  return request.get<ApiGallery.WorkListResult>('gallery-user-work-list', params)
}

/**
 * 管理员作品统计
 */
export function getAdminWorkStats() {
  return request.get<ApiGallery.WorkStats>('gallery-work-stats')
}

/**
 * 管理员修改作品状态
 */
export function updateAdminWorkState(params: ApiGallery.UpdateWorkStateParams) {
  return request.post<null>('gallery-work-state', params)
}

/**
 * 管理员批量修改作品状态
 */
export function batchUpdateWorkState(params: ApiGallery.BatchUpdateStateParams) {
  return request.post<ApiGallery.BatchUpdateStateResult>('gallery-work-batch-state', params)
}

/**
 * 管理员批量删除作品
 */
export function batchRemoveWork(params: ApiGallery.BatchRemoveParams) {
  return request.post<ApiGallery.BatchRemoveResult>('gallery-work-batch-remove', params)
}
