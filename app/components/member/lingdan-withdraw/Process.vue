<script setup lang="ts">
import { completeLingdanWithdraw, rejectLingdanWithdraw } from '@/api'
import { formatLingdan, formatUsdt } from './columns'

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

const toast = useToast()

const state = reactive({
  loading: false,
  action: 'complete' as 'complete' | 'reject',
  txHash: '',
  remark: '',
  reason: ''
})

const addressUids = computed<number[]>(() => props.currentForm.address_uids || [])

async function onSubmit() {
  const id = props.currentForm.id
  if (state.action === 'complete') {
    const txHash = state.txHash.trim()
    if (!txHash || txHash.length > 128) {
      toast.add({ title: '请填写转账交易哈希（128 字符以内）', color: 'error' })
      return
    }
    state.loading = true
    const { error } = await completeLingdanWithdraw({ id, tx_hash: txHash, remark: state.remark.trim() })
    state.loading = false
    if (!error) {
      toast.add({ title: '已标记为已打款', color: 'success' })
      emit('refresh')
    }
    return
  }
  const reason = state.reason.trim()
  if (!reason || [...reason].length > 100) {
    toast.add({ title: '请填写驳回原因（100 字以内）', color: 'error' })
    return
  }
  state.loading = true
  const { error } = await rejectLingdanWithdraw({ id, reason })
  state.loading = false
  if (!error) {
    toast.add({ title: '已驳回，灵丹已退回用户', color: 'success' })
    emit('refresh')
  }
}

watch(() => props.dialog, (val) => {
  if (val) {
    Object.assign(state, { loading: false, action: 'complete', txHash: '', remark: '', reason: '' })
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ footer: 'justify-end', content: 'sm:max-w-lg' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-wallet" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">处理灵丹提取单</span>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-3">
            <UAvatar :src="currentForm.member?.avatar" :alt="currentForm.member?.username" size="lg" />
            <div>
              <div class="font-medium">
                {{ currentForm.member?.username || '-' }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                ID: {{ currentForm.uid }} · {{ currentForm.order_no }}
              </div>
            </div>
            <div class="ml-auto text-right">
              <div class="text-xs text-(--ui-text-muted)">
                {{ formatLingdan(currentForm.amount) }} 灵丹 · 应付
              </div>
              <div class="text-lg font-semibold text-green-600">
                {{ formatUsdt(currentForm.usdt_amount) }} USDT
              </div>
            </div>
          </div>
          <div class="text-xs">
            <span class="text-(--ui-text-muted)">收款地址（{{ currentForm.network || 'TRC20' }}）：</span>
            <span class="font-mono break-all">{{ currentForm.address }}</span>
          </div>
          <UAlert
            v-if="addressUids.length"
            color="error"
            variant="subtle"
            icon="i-lucide-triangle-alert"
            title="疑似同一人多号"
            :description="`用过同一收款地址的其他账号：${addressUids.join('、')}`"
          />
        </div>

        <div class="flex gap-3">
          <UButton
            :color="state.action === 'complete' ? 'success' : 'neutral'"
            :variant="state.action === 'complete' ? 'solid' : 'soft'"
            class="flex-1 justify-center"
            icon="i-lucide-check-circle"
            label="已打款"
            @click="state.action = 'complete'"
          />
          <UButton
            :color="state.action === 'reject' ? 'error' : 'neutral'"
            :variant="state.action === 'reject' ? 'solid' : 'soft'"
            class="flex-1 justify-center"
            icon="i-lucide-x-circle"
            label="驳回"
            @click="state.action = 'reject'"
          />
        </div>

        <template v-if="state.action === 'complete'">
          <UFormField label="转账交易哈希" required hint="先在钱包完成转账，再回填交易哈希">
            <UInput v-model="state.txHash" placeholder="TRC20 交易哈希" class="w-full font-mono" />
          </UFormField>
          <UFormField label="备注（可选）">
            <UInput v-model="state.remark" placeholder="内部备注" class="w-full" />
          </UFormField>
        </template>
        <template v-else>
          <UFormField label="驳回原因" required hint="会展示给用户，请用面向用户的措辞（100 字以内）">
            <UTextarea
              v-model="state.reason"
              :rows="3"
              :maxlength="100"
              placeholder="例如：收款地址无效，请核对后重新提交"
              class="w-full"
            />
          </UFormField>
          <p class="text-xs text-(--ui-text-muted)">
            驳回后灵丹自动退回用户。
          </p>
        </template>
      </div>
    </template>

    <template #footer>
      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="drawerVisible = false"
      />
      <UButton
        :loading="state.loading"
        :color="state.action === 'reject' ? 'error' : 'primary'"
        :label="state.action === 'reject' ? '确认驳回' : '确认已打款'"
        @click="onSubmit"
      />
    </template>
  </UModal>
</template>
