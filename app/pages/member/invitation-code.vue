<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/invitation/columns'
import { getMemberInvitationCodeList } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'InvitationCodeList' })

const tableRef = ref()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 2 }
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    meta: {
      class: {
        th: 'w-[80px]',
        td: 'w-[80px]'
      }
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
        color="primary"
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
</template>
