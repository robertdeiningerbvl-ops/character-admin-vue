<script setup lang="ts">
import { getCommonModelConsumeStatisticsList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'ModelStatistics' })

const state = reactive({
  loading: false,
  list: [] as any[],
  total: 0,
  page: 1,
  pagesize: 20,
  uid: '',
  startTime: '',
  endTime: ''
})

const loadData = async () => {
  state.loading = true
  try {
    const params: any = { page: state.page, pagesize: state.pagesize }
    if (state.uid) params.uid = state.uid
    if (state.startTime) params.start_time = state.startTime
    if (state.endTime) params.end_time = state.endTime
    const { data } = await getCommonModelConsumeStatisticsList(params)
    state.list = data?.list || []
    state.total = data?.total || 0
  } finally {
    state.loading = false
  }
}

const resetFilter = () => {
  state.uid = ''
  state.startTime = ''
  state.endTime = ''
  state.page = 1
  loadData()
}

const search = () => {
  state.page = 1
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <!-- 筛选栏 -->
    <div class="flex items-center gap-2 mb-6 flex-wrap">
      <UInput v-model="state.uid" placeholder="用户ID" class="w-32" />
      <UInput v-model="state.startTime" placeholder="开始时间 RFC3339" class="w-52" />
      <UInput v-model="state.endTime" placeholder="结束时间 RFC3339" class="w-52" />
      <UButton icon="i-lucide-search" label="查询" @click="search" />
      <UButton icon="i-lucide-rotate-ccw" label="重置" color="neutral" variant="outline" @click="resetFilter" />
    </div>

    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <!-- 卡片列表 -->
    <div v-else>
      <div v-if="state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
        <UIcon name="i-lucide-bar-chart-2" class="w-12 h-12 mx-auto mb-2 opacity-40" />
        <p>暂无统计数据</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-3">
        <!-- 表头 -->
        <div class="grid grid-cols-8 gap-4 px-4 py-2 text-xs font-semibold text-(--ui-text-muted) uppercase tracking-wider">
          <span>ID</span>
          <span>用户ID</span>
          <span>模型单价</span>
          <span class="col-span-2">输入</span>
          <span class="col-span-2">输出</span>
          <span>创建时间</span>
        </div>

        <div
          v-for="item in state.list"
          :key="item.id"
          class="grid grid-cols-8 gap-4 items-center px-4 py-3 rounded-xl bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary)/50 transition-all"
        >
          <span class="text-xs text-(--ui-text-muted) font-mono">#{{ item.id }}</span>

          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-(--ui-primary)/10 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-user" class="w-3.5 h-3.5 text-(--ui-primary)" />
            </div>
            <span class="text-sm font-medium">{{ item.uid }}</span>
          </div>

          <UBadge color="warning" variant="subtle" class="w-fit">
            {{ item.price }}
          </UBadge>

          <div class="col-span-2 flex items-center gap-3">
            <div class="text-center">
              <div class="text-xs text-(--ui-text-muted) mb-0.5">Token</div>
              <div class="text-sm font-semibold text-blue-500">{{ item.enter_count_token }}</div>
            </div>
            <div class="w-px h-8 bg-(--ui-border)" />
            <div class="text-center">
              <div class="text-xs text-(--ui-text-muted) mb-0.5">电量</div>
              <div class="text-sm font-semibold text-cyan-500">{{ item.enter_battery }}</div>
            </div>
          </div>

          <div class="col-span-2 flex items-center gap-3">
            <div class="text-center">
              <div class="text-xs text-(--ui-text-muted) mb-0.5">Token</div>
              <div class="text-sm font-semibold text-purple-500">{{ item.out_count_token }}</div>
            </div>
            <div class="w-px h-8 bg-(--ui-border)" />
            <div class="text-center">
              <div class="text-xs text-(--ui-text-muted) mb-0.5">电量</div>
              <div class="text-sm font-semibold text-pink-500">{{ item.out_battery }}</div>
            </div>
          </div>

          <span class="text-xs text-(--ui-text-muted)">{{ formatToDateTime(item.created_at) }}</span>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="state.total > state.pagesize" class="flex justify-end mt-4">
      <UPagination
        v-model:page="state.page"
        :total="state.total"
        :page-count="state.pagesize"
        @update:page="loadData"
      />
    </div>
  </DashboardLayout>
</template>
