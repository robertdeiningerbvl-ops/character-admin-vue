<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { uploadFile, updateMember, getMemberLevelList } from '@/api'

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
  form: {} as any,
  levelOptions: [] as any[]
})

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  if (imageFormat(input.files[0])) {
    state.avatarLoading = true
    const { data } = await uploadFile({ image: input.files[0] })
    if (data) state.form.avatar = data.uri
    state.avatarLoading = false
  }
}

function onFileClick() {
  fileRef.value?.click()
}

const toast = useToast()

async function fetchLevelList() {
  const { data, error } = await getMemberLevelList()
  if (!error && data?.list) {
    state.levelOptions = data.list.map((item: any) => ({ label: item.name, value: item.id }))
  }
}

async function onSubmit() {
  state.loading = true
  const { error } = await updateMember(cloneDeep(state.form))
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (newValue) => {
  if (newValue) {
    state.loading = false
    state.form = cloneDeep(props.currentForm)
    fetchLevelList()
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ content: 'sm:max-w-2xl', footer: 'justify-end' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-user-cog" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑用户' : '新增用户' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- 用户概览 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-4">
            <div class="relative group cursor-pointer" @click="onFileClick">
              <UAvatar :src="state.form.avatar" :alt="state.form.username" size="xl" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <UIcon name="i-lucide-camera" class="w-5 h-5 text-white" />
              </div>
              <input
                ref="fileRef"
                type="file"
                class="hidden"
                accept=".jpg,.jpeg,.png"
                @change="onFileChange"
              >
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-lg">{{ state.form.username || '未设置' }}</span>
                <UBadge
                  v-if="state.form.is_admin === 2"
                  color="warning"
                  variant="solid"
                  size="xs"
                >
                  官方
                </UBadge>
              </div>
              <div class="text-sm text-(--ui-text-muted)">
                ID: {{ state.form.id }} · {{ state.form.source || '-' }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                邀请码: {{ state.form.code || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-2 mb-3">
            <UIcon name="i-lucide-bar-chart-2" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">数据统计</span>
          </div>
          <div class="grid grid-cols-4 gap-3 text-center">
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-pink-500">
                {{ state.form.fans || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                粉丝
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-blue-500">
                {{ state.form.focus || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                关注
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-orange-500">
                {{ state.form.publish_count || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                发布
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-teal-500">
                {{ state.form.game_num || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                游戏
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-purple-500">
                {{ state.form.invite || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                邀请
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-yellow-500">
                {{ state.form.battery || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                电量
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-green-500">
                {{ state.form.income_battery || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                收益电量
              </div>
            </div>
            <div class="p-2 rounded bg-(--ui-bg) border border-(--ui-border)">
              <div class="text-lg font-semibold text-green-600">
                ¥{{ state.form.income_amount || 0 }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                收益金额
              </div>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">基本信息</span>
          </div>
          <UFormField label="昵称" name="username">
            <UInput v-model.trim="state.form.username" placeholder="请输入昵称" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="性别" name="sex">
              <USelect
                v-model="state.form.sex"
                :items="sexOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="状态" name="state">
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="官方号" name="is_admin">
              <USelect
                v-model="state.form.is_admin"
                :items="isAdminOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="修改密码" name="password">
              <UInput
                v-model.trim="state.form.password"
                type="password"
                placeholder="留空则不修改"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="备注" name="remarks">
            <UTextarea
              v-model.trim="state.form.remarks"
              placeholder="请输入备注"
              class="w-full"
              :rows="2"
            />
          </UFormField>
        </div>

        <!-- 详细信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">详细信息</span>
          </div>
          <UFormField label="简介" name="summary">
            <UTextarea
              v-model.trim="state.form.summary"
              placeholder="请输入简介"
              class="w-full"
              :rows="2"
            />
          </UFormField>
          <UFormField label="爱好" name="fetish">
            <UTextarea
              v-model.trim="state.form.fetish"
              placeholder="请输入爱好"
              class="w-full"
              :rows="2"
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
      <UButton :loading="state.loading" label="确认" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
