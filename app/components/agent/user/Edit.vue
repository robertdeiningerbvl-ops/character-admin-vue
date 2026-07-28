<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updateAgentUser, createAgentUser, type AgentUserFormData } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const isOpen = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { isOpen.value = false }

const formRef = useTemplateRef('formRef')
const toast = useToast()

const stateOptions = [
  { label: '开放', value: 1 },
  { label: '冻结', value: 2 }
]

const state = reactive({
  loading: false,
  form: {
    username: '',
    password: '',
    commission_ratio: 0,
    withdraw_amount: 0,
    state: 1
  } as AgentUserFormData
})

const resetForm = () => {
  state.form = {
    username: '',
    password: '',
    commission_ratio: 0,
    withdraw_amount: 0,
    state: 1
  }
}

async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updateAgentUser : createAgentUser)(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    closeModal()
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    if (props.currentForm && props.currentForm.id) {
      state.form = Object.assign({}, state.form, {
        id: props.currentForm.id,
        username: props.currentForm.username,
        password: props.currentForm.password,
        commission_ratio: props.currentForm.commission_ratio,
        withdraw_amount: props.currentForm.withdraw_amount,
        state: props.currentForm.state
      })
    } else {
      resetForm()
    }
  }
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ footer: 'justify-end', content: 'sm:max-w-2xl' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑代理用户' : '新增代理用户' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- 账户信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">账户信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="用户名" name="username" required>
              <UInput
                v-model.trim="state.form.username"
                placeholder="请输入用户名"
                class="w-full"
              />
            </UFormField>
            <UFormField label="密码" name="password" required>
              <UInput
                v-model="state.form.password"
                type="password"
                placeholder="请输入密码"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 财务设置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-wallet" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">财务设置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="佣金比例" name="commission_ratio">
              <UInput
                v-model.number="state.form.commission_ratio"
                type="number"
                step="0.01"
                placeholder="请输入佣金比例"
                class="w-full"
              />
            </UFormField>
            <UFormField label="提现金额" name="withdraw_amount">
              <UInput
                v-model.number="state.form.withdraw_amount"
                type="number"
                step="0.01"
                placeholder="请输入提现金额"
                class="w-full"
              />
            </UFormField>
          </div>
          <UFormField label="状态" name="state">
            <USelect
              v-model="state.form.state"
              :items="stateOptions"
              placeholder="请选择状态"
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
      <UButton :loading="state.loading" label="确认" @click="formRef?.submit()" />
    </template>
  </UModal>
</template>
