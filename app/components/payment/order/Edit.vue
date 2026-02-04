<script setup lang="ts">
import * as z from 'zod'
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

const schema = z.object({
  real_amount: z.coerce.number().min(0),
  state: z.number().min(0)
})

const stateOptions = [
  { label: '已完成', value: 2 },
  { label: '未支付', value: 0 }
]

const state = reactive({
  loading: false,
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await updatePaymentOrder(postForm)
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
    title="编辑订单"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-2xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="p-6">
        <!-- 订单信息（只读） -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 mb-6">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
            订单信息
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                订单号
              </p>
              <p class="font-mono text-sm font-medium text-gray-900 dark:text-white">
                {{ state.form.order_sn || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                支付单号
              </p>
              <p class="font-mono text-xs text-gray-600 dark:text-gray-300">
                {{ state.form.trade_no || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                用户名
              </p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ state.form.member?.username || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                订单金额
              </p>
              <p class="font-semibold text-blue-700 dark:text-blue-400">
                ¥{{ state.form.order_amount || 0 }}
              </p>
            </div>
          </div>
        </div>

        <UForm
          ref="formRef"
          :schema="schema"
          :state="state.form"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- 订单编辑卡片 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 space-y-5">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
              可编辑信息
            </h4>

            <UFormField label="备注" name="remark">
              <UInput
                v-model.trim="state.form.remark"
                class="w-full"
                placeholder="请输入备注信息"
                size="lg"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="能量" name="coins" required>
                <UInput
                  v-model.number="state.form.coins"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="请输入能量值"
                  class="w-full"
                  size="lg"
                />
              </UFormField>

              <UFormField label="实付金额" name="real_amount" required>
                <UInput
                  v-model.number="state.form.real_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full"
                  size="lg"
                >
                  <template #trailing>
                    <span class="text-sm text-gray-500">¥</span>
                  </template>
                </UInput>
              </UFormField>
            </div>

            <UFormField label="状态" name="state" required>
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择订单状态"
                class="w-full"
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
          修改后将更新订单信息
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
