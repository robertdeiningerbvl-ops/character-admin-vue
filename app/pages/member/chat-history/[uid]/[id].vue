<script setup lang="ts">
import { getAmusementChatHistory } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberChatHistory' })

const route = useRoute()
const uid = computed(() => route.params.uid as string)
const amusementId = computed(() => route.params.id as string)

const state = reactive({
  loading: false,
  list: [] as any[]
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getAmusementChatHistory({
      uid: uid.value,
      biz_id: amusementId.value
    })
    state.list = data?.history || []
  } finally {
    state.loading = false
  }
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <div class="mb-4 flex items-center gap-2">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" :to="`/member/chat/${uid}`" />
      <h2 class="text-lg font-semibold">聊天历史</h2>
      <UBadge color="neutral" variant="subtle">共 {{ state.list.length }} 条</UBadge>
    </div>

    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in state.list"
        :key="item._id"
        class="p-4 rounded-xl border border-(--ui-border)"
        :class="item.role === 'assistant' ? 'bg-(--ui-bg-elevated)' : 'bg-(--ui-bg)'"
      >
        <div class="flex items-center gap-2 mb-2">
          <UBadge :color="item.role === 'assistant' ? 'primary' : 'neutral'" variant="subtle" size="xs">
            {{ item.role === 'assistant' ? 'AI' : '用户' }}
          </UBadge>
          <span class="text-xs text-(--ui-text-muted)">{{ formatToDateTime(item.created_at) }}</span>
        </div>
        <div class="text-sm whitespace-pre-wrap">{{ item.content }}</div>
      </div>
    </div>

    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon name="i-lucide-message-circle-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无聊天历史</p>
    </div>
  </DashboardLayout>
</template>
