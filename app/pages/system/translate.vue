<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/system/translate/columns'
import { getLanguageList, removeLanguage } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'BaseTranslate'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const openEditModal = async (record: any) => {
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = {}
  }
  state.isDialog = true
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeLanguage({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
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
      type: 'separator'
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
    }
  ]
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
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
        @click="openEditModal(null)"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getLanguageList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
  <SystemTranslateEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
