<script setup lang="ts">
import dayjs from 'dayjs'
import { getCommonInviteStatistics } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'InviteStatistics'
})

const state = reactive({
  loading: false,
  list: [] as any[],
  total: 0,
  searchCode: '',
  dateRange: {
    start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  },
  page: 1,
  pageSize: 10,
  expandedRows: new Set<string>()
})

// 前端搜索过滤
const filteredList = computed(() => {
  if (!state.searchCode) return state.list
  return state.list.filter(item =>
    item.invitation_code.toLowerCase().includes(state.searchCode.toLowerCase())
  )
})

// 加载数据
async function loadData(resetPage = true) {
  state.loading = true
  state.expandedRows.clear()
  if (resetPage) state.page = 1
  const { data, error } = await getCommonInviteStatistics({
    start: state.dateRange.start,
    end: state.dateRange.end,
    page: state.page,
    pagesize: state.pageSize
  })
  if (!error && data) {
    state.list = data.list || []
    state.total = data.count || 0
  }
  state.loading = false
}

// 重置
function reset() {
  state.dateRange.start = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
  state.dateRange.end = dayjs().format('YYYY-MM-DD')
  state.searchCode = ''
  loadData()
}

// 分页变化
function onPageChange(page: number) {
  state.page = page
  loadData(false)
}

// 每页条数变化
function onPageSizeChange() {
  state.page = 1
  loadData(false)
}

// 计算汇总
function getSummary(item: any) {
  const summary: Record<string, number> = {}
  item.days?.forEach((day: any) => {
    day.stats?.forEach((stat: any) => {
      summary[stat.f] = (summary[stat.f] || 0) + stat.num
    })
  })
  return summary
}

// 切换展开
function toggleExpand(code: string) {
  if (state.expandedRows.has(code)) {
    state.expandedRows.delete(code)
  } else {
    state.expandedRows.add(code)
  }
}

// 获取日期统计值
function getDayStat(day: any, field: string) {
  return day.stats?.find((s: any) => s.f === field)?.num || 0
}

// 搜索时重置页码
watch(() => state.searchCode, () => {
  state.page = 1
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <DashboardLayout>
    <!-- 搜索栏 -->
    <UCard :ui="{ body: 'p-4' }" class="mb-6">
      <div class="flex flex-wrap items-end gap-4">
        <UFormField label="开始日期" class="w-[150px]">
          <UInput v-model="state.dateRange.start" type="date" />
        </UFormField>
        <UFormField label="结束日期" class="w-[150px]">
          <UInput v-model="state.dateRange.end" type="date" />
        </UFormField>
        <UFormField label="邀请码" class="w-[160px]">
          <UInput v-model="state.searchCode" placeholder="搜索邀请码" />
        </UFormField>
        <div class="flex items-center gap-2">
          <UButton
            :loading="state.loading"
            label="查询"
            icon="i-lucide-search"
            @on-click="loadData"
          />
          <UButton
            :disabled="state.loading"
            label="重置"
            icon="fluent:arrow-reset-24-filled"
            color="neutral"
            variant="outline"
            @click="reset"
          />
        </div>
      </div>
    </UCard>

    <!-- 表格 -->
    <UCard :ui="{ body: 'p-0' }">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-(--ui-bg-elevated)/50 text-(--ui-text-muted)">
              <th class="w-12 px-3 py-3" />
              <th class="px-3 py-3 text-left font-semibold">
                邀请码
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                注册
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                活跃
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                游客
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                充值人数
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                充值金额
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                成功单
              </th>
              <th class="px-3 py-3 text-right font-semibold">
                未付款
              </th>
            </tr>
          </thead>
          <tbody v-if="state.loading">
            <tr>
              <td colspan="9" class="px-3 py-8 text-center text-(--ui-text-muted)">
                <UIcon name="i-lucide-loader-2" class="size-5 animate-spin" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="filteredList.length === 0">
            <tr>
              <td colspan="9" class="px-3 py-8 text-center text-(--ui-text-muted)">
                暂无数据
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <template v-for="item in filteredList" :key="item.invitation_code">
              <tr class="border-t border-(--ui-border) hover:bg-(--ui-bg-elevated)/30 transition-colors">
                <td class="px-3 py-3">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :icon="state.expandedRows.has(item.invitation_code) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                    @click="toggleExpand(item.invitation_code)"
                  />
                </td>
                <td class="px-3 py-3">
                  <span class="font-mono text-(--ui-primary)">{{ item.invitation_code }}</span>
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).ZC_NUM || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).HY_NUM || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).HY_YK_NUM || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).CZ_NUM || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).CZ_PRICE || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).CZ_SUCCESS || 0 }}
                </td>
                <td class="px-3 py-3 text-right">
                  {{ getSummary(item).CZ_ERROR || 0 }}
                </td>
              </tr>
              <!-- 展开明细 -->
              <tr v-if="state.expandedRows.has(item.invitation_code)">
                <td colspan="9" class="p-0">
                  <div class="bg-(--ui-bg-muted)/50 px-4 py-3">
                    <div class="text-xs text-(--ui-text-muted) mb-3 font-medium flex items-center gap-2">
                      <UIcon name="i-lucide-calendar-days" class="size-4" />
                      按日期明细
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      <div
                        v-for="day in item.days"
                        :key="day.tm"
                        class="bg-(--ui-bg) rounded-lg p-3 border border-(--ui-border)"
                      >
                        <div class="text-sm font-medium text-(--ui-text-highlighted) mb-2">
                          {{ day.tm }}
                        </div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">注册</span>
                            <span>{{ getDayStat(day, 'ZC_NUM') }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">活跃</span>
                            <span>{{ getDayStat(day, 'HY_NUM') }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">游客</span>
                            <span>{{ getDayStat(day, 'HY_YK_NUM') }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">充值人数</span>
                            <span>{{ getDayStat(day, 'CZ_NUM') }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">充值金额</span>
                            <span class="text-(--ui-primary)">{{ getDayStat(day, 'CZ_PRICE') }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-(--ui-text-muted)">成功单</span>
                            <span class="text-(--ui-success)">{{ getDayStat(day, 'CZ_SUCCESS') }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- 分页 -->
    <div class="flex items-center justify-between gap-3 pt-4 mt-4">
      <div class="text-sm text-(--ui-text-muted)">
        共 <span class="font-medium text-(--ui-text)">{{ state.total }}</span> 条数据
      </div>
      <div class="flex items-center gap-2">
        <UPagination
          show-edges
          :sibling-count="1"
          :page="state.page"
          :items-per-page="state.pageSize"
          :total="state.total"
          @update:page="onPageChange"
        />
        <USelect
          v-model="state.pageSize"
          :items="[
            { value: 10, label: '10 / 页' },
            { value: 20, label: '20 / 页' },
            { value: 50, label: '50 / 页' },
            { value: 100, label: '100 / 页' }
          ]"
          class="w-24"
          @update:model-value="onPageSizeChange"
        />
      </div>
    </div>
  </DashboardLayout>
</template>
