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
  sort: z.number().optional(),
  ty: z.number(),
  recommend_tag: z.string().optional(),
  recommend_tag_color: z.string().optional(),
  state: z.number()
})

const state = reactive({
  loading: false,
  form: {
    title: '',
    sort: 0,
    ty: 1,
    state: 2,
    recommend_tag: '',
    recommend_tag_color: '',
    tier_json: [] as any[]
  }
})

const stateEnabled = computed({
  get: () => state.form.state === 2,
  set: (val: boolean) => { state.form.state = val ? 2 : 1 }
})

// 添加档位
const addTier = () => {
  const tierNo = state.form.tier_json.length + 1
  state.form.tier_json.push({
    tier_no: tierNo,
    name: `档位${tierNo}`,
    coins: 0,
    us: 0,
    CNY: 0,
    rebate: 0
  })
}

// 删除档位
const removeTier = (index: number) => {
  state.form.tier_json.splice(index, 1)
  // 重新编号
  state.form.tier_json.forEach((tier, idx) => {
    tier.tier_no = idx + 1
  })
}

async function onSubmit() {
  if (state.form.tier_json.length === 0) {
    toast.add({ title: '请至少添加一个价格档位', color: 'error' })
    return
  }

  state.loading = true
  try {
    const postForm: any = {
      ...cloneDeep(state.form),
      tier_json: JSON.stringify(state.form.tier_json)
    }

    if (postForm.id) {
      delete postForm.amount // 编辑时不需要 amount
    }

    console.log('提交的数据:', postForm)
    console.log('recommend_tag_color:', postForm.recommend_tag_color)
    console.log('recommend_tag:', postForm.recommend_tag)

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
      const form = cloneDeep(props.currentForm)

      // 解析 tier_json
      let tierJson = []
      if (form.tier_json) {
        try {
          tierJson = typeof form.tier_json === 'string' ? JSON.parse(form.tier_json) : form.tier_json
        } catch (e) {
          console.error('解析 tier_json 失败', e)
        }
      }

      state.form = {
        ...form,
        tier_json: tierJson,
        state: form.state || 2,
        ty: form.ty || 1,
        sort: form.sort || 0,
        recommend_tag: form.recommend_tag || '',
        recommend_tag_color: form.recommend_tag_color || ''
      }
    }
  }
)
</script>

<template>
  <UModal
    v-model:open="drawerVisible"
    :ui="{ footer: 'justify-end', content: 'sm:max-w-3xl' }"
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
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="套餐类型" name="ty" required>
              <USelect
                v-model="state.form.ty"
                :items="[
                  { label: '常驻套餐', value: 1 },
                  { label: '活动套餐', value: 2 },
                  { label: '礼包套餐', value: 3 }
                ]"
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
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="是否启用" name="state">
              <USwitch v-model="stateEnabled" />
            </UFormField>
          </div>
        </div>

        <!-- 推荐标签 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-tag" class="w-4 h-4 text-(--ui-warning)" />
            <span class="text-sm font-medium text-(--ui-text-highlighted)">推荐标签（可选）</span>
          </div>
          <UFormField label="标签文字" name="recommend_tag">
            <UInput v-model.trim="state.form.recommend_tag" placeholder="如：限时特惠" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="标签颜色（选择器）" name="recommend_tag_color">
              <input v-model="state.form.recommend_tag_color" type="color" class="w-full h-10 rounded-lg border border-(--ui-border) cursor-pointer" />
            </UFormField>
            <UFormField label="标签颜色（手动输入）" name="recommend_tag_color_text">
              <UInput v-model.trim="state.form.recommend_tag_color" placeholder="如：#f59e0b" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- 价格档位 -->
        <div class="p-4 rounded-lg bg-(--ui-bg-elevated) border border-(--ui-border) space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-coins" class="w-4 h-4 text-(--ui-success)" />
              <span class="text-sm font-medium text-(--ui-text-highlighted)">价格档位</span>
            </div>
            <UButton size="xs" icon="i-lucide-plus" label="添加档位" @click="addTier" />
          </div>

          <div v-if="state.form.tier_json.length === 0" class="text-center py-4 text-(--ui-text-muted) text-sm">
            暂无档位，请点击"添加档位"按钮
          </div>

          <div v-for="(tier, index) in state.form.tier_json" :key="index" class="p-3 rounded border border-(--ui-border) space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">档位 {{ tier.tier_no }}</span>
              <UButton size="xs" color="error" variant="ghost" icon="i-lucide-trash-2" @click="removeTier(index)" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <UFormField label="档位名称" :name="`tier_json.${index}.name`">
                <UInput v-model="tier.name" placeholder="如：基础档" />
              </UFormField>
              <UFormField label="妖力数量" :name="`tier_json.${index}.coins`">
                <UInput v-model.number="tier.coins" type="number" placeholder="0" />
              </UFormField>
              <UFormField label="美元价格（分）" :name="`tier_json.${index}.us`">
                <UInput v-model.number="tier.us" type="number" placeholder="0" />
              </UFormField>
              <UFormField label="人民币价格（分）" :name="`tier_json.${index}.CNY`">
                <UInput v-model.number="tier.CNY" type="number" placeholder="0" />
              </UFormField>
              <UFormField label="优惠比例" :name="`tier_json.${index}.rebate`">
                <UInput v-model.number="tier.rebate" type="number" placeholder="0" />
              </UFormField>
            </div>
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
