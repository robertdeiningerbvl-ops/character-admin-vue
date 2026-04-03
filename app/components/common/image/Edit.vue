<script setup lang="ts">
import { addImage, uploadFile } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
}>(), {
  dialog: false
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { drawerVisible.value = false }
const toast = useToast()

const state = reactive({
  loading: false,
  uploading: false,
  form: { name: '', image: '', ty: 0 }
})

const handleUpload = async (e: any) => {
  const file = e.target.files?.[0]
  if (!file) return

  state.uploading = true
  const formData = new FormData()
  formData.append('image', file)

  try {
    const { data } = await uploadFile(formData)
    if (data?.url) {
      state.form.image = data.url
      toast.add({ title: '图片上传成功', color: 'success' })
    } else if (data?.uri) {
      state.form.image = data.uri
      toast.add({ title: '图片上传成功', color: 'success' })
    }
  } catch (error) {
    toast.add({ title: '上传失败', color: 'error' })
  } finally {
    state.uploading = false
  }
}

async function onSubmit() {
  if (!state.form.image) return
  state.loading = true
  const { error } = await addImage(state.form)
  if (!error) {
    toast.add({ title: '上传成功', color: 'success' })
    closeModal()
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.form = { name: '', image: '', ty: 0 }
    state.loading = false
    state.uploading = false
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-md', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-upload" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">上传图片</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <UFormField label="图片名称" name="name">
          <UInput v-model.trim="state.form.name" placeholder="请输入图片名称（可选）" />
        </UFormField>

        <UFormField label="选择图片" name="image" required>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input type="file" accept="image/*" class="hidden" id="file-upload" @change="handleUpload" />
            <label for="file-upload" class="cursor-pointer block">
              <UIcon v-if="!state.form.image" name="i-lucide-upload-cloud" class="text-4xl text-gray-400 mb-2 mx-auto" />
              <NuxtImg v-else :src="state.form.image" class="max-h-48 mx-auto rounded" loading="lazy" />
              <p class="text-sm text-gray-600 mt-2">{{ state.form.image ? '点击更换图片' : '点击上传图片' }}</p>
            </label>
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <UButton label="取消" color="neutral" variant="outline" @click="closeModal" />
      <UButton :loading="state.loading || state.uploading" :disabled="!state.form.image" label="保存" @click="onSubmit" />
    </template>
  </UModal>
</template>
