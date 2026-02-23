<script setup lang="ts">
import { getConductCollectList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'MemberCollectList' })

const route = useRoute()
const uid = computed(() => route.params.id as string)

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateMap: Record<number, [string, BadgeColor]> = {
  0: ['未审核', 'warning'],
  2: ['正常', 'success'],
  4: ['已删除', 'error']
}

const state = reactive({
  loading: false,
  list: [] as any[],
  total: 0,
  page: 1,
  pageSize: 12
})

const loadData = async () => {
  state.loading = true
  try {
    const { data } = await getConductCollectList({
      uid: uid.value,
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
    <!-- 头部信息 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          to="/member/list"
        />
        <h2 class="text-lg font-semibold">
          用户收藏
        </h2>
        <UBadge color="neutral" variant="subtle">
          共 {{ state.total }} 个
        </UBadge>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 卡片列表 -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <div
        v-for="item in state.list"
        :key="item.id"
        class="rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) overflow-hidden hover:border-(--ui-primary) transition-all"
      >
        <!-- 封面图 -->
        <div class="relative h-32">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
          <div class="absolute top-2 right-2">
            <UBadge :color="stateMap[item.state]?.[1] || 'neutral'" variant="solid" size="xs">
              {{ stateMap[item.state]?.[0] || '未知' }}
            </UBadge>
          </div>
          <div v-if="item.nsfw === 2" class="absolute top-2 left-2">
            <UBadge color="error" variant="solid" size="xs">
              NSFW
            </UBadge>
          </div>
        </div>

        <!-- 信息 -->
        <div class="p-3 space-y-2">
          <div class="font-medium truncate" :title="item.name">
            {{ item.name }}
          </div>

          <!-- 统计 -->
          <div class="flex items-center gap-3 text-xs text-(--ui-text-muted)">
            <span class="inline-flex items-center gap-1">
              <UIcon name="i-lucide-zap" class="w-3 h-3 text-yellow-500" />
              {{ item.battery || 0 }}
            </span>
            <span class="inline-flex items-center gap-1">
              <UIcon name="i-lucide-bookmark" class="w-3 h-3 text-blue-500" />
              {{ item.collect_count || 0 }}
            </span>
            <span class="inline-flex items-center gap-1">
              <UIcon name="i-lucide-message-circle" class="w-3 h-3 text-green-500" />
              {{ item.comment_count || 0 }}
            </span>
            <span class="inline-flex items-center gap-1">
              <UIcon name="i-lucide-play" class="w-3 h-3 text-purple-500" />
              {{ item.play_count || 0 }}
            </span>
          </div>

          <!-- 时间 -->
          <div class="text-xs text-(--ui-text-muted)">
            {{ formatToDateTime(item.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!state.loading && state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      <UIcon name="i-lucide-bookmark-x" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>暂无收藏</p>
    </div>

    <!-- 分页 -->
    <div v-if="state.total > state.pageSize" class="mt-4 flex justify-end">
      <UPagination
        :model-value="state.page"
        :total="state.total"
        :page-count="state.pageSize"
        @update:model-value="onPageChange"
      />
    </div>
  </DashboardLayout>
</template>
