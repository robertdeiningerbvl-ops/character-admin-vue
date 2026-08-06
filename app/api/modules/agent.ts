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

/** 代理提现订单筛选参数 */
export interface AgentWithdrawalParams {
  page?: number
  pagesize?: number
  agent_code?: string
  state?: number
  start_time?: string
  end_time?: string
}

/** 代理提现订单数据项 */
export interface AgentWithdrawalItem {
  id: number
  order_no: string
  agent_code: string
  amount: number
  fee: number
  actual_amount: number
  withdraw_type: number
  state: number
  bank_name?: string
  bank_account?: string
  bank_account_name?: string
  alipay_account?: string
  alipay_name?: string
  wechat_account?: string
  wechat_name?: string
  remark?: string
  reject_reason?: string
  created_at: string
  updated_at: string
}

/** 代理提现订单列表响应 */
export interface AgentWithdrawalResponse {
  list: AgentWithdrawalItem[]
  count: number
}

/** 审核通过参数 */
export interface AgentWithdrawalApproveParams {
  id: number
  remark?: string
}

/** 审核拒绝参数 */
export interface AgentWithdrawalRejectParams {
  id: number
  reject_reason: string
}

/** 获取代理提现订单列表 */
export function getAgentWithdrawalList(params?: AgentWithdrawalParams) {
  return request.get<AgentWithdrawalResponse>(apiRoute.agentWithdrawalList, params)
}

/** 获取代理提现订单详情 */
export function getAgentWithdrawalDetail(id: number) {
  return request.get<AgentWithdrawalItem>(apiRoute.agentWithdrawalGet, { id })
}

/** 审核通过 */
export function approveAgentWithdrawal(data: AgentWithdrawalApproveParams) {
  return request.post<any>(apiRoute.agentWithdrawalApprove, data)
}

/** 审核拒绝 */
export function rejectAgentWithdrawal(data: AgentWithdrawalRejectParams) {
  return request.post<any>(apiRoute.agentWithdrawalReject, data)
}
