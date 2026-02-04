import request from '../request'
import apiRoute from '../router'

/** 获取目录列表 */
export function getMenuList() {
  return request.get<ApiBase.List>(apiRoute.rbacMenuList)
}

/** 新增目录 */
export function createMenu(data: any) {
  return request.post<any>(apiRoute.rbacMenuAdd, data)
}

/** 修改目录 */
export function updateMenu(data: any) {
  return request.post<any>(apiRoute.rbacMenuEdit, data)
}

/** 删除目录 */
export function deleteMenu(data: any) {
  return request.post<any>(apiRoute.rbacMenuRemove, data)
}

/** 编辑分配权限 */
export function updateGroupMenu(data: any) {
  return request.post<any>(apiRoute.rbacGroupAdd, data)
}

/** 指定组数据权限 */
export function getAdminGroupMenuList(params: { group_id: number }) {
  return request.get<any>(apiRoute.rbacGroupMenu, params)
}
