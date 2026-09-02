declare namespace ApiGallery {
  /** 作品模型 */
  interface Work {
    id: string
    uid: number
    title: string
    image: string
    prompt: string
    negative_prompt: string
    model_id: number
    model_name: string
    ratio: 'square' | 'portrait' | 'landscape'
    width: number
    height: number
    source: number
    is_public: number
    state: number
    like_count: number
    dislike_count: number
    collect_count: number
    comment_count: number
    hot_score: number
    expired_at: string
    created_at: string
    updated_at: string
  }

  /** 作品列表请求参数 */
  interface WorkListParams extends ApiBase.PageParams {
    uid?: number
    state?: number
    is_public?: number
    source?: number
    keywords?: string
    start_time?: string
    end_time?: string
  }

  /** 作品列表响应 */
  interface WorkListResult extends ApiBase.List<Work[]> {
    user_total_works?: number
    user_public_works?: number
    user_private_works?: number
  }

  /** 作品统计数据 */
  interface WorkStats {
    total_works: number
    public_works: number
    private_works: number
    today_works: number
    yesterday_works: number
    week_works: number
    month_works: number
    deleted_works: number
    novelai_works: number
    aicore_works: number
  }

  /** 修改作品状态参数 */
  interface UpdateWorkStateParams {
    work_id: string
    state: number
  }

  /** 批量修改作品状态参数 */
  interface BatchUpdateStateParams {
    work_ids: string
    state: number
  }

  /** 批量修改作品状态响应 */
  interface BatchUpdateStateResult {
    success_count: number
  }

  /** 批量删除作品参数 */
  interface BatchRemoveParams {
    work_ids: string
  }

  /** 批量删除作品响应 */
  interface BatchRemoveResult {
    success_count: number
  }
}
