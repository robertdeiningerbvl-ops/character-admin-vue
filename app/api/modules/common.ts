import request from '../request'
import apiRoute from '../router'

/** 套餐列表 */
export function getCommonCoinsList(params?: any) {
  return request.get<any>(apiRoute.commonCoinsList, params)
}

/** 套餐新增 */
export function addCommonCoins(data: any) {
  return request.post<any>(apiRoute.commonCoinsAdd, data)
}

/** 套餐修改 */
export function updateCommonCoins(data: any) {
  return request.post<any>(apiRoute.commonCoinsEdit, data)
}

/** 套餐删除 */
export function removeCommonCcoins(data: any) {
  return request.post<any>(apiRoute.commonCcoinsRemove, data)
}

/** 标签列表 */
export function getCommonTagList(params?: any) {
  return request.get<any>(apiRoute.commonTagList, params)
}

/** 标签新增 */
export function addCommonTag(data: any) {
  return request.post<any>(apiRoute.commonTagAdd, data)
}

/** 标签修改 */
export function updateCommonTag(data: any) {
  return request.post<any>(apiRoute.commonTagEdit, data)
}

/** 标签删除 */
export function removeCommonTag(data: any) {
  return request.post<any>(apiRoute.commonTagRemove, data)
}

/** 模型列表 */
export function getCommonModelList(params?: any) {
  return request.get<any>(apiRoute.commonModelList, params)
}

/** 模型新增 */
export function addCommonModel(data: any) {
  return request.post<any>(apiRoute.commonModelAdd, data)
}

/**  模型修改 */
export function updateCommonModel(data: any) {
  return request.post<any>(apiRoute.commonModelEdit, data)
}

/** 模型预设列表 */
export function getCommonModelPresetList(params?: any) {
  return request.get<any>(apiRoute.commonModelPresetList, params)
}

/** 模型预设新增 */
export function addCommonModelPreset(data: any) {
  return request.post<any>(apiRoute.commonModelPresetAdd, data)
}

/**  模型预设修改 */
export function updateCommonModelPreset(data: any) {
  return request.post<any>(apiRoute.commonModelPresetEdit, data)
}

/** 模型预设删除 */
export function removeCommonModelPreset(data: any) {
  return request.post<any>(apiRoute.commonModelPresetRemove, data)
}

/** 模型token列表 */
export function getCommonModelTokenList(params?: any) {
  return request.get<any>(apiRoute.commonModelTokenList, params)
}

/** 模型token新增 */
export function addCommonModelToken(data: any) {
  return request.post<any>(apiRoute.commonModelTokenAdd, data)
}

/**  模型token修改 */
export function updateCommonModelToken(data: any) {
  return request.post<any>(apiRoute.commonModelTokenEdit, data)
}

/** 模型token删除 */
export function removeCommonModelToken(data: any) {
  return request.post<any>(apiRoute.commonModelTokenRemove, data)
}

/** 系统消息列表 */
export function getCommonMessageList(params?: any) {
  return request.get<any>(apiRoute.commonMessageList, params)
}

/** 系统消息新增 */
export function addCommonMessage(data: any) {
  return request.post<any>(apiRoute.commonMessageAdd, data)
}

/**  系统消息修改 */
export function updateCommonMessage(data: any) {
  return request.post<any>(apiRoute.commonMessageEdit, data)
}

/** 系统消息删除 */
export function removeCommonMessage(data: any) {
  return request.post<any>(apiRoute.commonMessageRemove, data)
}

/** 获取营销任务配置 */
export function getMarketingList() {
  return request.get<any>(apiRoute.marketingList)
}

/** 修改营销任务配置 */
export function updateMarketingConfig(data: any) {
  return request.post<any>(apiRoute.marketingEdit, data)
}

/** 敏感词列表 */
export function getCommonSensitiveList(params?: any) {
  return request.get<any>(apiRoute.commonSensitiveList, params)
}

/** 敏感词新增 */
export function addCommonSensitive(data: any) {
  return request.post<any>(apiRoute.commonSensitiveAdd, data)
}

/** 敏感词修改 */
export function updateCommonSensitive(data: any) {
  return request.post<any>(apiRoute.commonSensitiveEdit, data)
}

/** 敏感词删除 */
export function removeCommonSensitive(data: any) {
  return request.post<any>(apiRoute.commonSensitiveRemove, data)
}

/** 反馈日志列表 */
export function getCommonFeedList(params?: any) {
  return request.get<any>(apiRoute.CommonFeedList, params)
}

/** 反馈日志处理 */
export function updateCommonFeed(data: any) {
  return request.post<any>(apiRoute.CommonFeedEdit, data)
}

/** 反馈日志删除 */
export function removeCommonFeed(data: any) {
  return request.post<any>(apiRoute.CommonFeedRemove, data)
}
