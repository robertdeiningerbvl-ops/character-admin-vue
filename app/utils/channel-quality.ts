import dayjs from 'dayjs'

/** 渠道质量评级配色（后端 grade_level） */
export type GradeLevel = 'success' | 'info' | 'warning' | 'error' | 'neutral'

/** 平台自然用户的邀请码（与后端 model.InviteCodePlatform 一致） */
export const CQ_PLATFORM_CODE = 'AAAA'

export function cqCodeLabel(code: string) {
  return code === CQ_PLATFORM_CODE ? '平台自然用户' : code
}

/** 比率 → 百分比文本；null / undefined 显示 — */
export function cqPct(v: number | null | undefined, digits?: number) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const p = v * 100
  const d = digits ?? (p !== 0 && Math.abs(p) < 10 ? 1 : 0)
  return `${p.toFixed(d)}%`
}

export function cqMoney(v: number | null | undefined) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  return v < 10 ? `¥${Number(v.toFixed(2))}` : `¥${Math.round(v).toLocaleString('en-US')}`
}

/** 分数 → 颜色 class */
export function cqScoreClass(score: number | null | undefined) {
  if (score === null || score === undefined) return 'text-(--ui-text-dimmed)'
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 65) return 'text-sky-600 dark:text-sky-400'
  if (score >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export function cqScoreBg(score: number | null | undefined) {
  if (score === null || score === undefined) return 'bg-(--ui-border)'
  if (score >= 80) return 'bg-green-500'
  if (score >= 65) return 'bg-sky-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

/** 某个注册日到今天是否已满 lag 天（与后端成熟规则一致：注册日 <= 今天 - lag） */
export function cqMatured(regDate: string, today: string, lag: number) {
  return dayjs(today).diff(dayjs(regDate), 'day') >= lag
}

export function cqRatio(num: number, den: number) {
  return den > 0 ? Math.min(num / den, 1) : null
}
