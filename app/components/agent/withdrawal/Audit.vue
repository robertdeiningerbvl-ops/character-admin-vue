<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { approveAgentWithdrawal, rejectAgentWithdrawal, type AgentWithdrawalItem } from '@/api/modules/agent'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentRecord?: AgentWithdrawalItem
}>(), {
  dialog: false,
  currentRecord: () => ({} as AgentWithdrawalItem)
})

const emit = defineEmits(['update:dialog', 'refresh'])

const isOpen = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { isOpen.value = false }

const toast = useToast()

const state = reactive({
  loading: false,
  action: '' as 'approve' | 'reject' | '',
  remark: '',
  reject_reason: ''
})

const resetForm = () => {
  state.action = ''
  state.remark = ''
  state.reject_reason = ''
}

async function handleApprove() {
  state.loading = true
  state.action = 'approve'
  const { error } = await approveAgentWithdrawal({
    id: props.currentRecord.id,
    remark: state.remark || undefined
  })
  if (!error) {
    toast.add({ title: '审核通过成功', color: 'success' })
    closeModal()
    emit('refresh')
    resetForm()
  }
  state.loading = false
}

async function handleReject() {
  if (!state.reject_reason.trim()) {
    toast.add({ title: '请输入拒绝原因', color: 'error' })
    return
  }
  state.loading = true
  state.action = 'reject'
  const { error } = await rejectAgentWithdrawal({
    id: props.currentRecord.id,
    reject_reason: state.reject_reason
  })
  if (!error) {
    toast.add({ title: '审核拒绝成功', color: 'success' })
    closeModal()
    emit('refresh')
    resetForm()
  }
  state.loading = false
}

const withdrawTypeEnum: Record<number, string> = {
  1: '银行卡',
  2: '支付宝',
  3: '微信'
}

const getWithdrawType = computed(() => {
  return withdrawTypeEnum[props.currentRecord?.withdraw_type] || '-'
})

watch(() => props.dialog, (val) => {
  if (val) {
    resetForm()
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
        <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">审核提现订单</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- 订单基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">订单信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">订单号</div>
              <div class="text-sm font-mono">{{ currentRecord?.order_no || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">代理编码</div>
              <div class="text-sm font-mono">{{ currentRecord?.agent_code || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">提现金额</div>
              <div class="text-sm font-medium text-green-600 dark:text-green-400">
                ¥{{ currentRecord?.amount?.toFixed(2) || '0.00' }}
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">实际到账</div>
              <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
                ¥{{ currentRecord?.actual_amount?.toFixed(2) || '0.00' }}
              </div>
            </div>
            <div class="space-y-1 col-span-2">
              <div class="text-xs text-(--ui-text-muted)">提现方式</div>
              <div class="text-sm">{{ getWithdrawType }}</div>
            </div>
          </div>
        </div>

        <!-- 收款信息 -->
        <div v-if="currentRecord?.withdraw_type === 1" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-credit-card" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">银行卡信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">银行名称</div>
              <div class="text-sm">{{ currentRecord?.bank_name || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">开户人</div>
              <div class="text-sm">{{ currentRecord?.bank_account_name || '-' }}</div>
            </div>
            <div class="space-y-1 col-span-2">
              <div class="text-xs text-(--ui-text-muted)">银行账号</div>
              <div class="text-sm font-mono">{{ currentRecord?.bank_account || '-' }}</div>
            </div>
          </div>
        </div>

        <div v-if="currentRecord?.withdraw_type === 2" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-smartphone" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">支付宝信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">支付宝账号</div>
              <div class="text-sm">{{ currentRecord?.alipay_account || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">姓名</div>
              <div class="text-sm">{{ currentRecord?.alipay_name || '-' }}</div>
            </div>
          </div>
        </div>

        <div v-if="currentRecord?.withdraw_type === 3" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-message-circle" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">微信信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">微信账号</div>
              <div class="text-sm">{{ currentRecord?.wechat_account || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">姓名</div>
              <div class="text-sm">{{ currentRecord?.wechat_name || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- 审核表单 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-pencil" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">审核操作</span>
          </div>

          <UFormField label="审核备注（选填）" name="remark">
            <UTextarea
              v-model="state.remark"
              placeholder="请输入审核备注（通过时可选）"
              :rows="3"
            />
          </UFormField>

          <UFormField label="拒绝原因（拒绝时必填）" name="reject_reason">
            <UTextarea
              v-model="state.reject_reason"
              placeholder="请输入拒绝原因"
              :rows="3"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton
        label="拒绝"
        color="error"
        :loading="state.loading && state.action === 'reject'"
        @click="handleReject"
      />
      <UButton
        label="通过"
        color="success"
        :loading="state.loading && state.action === 'approve'"
        @click="handleApprove"
      />
    </template>
  </UModal>
</template>
