<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { uploadFile, addAdmin, updateAdmin } from '@/api'
import { useAuthStore } from '@/store'

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
const auth = useAuthStore()

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().min(8, '不能少于 8 个字符').optional().or(z.literal('')),
  group_id: z.number(),
  state: z.number()
})

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any,
  groupOptions: [
    {
      label: '运营',
      value: 5
    },
    {
      label: '管理员',
      value: 1
    },
    {
      label: '超级管理员',
      value: 99
    }
  ],
  stateOptions: [
    {
      label: '正常',
      value: 2
    },
    {
      label: '禁用',
      value: 1
    }
  ]
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
  postForm.id = props.currentForm.id
  if (!postForm.id && !postForm.password) {
    postForm.password = '12345677'
  }
  const { error } = await (postForm.id ? updateAdmin : addAdmin)(postForm)
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

    :ui="{ footer: 'justify-end', content: 'sm:max-w-lg' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-user-cog" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '修改用户' : '新增用户' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <!-- 头像区域 -->
        <div class="flex items-center gap-4 p-4 rounded-lg bg-(--ui-bg) border border-(--ui-border)">
          <UAvatar :src="state.form.avatar" :alt="state.form.username" size="xl" />
          <div class="flex-1">
            <p class="text-sm font-medium text-(--ui-text-highlighted) mb-1">
              用户头像
            </p>
            <p class="text-xs text-(--ui-text-muted) mb-2">
              支持 JPG、PNG 格式，最大 1MB
            </p>
            <UButton
              :loading="state.avatarLoading"
              label="上传头像"
              color="neutral"
              size="xs"
              @click="onFileClick"
            />
            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png"
              @change="onFileChange"
            >
          </div>
        </div>

        <UFormField label="用户名" name="username" required>
          <UInput
            v-model.trim="state.form.username"
            :disabled="!!currentForm.id"
            placeholder="请输入用户名"
            class="w-full"
          >
            <template #leading>
              <UIcon name="i-lucide-user" class="w-4 h-4 text-(--ui-text-muted)" />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="密码" name="password" :help="currentForm.id ? '不填则不修改密码' : '默认密码：12345677'">
          <UInput
            v-model.trim="state.form.password"
            type="password"
            placeholder="请输入密码（至少8位）"
            class="w-full"
          >
            <template #leading>
              <UIcon name="i-lucide-lock" class="w-4 h-4 text-(--ui-text-muted)" />
            </template>
          </UInput>
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField
            v-if="auth.userInfo.group_id == 99"
            label="角色"
            name="group_id"
            required
          >
            <USelect
              v-model="state.form.group_id"
              :items="state.groupOptions"
              placeholder="请选择"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="状态"
            name="state"
            required
            :class="auth.userInfo.group_id != 99 ? 'col-span-2' : ''"
          >
            <USelect
              v-model="state.form.state"
              :items="state.stateOptions"
              placeholder="请选择"
              class="w-full"
            />
          </UFormField>
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
