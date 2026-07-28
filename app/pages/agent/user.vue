<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '~/components/agent/user/columns'
import { getAgentUserList } from '@/api/modules/agent'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AgentUserList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEdit = (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = { state: 1 }
  }
}

const refresh = () => {
  tableRef.value.reload()
  state.isDialog = false
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEdit(row.original)
      }
    }
  ]
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
    },
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton
        label="新增"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEdit(null)"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getAgentUserList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
  <AgentUserEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
