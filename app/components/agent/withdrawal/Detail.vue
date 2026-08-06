<script setup lang="ts">
import type { AgentWithdrawalItem } from '@/api/modules/agent'
import { formatToDateTime } from '@/utils/common/date'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentRecord?: AgentWithdrawalItem
}>(), {
  dialog: false,
  currentRecord: () => ({} as AgentWithdrawalItem)
})

const emit = defineEmits(['update:dialog'])

const isOpen = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => { isOpen.value = false }

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const stateEnum: Record<number, { label: string, color: BadgeColor }> = {
  1: { label: '待审核', color: 'warning' },
  2: { label: '审核通过', color: 'info' },
  3: { label: '已打款', color: 'primary' },
  4: { label: '已完成', color: 'success' },
  '-1': { label: '审核拒绝', color: 'error' },
  '-2': { label: '已取消', color: 'neutral' }
}

const withdrawTypeEnum: Record<number, string> = {
  1: '银行卡',
  2: '支付宝',
  3: '微信'
}

const getStateInfo = computed((): { label: string, color: BadgeColor } => {
  return stateEnum[props.currentRecord?.state] || { label: '未知', color: 'neutral' as BadgeColor }
})

const getWithdrawType = computed(() => {
  return withdrawTypeEnum[props.currentRecord?.withdraw_type] || '-'
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ footer: 'justify-end', content: 'sm:max-w-3xl' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-file-text" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">提现订单详情</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- 订单信息 -->
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
              <div class="text-xs text-(--ui-text-muted)">提现方式</div>
              <div class="text-sm">{{ getWithdrawType }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">状态</div>
              <UBadge :label="getStateInfo.label" :color="getStateInfo.color" size="sm" />
            </div>
          </div>
        </div>

        <!-- 金额信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-wallet" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">金额信息</span>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">提现金额</div>
              <div class="text-sm font-medium text-green-600 dark:text-green-400">
                ¥{{ currentRecord?.amount?.toFixed(2) || '0.00' }}
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">手续费</div>
              <div class="text-sm font-medium text-orange-600 dark:text-orange-400">
                ¥{{ currentRecord?.fee?.toFixed(2) || '0.00' }}
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">实际到账</div>
              <div class="text-sm font-medium text-blue-600 dark:text-blue-400">
                ¥{{ currentRecord?.actual_amount?.toFixed(2) || '0.00' }}
              </div>
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

        <!-- 备注信息 -->
        <div v-if="currentRecord?.remark || currentRecord?.reject_reason" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-message-square" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">备注信息</span>
          </div>
          <div v-if="currentRecord?.remark" class="space-y-1">
            <div class="text-xs text-(--ui-text-muted)">审核备注</div>
            <div class="text-sm">{{ currentRecord.remark }}</div>
          </div>
          <div v-if="currentRecord?.reject_reason" class="space-y-1">
            <div class="text-xs text-(--ui-text-muted)">拒绝原因</div>
            <div class="text-sm text-red-600 dark:text-red-400">{{ currentRecord.reject_reason }}</div>
          </div>
        </div>

        <!-- 时间信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">时间信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">创建时间</div>
              <div class="text-sm">{{ formatToDateTime(currentRecord?.created_at) || '-' }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-xs text-(--ui-text-muted)">更新时间</div>
              <div class="text-sm">{{ formatToDateTime(currentRecord?.updated_at) || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="关闭"
        color="neutral"
        @click="closeModal"
      />
    </template>
  </UModal>
</template>
