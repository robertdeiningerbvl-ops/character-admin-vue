<script setup lang="ts">
import { updateBatteryMember } from '@/api'

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

const closeModal = () => { drawerVisible.value = false }

const formRef = useTemplateRef('formRef')

const state = reactive({
  loading: false,
  form: { id: undefined as any, battery: undefined as any }
})

const toast = useToast()

async function onSubmit() {
  state.loading = true
  const { error } = await updateBatteryMember({
    uid: state.form.id,
    battery: Number(state.form.battery)
  })
  if (!error) {
    toast.add({ title: '充值成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    state.form = { id: props.currentForm.id, battery: undefined }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ footer: 'justify-end', content: 'sm:max-w-md' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-zap" class="w-5 h-5 text-yellow-500" />
        <span class="font-semibold">电量充值</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- 用户信息 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border)">
          <div class="flex items-center gap-3">
            <UAvatar :src="currentForm.avatar" :alt="currentForm.username" size="lg" />
            <div>
              <div class="font-medium">
                {{ currentForm.username || '-' }}
              </div>
              <div class="text-xs text-(--ui-text-muted)">
                ID: {{ currentForm.id }}
              </div>
            </div>
            <div class="ml-auto text-right">
              <div class="text-xs text-(--ui-text-muted)">
                当前电量
              </div>
              <div class="text-lg font-semibold text-yellow-500">
                {{ currentForm.battery || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- 充值金额 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-plus-circle" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">充值电量</span>
          </div>
          <UFormField name="battery" required>
            <UInput
              v-model.number="state.form.battery"
              placeholder="请输入充值电量"
              type="number"
              class="w-full"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-lucide-zap" class="w-4 h-4 text-yellow-500" />
              </template>
            </UInput>
          </UFormField>
          <div class="text-xs text-(--ui-text-muted)">
            充值后电量: <span class="text-yellow-500 font-medium">{{ (currentForm.battery || 0) + (state.form.battery || 0) }}</span>
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
        label="确认充值"
        color="warning"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
