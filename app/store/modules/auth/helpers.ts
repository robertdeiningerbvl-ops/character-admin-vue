/** 获取token */
export function getToken() {
  return localStg.get('token') || ''
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo = {} as ApiAccount.Info
  const userInfo: ApiAccount.Info = localStg.get('userInfo') || emptyInfo
  return userInfo
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('token')
  localStg.remove('userInfo')
}
