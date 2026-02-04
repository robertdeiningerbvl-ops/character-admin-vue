import request from '../request'
import apiRoute from '../router'

/** 游戏分类列表 */
export function getAmusementCategoryList(params?: any) {
  return request.get<any>(apiRoute.AmusementCategoryList, params)
}

/** 游戏分类新增 */
export function addAmusementCategory(data: any) {
  return request.post<any>(apiRoute.AmusementCategoryAdd, data)
}

/** 游戏分类修改 */
export function updateAmusementCategory(data: any) {
  return request.post<any>(apiRoute.AmusementCategoryEdit, data)
}

/** 游戏分类删除 */
export function removeAmusementCategory(data: any) {
  return request.post<any>(apiRoute.AmusementCategoryRemove, data)
}

/** 获取角色卡列表 */
export function getAmusementList(params?: any) {
  return request.get<any>(apiRoute.amusementList, params)
}

/** 获取角色卡详情 */
export function getAmusementDetail(params?: any) {
  return request.get<any>(apiRoute.amusementDetail, params)
}

/** 新增角色卡 */
export function addAmusement(data: any) {
  return request.post<any>(apiRoute.amusementAdd, data)
}

/** 编辑角色卡 */
export function updateAmusement(data: any) {
  return request.post<any>(apiRoute.amusementEdit, data)
}

/** 删除角色卡 */
export function removeAmusement(data: { id: number }) {
  return request.post<any>(apiRoute.amusementRemove, data)
}

/** 获取游戏参数列表 */
export function getAmusementParameterList(params?: any) {
  return request.get<any>(apiRoute.amusementParameterList, params)
}

/** 新增游戏参数 */
export function addAmusementParameter(data: any) {
  return request.post<any>(apiRoute.amusementParameterAdd, data)
}

/** 编辑游戏参数 */
export function updateAmusementParameter(data: any) {
  return request.post<any>(apiRoute.amusementParameterEdit, data)
}

/** 删除游戏参数 */
export function removeAmusementParameter(data: { id: number }) {
  return request.post<any>(apiRoute.amusementParameterRemove, data)
}
/** 获取评论列表 */
export function getConductCommentList(params?: any) {
  return request.get<any>(apiRoute.conductCommentList, params)
}

/** 评论下回复 */
export function getConductCommentReplyList(params?: any) {
  return request.get<any>(apiRoute.conductCommentReplyList, params)
}

/** 删除评论 */
export function removeConductCommentRemove(data: any) {
  return request.post<any>(apiRoute.conductCommentRemove, data)
}
