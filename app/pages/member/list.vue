<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { baseColumns, type TableColumnList } from '@/components/member/list/columns'
import { getMemberList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberList'
})

const tableRef = ref()
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const state = reactive({
  isDialog: false,
  isDialogBattery: false,
  currentForm: {}
})

const openEditModal = async (record: any) => {
  state.isDialog = true
  if (record) {
    state.currentForm = cloneDeep(record)
  } else {
    state.currentForm = { state: 2 }
  }
}

const openEditBattery = async (record: any) => {
  state.isDialogBattery = true
  state.currentForm = cloneDeep(record)
}

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
  state.isDialogBattery = false
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
      label: '充值',
      icon: 'material-symbols:battery-charging-full',
      onSelect() {
        openEditBattery(row.original)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '查看收藏',
      icon: 'material-symbols:visibility-outline',
      onSelect() {
        router.push(`/member/collect/${row.original.id}`)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '查看邀请',
      icon: 'material-symbols:visibility-outline',
      onSelect() {
        router.push(`/member/invite/${row.original.id}`)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '查看流水',
      icon: 'material-symbols:receipt-long-outline',
      onSelect() {
        router.push(`/member/wallet-log?uid=${row.original.id}`)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '查看聊天',
      icon: 'material-symbols:chat-outline',
      onSelect() {
        router.push(`/member/chat/${row.original.id}`)
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
      :data-request="getMemberList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
  <MemberListEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
  <MemberListBattery
    v-model:dialog="state.isDialogBattery"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
