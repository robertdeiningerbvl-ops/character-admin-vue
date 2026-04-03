<script setup lang="ts">
import { getImageList } from '@/api'

const props = defineProps<{
  dialog: boolean
}>()

const emit = defineEmits(['update:dialog', 'select'])

const visible = computed({
  get: () => props.dialog,
  set: val => emit('update:dialog', val)
})

const state = reactive({
  list: [],
  loading: false,
  page: 1,
  pagesize: 48,
  total: 0,
  previewImage: '',
  showPreview: false
})

const loadData = async () => {
  state.loading = true
  const { data, error } = await getImageList({
    page: state.page,
    pagesize: state.pagesize,
    with_ref: '1'
  })
  state.loading = false
  if (!error && data) {
    state.list = data.list || []
    state.total = data.count || 0
  }
}

const handleSelect = (item: any) => {
  emit('select', item.image)
  visible.value = false
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

watch(visible, (val) => {
  if (val) {
    state.page = 1
    loadData()
  }
})
</script>

<template>
  <UModal v-model:open="visible" :ui="{ content: 'sm:max-w-5xl' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-images" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">选择图片</span>
      </div>
    </template>

    <template #body>
      <div v-if="state.loading" class="flex items-center justify-center py-20">
        <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-(--ui-text-muted)" />
      </div>

      <div v-else-if="state.list.length === 0" class="text-center py-20 text-(--ui-text-muted)">
        暂无图片
      </div>

      <div v-else>
        <div class="grid grid-cols-8 gap-2 max-h-[60vh] overflow-y-auto">
          <div
            v-for="item in state.list"
            :key="item.id"
            class="relative rounded bg-(--ui-bg-elevated) border border-(--ui-border) hover:border-(--ui-primary) transition-all overflow-hidden cursor-pointer group"
            @click="handleSelect(item)"
          >
            <div class="aspect-square relative bg-(--ui-bg)">
              <img :src="item.image" loading="lazy" decoding="async" class="w-full h-full object-cover" />
              <div class="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {{ item.ref_count || 0 }}
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UButton
                  icon="i-lucide-zoom-in"
                  size="sm"
                  color="white"
                  @click="handlePreview($event, item.image)"
                />
              </div>
            </div>
            <div class="p-1.5">
              <span class="text-xs text-(--ui-text-highlighted) truncate block">
                {{ item.name || '未命名' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="state.total > state.pagesize" class="flex justify-center mt-4">
          <UPagination
            :page="state.page"
            :items-per-page="state.pagesize"
            :total="state.total"
            @update:page="handlePageChange"
          />
        </div>
      </div>
    </template>
  </UModal>

  <UModal v-model:open="state.showPreview" :ui="{ content: 'sm:max-w-4xl' }">
    <template #body>
      <div class="flex items-center justify-center p-4">
        <img :src="state.previewImage" class="max-w-full max-h-[80vh] object-contain" />
      </div>
    </template>
  </UModal>
</template>
