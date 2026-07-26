import request from '../request'
import apiRoute from '../router'

/** 代理渠道属性筛选参数 */
export interface AgentChannelAttrsParams {
  page?: number
  pagesize?: number
  agent_code?: string
  channel_id?: string
  start_time?: string
  end_time?: string
}

/** 代理渠道属性数据项 */
export interface AgentChannelAttrsItem {
  id: number
  agent_code: string
  channel_id: string
  consume_amount: string
  profit: string
  created_at: string
  day_time?: string
}

/** 代理渠道属性列表响应 */
export interface AgentChannelAttrsResponse {
  list: AgentChannelAttrsItem[]
  count: number
}

/** 获取代理渠道属性汇总统计 */
export function getAgentChannelAttrs(params?: AgentChannelAttrsParams) {
  return request.get<AgentChannelAttrsResponse>(apiRoute.agentChannelAttrs, params)
}

/** 获取代理渠道属性每日明细 */
export function getAgentChannelAttrsDay(params?: AgentChannelAttrsParams) {
  return request.get<AgentChannelAttrsResponse>(apiRoute.agentChannelAttrsDay, params)
}
