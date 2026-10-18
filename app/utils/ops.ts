import dayjs from 'dayjs'

/** 比率 0.1234 → 12.3%；后端用 -1 表示还没有样本 */
export function opsPct(rate: number | null | undefined, digits = 1): string {
  if (rate === null || rate === undefined || rate < 0 || Number.isNaN(rate)) return '—'
  return `${(rate * 100).toFixed(digits)}%`
}

/** 千分位 */
export function opsNum(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

/** 1/100 单位（妖力 / 萝卜）→ 显示值 */
export function opsCents(n: number | null | undefined): string {
  if (!n) return '0'
  return (n / 100).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

/** 毫秒 → 1.2s / 850ms */
export function opsMs(ms: number | null | undefined): string {
  if (!ms) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

/** 秒 → 2 分 / 1.5 小时 */
export function opsSeconds(s: number | null | undefined): string {
  if (!s) return '—'
  if (s < 60) return `${s} 秒`
  if (s < 3600) return `${Math.round(s / 60)} 分`
  return `${(s / 3600).toFixed(1)} 小时`
}

/** YYYYMMDD → YYYY-MM-DD */
export function opsDay(day: number | string | null | undefined): string {
  const s = String(day ?? '')
  return /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s
}

/** 最近 n 天（含今天，或截止昨天）的日期范围 */
export function opsRecentRange(days: number, untilYesterday = false) {
  const end = untilYesterday ? dayjs().subtract(1, 'day') : dayjs()
  return { start: end.subtract(days - 1, 'day').format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') }
}

/** 比率着色：越高越好（good=true）或越高越差 */
export function opsRateClass(rate: number | null | undefined, thresholds: [number, number], higherIsBetter = true): string {
  if (rate === null || rate === undefined || rate < 0) return 'text-(--ui-text-dimmed)'
  const [low, high] = thresholds
  const good = higherIsBetter ? rate >= high : rate <= low
  const bad = higherIsBetter ? rate < low : rate > high
  if (good) return 'text-green-600 dark:text-green-400'
  if (bad) return 'text-red-600 dark:text-red-400'
  return 'text-amber-600 dark:text-amber-400'
}

export const opsFeatureLabel: Record<string, string> = { chat: '聊天', tts: '语音', scene_image: '插图' }

export const opsOutcomeLabel: Record<string, string> = {
  ok: '成功', error: '失败', refusal: '拒答', empty: '空回复', format_error: '格式错误', cancelled: '中途停止', balance: '余额不足'
}

export const opsErrorKindLabel: Record<string, string> = {
  upstream: '上游报错 / 超时', too_long: '输入超长', busy: '并发冲突', upload: '保存文件失败', prompt: '画面描述失败', internal: '内部错误'
}

export const opsReasonLabel: Record<string, string> = {
  off_topic: '答非所问', out_of_character: '不符合人设', too_short: '太短', too_long: '太长', repetitive: '重复', inappropriate: '不恰当', unspecified: '未选原因'
}

/** 留存 / 首充的分组方式 */
export const opsCohortGroupOptions = [
  { label: '按注册日期', value: 'day' },
  { label: '按注册方式', value: 'login_type' },
  { label: '按渠道', value: 'channel' },
  { label: '按 utm_source', value: 'utm_source' },
  { label: '按注册域名', value: 'host' },
  { label: '按平台', value: 'platform' },
  { label: '合计', value: 'all' }
]

export const opsLoginTypeLabel: Record<string, string> = {
  device: '访客 / 设备', email: '邮箱', google: 'Google', discord: 'Discord', telegram: 'Telegram'
}

/** 分组值显示 */
export function opsCohortKey(groupBy: string, key: string): string {
  if (groupBy === 'day') return opsDay(key)
  if (groupBy === 'login_type') return opsLoginTypeLabel[key] || key
  if (groupBy === 'channel') {
    if (key === 'organic') return '自然流量'
    if (key === 'invite') return '邀请'
    if (key.startsWith('channel:')) return `渠道 ${key.slice(8)}`
    if (key.startsWith('utm:')) return `utm ${key.slice(4)}`
  }
  if (key === 'all') return '合计'
  if (key === '(unknown)') return '未知'
  return key
}
