import request from '../request'
import apiRoute from '../router'

/** 视频列表 */
export function getVideoList(params?: any) {
  return request.get<any>(apiRoute.videoList, params)
}

/** 视频新增 */
export function addVideo(data: any) {
  return request.post<any>(apiRoute.videoAdd, data)
}

/** 视频修改 */
export function updateVideo(data: any) {
  return request.post<any>(apiRoute.videoEdit, data)
}

/** 视频上架(1)/下架(2)/删除(9) */
export function updateVideoState(data: { id: number, state: number }) {
  return request.post<any>(apiRoute.videoState, data)
}

/** 上传视频文件（字段 file，mp4/mov/webm/m4v，≤500MB） */
export function uploadVideoFile(data: FormData) {
  return request.post<any>(apiRoute.videoUpload, data, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}
