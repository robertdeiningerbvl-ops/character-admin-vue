export interface Card {
  id: number
  name: string
  description: string
}

export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type ContentType
  = | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'application/octet-stream'
    | 'text/plain'
    | 'text/html'
    | 'text/xml'
    | 'image/png'
    | 'image/jpeg'
    | 'image/webp'
    | 'image/jpg'
    | 'image/bmp'
    | 'image/svg+xml'
    | 'image/ico'
    | 'image/gif'
    | 'video/mp4'
    | 'audio/mpeg'

export namespace Service {
  export interface RequestError {
    type: 'backend' | 'fetch' | 'http'
    code: string | number
    msg: string
  }

  export interface FailedResult {
    error: RequestError
    data: null
  }

  export interface SuccessResult<T = any> {
    error: null
    data: T
  }

  export type RequestResult<T = any> = FailedResult | SuccessResult<T>
}
