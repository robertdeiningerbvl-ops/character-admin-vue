<script setup lang="ts">
import { getAdminWorkStats } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'GalleryStatistics'
})

const stats = ref<ApiGallery.WorkStats | null>(null)
const loading = ref(false)
const toast = useToast()

const loadStats = async () => {
  loading.value = true
  try {
    stats.value = await getAdminWorkStats()
  } catch (error: any) {
    toast.add({
      title: '加载失败',
      description: error.message || '获取统计数据失败',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})

const statsCards = computed(() => {
  if (!stats.value) return []

  return [
    {
      title: '总作品数',
      value: stats.value.total_works,
      icon: 'material-symbols:image-outline',
      color: 'blue'
    },
    {
      title: '公开作品',
      value: stats.value.public_works,
      icon: 'material-symbols:public',
      color: 'green'
    },
    {
      title: '私有作品',
      value: stats.value.private_works,
      icon: 'material-symbols:lock-outline',
      color: 'gray'
    },
    {
      title: '今日新增',
      value: stats.value.today_works,
      icon: 'material-symbols:today-outline',
      color: 'purple'
    },
    {
      title: '昨日新增',
      value: stats.value.yesterday_works,
      icon: 'material-symbols:history',
      color: 'indigo'
    },
    {
      title: '本周新增',
      value: stats.value.week_works,
      icon: 'material-symbols:calendar-view-week-outline',
      color: 'cyan'
    },
    {
      title: '本月新增',
      value: stats.value.month_works,
      icon: 'material-symbols:calendar-month-outline',
      color: 'teal'
    },
    {
      title: '已删除',
      value: stats.value.deleted_works,
      icon: 'material-symbols:delete-outline',
      color: 'red'
    },
    {
      title: 'NovelAI 作品',
      value: stats.value.novelai_works,
      icon: 'material-symbols:brush-outline',
      color: 'pink'
    },
    {
      title: 'Aicore 作品',
      value: stats.value.aicore_works,
      icon: 'material-symbols:auto-awesome',
      color: 'amber'
    }
  ]
})
</script>

<template>
  <div class="p-4 space-y-6">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">画廊作品统计</h2>
          <UButton @click="loadStats" :loading="loading" icon="material-symbols:refresh">
            刷新
          </UButton>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <USpinner size="lg" />
      </div>

      <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <UCard v-for="card in statsCards" :key="card.title" :ui="{ body: { padding: 'p-4' } }">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ card.title }}</p>
              <p class="text-2xl font-bold">{{ card.value.toLocaleString() }}</p>
            </div>
            <UIcon
              :name="card.icon"
              class="w-8 h-8"
              :class="`text-${card.color}-500`"
            />
          </div>
        </UCard>
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        暂无数据
      </div>
    </UCard>

    <!-- 图表区域 (可选扩展) -->
    <UCard v-if="stats">
      <template #header>
        <h3 class="text-lg font-semibold">作品来源分布</h3>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium mb-2">公开/私有比例</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">公开作品</span>
              <span class="text-sm font-medium">
                {{ ((stats.public_works / stats.total_works) * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full"
                :style="{ width: `${(stats.public_works / stats.total_works) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">私有作品</span>
              <span class="text-sm font-medium">
                {{ ((stats.private_works / stats.total_works) * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gray-500 h-2 rounded-full"
                :style="{ width: `${(stats.private_works / stats.total_works) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium mb-2">模型使用分布</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">NovelAI</span>
              <span class="text-sm font-medium">
                {{ ((stats.novelai_works / stats.total_works) * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-pink-500 h-2 rounded-full"
                :style="{ width: `${(stats.novelai_works / stats.total_works) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Aicore</span>
              <span class="text-sm font-medium">
                {{ ((stats.aicore_works / stats.total_works) * 100).toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-amber-500 h-2 rounded-full"
                :style="{ width: `${(stats.aicore_works / stats.total_works) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
