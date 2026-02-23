<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/invitation/columns'
import { getMemberInvitationCodeList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'InvitationCodeList' })

const tableRef = ref()
const UButton = resolveComponent('UButton')

const state = reactive({
  isDialog: false,
  currentForm: {},
  // 领取记录弹框
  recordDialog: false,
  recordCode: '',
  recordList: [] as any[],
  recordLoading: false,
  recordPage: 1,
  recordPageSize: 10,
  recordTotal: 0
})

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2 }
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

// 查看领取记录
const viewRecords = async (code: string) => {
  state.recordCode = code
  state.recordDialog = true
  state.recordPage = 1
  await loadRecords()
}

// 加载领取记录
const loadRecords = async () => {
  state.recordLoading = true
  try {
    const { data } = await getMemberInvitationCodeList({
      code: state.recordCode,
      ty: 1,
      page: state.recordPage,
      pagesize: state.recordPageSize
    })
    state.recordList = data?.list || []
    state.recordTotal = data?.count || 0
  } finally {
    state.recordLoading = false
  }
}

// 分页变化
const onRecordPageChange = (page: number) => {
  state.recordPage = page
  loadRecords()
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    header: '操作',
    meta: {
      class: {
        th: 'w-[100px]',
        td: 'w-[100px]'
      }
    },
    cell: ({ row }) => {
      return h(UButton, {
        label: '领取记录',
        size: 'xs',
        color: 'neutral',
        variant: 'outline',
        onClick: () => viewRecords(row.original.code)
      })
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton
        label="添加兑换码"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditModal()"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getMemberInvitationCodeList"
      :columns="columns"
      scroll-x="min-w-[1400px]"
    />
  </DashboardLayout>

  <MemberInvitationEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />

  <!-- 领取记录弹框 -->
  <UModal
    v-model:open="state.recordDialog"
    title="领取记录"
    :ui="{ content: 'sm:max-w-2xl', footer: 'justify-end bg-(--ui-bg-elevated)' }"
  >
    <template #body>
      <div class="mb-3 flex items-center gap-2">
        <span class="text-sm text-(--ui-text-muted)">兑换码：</span>
        <code class="px-2 py-1 rounded bg-(--ui-bg-elevated) text-xs font-mono text-(--ui-primary)">{{ state.recordCode }}</code>
      </div>

      <div v-if="state.recordLoading" class="flex items-center justify-center py-8">
        <UIcon name="i-lucide-loader" class="w-6 h-6 animate-spin text-(--ui-text-muted)" />
      </div>

      <div v-else-if="state.recordList.length === 0" class="text-center py-8 text-(--ui-text-muted)">
        暂无领取记录
      </div>

      <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="item in state.recordList"
          :key="item.id"
          class="p-3 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-(--ui-text-highlighted)">
                {{ item.member?.username || '未知用户' }}
              </span>
              <span class="text-xs text-(--ui-text-muted)">ID: {{ item.uid }}</span>
            </div>
            <span class="text-xs text-(--ui-text-muted)">{{ formatToDateTime(item.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="state.recordTotal > state.recordPageSize" class="flex justify-center mt-4">
        <UPagination
          :page="state.recordPage"
          :items-per-page="state.recordPageSize"
          :total="state.recordTotal"
          @update:page="onRecordPageChange"
        />
      </div>
    </template>

    <template #footer>
      <UButton
        label="关闭"
        color="neutral"
        variant="outline"
        @click="state.recordDialog = false"
      />
    </template>
  </UModal>
</template>
