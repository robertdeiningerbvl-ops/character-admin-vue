<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  columns: Column[]
  loadData: (params: { page: number; pageSize: number }) => Promise<{ list: any[]; count: number }>
  enableSelection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableSelection: false
})

const emit = defineEmits<{
  (e: 'selection-change', ids: string[]): void
}>()

const state = reactive({
  loading: false,
  list: [],
  total: 0,
  page: 1,
  pageSize: 20,
  selectedIds: [] as string[]
})

const loadList = async () => {
  state.loading = true
  try {
    const result = await props.loadData({
      page: state.page,
      pageSize: state.pageSize
    })
    state.list = result.list || []
    state.total = result.count || 0
  } catch (error) {
    console.error('Failed to load data:', error)
    state.list = []
    state.total = 0
  } finally {
    state.loading = false
  }
}

const handlePageChange = (page: number) => {
  state.page = page
  loadList()
}

const handleSelectionChange = (selected: boolean, row: any) => {
  if (selected) {
    if (!state.selectedIds.includes(row.id)) {
      state.selectedIds.push(row.id)
    }
  } else {
    const index = state.selectedIds.indexOf(row.id)
    if (index > -1) {
      state.selectedIds.splice(index, 1)
    }
  }
  emit('selection-change', state.selectedIds)
}

const handleSelectAll = (selected: boolean) => {
  if (selected) {
    state.selectedIds = state.list.map((item: any) => item.id)
  } else {
    state.selectedIds = []
  }
  emit('selection-change', state.selectedIds)
}

const reload = () => {
  state.page = 1
  state.selectedIds = []
  loadList()
}

onMounted(() => {
  loadList()
})

defineExpose({
  reload
})
</script>

<template>
  <div class="common-table">
    <div v-if="state.loading" class="flex justify-center items-center py-12">
      <USpinner size="lg" />
    </div>

    <div v-else-if="state.list.length === 0" class="text-center py-12 text-gray-500">
      暂无数据
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-if="enableSelection" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                :checked="state.selectedIds.length === state.list.length"
                @change="handleSelectAll(($event.target as HTMLInputElement).checked)"
                class="rounded"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in state.list" :key="row.id" class="hover:bg-gray-50">
            <td v-if="enableSelection" class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                :checked="state.selectedIds.includes(row.id)"
                @change="handleSelectionChange(($event.target as HTMLInputElement).checked, row)"
                class="rounded"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="state.total > state.pageSize" class="flex items-center justify-between px-6 py-4 border-t">
      <div class="text-sm text-gray-700">
        显示 {{ (state.page - 1) * state.pageSize + 1 }} 到 {{ Math.min(state.page * state.pageSize, state.total) }} 条，
        共 {{ state.total }} 条
      </div>
      <div class="flex gap-2">
        <UButton
          size="xs"
          :disabled="state.page === 1"
          @click="handlePageChange(state.page - 1)"
        >
          上一页
        </UButton>
        <span class="text-sm text-gray-700 self-center px-2">
          第 {{ state.page }} / {{ Math.ceil(state.total / state.pageSize) }} 页
        </span>
        <UButton
          size="xs"
          :disabled="state.page >= Math.ceil(state.total / state.pageSize)"
          @click="handlePageChange(state.page + 1)"
        >
          下一页
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.common-table {
  @apply bg-white rounded-lg shadow;
}
</style>