<script setup lang="ts">
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { getOpsReportPreview } from '@/api'

definePageMeta({ layout: 'app' })
defineOptions({ name: 'OpsReport' })

const toast = useToast()

const state = reactive({
  loading: false,
  day: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  text: ''
})

async function loadData() {
  state.loading = true
  try {
    const { data } = await getOpsReportPreview({ day: state.day })
    state.text = data?.text || ''
  } finally {
    state.loading = false
  }
}

onMounted(loadData)

// 报告正文是 Telegram HTML（只用了 <b>），只放行 <b>
const html = computed(() => DOMPurify.sanitize(state.text.replace(/\n/g, '<br>'), { ALLOWED_TAGS: ['b', 'br'], ALLOWED_ATTR: [] }))

// 复制成纯文本（去掉标签、还原转义）
async function copyText() {
  const div = document.createElement('div')
  div.innerHTML = DOMPurify.sanitize(state.text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  await navigator.clipboard.writeText(div.textContent || '')
  toast.add({ title: '已复制', color: 'success' })
}
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6 max-w-3xl">
      <UCard :ui="{ body: 'p-4' }" class="mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <UFormField label="报告日期" class="w-[160px]">
            <UInput v-model="state.day" type="date" :max="dayjs().format('YYYY-MM-DD')" />
          </UFormField>
          <UButton
            :loading="state.loading"
            label="生成预览"
            icon="i-lucide-eye"
            @click="loadData"
          />
          <UButton
            :disabled="!state.text"
            label="复制文本"
            icon="i-lucide-copy"
            color="neutral"
            variant="outline"
            @click="copyText"
          />
        </div>
      </UCard>

      <UCard class="mb-6">
        <USkeleton v-if="state.loading" class="h-96" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-else-if="state.text" class="text-sm leading-6 whitespace-normal" v-html="html" />
        <p v-else class="text-(--ui-text-muted)">
          没有数据
        </p>
      </UCard>

      <UAlert
        color="neutral"
        variant="subtle"
        icon="lucide:send"
        title="每天自动发到 Telegram"
      >
        <template #description>
          <div class="leading-6">
            在「系统 → 配置项」里编辑 <code>OPS_REPORT</code>：<code>{"enabled":1,"chat_id":"-100…","thread_id":0,"hour":9}</code>。
            服务端配置的 Telegram 机器人要先拉进群；每天到 hour 点（系统时区）发前一天的报告，一天只发一次。
            发送失败时可在服务器上执行 <code>task -job ops-report -confirm</code> 补发。
          </div>
        </template>
      </UAlert>
    </div>
  </DashboardLayout>
</template>
