<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/common/model/columns'
import { getCommonModelList } from '@/api'
import { CommonModelEdit } from '#components'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'CommonModelList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

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

function getRowItems(row: any) {
  const router = useRouter()
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
      label: '模型token',
      icon: 'material-symbols:visibility-outline',
      onSelect() {
        router.push(`/model/token/${row.original.id}`)
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
      <UButton label="新增" icon="i-lucide-plus" @click="openEditModal(null)" />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getCommonModelList"
      :columns="columns"
      scroll-x="min-w-[1800px]"
    />
  </DashboardLayout>
  <CommonModelEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
