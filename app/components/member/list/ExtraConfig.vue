<script setup lang="ts">
import { updateMember } from '@/api'

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
  form: { id: undefined as any, invite_rate: '', invite_times: '', game_rate: '', game_tx_rate: '' }
})

const toast = useToast()

async function onSubmit() {
  state.loading = true
  const extra = {
    invite_rate: state.form.invite_rate,
    invite_times: state.form.invite_times,
    game_rate: state.form.game_rate,
    game_tx_rate: state.form.game_tx_rate
  }
  const { error } = await updateMember({
    id: state.form.id,
    extra: JSON.stringify(extra)
  })
  if (!error) {
    toast.add({ title: '保存成功', color: 'success' })
    emit('refresh')
  }
  state.loading = false
}

watch(() => props.dialog, (val) => {
  if (val) {
    state.loading = false
    let extra = {}
    try {
      extra = props.currentForm.extra ? JSON.parse(props.currentForm.extra) : {}
    } catch (e) {
      extra = {}
    }
    state.form = {
      id: props.currentForm.id,
      invite_rate: extra.invite_rate || '',
      invite_times: extra.invite_times || '',
      game_rate: extra.game_rate || '',
      game_tx_rate: extra.game_tx_rate || ''
    }
  }
})
</script>

<template>
  <UModal v-model:open="drawerVisible" :ui="{ footer: 'justify-end', content: 'sm:max-w-md' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-settings" class="w-5 h-5 text-(--ui-primary)" />
        <span class="font-semibold">额外配置</span>
      </div>
    </template>

    <template #body>
      <UForm
        ref="formRef"
        :state="state.form"
        class="space-y-4"
        @submit="onSubmit"
      >
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
          </div>
        </div>

        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-3">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-percent" class="w-4 h-4 text-(--ui-primary)" />
            <span class="text-sm font-medium">费率配置</span>
          </div>

          <UFormField label="邀请返现费率 (%)" name="invite_rate" hint="邀请用户充值时的返现比例">
            <UInput
              v-model="state.form.invite_rate"
              placeholder="例如 50"
              type="number"
              size="lg"
              class="w-full"
            >
              <template #leading>
                <UIcon name="i-lucide-user-plus" class="w-4 h-4 text-purple-500" />
              </template>
              <template #trailing>
                <span class="text-sm text-(--ui-text-muted)">%</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="返现次数" name="invite_times" hint="-1:无限制 0:不返现 1:首充 其他:指定次数">
            <UInput
              v-model="state.form.invite_times"
              placeholder="例如 -1"
              type="number"
              size="lg"
              class="w-full"
            >
              <template #leading>
                <UIcon name="i-lucide-repeat" class="w-4 h-4 text-blue-500" />
              </template>
              <template #trailing>
                <span class="text-sm text-(--ui-text-muted)">次</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="游戏费率 (%)" name="game_rate" hint="用户游戏收益的分成比例">
            <UInput
              v-model="state.form.game_rate"
              placeholder="例如 90"
              type="number"
              size="lg"
              class="w-full"
            >
              <template #leading>
                <UIcon name="i-lucide-gamepad-2" class="w-4 h-4 text-teal-500" />
              </template>
              <template #trailing>
                <span class="text-sm text-(--ui-text-muted)">%</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="提现费率 (%)" name="game_tx_rate" hint="用户提现时的手续费比例">
            <UInput
              v-model="state.form.game_tx_rate"
              placeholder="例如 50"
              type="number"
              size="lg"
              class="w-full"
            >
              <template #leading>
                <UIcon name="i-lucide-wallet" class="w-4 h-4 text-green-500" />
              </template>
              <template #trailing>
                <span class="text-sm text-(--ui-text-muted)">%</span>
              </template>
            </UInput>
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
        label="保存配置"
        @click="formRef?.submit()"
      />
    </template>
  </UModal>
</template>
