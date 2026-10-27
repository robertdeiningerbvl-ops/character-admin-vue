import request from '../request'
import apiRoute from '../router'

/**
 * 运营统计（后端 character-card 2026-10-19）
 * 时间参数统一为 start_time / end_time：YYYY-MM-DD（包含结束当天）
 */

/** 模型使用统计 group_by: model | backend | day；feature: chat | tts | scene_image | asr（空为全部）；最多 31 天 */
export function getModelUsageStats(params: { start_time: string, end_time: string, feature?: string, group_by?: string }) {
  return request.get<any>(apiRoute.modelUsageStats, params)
}

/** 角色卡聊天轮次：用户数、轮次、人均轮次、按天、分布、每个用户（分页）；最多 31 天 */
export function getChatTurnStats(params: { start_time: string, end_time: string, page?: number, pagesize?: number }) {
  return request.get<any>(apiRoute.chatTurnStats, params)
}

/** 新用户留存 group_by: day | login_type | channel | utm_source | host | platform | all；最多 92 天 */
export function getRetentionStats(params: { start_time: string, end_time: string, group_by?: string }) {
  return request.get<any>(apiRoute.retentionStats, params)
}

/** 每日活跃（新 / 老用户、按域名） */
export function getActiveDaily(params: { start_time: string, end_time: string }) {
  return request.get<any>(apiRoute.activeDaily, params)
}

/** 付费漏斗 group_by: channel | tier | package | day */
export function getPaymentFunnel(params: { start_time: string, end_time: string, group_by?: string }) {
  return request.get<any>(apiRoute.paymentFunnel, params)
}

/** 新用户首充 + 付费墙转化 group_by 同留存 */
export function getPaymentConversion(params: { start_time: string, end_time: string, group_by?: string }) {
  return request.get<any>(apiRoute.paymentConversion, params)
}

/** 每日运营报告预览 day: YYYY-MM-DD（不传为昨天） */
export function getOpsReportPreview(params?: { day?: string }) {
  return request.get<any>(apiRoute.opsReportPreview, params)
}
