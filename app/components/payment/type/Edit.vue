<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { updatePaymentType, addPaymentType, getPaymentList } from '@/api'

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
  { label: '正常', value: 2 },
  { label: '删除', value: 4 },
  { label: '待审核', value: 0 }
]

const tyOptions = ref<{ label: string, value: number }[]>([])

const limitTypeOptions = [
  {
    label: '固定金额',
    value: 1
  },
  {
    label: '范围金额',
    value: 2
  }
]

const signTyOptions = [
  { label: 'MD5 签名(常规拼接方式&key=)', value: 1 },
  { label: 'MD5 签名(常规拼接方式无key拼接)', value: 2 },
  { label: 'MD5-方式3', value: 3 },
  { label: 'MD5-方式4', value: 4 },
  { label: 'MD5-方式5', value: 5 }
]

const state = reactive({
  loading: false,
  avatarLoading: false,
  form: {} as any
})

const toast = useToast()

// 金额限制：固定金额填一个正数（如 100）；范围金额填“最小-最大”（如 10-5000，也接受 ~ , 到）
// 填错的限额后端会当作“不限额”，所以提交前先校验
const limitIsFixed = computed(() => Number(state.form.limit_type) === 1)
function limitError(limit: string, limitType: number): string {
  const v = (limit || '').trim()
  if (!v) return '请填写金额限制'
  if (Number(limitType) === 1) {
    return /^\d+(\.\d{1,2})?$/.test(v) && Number(v) > 0 ? '' : '固定金额只能填一个正数，如 100'
  }
  const m = v.replace(/^\[|\]$/g, '').match(/^\s*(\d+(?:\.\d{1,2})?)\s*(?:-|~|～|—|,|，|到|至)\s*(\d+(?:\.\d{1,2})?)\s*$/)
  if (!m) return '金额范围格式：最小-最大，如 10-5000'
  const min = Number(m[1])
  const max = Number(m[2])
  if (min <= 0 || max < min) return '金额范围须满足 0 < 最小 ≤ 最大'
  return ''
}

async function onSubmit() {
  const err = limitError(state.form.limit, state.form.limit_type)
  if (err) {
    toast.add({ title: err, color: 'error' })
    return
  }
  state.loading = true
  const postForm = cloneDeep(state.form)
  const { error } = await (postForm.id ? updatePaymentType : addPaymentType)(postForm)
  if (!error) {
    toast.add({ title: `操作成功`, color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

const loadPaymentTypes = async () => {
  const { data } = await getPaymentList()
  tyOptions.value = (data?.list || []).map((item: any) => ({
    label: item.name,
    value: item.ty // 通道的 ty 要等于支付方式的 ty（不是支付方式的 id）
  }))
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = props.currentForm
      loadPaymentTypes()
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"

    :ui="{ footer: 'justify-end', content: 'sm:max-w-2xl' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-credit-card" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑支付通道' : '新增支付通道' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-5"
        @submit="onSubmit"
      >
        <!-- 基本信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">基本信息</span>
          </div>
          <UFormField label="通道名称" name="name" required>
            <UInput v-model.trim="state.form.name" placeholder="请输入通道名称" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="支付类型" name="ty" required>
              <USelect
                v-model="state.form.ty"
                :items="tyOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="状态" name="state" required>
              <USelect
                v-model="state.form.state"
                :items="stateOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 商户配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-key" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">商户配置</span>
          </div>
          <UFormField label="商户ID" name="mch_id" required>
            <UInput v-model.trim="state.form.mch_id" placeholder="请输入商户ID" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="App Key" name="app_key" required>
              <UInput v-model.trim="state.form.app_key" placeholder="请输入" class="w-full" />
            </UFormField>
            <UFormField label="密钥" name="secret" required>
              <UInput v-model.trim="state.form.secret" placeholder="请输入" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="签名方式" name="sign_ty" required>
            <USelect
              v-model="state.form.sign_ty"
              :items="signTyOptions"
              placeholder="请选择"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- 支付配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-link" class="w-4 h-4 text-(--ui-info)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">支付配置</span>
          </div>
          <UFormField label="下单地址" name="place_uri" required>
            <UInput v-model.trim="state.form.place_uri" placeholder="请输入下单API地址" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="支付标识" name="f" required>
              <UInput
                v-model.trim="state.form.f"
                placeholder="请输入"
                class="w-full"
                :disabled="!!currentForm.id"
              />
            </UFormField>
            <UFormField label="支付编码" name="code" required>
              <UInput v-model.trim="state.form.code" placeholder="请输入" class="w-full" />
            </UFormField>
          </div>
        </div>
        <!-- 金额限制 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-coins" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">金额限制</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="限制类型" name="limit_type">
              <USelect
                v-model="state.form.limit_type"
                :items="limitTypeOptions"
                placeholder="请选择"
                class="w-full"
              />
            </UFormField>
            <UFormField label="支付权重" name="weights" description="仅 Telegram 机器人下单时按权重选通道；H5 由用户自己选通道">
              <UInput
                v-model.trim="state.form.weights"
                placeholder="数值越大优先级越高"
                class="w-full"
                type="number"
                min="0"
                max="99"
              />
            </UFormField>
          </div>
          <UFormField
            :label="limitIsFixed ? '固定金额（元）' : '金额范围（元）'"
            name="limit"
            required
            :description="(limitIsFixed ? '只填一个正数，如 100。' : '格式：最小-最大，如 10-5000（也接受 ~ 、逗号、到）。') + '用户下单金额必须符合这里的限制，否则提示“该通道只支持 X–Y 元，请更换支付通道”'"
          >
            <UInput v-model.trim="state.form.limit" :placeholder="limitIsFixed ? '例如：100' : '例如：10-5000'" class="w-full" />
          </UFormField>
        </div>

        <!-- 备注信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-text-muted)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">备注信息</span>
          </div>
          <UFormField label="备注" name="remark">
            <UTextarea
              v-model.trim="state.form.remark"
              placeholder="请输入备注信息"
              class="w-full"
              :rows="3"
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
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
