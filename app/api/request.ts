import qs from 'qs'
import { showErrorMsg } from './msg'
import type { Service, ContentType, Methods } from '@/types'

export async function handleServiceResult<T = any>(error: Service.RequestError | null, data: any) {
  if (error) {
    const fail: Service.FailedResult = {
      error,
      data: null
    }
    return fail
  }
  const success: Service.SuccessResult<T> = {
    error: null,
    data
  }
  return success
}

export function handleBackendError(backendResult: Record<string, any>) {
  const error: Service.RequestError = {
    type: 'backend',
    code: backendResult.code,
    msg: backendResult.msg
  }

  showErrorMsg({ title: 'Error', color: 'error', ...error })

  return error
}

export function handleResponseError(response: any) {
  const error: Service.RequestError = {
    type: 'fetch',
    code: 'DEFAULT',
    msg: 'Request Error~'
  }

  if (!window.navigator.onLine) {
    // 网路错误
    Object.assign(error, { code: 'NETWORK_ERROR', msg: 'Network Unavailable~' })
  } else {
    // 请求成功的状态码非200的错误
    const errorCode = typeof response === 'object' ? response.statusCode || response.status : response
    const msg = `NETWORK_ERROR: ${errorCode || response}`
    Object.assign(error, { type: 'http', code: errorCode, msg })
  }

  showErrorMsg({ title: 'Fetch Error', color: 'error', ...error })

  return error
}

class HttpRequest {
  async request<T>(
    url: string,
    method: Methods,
    data: any,
    requestOptions?: any
  ): Promise<Service.RequestResult<T>> {
    try {
      // 添加随机字符串
      if (data) {
        data._rid = generateRandomString(24)
      } else {
        data = { _rid: generateRandomString(24) }
      }

      const _headers: Record<string, string> = {
        token: localStg.get('token') || '',
        nation: 'en',
        ...(requestOptions?.headers || {})
      }

      const contentType = (_headers['content-type'] as ContentType) || 'application/x-www-form-urlencoded'

      let params: any = undefined
      let body: any = undefined

      // 处理 GET 和 DELETE 请求
      if (method === 'GET' || method === 'DELETE') {
        params = data
      }

      // 处理 POST 和 PUT 请求
      if (method === 'POST' || method === 'PUT') {
        const isFormData = data instanceof FormData

        if (contentType === 'multipart/form-data') {
          delete _headers['content-type']
          if (isFormData) {
            body = data
          } else {
            const formData = new FormData()
            for (const item in data) {
              formData.append(item, data[item])
            }
            body = formData
          }
        } else if (contentType === 'application/x-www-form-urlencoded') {
          _headers['content-type'] = contentType
          body = qs.stringify(data)
        } else {
          _headers['content-type'] = contentType
          body = data
        }
      }

      const response = await $fetch(`/admin/${url}`.replace(/(?<!:)\/{2,}/g, '/'), {
        method,
        headers: _headers,
        body,
        params
      })

      // 处理响应
      if ((response as any).sdp) {
        return handleServiceResult(null, response)
      } else if ((response as any).code === 1) {
        return handleServiceResult(null, (response as any).data)
      } else {
        const err = handleBackendError(response as any)
        return handleServiceResult(err, null)
      }
    } catch (error: any) {
      const err = handleResponseError(error?.statusCode || error?.message || 'Unknown Error')
      return handleServiceResult(err, null)
    }
  }

  get<T>(url: string, params?: any, options?: any) {
    return this.request<T>(url, 'GET', params, options)
  }

  post<T>(url: string, data: any, options?: any) {
    return this.request<T>(url, 'POST', data, options)
  }

  put<T>(url: string, data: any, options?: any) {
    return this.request<T>(url, 'PUT', data, options)
  }

  delete<T>(url: string, params: any, options?: any) {
    return this.request<T>(url, 'DELETE', params, options)
  }
}

const request = new HttpRequest()

export default request
