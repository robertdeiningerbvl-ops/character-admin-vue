<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateCommonCoins, addCommonCoins } from '@/api'

const props = withDefaults(defineProps<{
  dialog?: boolean
  currentForm?: any
}>(), {
  dialog: false,
  currentForm: () => ({})
})

const emit = defineEmits(['update:dialog', 'refresh'])

const drawerVisible = computed({
  get: () => props.dialog,
  set: visible => emit('update:dialog', visible)
})

const closeModal = () => {
  drawerVisible.value = false
}

const formRef = useTemplateRef('formRef')
const toast = useToast()

const schema = z.object({
  title: z.string().nonempty('套餐名称不能为空'),
  content: z.string().optional(),
  coins: z.number().min(0, '能量不能小于0'),
  gift_coins: z.number().min(0, '赠送能量不能小于0').optional(),
  amount: z.number().min(0, '价格不能小于0'),
  sort: z.number().optional(),
  recommend_desc: z.string().optional(),
  state: z.number()
})

const stateOptions = [
  { label: '启用', value: 2 },
  { label: '关闭', value: 4 }
]

const showOptions = [
  { label: '显示', value: 2 },
  { label: '隐藏', value: 0 }
]

const state = reactive({
  loading: false,
  form: {} as any
})

const showEnabled = computed({
  get: () => state.form.show === 2,
  set: (val: boolean) => { state.form.show = val ? 2 : 0 }
})

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val: boolean) => { state.form.state = val ? 2 : 4 }
})

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    postForm.amount = Math.round(postForm.amount * 100)
    const { error } = await (postForm.id ? updateCommonCoins : addCommonCoins)(postForm)
    if (!error) {
      toast.add({ title: '操作成功', color: 'success' })
      closeModal()
      emit('refresh')
    }
  } finally {
    state.loading = false
  }
}

watch(
  () => props.dialog,
  (newValue) => {
    if (newValue) {
      state.loading = false
      state.form = {
        ...props.currentForm,
        amount: props.currentForm.amount ? props.currentForm.amount / 100 : 0
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
        <UIcon name="i-lucide-package" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">{{ currentForm.id ? '修改套餐' : '新增套餐' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
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
          <UFormField label="套餐名称" name="title" required>
            <UInput v-model.trim="state.form.title" placeholder="请输入套餐名称" class="w-full" />
          </UFormField>
        </div>

        <!-- 能量配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">能量配置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="能量数" name="coins" required>
              <UInput
                v-model.number="state.form.coins"
                placeholder="请输入"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="赠送能量" name="gift_coins">
              <UInput
                v-model.number="state.form.gift_coins"
                placeholder="请输入"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 价格配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-coins" class="w-4 h-4 text-(--ui-success)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">价格配置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="价格" name="amount" required>
              <UInput
                v-model.number="state.form.amount"
                placeholder="请输入"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="排序" name="sort">
              <UInput
                v-model.number="state.form.sort"
                placeholder="数值越大越靠前"
                type="number"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 套餐详情 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-info)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">套餐详情</span>
          </div>
          <UFormField label="推荐标签" name="recommend_desc">
            <UInput v-model.trim="state.form.recommend_desc" placeholder="如：更划算、限时特惠" class="w-full" />
          </UFormField>
          <UFormField label="描述" name="content">
            <UTextarea
              v-model.trim="state.form.content"
              placeholder="请输入套餐描述"
              class="w-full"
              :rows="2"
            />
          </UFormField>
        </div>

        <!-- 状态配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">状态配置</span>
          </div>
          <div class="flex items-center gap-8">
            <UFormField label="是否显示" name="show">
              <USwitch v-model="showEnabled" />
            </UFormField>
            <UFormField label="是否启用" name="state">
              <USwitch v-model="stateEnabled" />
            </UFormField>
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
        label="确认"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
