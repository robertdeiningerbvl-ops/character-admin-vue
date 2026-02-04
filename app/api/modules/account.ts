import request from '../request'
import apiRoute from '../router'

/** 获取权限组 */
export function rbacAdminGroup() {
  return request.get<ApiAccount.PermMenu>(apiRoute.rbacAdminGroup)
}

/** 用户当前编辑 */
export function updateAccount(data: ApiAccount.UpdateUserParams) {
  return request.post<any>(apiRoute.adminUserEdit, data)
}

/** 用户列表 */
export function getAdminList(params: ApiBase.PageParams) {
  return request.get<ApiBase.List<ApiAccount.Info[]>>(apiRoute.adminU, params)
}

/** 用户添加 */
export function addAdmin(data: ApiAccount.AddUserParams) {
  return request.post<any>(apiRoute.adminAdd, data)
}

/** 用户编辑 */
export function updateAdmin(data: ApiAccount.UpdateUserParams) {
  return request.post<any>(apiRoute.adminEdit, data)
}

/** 用户日志列表 */
export function getAdminLogList(params?: any) {
  return request.get<any>(apiRoute.adminLog, params)
}

/** 用户移除 */
export function removeAdmin(data: { id: number }) {
  return request.post<any>(apiRoute.adminRemove, data)
}

/** 上传文件 */
export function uploadFile(data: any) {
  return request.post<any>(apiRoute.commonUpload, data, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}
