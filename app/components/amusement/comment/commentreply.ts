import { getConductCommentReplyList } from '~/api'

export interface Member {
  id: number
  username: string
  avatar: string
}

export interface CommentReply {
  id: number
  parent_id: number
  content: string
  created_at: string
  member: Member
}

export function useCommentReplies() {
  const expandedIds = ref<Set<number>>(new Set())
  const loadingIds = ref<Set<number>>(new Set())
  const replyMap = ref<Record<number, CommentReply[]>>({})
  const route = useRoute()

  const toggle = async (row: { id: number }) => {
    const id = row.id
    /** 已展开 → 收起 */
    if (expandedIds.value.has(id)) {
      expandedIds.value.delete(id)
      return
    }
    expandedIds.value.add(id)
    if (replyMap.value[id]) return
    const bizId = route.params.id as string
    loadingIds.value.add(id)
    try {
      const res = await getConductCommentReplyList({
        comment_id: id,
        biz_id: bizId
      })
      console.log('res', res)
      replyMap.value[id] = res.data.list
    } finally {
      loadingIds.value.delete(id)
    }
  }
  return {
    expandedIds,
    loadingIds,
    replyMap,
    toggle
  }
}
