<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/amusement/comment/columns'
import { getConductCommentList, removeConductCommentRemove } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberCollectList'
})

const tableRef = ref()
const dialog = useDialog()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const route = useRoute()

const bizId = computed(() => route.params.id as string)
const fetchCommentList = (params: any) => {
  return getConductCommentList({
    ...params,
    biz_id: bizId.value
  })
}

const delRowConfirm = async (record: any) => {
  const { error } = await removeConductCommentRemove({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

function getRowItems(row: any) {
  return [
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
    <DynamicTable
      ref="tableRef"
      :data-request="fetchCommentList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
</template>
