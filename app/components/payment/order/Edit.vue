<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updatePaymentOrder } from '@/api'

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

const state = reactive({
  loading: false,
  补单Loading: false,
  form: {} as any
})

const isPaid = computed(() => state.form.state === 2)

const dialogHelper = useDialog()
const toast = useToast()

async function onSubmit() {
  state.loading = true
  const postForm = {
    id: state.form.id,
    real_amount: state.form.real_amount ? state.form.real_amount * 100 : 0,
    remark: state.form.remark
  }
  const { error } = await updatePaymentOrder(postForm)
  if (!error) {
    toast.add({ title: '操作成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

async function handleBudan() {
  dialogHelper.open({
    title: '补单确认',
    description: `确定要对订单「${state.form.order_sn}」进行补单操作吗？补单后订单状态将变为已支付，并为用户增加相应能量。`,
    color: 'warning',
    onPositiveClick: async () => {
      state.补单Loading = true
      const postForm = {
        id: state.form.id,
        state: 2
      }
      const { error } = await updatePaymentOrder(postForm)
      if (!error) {
        toast.add({ title: '补单成功', color: 'success' })
        emit('refresh')
      }
      state.补单Loading = false
    }
  })
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = cloneDeep(props.currentForm)
      if (state.form.real_amount) {
        state.form.real_amount = state.form.real_amount / 100
      }
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
        <UIcon name="i-lucide-receipt" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ isPaid ? '查看订单' : '编辑订单' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- 订单信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">订单信息</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-(--ui-text-muted)">订单号：</span>
              <span class="font-mono">{{ state.form.order_sn || '-' }}</span>
            </div>
            <div>
              <span class="text-(--ui-text-muted)">用户：</span>
              <span>{{ state.form.member?.username || '-' }}</span>
            </div>
            <div>
              <span class="text-(--ui-text-muted)">套餐：</span>
              <span>{{ state.form.package_info || '-' }}</span>
            </div>
            <div>
              <span class="text-(--ui-text-muted)">能量：</span>
              <span class="text-yellow-600">{{ state.form.coins || 0 }}</span>
            </div>
            <div>
              <span class="text-(--ui-text-muted)">订单金额：</span>
              <span class="font-medium">¥{{ (state.form.order_amount || 0) / 100 }}</span>
            </div>
            <div>
              <span class="text-(--ui-text-muted)">状态：</span>
              <UBadge :color="state.form.state === 2 ? 'success' : 'warning'" variant="subtle">
                {{ state.form.state === 2 ? '已支付' : '待支付' }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- 可编辑信息 -->
        <div v-if="!isPaid" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-edit" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">可编辑信息</span>
          </div>
          <UFormField label="实付金额" name="real_amount">
            <UInput
              v-model.number="state.form.real_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full"
            />
          </UFormField>
          <UFormField label="备注" name="remark">
            <UTextarea
              v-model.trim="state.form.remark"
              placeholder="请输入备注信息"
              class="w-full"
              :rows="2"
            />
          </UFormField>
        </div>

        <!-- 补单操作 -->
        <div v-if="state.form.state === 0" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-(--ui-error)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">补单操作</span>
          </div>
          <p class="text-sm text-(--ui-text-muted)">
            如果用户已支付但订单状态未更新，可以进行补单操作。补单后将为用户增加相应能量。
          </p>
          <UButton
            color="warning"
            variant="soft"
            icon="i-lucide-refresh-cw"
            label="确认补单"
            :loading="state.补单Loading"
            @click="handleBudan"
          />
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        :label="isPaid ? '关闭' : '取消'"
        color="neutral"
        variant="outline"
        @click="closeModal"
      />
      <UButton
        v-if="!isPaid"
        :loading="state.loading"
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
