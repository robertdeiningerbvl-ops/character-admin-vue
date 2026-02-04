import request from '../request'
import apiRoute from '../router'

export function getMemberList(params?: any) {
  return request.get<any>(apiRoute.memberList, params)
}

/** 编辑客户 */
export function updateMember(data: any) {
  return request.post<any>(apiRoute.memberEdit, data)
}

/** 客户加钱 */
export function updateBatteryMember(data: any) {
  return request.post<any>(apiRoute.memberBatteryEdit, data)
}

/** 获取用户等级列表 */
export function getMemberLevelList(params?: any) {
  return request.get<any>(apiRoute.memberLvList, params)
}

/** 编辑客户等级 */
export function updateMemberLevel(data: any) {
  return request.post<any>(apiRoute.memberLvEdit, data)
}

/** 获取用户流水列表 */
export function getMemberWalletLogList(params?: any) {
  return request.get<any>(apiRoute.memberWalletLogList, params)
}

/** 获取用户兑换列表 */
export function getMemberInvitationCodeList(params?: any) {
  return request.get<any>(apiRoute.memberInvitationCodeList, params)
}

/** 生成兑换卡 */
export function addMemberInvitationCodeGenerate(params?: any) {
  return request.post<any>(apiRoute.memberInvitationCodeGenerate, params)
}

/** 获取收藏列表 */
export function getConductCollectList(params?: any) {
  return request.get<any>(apiRoute.memberCollectList, params)
}

/** 获取用户邀请列表 */
export function getMemberMarketingInviteList(params?: any) {
  return request.get<any>(apiRoute.memberMarketingInviteList, params)
}
