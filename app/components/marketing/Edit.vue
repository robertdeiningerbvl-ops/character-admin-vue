<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { updateMarketingConfig } from '@/api'

interface Props {
  dialog?: boolean
  currentForm?: any
}

const props = withDefaults(defineProps<Props>(), {
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
  name: z.string().nonempty('任务名称不能为空'),
  code: z.string().nonempty('任务编码不能为空'),
  battery: z.number().min(0, '奖励电量不能小于0'),
  num: z.number().min(0, '需要次数不能小于0'),
  amount: z.number().min(0, '奖励金额不能小于0'),
  show: z.number(),
  state: z.number()
})

const stateOptions = [
  { label: '关闭', value: 0 },
  { label: '启用', value: 2 }
]

const showOptions = [
  { label: '隐藏', value: 0 },
  { label: '显示', value: 2 }
]

interface FormState {
  loading: boolean
  form: {
    id?: number
    name?: string
    code?: string
    battery?: number
    num?: number
    amount?: number
    remark?: string
    show?: number
    state?: number
  }
}

const state = reactive<FormState>({
  loading: false,
  form: {}
})

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    const { error } = await updateMarketingConfig(postForm)
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
      state.form = cloneDeep(props.currentForm)
      state.loading = false
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '修改营销任务' : '新增营销任务'"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="state.form"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="任务名称" name="name" required>
            <UInput
              v-model.trim="state.form.name"
              placeholder="如：每日签到"
              class="w-full"
            />
          </UFormField>

          <UFormField label="任务编码" name="code" required>
            <UInput
              v-model.trim="state.form.code"
              placeholder="如：daily_checkin"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <UFormField label="奖励电量" name="battery" required>
            <UInput
              v-model.number="state.form.battery"
              placeholder="电量值"
              type="number"
              min="0"
              class="w-full"
            />
          </UFormField>

          <UFormField label="需要次数" name="num" required>
            <UInput
              v-model.number="state.form.num"
              placeholder="完成次数"
              type="number"
              min="0"
              class="w-full"
            />
          </UFormField>

          <UFormField label="奖励金额" name="amount" required>
            <UInput
              v-model.number="state.form.amount"
              placeholder="金额"
              type="number"
              min="0"
              step="0.01"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="任务描述" name="remark">
          <UTextarea
            v-model="state.form.remark"
            placeholder="请输入任务描述信息，帮助用户了解任务详情"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="显示状态" name="show" required>
            <USelect
              v-model="state.form.show"
              :items="showOptions"
              placeholder="选择显示状态"
              class="w-full"
            />
          </UFormField>

          <UFormField label="任务状态" name="state" required>
            <USelect
              v-model="state.form.state"
              :items="stateOptions"
              placeholder="选择任务状态"
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
        label="确认"
        color="primary"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
