<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/content/video/columns'
import { getVideoList, updateVideoState } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'VideoList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const toast = useToast()

const state = reactive({
  isDialog: false,
  isPreview: false,
  previewItem: null as any,
  currentForm: {} as any
})

const openEdit = (record: any) => {
  state.currentForm = record ? cloneDeep(record) : { state: 1 }
  state.isDialog = true
}

const openPreview = (record: any) => {
  state.previewItem = record
  state.isPreview = true
}

const refresh = () => {
  tableRef.value.reload()
  state.isDialog = false
}

const setState = async (record: any, value: number, tip: string) => {
  const { error } = await updateVideoState({ id: record.id, state: value })
  if (!error) {
    toast.add({ title: tip, color: 'success' })
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  const r = row.original
  return [
    {
      label: '预览',
      icon: 'i-lucide-play',
      onSelect() {
        openPreview(r)
      }
    },
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEdit(r)
      }
    },
    r.state === 1
      ? {
          label: '下架',
          icon: 'i-lucide-eye-off',
          onSelect() {
            setState(r, 2, '已下架')
          }
        }
      : {
          label: '上架',
          icon: 'i-lucide-eye',
          onSelect() {
            setState(r, 1, '已上架')
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
          title: '删除视频',
          description: `确定删除「${r.title}」吗？删除后前台不再展示。`,
          onPositiveClick() {
            setState(r, 9, '已删除')
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
        label="上传视频"
        icon="i-lucide-upload"
        color="neutral"
        @click="openEdit(null)"
      />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getVideoList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>

  <ContentVideoEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />

  <UModal v-model:open="state.isPreview" :title="state.previewItem?.title || '预览'" :ui="{ content: 'sm:max-w-md' }">
    <template #body>
      <video
        v-if="state.isPreview && state.previewItem?.url"
        :src="state.previewItem.url"
        :poster="state.previewItem.cover"
        class="w-full max-h-[70vh] rounded-lg bg-black"
        controls
        autoplay
        playsinline
      />
    </template>
  </UModal>
</template>
