<script setup lang="ts">
import { applyMemberWithdraw } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get() { return props.dialog },
  set(visible) { emit('update:dialog', visible) }
})

const closeModal = () => { drawerVisible.value = false }

const formRef = useTemplateRef('formRef')

const state = reactive({
  loading: false,
  form: { uid: undefined as any, amount: '' }
})

const toast = useToast()

async function onSubmit() {
  state.loading = true
  const { error } = await applyMemberWithdraw({
    uid: state.form.uid,
    amount: state.form.amount * 100
  })
  if (!error) {
    toast.add({ title: '提现申请成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = {
      uid: props.currentForm.id,
      amount: ''
    }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ footer: 'justify-end', content: 'sm:max-w-md' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-hand-coins" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">协助提现</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-3">
            <UAvatar :src="currentForm.avatar" :alt="currentForm.username" size="lg" />
            <div>
              <div class="font-medium">
                {{ currentForm.username || '-' }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                ID: {{ currentForm.id }}
              </div>
            </div>
            <div class="ml-auto text-right">
              <div class="text-xs text-(--ui-text-muted)">
                可提现金额
              </div>
              <div class="text-lg font-semibold text-green-600">
                ¥{{ (currentForm.amount || 0) / 100 }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <UFormField label="提现金额" name="amount" required>
            <UInput
              v-model.number="state.form.amount"
              type="number"
              placeholder="请输入提现金额"
              class="w-full"
            />
          </UFormField>
          <div class="text-xs text-(--ui-text-muted) mt-2">
            最低提现金额为1元，单笔最高100000元
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
        label="确认提现"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
