<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addCommonVip, updateCommonVip } from '@/api'

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

const state = reactive({
  loading: false,
  form: {
    title: '',
    sort: 0,
    amount: 0,
    us_amount: 0,
    rebate: 0,
    free_battery: 0,
    battery: 0,
    vip_time: 0,
    state: 2
  } as any
})

function toNumber(value: any) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

async function onSubmit() {
  const title = String(state.form.title ?? '').trim()
  if (!title) {
    toast.add({ title: '套餐名称必须填写', color: 'error' })
    return
  }

  state.loading = true
  try {
    const postForm = {
      ...cloneDeep(state.form),
      title,
      sort: Math.round(toNumber(state.form.sort)),
      amount: toNumber(state.form.amount),
      us_amount: toNumber(state.form.us_amount),
      rebate: Math.round(toNumber(state.form.rebate)),
      free_battery: Math.round(toNumber(state.form.free_battery)),
      battery: Math.round(toNumber(state.form.battery)),
      vip_time: Math.round(toNumber(state.form.vip_time)),
      state: state.form.state === 0 ? 0 : 2
    }

    const { error } = await (postForm.id ? updateCommonVip : addCommonVip)(postForm)
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
  (visible) => {
    if (visible) {
      state.loading = false
      state.form = {
        title: '',
        sort: 0,
        amount: 0,
        us_amount: 0,
        rebate: 0,
        free_battery: 0,
        battery: 0,
        vip_time: 0,
        state: 2,
        ...cloneDeep(props.currentForm)
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
        <UIcon name="i-lucide-crown" class="w-5 h-5 text-(--ui-warning)" />
        <span class="font-semibold">{{ currentForm.id ? '编辑 VIP 套餐' : '新增 VIP 套餐' }}</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-5"
        @submit="onSubmit"
      >
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">套餐信息</span>
          </div>

          <UFormField label="套餐名称" name="title" required>
            <UInput
              v-model.trim="state.form.title"
              placeholder="请输入套餐名称，如：月度VIP"
              class="w-full"
            />
          </UFormField>

          <UFormField label="状态" name="state" required>
            <USelect
              v-model="state.form.state"
              :items="[
                { label: '开启', value: 2 },
                { label: '关闭', value: 0 }
              ]"
              placeholder="请选择"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="排序（越大越靠前）" name="sort">
              <UInput
                v-model.number="state.form.sort"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="价格 - 人民币（元）" name="amount">
              <UInput
                v-model.number="state.form.amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full"
              />
            </UFormField>
            <UFormField label="价格 - 美元（美元）" name="us_amount">
              <UInput
                v-model.number="state.form.us_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="首次赠送妖力" name="free_battery">
              <UInput
                v-model.number="state.form.free_battery"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="VIP 时长" name="vip_time">
              <UInput
                v-model.number="state.form.vip_time"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="每月赠送妖力" name="battery">
              <UInput
                v-model.number="state.form.battery"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="w-full"
              />
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
