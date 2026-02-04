<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/amusement/list/columns'
import { getAmusementList, removeAmusement, getCommonTagList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'AmusementList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
const dialog = useDialog()
const state = reactive({
  isDialog: false,
  currentForm: {},
  tagsOptions: [] as any
})

const openEditCoins = async (record: any) => {
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

const delRowConfirm = async (record: any) => {
  const { error } = await removeAmusement({ id: record.id })
  if (!error) {
    tableRef.value.reload()
  }
}

const loadTagsOptions = async () => {
  const { data } = await getCommonTagList({ page: 1, pagesize: -1, ty: '1' })
  if (data) {
    state.tagsOptions = data.list.map((item: any) => {
      return { label: item.name, value: item.name }
    })
  } else {
    state.tagsOptions = []
  }
}

function getRowItems(row: any) {
  const router = useRouter()

  return [
    {
      label: '编辑',
      icon: 'material-symbols:edit-square-outline',
      onSelect() {
        openEditCoins(row.original)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '查看评论',
      icon: 'material-symbols:visibility-outline',
      onSelect() {
        router.push(`/amusement/comment/${row.original.id}`)
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

const init = () => {
  loadTagsOptions()
}

onActivated(() => {
  init()
})
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton label="新增" icon="i-lucide-plus" @click="openEditCoins(null)" />
    </template>

    <DynamicTable
      ref="tableRef"
      :data-request="getAmusementList"
      :columns="columns"
      scroll-x="min-w-[1000px]"
    />
  </DashboardLayout>
  <AmusementListEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    :tags-options="state.tagsOptions"
    @refresh="refresh"
  />
</template>
