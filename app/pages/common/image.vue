<script setup lang="ts">
import { getImageList, removeImage } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'ImageList' })

const dialog = useDialog()
const state = reactive({
  list: [],
  loading: false,
  page: 1,
  pagesize: 48,
  total: 0,
  isDialog: false,
  previewImage: '',
  showPreview: false
})

const loadData = async () => {
  state.loading = true
  const { data, error } = await getImageList({
    page: state.page,
    pagesize: state.pagesize
  })
  state.loading = false
  if (!error && data) {
    state.list = data.list || []
    state.total = data.count || 0
  }
}

const openDialog = () => {
  state.isDialog = true
}

const refresh = () => {
  state.isDialog = false
  loadData()
}

const delImage = (item: any) => {
  dialog.open({
    color: 'error',
    title: '删除图片',
    description: `确定要删除「${item.name || '未命名'}」吗？`,
    onPositiveClick: async () => {
      const { error } = await removeImage({ id: item.id })
      if (!error) loadData()
    }
  })
}

const handlePreview = (e: Event, url: string) => {
  e.stopPropagation()
  state.previewImage = url
  state.showPreview = true
}

const handlePageChange = (page: number) => {
  state.page = page
  loadData()
}

onMounted(() => loadData())
</script>

<template>
  <DashboardLayout>
    <template #actions>
      <UButton label="上传图片" icon="i-lucide-plus" color="neutral" @click="openDialog" />
    </template>

    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
    </div>

    <div v-else-if="state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
      暂无图片
    </div>

    <div v-else>
      <div class="grid grid-cols-8 gap-2">
        <div
          v-for="item in state.list"
          :key="item.id"
          class="relative rounded bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all overflow-hidden group"
        >
          <div class="aspect-square relative bg-(--ui-bg)">
            <NuxtImg :src="item.image" loading="lazy" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <UButton
                icon="i-lucide-zoom-in"
                size="sm"
                color="white"
                @click="handlePreview($event, item.image)"
              />
            </div>
          </div>
          <div class="p-1.5 flex items-center justify-between gap-1">
            <span class="text-xs text-(--ui-text-highlighted) truncate flex-1">
              {{ item.name || '未命名' }}
            </span>
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              @click="delImage(item)"
            />
          </div>
        </div>
      </div>

      <div v-if="state.total > state.pagesize" class="flex justify-center mt-6">
        <UPagination
          :page="state.page"
          :items-per-page="state.pagesize"
          :total="state.total"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </DashboardLayout>

  <CommonImageEdit v-model:dialog="state.isDialog" @refresh="refresh" />

  <UModal v-model:open="state.showPreview" :ui="{ content: 'sm:max-w-4xl' }">
    <template #body>
      <div class="flex items-center justify-center p-4">
        <NuxtImg :src="state.previewImage" class="max-w-full max-h-[80vh] object-contain" />
      </div>
    </template>
  </UModal>
</template>
