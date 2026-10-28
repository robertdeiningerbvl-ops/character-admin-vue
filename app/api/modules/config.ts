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

/** 发送测试错误告警（按已保存的 ALERT_TG） */
export function sendAlertTestRequest() {
  return request.post<any>(apiRoute.alertTest, {})
}
