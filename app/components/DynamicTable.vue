<script setup lang="ts">
import type { Service } from '@/types'

const props = withDefaults(defineProps<{
  /** 是否隐藏工具栏 */
  hideToolbar?: boolean
  /** 是否显示搜索表单 */
  search?: boolean
  /** 是否加载 */
  loading?: boolean
  /** 表格请求函数 */
  dataRequest: (params: ApiBase.PageParams<any>) => Promise<Service.RequestResult<ApiBase.List>>
  /** 表格配置 */
  columns?: any
  /** 表格最小宽度，小于则出现滚动条 */
  scrollX?: string
  /** 分页大小 */
  defaultPageSize?: number
}>(), {
  hideToolbar: false,
  search: true,
  columns: [],
  scrollX: 'min-w-[1000px]',
  defaultPageSize: 10
})

/** 是否显示搜索表单 */
const searchShow = computed(() => {
  return props.search && props.columns.some((item: any) => item.searchPlaceholder)
})

const state = reactive({
  loading: false,
  isBackendPagination: false,
  formHash: '',
  form: null as any,
  list: [],
  showList: []
})

/** 内部表格配置 */
const _columns = computed(() => {
  return props.columns.filter((item: any) => !item.hideInTable)
})

const isLoading = computed(() => {
  return props.loading || state.loading
})

// 输入框数据处理
const updateTrimValue = async (value: string, name: string) => {
  state.form[name] = value.trim()
}

const pagination: any = reactive({
  page: 1,
  pageSize: props.defaultPageSize,
  itemCount: 0,
  onUpdatePage: (page: number) => {
    pagination.page = page
    if (state.isBackendPagination) {
      getList()
    } else {
      paginationHandler()
    }
  }
})

// 前端分页处理
function paginationHandler() {
  state.showList = state.list.slice(
    (Number(pagination.page) - 1) * Number(pagination.pageSize),
    Number(pagination.page) * Number(pagination.pageSize)
  )
}

async function getList() {
  state.loading = true
  // 搜索条件变化重置显示页面
  const formHash = JSON.stringify(state.form)
  if (state.formHash !== formHash) {
    pagination.page = 1
    state.formHash = formHash
  }
  const { data } = await props.dataRequest({ page: pagination.page, pagesize: pagination.pageSize, ...state.form })
  if (data) {
    state.isBackendPagination = Boolean(data.count)
    if (state.isBackendPagination) {
      pagination.itemCount = data.count
      state.showList = data.list
    } else {
      state.list = data.list
      pagination.itemCount = data.list.length
      paginationHandler()
    }
  }
  state.loading = false
}

async function init() {
  pagination.page = 1
  state.form = null
  nextTick(() => {
    // 初始化表单，支持默认值
    const form: any = {}
    props.columns.forEach((item: any) => {
      if (item.formItemProps?.defaultValue !== undefined) {
        const field = item.formItemProps?.field || item.accessorKey
        form[field] = item.formItemProps.defaultValue
      }
    })
    state.form = form
    getList()
  })
}

init()

defineExpose({
  reload: getList
})
</script>

<template>
  <div class="pt-[var(--ui-header-height)]">
    <template v-if="!hideToolbar">
      <div v-if="searchShow && state.form" class="flex flex-wrap items-center mb-4 sm:mb-6 gap-4">
      <template v-for="item in columns" :key="item.accessorKey">
        <template v-if="item.searchPlaceholder">
          <UInput
            v-if="!item.formItemProps"
            :model-value="state.form[item.accessorKey]"
            placeholder=""
            class="w-[180px]"
            :ui="{ base: 'peer', trailing: 'pe-1' }"
            @update:model-value="
              (value: any) => {
                updateTrimValue(value, item.accessorKey);
              }
            "
            @keyup.enter="getList"
          >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">{{ item.searchPlaceholder }}</span>
            </label>
            <template #trailing>
              <UButton
                v-if="state.form[item.accessorKey]"
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                @click="state.form[item.accessorKey] = ''"
              />
            </template>
          </UInput>
          <div v-else-if="item.formItemProps && item.formItemProps.component === 'Select'" class="relative">
            <USelect
              v-model="state.form[item.formItemProps?.field || item.accessorKey]"
              :items="item.formItemProps.componentProps.options"
              :placeholder="item.searchPlaceholder"
              class="w-[180px]"
              :ui="{ placeholder: 'opacity-0', trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  v-if="state.form[item.formItemProps?.field || item.accessorKey] || state.form[item.formItemProps?.field || item.accessorKey] === 0"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                />
              </template>
            </USelect>
            <input
              type="text"
              :value="state.form[item.formItemProps?.field || item.accessorKey]"
              :placeholder="item.searchPlaceholder"
              class="hidden peer"
            >
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
              <span class="inline-flex bg-default px-1">{{ item.searchPlaceholder }}</span>
            </label>
            <UButton
              v-if="state.form[item.formItemProps?.field || item.accessorKey] || state.form[item.formItemProps?.field || item.accessorKey] === 0"
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              class="absolute top-1/2 right-1 -translate-y-1/2 opacity-0"
              @click="state.form[item.formItemProps?.field || item.accessorKey] = ''"
            />
          </div>
          <div v-else-if="item.formItemProps && item.formItemProps.component === 'DateInput'" class="relative">
            <UInput
              v-model="state.form[item.formItemProps?.field || item.accessorKey]"
              type="date"
              class="w-[160px]"
            />
            <label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5">
              <span class="inline-flex bg-default px-1">{{ item.searchPlaceholder }}</span>
            </label>
          </div>
        </template>
      </template>

      <div class="flex flex-wrap items-center gap-4">
        <UButton
          :disabled="isLoading"
          label="查询"
          icon="i-lucide-search"
          @click="getList"
        />
        <UButton
          :disabled="isLoading"
          label="重置"
          icon="fluent:arrow-reset-24-filled"
          color="neutral"
          variant="outline"
          @click="init"
        />
      </div>
    </div>
    <div v-else class="mb-4 sm:mb-6">
      <UButton
        :disabled="isLoading"
        label="刷新"
        icon="mdi-refresh"
        color="neutral"
        variant="outline"
        @click="getList"
      />
    </div>
  </template>

  <UTable
    ref="table"
    sticky
    class="flex-1 shrink-0"
    :data="state.showList"
    :columns="_columns"
    :loading="isLoading"
    :ui="{
      base: `table-fixed border-separate border-spacing-0 w-full ${scrollX}`,
      thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
      td: 'border-b border-(--ui-border) whitespace-normal break-all',
      tr: 'data-[expanded=true]:bg-(--ui-bg-elevated)/50'
    }"
  >
    <template #expanded="{ row }:any">
      <ExpandTable
        v-if="row.original.children"
        :data="row.original.children"
        :columns="_columns"
        :scroll-x="scrollX"
      />
    </template>
  </UTable>

  <div v-if="pagination.pageSize !== 999" class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
    <div class="text-sm text-(--ui-text-muted)">
      共 {{ pagination.itemCount }} 条数据
    </div>

    <div class="flex items-center gap-1.5">
      <UPagination
        show-edges
        :sibling-count="1"
        :page="pagination.page"
        :items-per-page="pagination.pageSize"
        :total="pagination.itemCount"
        @update:page="pagination.onUpdatePage"
      />
      <USelect
        v-model="pagination.pageSize"
        :items="[{
          value: 10,
          label: '10 / 页'
        }, {
          value: 20,
          label: '20 / 页'
        }, {
          value: 50,
          label: '50 / 页'
        }, {
          value: 100,
          label: '100 / 页'
        }]"
        @change="pagination.onUpdatePage(1)"
      />
    </div>
  </div>
</div>
</template>
