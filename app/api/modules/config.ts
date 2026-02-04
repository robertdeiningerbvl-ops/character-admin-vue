import request from '../request'
import apiRoute from '../router'

/** 获取配置 */
export function getSiteConfig() {
  return request.get<any>(apiRoute.commonConfig)
}

/** 获取配置 */
export function getConfig(params: any) {
  return request.get<any>(apiRoute.configList, params)
}

/** 修改配置 */
export function updateConfig(data: any) {
  return request.post<any>(apiRoute.configEdit, data)
}
