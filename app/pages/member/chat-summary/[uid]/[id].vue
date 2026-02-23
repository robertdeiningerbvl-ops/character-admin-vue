<script setup lang="ts">
import { getAmusementChatSummary } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberChatSummary' })

const route = useRoute()
const uid = computed(() => route.params.uid as string)
const amusementId = computed(() => route.params.id as string)

const state = reactive({
  loading: false,
  list: [] as any[],
  total: 0,
  page: 1,
  pageSize: 20
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getAmusementChatSummary({
      uid: uid.value,
      biz_id: amusementId.value,
      page: state.page,
      pagesize: state.pageSize
    })
    state.list = data?.list || []
    state.total = data?.count || 0
  } finally {
    state.loading = false
  }
}

const onPageChange = (page: number) => {
  state.page = page
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" :to="`/member/chat/${uid}`" />
        <h2 class="text-lg font-semibold">聊天摘要</h2>
        <UBadge color="neutral" variant="subtle">共 {{ state.total }} 条</UBadge>
      </div>
    </div>

    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="p-4 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border)"
      >
        <div class="text-sm">{{ item.content }}</div>
        <div class="mt-2 text-xs text-(--ui-text-muted)">{{ formatToDateTime(item.created_at) }}</div>
      </div>
    </div>

    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon name="i-lucide-file-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无摘要</p>
    </div>

    <div v-if="state.total > state.pageSize" class="mt-4 flex justify-end">
      <UPagination :model-value="state.page" :total="state.total" :page-count="state.pageSize" @update:model-value="onPageChange" />
    </div>
  </DashboardLayout>
</template>
