import request from '../request'
import apiRoute from '../router'

/** 获取翻译列表 */
export function getLanguageList(params?: any) {
  return request.get<any>(apiRoute.commonLangList, params)
}

/** 新增翻译 */
export function addLanguage(data: any) {
  return request.post<any>(apiRoute.commonLangAdd, data)
}

/** 修改翻译 */
export function updateLanguage(data: any) {
  return request.post<any>(apiRoute.commonLangEdit, data)
}

/** 删除翻译 */
export function removeLanguage(data: any) {
  return request.post<any>(apiRoute.commonLangRemove, data)
}
