<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/common/modelToken/columns'
import { getCommonModelTokenList, removeCommonModelToken } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'CommonModelTokenList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {},
  factoryOwnerOptions: [] as any
})

const openEditModal = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = { state: 2 }
  }
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const route = useRoute()
const biz_id = computed(() => route.params.id as string)
const fetchCollectList = (params: any) => {
  return getCommonModelTokenList({
    ...params,
    biz_id: biz_id.value
  })
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEditModal(row.original)
      }
    },
    {
      label: '删除',
      icon: 'material-symbols:contract-delete-outline-rounded',
      color: 'error',
      onSelect() {
        dialog.open({
          color: 'error',
          title: '删除数据',
          description: '您确定要删除吗？',
          onPositiveClick() {
            delRowConfirm(row.original)
          }
        })
      }
    },
    {
      type: 'separator'
    }
  ]
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeCommonModelToken({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
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
      <UButton label="新增" icon="i-lucide-plus" @click="openEditModal(null)" />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="fetchCollectList"
      :columns="columns"
      scroll-x="min-w-[1800px]"
    />
  </DashboardLayout>
  <CommonModelTokenEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :biz-id="biz_id"
    @refresh="refresh"
  />
</template>
