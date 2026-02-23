<script setup lang="ts">
import * as z from 'zod'
import { cloneDeep } from 'lodash-es'
import { addMemberInvitationCodeGenerate } from '@/api'

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
  limit: z.number().min(0, '限领次数不能小于0'),
  num: z.number().min(1, '生成数量至少为1'),
  coins: z.number().min(0, '能量不能小于0'),
  tm: z.string().nonempty('请选择过期时间'),
  remark: z.string().optional(),
  uid: z.number().optional()
})

interface FormState {
  loading: boolean
  form: {
    num?: number
    limit?: number
    coins?: number
    tm?: string
    remark?: string
    uid?: number
  }
}

const state = reactive<FormState>({
  loading: false,
  form: {}
})

// 用户搜索
const userSearchQuery = ref('')
const userOptions = ref<{ label: string, value: number }[]>([])

async function onSubmit() {
  state.loading = true
  try {
    const postForm = cloneDeep(state.form)
    // 转换时间格式: 2024-02-08T20:54 -> 2024-02-08 20:54:00
    if (postForm.tm) {
      postForm.tm = postForm.tm.replace('T', ' ') + ':00'
    }
    const { error } = await addMemberInvitationCodeGenerate(postForm)
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
      userSearchQuery.value = ''
      userOptions.value = []
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    title="生成兑换卡"

    :ui="{
      content: 'sm:max-w-xl',
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
        <!-- 基本配置 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">基本配置</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="生成数量" name="num" required>
              <UInput
                v-model.number="state.form.num"
                placeholder="请输入数量"
                type="number"
                min="1"
                class="w-full"
              />
            </UFormField>
            <UFormField label="限领次数" name="limit" required>
              <UInput
                v-model.number="state.form.limit"
                placeholder="每张卡可用次数"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="能量值" name="coins" required>
              <UInput
                v-model.number="state.form.coins"
                placeholder="请输入能量值"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
            <UFormField label="过期时间" name="tm" required>
              <UInput
                v-model="state.form.tm"
                placeholder="请选择过期时间"
                type="datetime-local"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- 指定用户 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-(--ui-info)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">指定用户</span>
            <span class="text-xs text-(--ui-text-muted)">（可选）</span>
          </div>
          <UFormField label="选择用户" name="uid">
            <UInput
              v-model.number="state.form.uid"
              placeholder="请输入用户ID"
              type="number"
              min="1"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- 备注信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">备注信息</span>
            <span class="text-xs text-(--ui-text-muted)">（可选）</span>
          </div>
          <UFormField name="remark">
            <UTextarea
              v-model="state.form.remark"
              placeholder="请输入备注信息"
              :rows="2"
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
