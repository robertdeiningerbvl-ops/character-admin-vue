import request from '../request'
import apiRoute from '../router'

/** 游戏分类列表 */
export function getAmusementCategoryList(params?: any) {
  return request.get<any>(apiRoute.amusementCategoryList, params)
}

/** 游戏分类新增 */
export function addAmusementCategory(data: any) {
  return request.post<any>(apiRoute.amusementCategoryAdd, data)
}

/** 游戏分类修改 */
export function updateAmusementCategory(data: any) {
  return request.post<any>(apiRoute.amusementCategoryEdit, data)
}

/** 游戏分类删除 */
export function removeAmusementCategory(data: any) {
  return request.post<any>(apiRoute.amusementCategoryRemove, data)
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

/** 修改角色卡状态 */
export function updateAmusementState(data: any) {
  return request.post<any>(apiRoute.amusementStateEdit, data)
}

/** 提交审核 */
export function submitAmusement(data: any) {
  return request.post<any>(apiRoute.amusementSubmit, data)
}

/** 获取版本详情 */
export function getAmusementVersionDetail(params: any) {
  return request.get<any>(apiRoute.amusementVersionDetail, params)
}

/** 新增版本 */
export function addAmusementVersion(data: any) {
  return request.post<any>(apiRoute.amusementVersionAdd, data)
}

/** 编辑版本 */
export function updateAmusementVersion(data: any) {
  return request.post<any>(apiRoute.amusementVersionEdit, data)
}

/** 删除版本 */
export function removeAmusementVersion(data: any) {
  return request.post<any>(apiRoute.amusementVersionRemove, data)
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
export function removeConductComment(data: any) {
  return request.post<any>(apiRoute.conductCommentRemove, data)
}

/** 获取助手列表 */
export function getAssistantList(params?: any) {
  return request.get<any>(apiRoute.assistantList, params)
}

/** 获取助手详情 */
export function getAssistantDetail(params?: any) {
  return request.get<any>(apiRoute.assistantDetail, params)
}

/** 编辑助手 */
export function updateAssistant(data: any) {
  return request.post<any>(apiRoute.assistantEdit, data)
}

/** 删除助手 */
export function removeAssistant(data: { id: number }) {
  return request.post<any>(apiRoute.assistantRemove, data)
}

/** 修改助手状态 */
export function updateAssistantState(data: any) {
  return request.post<any>(apiRoute.assistantStateEdit, data)
}

/** 获取聊天历史 */
export function getChatHistory(params: { biz_id: number, version_id?: number }) {
  return request.get<any>(apiRoute.chatHistory, params)
}
