<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/common/tts-voice/columns'
import { getCommonTtsVoiceList, removeCommonTtsVoice } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'CommonTtsVoiceList' })

const tableRef = ref()
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const state = reactive({
  isDialog: false,
  currentForm: {} as any
})

const openEditModal = (record?: any) => {
  state.currentForm = record ? cloneDeep(record) : {}
  state.isDialog = true
}

const refresh = () => {
  tableRef.value?.reload()
  state.isDialog = false
}

const handleRemove = async (id: number) => {
  const { error } = await removeCommonTtsVoice({ id })
  if (!error) {
    showToast('删除成功')
    refresh()
  }
}

function getRowItems(row: any) {
  return [
    {
      label: '编辑',
      icon: 'i-lucide-pencil',
      onSelect() {
        openEditModal(row.original)
      }
    },
    {
      label: '删除',
      icon: 'i-lucide-trash-2',
      onSelect() {
        handleRemove(row.original.id)
      }
    }
  ]
}

const columns: TableColumnList = [
  ...baseColumns,
  {
    id: 'actions',
    header: '操作',
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
        label="添加声优"
        icon="i-lucide-plus"
        color="neutral"
        @click="openEditModal()"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getCommonTtsVoiceList"
      :columns="columns"
      scroll-x="min-w-[1600px]"
    />
  </DashboardLayout>

  <CommonTtsVoiceEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
