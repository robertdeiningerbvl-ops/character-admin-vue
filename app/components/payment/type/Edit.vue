<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updatePaymentType, addPaymentType } from '@/api'

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

const stateOptions = [
  {
    label: '启用',
    value: 2
  },
  {
    label: '已删除',
    value: 1
  }
]

const tyOptions = [
  {
    label: 'usdt',
    value: 3
  },
  {
    label: '微信',
    value: 2
  },
  {
    label: '支付宝',
    value: 1
  }
]

const limitTypeOptions = [
  {
    label: '范围金额',
    value: 2
  },
  {
    label: '固定金额',
    value: 1
  }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

const toast = useToast()
async function onSubmit() {
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updatePaymentType : addPaymentType)(postForm)
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
    :title="currentForm.id ? '编辑支付类型' : '新增支付类型'"
    :dismissible="false"
    :ui="{
      content: 'sm:max-w-3xl',
      body: 'p-0',
      footer: 'justify-end bg-gray-50 dark:bg-gray-900'
    }"
  >
    <template #body>
      <div class="p-6">
        <UForm
          ref="formRef"
          :state="state.form"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- 基本信息卡片 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 space-y-5 border border-blue-100 dark:border-blue-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-info-outline" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                基本信息
              </h4>
            </div>

            <UFormField label="名称" name="name" required>
              <UInput
                v-model.trim="state.form.name"
                placeholder="请输入支付类型名称"
                class="w-full"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-label-outline" class="w-5 h-5 text-gray-400" />
                </template>
                <template v-if="state.form.name" #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-circle-x"
                    @click="state.form.name = ''"
                  />
                </template>
              </UInput>
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="支付类型" name="ty" required>
                <USelect
                  v-model="state.form.ty"
                  :items="tyOptions"
                  placeholder="请选择支付类型"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-payment" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
              </UFormField>

              <UFormField label="状态" name="state" required>
                <USelect
                  v-model="state.form.state"
                  :items="stateOptions"
                  placeholder="请选择状态"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-toggle-on-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
              </UFormField>
            </div>
          </div>
          <!-- 商户配置卡片 -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-5 space-y-5 border border-purple-100 dark:border-purple-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-store-outline" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                商户配置
              </h4>
            </div>

            <UFormField label="商户ID" name="mch_id" required>
              <UInput
                v-model.trim="state.form.mch_id"
                placeholder="请输入商户ID"
                class="w-full"
                type="number"
                min="0"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-badge-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="App Key" name="app_key" required>
                <UInput
                  v-model.trim="state.form.app_key"
                  placeholder="请输入App Key"
                  class="w-full"
                  type="string"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-key-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>

              <UFormField label="密钥" name="secret" required>
                <UInput
                  v-model.trim="state.form.secret"
                  placeholder="请输入密钥"
                  class="w-full"
                  type="password"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-lock-outline" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>
            </div>

            <UFormField label="签名方式" name="sign_ty" required>
              <UInput
                v-model.trim="state.form.sign_ty"
                placeholder="请输入签名方式，如：MD5、RSA等"
                class="w-full"
                type="string"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-verified-outline" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>
          </div>
          <!-- 支付配置卡片 -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 space-y-5 border border-green-100 dark:border-green-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-settings-outline" class="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                支付配置
              </h4>
            </div>

            <UFormField label="下单地址" name="place_uri" required>
              <UInput
                v-model.trim="state.form.place_uri"
                placeholder="请输入下单API地址"
                class="w-full"
                type="string"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-link" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="支付标识" name="f" required>
                <UInput
                  v-model.trim="state.form.f"
                  placeholder="请输入支付标识"
                  class="w-full"
                  type="string"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-fingerprint" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>

              <UFormField label="支付编码" name="code" required>
                <UInput
                  v-model.trim="state.form.code"
                  placeholder="请输入支付编码"
                  class="w-full"
                  type="string"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-qr-code-2" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>
            </div>
          </div>
          <!-- 金额限制配置卡片 -->
          <div class="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl p-5 space-y-5 border border-orange-100 dark:border-orange-900/50">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-monetization-on-outline" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                金额限制
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="限制类型" name="limit_type">
                <USelect
                  v-model="state.form.limit_type"
                  :items="limitTypeOptions"
                  placeholder="请选择限制类型"
                  class="w-full"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-rule" class="w-5 h-5 text-gray-400" />
                  </template>
                </USelect>
              </UFormField>

              <UFormField label="支付权重" name="weights" required>
                <UInput
                  v-model.trim="state.form.weights"
                  placeholder="数值越大优先级越高"
                  class="w-full"
                  type="number"
                  min="0"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-material-symbols-weight" class="w-5 h-5 text-gray-400" />
                  </template>
                </UInput>
              </UFormField>
            </div>

            <UFormField
              label="金额范围"
              name="limit"
              required
              description="格式：最小金额-最大金额，如：1-10000"
            >
              <UInput
                v-model.trim="state.form.limit"
                placeholder="例如：1-10000"
                class="w-full"
                type="string"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-material-symbols-attach-money" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
            </UFormField>
          </div>

          <!-- 备注信息卡片 -->
          <div class="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-xl p-5 space-y-5 border border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-material-symbols-note-outline" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 class="font-semibold text-gray-900 dark:text-white">
                备注信息
              </h4>
            </div>

            <UFormField label="备注" name="remark">
              <UTextarea
                v-model.trim="state.form.remark"
                placeholder="请输入备注信息..."
                class="w-full"
                :rows="3"
                size="lg"
              />
            </UFormField>
          </div>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <UIcon name="i-material-symbols-info-outline" class="w-4 h-4" />
          <span>{{ currentForm.id ? '修改后将更新支付配置' : '确认后将创建新的支付类型' }}</span>
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
