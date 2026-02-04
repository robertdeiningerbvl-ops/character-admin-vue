import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 格式化时间
 */
export function formatToDateTime(
  date: dayjs.Dayjs | undefined | number | string | undefined,
  format = DATE_TIME_FORMAT
): string {
  if (typeof date === 'string' && date.length === 13) {
    date = Number(date)
  }
  const dateTime: any = dayjs(date).format(format)
  return dateTime === 'Invalid Date' ? String(date) : dateTime
}
