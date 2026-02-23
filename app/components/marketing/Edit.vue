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
  state: z.number(),
  content: z.string().optional()
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
    content?: string
    show?: number
    state?: number
  }
}

const state = reactive<FormState>({
  loading: false,
  form: {}
})

const showEnabled = computed({
  get: () => state.form.show === 2,
  set: (val: boolean) => { state.form.show = val ? 2 : 0 }
})

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val: boolean) => { state.form.state = val ? 2 : 0 }
})

// 判断是否为签到任务
const isCheckInTask = computed(() => state.form.code === 'QD')

// 签到奖励数据
const checkInRewards = reactive<Record<string, number>>({
  1: 100,
  2: 100,
  3: 100,
  4: 100,
  5: 100,
  6: 100,
  7: 100
})

const weekDays = [
  { key: '1', label: '第1天' },
  { key: '2', label: '第2天' },
  { key: '3', label: '第3天' },
  { key: '4', label: '第4天' },
  { key: '5', label: '第5天' },
  { key: '6', label: '第6天' },
  { key: '7', label: '第7天' }
]

// 初始化签到奖励数据
function initCheckInRewards() {
  if (state.form.content && isCheckInTask.value) {
    try {
      const parsed = JSON.parse(state.form.content)
      Object.keys(checkInRewards).forEach((key) => {
        checkInRewards[key] = parsed[key] ?? 100
      })
    } catch {
      // 解析失败使用默认值
    }
  }
}

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)

    // 签到任务：将表单数据转为 JSON
    if (isCheckInTask.value) {
      postForm.content = JSON.stringify(checkInRewards)
    }

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
      initCheckInRewards()
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :title="currentForm.id ? '编辑营销任务' : '新增营销任务'"

    :ui="{
      content: 'sm:max-w-2xl',
      footer: 'justify-end bg-(--ui-bg-elevated)'
    }"
  >
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
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="任务名称" name="name" required>
              <UInput v-model.trim="state.form.name" placeholder="如：每日签到" class="w-full" />
            </UFormField>
            <UFormField label="任务编码" name="code" required>
              <UInput
                v-model.trim="state.form.code"
                placeholder="如：daily_checkin"
                class="w-full"
                :disabled="!!currentForm.id"
              />
            </UFormField>
          </div>
        </div>

        <!-- 奖励配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-gift" class="w-4 h-4 text-(--ui-success)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">奖励配置</span>
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
        </div>

        <!-- 任务详情 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-info)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">任务详情</span>
          </div>
          <UFormField label="任务描述" name="remark">
            <UTextarea
              v-model="state.form.remark"
              placeholder="请输入任务描述信息"
              :rows="2"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- 签到奖励配置 (仅 QD 编码显示) -->
        <div v-if="isCheckInTask" class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-check" class="w-4 h-4 text-(--ui-success)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">签到奖励配置</span>
            <span class="text-xs text-(--ui-text-muted)">（每日签到奖励电量）</span>
          </div>
          <div class="grid grid-cols-7 gap-3">
            <div v-for="day in weekDays" :key="day.key" class="text-center">
              <p class="text-xs text-(--ui-text-muted) mb-2">
                {{ day.label }}
              </p>
              <UInput
                v-model.number="checkInRewards[day.key]"
                type="number"
                min="0"
                class="w-full text-center"
              />
            </div>
          </div>
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
        color="primary"
        variant="solid"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
