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

/** 代理用户筛选参数 */
export interface AgentUserParams {
  page?: number
  pagesize?: number
  username?: string
  code?: string
  parent_code?: string
  state?: number
}

/** 代理用户数据项 */
export interface AgentUserItem {
  id: number
  username: string
  code: string
  parent_code: string
  balance: number
  commission_ratio: number
  commission_diff_ratio: number
  withdraw_amount: number
  state: number
  created_at: string
  updated_at: string
}

/** 代理用户列表响应 */
export interface AgentUserResponse {
  list: AgentUserItem[]
  count: number
}

/** 代理用户创建/更新参数 */
export interface AgentUserFormData {
  id?: number
  username?: string
  password?: string
  commission_ratio?: number
  withdraw_amount?: number
  state?: number
}

/** 获取代理用户列表 */
export function getAgentUserList(params?: AgentUserParams) {
  return request.get<AgentUserResponse>(apiRoute.agentUser, params)
}

/** 创建代理用户 */
export function createAgentUser(data: AgentUserFormData) {
  return request.post<any>(apiRoute.agentUser, data)
}

/** 更新代理用户 */
export function updateAgentUser(data: AgentUserFormData) {
  return request.post<any>(apiRoute.agentUserEdit, data)
}

/** 代理渠道列表筛选参数 */
export interface AgentChannelListParams {
  page?: number
  pagesize?: number
  agent_code?: string
  channel_id?: string
  start_time?: string
  end_time?: string
}

/** 代理渠道列表数据项 */
export interface AgentChannelListItem {
  id: number
  agent_code: string
  channel_id: number
  commission_ratio: number
  commission_diff_ratio: number
  created_at: string
  updated_at: string
}

/** 代理渠道列表响应 */
export interface AgentChannelListResponse {
  list: AgentChannelListItem[]
  count: number
}

/** 获取代理渠道列表 */
export function getAgentChannelList(params?: AgentChannelListParams) {
  return request.get<AgentChannelListResponse>(apiRoute.agentChannelList, params)
}
