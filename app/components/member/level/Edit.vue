<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { uploadFile, updateMemberLevel } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get() {
    return props.dialog
  },
  set(visible) {
    emit('update:dialog', visible)
  }
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')
const fileRef = ref<HTMLInputElement>()

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '待审核', value: 1 },
  { label: '已删除', value: 4 }
]

const dividedOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) {
    return
  }

  if (imageFormat(input.files[0])) {
    state.avatarLoading = true
    const { data } = await uploadFile({
      image: input.files[0]
    })
    if (data) {
      state.form.logo = data.uri
    }
    state.avatarLoading = false
  }
}

function onFileClick() {
  fileRef.value?.click()
}

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  // const { error } = await (postForm.id ? updateMemberLevel : addMemberLevel)(postForm)
  const { error } = await updateMemberLevel(postForm)
  if (!error) {
    toast.add({ title: `操作成功`, color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = props.currentForm
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"

    :ui="{ footer: 'justify-end', content: 'sm:max-w-xl' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-award" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑等级' : '新增等级' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">基本信息</span>
          </div>
          <UFormField label="等级名称" name="name" required>
            <UInput v-model.trim="state.form.name" placeholder="请输入等级名称" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="所需电量" name="battery" required>
              <UInput
                v-model.number="state.form.battery"
                placeholder="请输入"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="参与分成" name="divided" required>
              <USelect
                v-model="state.form.divided"
                :items="dividedOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="状态" name="state" required>
            <USelect
              v-model="state.form.state"
              :items="stateOptions"
              placeholder="请选择"
              class="w-full"
            />
          </UFormField>
          <UFormField label="备注" name="remark">
            <UTextarea
              v-model.trim="state.form.remark"
              placeholder="请输入备注"
              class="w-full"
              :rows="2"
            />
          </UFormField>
        </div>

        <!-- 图标上传 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-image" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">等级图标</span>
          </div>
          <div class="flex items-center gap-4">
            <UAvatar :src="state.form.logo" :alt="state.form.name" size="xl" />
            <div>
              <UButton
                :loading="state.avatarLoading"
                label="上传图标"
                color="neutral"
                variant="soft"
                @click="onFileClick"
              />
              <p class="text-xs text-(--ui-text-muted) mt-1">
                支持 JPG、PNG，最大 1MB
              </p>
            </div>
            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg,.jpeg,.png"
              @change="onFileChange"
            >
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
