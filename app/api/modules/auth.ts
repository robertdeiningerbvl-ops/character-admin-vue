import request from '../request'
import apiRoute from '../router'

/** 登录 */
export function login(data: ApiAuth.LoginParams) {
  return request.post<ApiAuth.LoginResult>(apiRoute.adminLogin, data)
}

/** 登录之前 */
export function getCommonConfig(params?: any) {
  return request.get<any>(apiRoute.commonConfig, params)
}
