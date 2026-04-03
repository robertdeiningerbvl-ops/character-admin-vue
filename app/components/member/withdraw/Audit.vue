<script setup lang="ts">
import { auditMemberWithdraw } from '@/api'

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
  form: { id: undefined as any, state: 2, real_amount: '', remark: '' }
})

const stateOptions = [
  { label: '审核通过', value: 2 },
  { label: '拒绝', value: 3 }
]

const toast = useToast()

async function onSubmit() {
  state.loading = true
  const { error } = await auditMemberWithdraw({
    id: state.form.id,
    state: state.form.state,
    real_amount: state.form.real_amount * 100,
    remark: state.form.remark
  })
  if (!error) {
    toast.add({ title: '审核成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = {
      id: props.currentForm.id,
      state: 2,
      real_amount: (props.currentForm.real_amount || 0) / 100,
      remark: ''
    }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ footer: 'justify-end', content: 'sm:max-w-md' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">提现审核</span>
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
            <UAvatar :src="currentForm.member?.avatar" :alt="currentForm.member?.username" size="lg" />
            <div>
              <div class="font-medium">
                {{ currentForm.member?.username || '-' }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                ID: {{ currentForm.member?.id }}
              </div>
            </div>
            <div class="ml-auto text-right">
              <div class="text-xs text-(--ui-text-muted)">
                申请金额
              </div>
              <div class="text-lg font-semibold">
                ¥{{ (currentForm.amount || 0) / 100 }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <UFormField label="审核状态" name="state" required>
            <div class="flex gap-3">
              <UButton
                :color="state.form.state === 2 ? 'success' : 'neutral'"
                :variant="state.form.state === 2 ? 'solid' : 'soft'"
                size="lg"
                class="flex-1"
                @click="state.form.state = 2"
              >
                <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
                审核通过
              </UButton>
              <UButton
                :color="state.form.state === 3 ? 'error' : 'neutral'"
                :variant="state.form.state === 3 ? 'solid' : 'soft'"
                size="lg"
                class="flex-1"
                @click="state.form.state = 3"
              >
                <UIcon name="i-lucide-x-circle" class="w-5 h-5" />
                拒绝
              </UButton>
            </div>
          </UFormField>

          <UFormField label="实际到账金额" name="real_amount" required>
            <UInput
              v-model.number="state.form.real_amount"
              type="number"
              placeholder="请输入实际到账金额"
              class="w-full"
            />
          </UFormField>

          <UFormField label="备注" name="remark">
            <UTextarea
              v-model="state.form.remark"
              placeholder="请输入备注"
              :rows="3"
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
        label="确认审核"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
