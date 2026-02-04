<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { uploadFile, updateMember } from '@/api'

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

const schema = z.object({
  username: z.string(),
  remarks: z.string(),
  birthday: z.string(),
  state: z.number().min(0)
})

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '待审核', value: 1 },
  { label: '已删除', value: 4 }
]

const sexOptions = [
  { label: '保密', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

const isAdminOptions = [
  { label: '否', value: 0 },
  { label: '是', value: 2 }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) return

  if (imageFormat(input.files[0])) {
    state.avatarLoading = true
    const { data } = await uploadFile({ image: input.files[0] })
    if (data) {
      state.form.avatar = data.uri
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
  const { error } = await updateMember(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = cloneDeep(props.currentForm)
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '编辑客户' : '新增客户'"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-2xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="p-6">
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- 头像上传卡片 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-material-symbols-image-outline" class="w-5 h-5 text-primary-600" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                头像设置
              </h4>
            </div>
            <UFormField
              name="avatar"
              description="JPG, JPEG or PNG. 1MB Max."
            >
              <div class="flex items-center gap-4">
                <div class="relative group">
                  <UAvatar
                    :src="state.form.avatar"
                    :alt="state.form.username"
                    size="2xl"
                    class="ring-2 ring-gray-200 dark:ring-gray-700"
                  />
                  <div
                    v-if="state.form.avatar"
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                  >
                    <UIcon name="i-material-symbols-edit" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <UButton
                    :loading="state.avatarLoading"
                    color="primary"
                    variant="outline"
                    size="lg"
                    @click="onFileClick"
                  >
                    <template #leading>
                      <UIcon name="i-material-symbols-upload" />
                    </template>
                    {{ state.form.avatar ? '更换头像' : '上传头像' }}
                  </UButton>
                  <input
                    ref="fileRef"
                    type="file"
                    class="hidden"
                    accept=".jpg, .jpeg, .png"
                    @change="onFileChange"
                  >
                </div>
              </div>
            </UFormField>
          </div>

          <!-- 基本信息卡片 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-5">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-primary-600" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                基本信息
              </h4>
            </div>

            <UFormField label="客户昵称" name="username" required>
              <UInput
                v-model.trim="state.form.username"
                placeholder="请输入客户昵称"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-person-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="性别" name="sex" required>
                <USelect
                  v-model="state.form.sex"
                  :items="sexOptions"
                  placeholder="请选择性别"
                  class="w-full"
                  size="lg"
                />
              </UFormField>

              <UFormField label="等级" name="lv">
                <UInput
                  v-model.number="state.form.lv"
                  placeholder="请输入等级"
                  class="w-full"
                  type="number"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-star-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>
            </div>

            <UFormField label="备注" name="remarks">
              <UInput
                v-model.trim="state.form.remarks"
                placeholder="请输入备注信息"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-note-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>

            <UFormField label="状态" name="state" required>
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择状态"
                class="w-full"
                size="lg"
              />
            </UFormField>

            <UFormField label="官方号" name="is_admin">
              <USelect
                v-model="state.form.is_admin"
                :items="isAdminOptions"
                placeholder="请选择是否为官方号"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-verified" class="w-5 h-5 text-orange-500" />
                </template>
              </USelect>
            </UFormField>
          </div>

          <!-- 详细信息卡片 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-5">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-description-outline" class="w-5 h-5 text-primary-600" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                详细信息
              </h4>
            </div>

            <UFormField label="简介" name="summary">
              <UTextarea
                v-model.trim="state.form.summary"
                placeholder="请输入个人简介..."
                class="w-full"
                :rows="3"
                size="lg"
              />
            </UFormField>

            <UFormField label="爱好" name="fetish">
              <UTextarea
                v-model.trim="state.form.fetish"
                placeholder="请输入个人爱好..."
                class="w-full"
                :rows="3"
                size="lg"
              />
            </UFormField>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-material-symbols-info-outline" class="inline w-4 h-4" />
          {{ currentForm.id ? '修改后将更新客户信息' : '确认后将创建新客户' }}
        </div>
        <div class="flex gap-3">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            size="lg"
            @click="closeModal"
          >
            <template #leading>
              <UIcon name="i-material-symbols-close" />
            </template>
          </UButton>
          <UButton
            :loading="state.loading"
            label="确认保存"
            variant="solid"
            size="lg"
            @click="formRef?.submit()"
          >
            <template #leading>
              <UIcon name="i-material-symbols-check" />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
