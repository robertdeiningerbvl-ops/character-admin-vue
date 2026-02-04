<script setup lang="ts">
import { baseColumns, type TableColumnList } from '@/components/member/collect/columns'
import { getConductCollectList } from '@/api'

definePageMeta({
  layout: 'app'
})

defineOptions({
  name: 'MemberCollectList'
})

const tableRef = ref()

const state = reactive({
  isDialog: false,
  currentForm: {}
})

const refresh = async () => {
  tableRef.value.reload()
  state.isDialog = false
}

const route = useRoute()

const uid = computed(() => route.params.id as string)
const fetchCollectList = (params: any) => {
  return getConductCollectList({
    ...params,
    uid: uid.value
  })
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
    <DynamicTable
      ref="tableRef"
      :data-request="fetchCollectList"
      :columns="columns"
      scroll-x="min-w-[1200px]"
    />
  </DashboardLayout>
  <MemberListEdit
    v-model:dialog="state.isDialog"
    :current-form="state.currentForm"
    @refresh="refresh"
  />
</template>
