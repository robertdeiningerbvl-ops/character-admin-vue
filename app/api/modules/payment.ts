import request from '../request'
import apiRoute from '../router'

/** 支付类型列表 */
export function getPaymentListList(params?: any) {
  return request.get<any>(apiRoute.paymentList, params)
}

/** 支付类型修改 */
export function updatePayment(data: any) {
  return request.post<any>(apiRoute.paymentEdit, data)
}

/** 支付通道列表 */
export function getPaymentTypeList(data: any) {
  return request.get<any>(apiRoute.paymentTypeList, data)
}

/** 支付通道增加 */
export function addPaymentType(data: any) {
  return request.post<any>(apiRoute.paymentTypeAdd, data)
}

/** 支付通道修改 */
export function updatePaymentType(data: any) {
  return request.post<any>(apiRoute.paymentTypeEdit, data)
}

/** 支付通道删除 */
export function removePaymentType(data: any) {
  return request.post<any>(apiRoute.paymentTyperemove, data)
}

/** 支付订单列表 */
export function getPaymentOrderList(data: any) {
  return request.get<any>(apiRoute.paymentOrderList, data)
}

/** 支付订单编辑 */
export function updatePaymentOrder(data: any) {
  return request.post<any>(apiRoute.paymentOrderEdit, data)
}
