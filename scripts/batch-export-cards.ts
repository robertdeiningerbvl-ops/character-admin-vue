import fs from 'node:fs'
import fsp from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { URL } from 'node:url'
import sharp from 'sharp'

type VersionStrategy = 'first' | 'review' | 'current' | 'latest'

interface ExportConfig {
  apiUrl: string
  token: string
  outputDir: string
  limit: number
  pageSize: number
  seeking: number
  versionStrategy: VersionStrategy
  delayMs: number
  skipExisting: boolean
  dryRun: boolean
}

interface RawResponse {
  status: number
  headers: http.IncomingHttpHeaders
  buffer: Buffer
}

interface FailureItem {
  id: string | number
  name: string
  reason: string
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const log = (message: string) => {
  console.log(`[batch-export] ${new Date().toISOString()} ${message}`)
}

const warn = (message: string) => {
  console.warn(`[batch-export] ${new Date().toISOString()} ${message}`)
}

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}

  const result: Record<string, string> = {}
  const content = fs.readFileSync(filePath, 'utf8')

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const equalIndex = line.indexOf('=')
    if (equalIndex === -1) continue

    const key = line.slice(0, equalIndex).trim()
    let value = line.slice(equalIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (key) result[key] = value
  }

  return result
}

function loadDotEnv(): Record<string, string> {
  const cwd = process.cwd()
  return {
    ...readEnvFile(path.join(cwd, '.env')),
    ...readEnvFile(path.join(cwd, '.env.local'))
  }
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

function readCliArg(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`
  const withPrefix = args.find(arg => arg.startsWith(prefix))
  if (withPrefix) return withPrefix.slice(prefix.length)

  const index = args.indexOf(`--${name}`)
  if (index !== -1) {
    const next = args[index + 1]
    if (next && !next.startsWith('--')) return next
    return 'true'
  }

  return undefined
}

function buildConfig(args: string[]): ExportConfig {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  const dotEnv = loadDotEnv()
  const env = (key: string) => process.env[key] ?? dotEnv[key]

  const apiUrl = readCliArg(args, 'api-url') ?? env('BATCH_EXPORT_API_URL') ?? env('API_BASE_URL') ?? ''
  const token = readCliArg(args, 'token') ?? env('BATCH_EXPORT_TOKEN') ?? ''
  const outputDir = readCliArg(args, 'output-dir') ?? env('BATCH_EXPORT_OUTPUT_DIR') ?? './exports/cards'
  const limit = parsePositiveInt(readCliArg(args, 'limit') ?? env('BATCH_EXPORT_LIMIT'), 0)
  const pageSize = parsePositiveInt(readCliArg(args, 'page-size') ?? env('BATCH_EXPORT_PAGE_SIZE'), 100)
  const seeking = parsePositiveInt(readCliArg(args, 'seeking') ?? env('BATCH_EXPORT_SEEKING'), 0)
  const delayMs = parsePositiveInt(readCliArg(args, 'delay') ?? env('BATCH_EXPORT_DELAY'), 200)

  const versionStrategyRaw = (readCliArg(args, 'version-strategy') ?? env('BATCH_EXPORT_VERSION_STRATEGY') ?? 'first') as VersionStrategy
  const versionStrategy: VersionStrategy = ['first', 'review', 'current', 'latest'].includes(versionStrategyRaw)
    ? versionStrategyRaw
    : 'first'

  const skipExisting = parseBoolean(readCliArg(args, 'skip-existing') ?? env('BATCH_EXPORT_SKIP_EXISTING'), true)
  const dryRun = parseBoolean(readCliArg(args, 'dry-run') ?? env('BATCH_EXPORT_DRY_RUN'), false)

  if (!apiUrl) {
    throw new Error('缺少 API 地址，请设置 BATCH_EXPORT_API_URL 或通过 --api-url 传入')
  }

  return {
    apiUrl: apiUrl.replace(/\/+$/, ''),
    token,
    outputDir: path.resolve(process.cwd(), outputDir),
    limit,
    pageSize,
    seeking,
    versionStrategy,
    delayMs,
    skipExisting,
    dryRun
  }
}

function printHelp() {
  console.log(`
批量导出角色卡 PNG 脚本

用法：
  pnpm export:cards [选项]

环境变量：
  BATCH_EXPORT_API_URL          后台接口地址，例如 http://127.0.0.1:3001
  BATCH_EXPORT_TOKEN            后台 token，对应登录后的 localStorage token
  BATCH_EXPORT_OUTPUT_DIR       导出目录，默认 ./exports/cards
  BATCH_EXPORT_LIMIT            最多导出卡片数，0 表示不限制
  BATCH_EXPORT_PAGE_SIZE        列表每页数量，默认 100
  BATCH_EXPORT_SEEKING          列表 seeking 过滤，默认 0 表示全部
  BATCH_EXPORT_VERSION_STRATEGY 版本选择策略：first|review|current|latest
  BATCH_EXPORT_DELAY            每张卡之间的延迟毫秒数，默认 200
  BATCH_EXPORT_SKIP_EXISTING    是否跳过已存在文件，默认 true

常用选项：
  --api-url=URL
  --token=TOKEN
  --output-dir=PATH
  --limit=N
  --page-size=N
  --seeking=N
  --version-strategy=first
  --delay=200
  --skip-existing=false
  --dry-run
  --help
`.trim())
}

function requestRaw(
  input: string,
  headers: Record<string, string> = {},
  timeoutMs = 30000,
  redirectCount = 0
): Promise<RawResponse> {
  if (redirectCount > 5) {
    return Promise.reject(new Error(`重定向次数过多: ${input}`))
  }

  const url = new URL(input)
  const lib = url.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    const req = lib.request(
      url,
      {
        method: 'GET',
        headers: {
          accept: '*/*',
          ...headers
        },
        timeout: timeoutMs
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          const status = res.statusCode || 0
          const location = res.headers.location

          if ([301, 302, 303, 307, 308].includes(status) && location) {
            const nextUrl = new URL(location, url).toString()
            resolve(requestRaw(nextUrl, headers, timeoutMs, redirectCount + 1))
            return
          }

          resolve({
            status,
            headers: res.headers,
            buffer: Buffer.concat(chunks)
          })
        })
      }
    )

    req.on('timeout', () => {
      req.destroy(new Error(`请求超时: ${url}`))
    })
    req.on('error', reject)
    req.end()
  })
}

async function requestJson<T = any>(input: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await requestRaw(input, headers)
  const text = response.buffer.toString('utf8')

  let payload: any
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error(`接口返回的不是合法 JSON: ${input}`)
  }

  return payload
}

function getAdminBase(apiUrl: string): string {
  return apiUrl.endsWith('/admin') ? apiUrl : `${apiUrl}/admin`
}

function buildAdminUrl(apiUrl: string, route: string, params: Record<string, any> = {}): string {
  const url = new URL(`${getAdminBase(apiUrl)}/${route}`)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function apiGet<T = any>(
  apiUrl: string,
  token: string,
  route: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = buildAdminUrl(apiUrl, route, params)
  const headers: Record<string, string> = {
    'user-agent': 'character-admin-vue/batch-export-cards'
  }
  if (token) headers.token = token

  const payload = await requestJson<any>(url, headers)
  if (payload?.code === 1) {
    return payload.data as T
  }

  const message = payload?.msg || payload?.message || `接口调用失败(code=${payload?.code ?? 'unknown'})`
  throw new Error(message)
}

function resolveMediaUrl(raw: string, apiUrl: string): string {
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw

  const baseUrl = apiUrl.endsWith('/admin')
    ? apiUrl.replace(/\/admin$/, '')
    : apiUrl

  return new URL(raw, `${baseUrl}/`).toString()
}

async function downloadImage(url: string, token: string): Promise<Buffer> {
  if (url.startsWith('data:')) {
    const commaIndex = url.indexOf(',')
    if (commaIndex === -1) throw new Error('data URL 格式错误')
    const metadata = url.slice(0, commaIndex)
    const data = url.slice(commaIndex + 1)
    if (metadata.includes(';base64')) {
      return Buffer.from(data, 'base64')
    }
    return Buffer.from(decodeURIComponent(data), 'utf8')
  }

  const headers: Record<string, string> = {
    'user-agent': 'character-admin-vue/batch-export-cards'
  }
  if (token) headers.token = token

  const response = await requestRaw(url, headers, 30000)
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`图片下载失败(HTTP ${response.status}): ${url}`)
  }
  return response.buffer
}

function chooseVersion(detail: any, strategy: VersionStrategy): any | null {
  const versions = Array.isArray(detail?.version) ? detail.version : []
  if (versions.length === 0) return null

  if (strategy === 'review') {
    return versions.find((v: any) => Number(v?.id) === Number(detail?.review_version_id)) || versions[0]
  }

  if (strategy === 'current') {
    const currentId = detail?.version_id ?? detail?.current_version_id
    return versions.find((v: any) => Number(v?.id) === Number(currentId)) || versions[0]
  }

  if (strategy === 'latest') {
    return versions[versions.length - 1]
  }

  return versions[0]
}

function parseBody(body: any): Record<string, any> {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      throw new Error('版本 body 不是合法 JSON')
    }
  }

  if (body && typeof body === 'object') return body
  throw new Error('版本 body 为空')
}

async function resolveCardBody(
  detail: any,
  apiUrl: string,
  token: string,
  strategy: VersionStrategy
): Promise<Record<string, any>> {
  const versions = Array.isArray(detail?.version) ? detail.version : []
  const preferred = chooseVersion(detail, strategy)

  const ordered = [
    preferred,
    ...versions.filter((v: any) => Number(v?.id) !== Number(preferred?.id))
  ].filter((v): v is any => Boolean(v))

  for (const version of ordered) {
    try {
      const versionData = await apiGet<any>(
        apiUrl,
        token,
        'amusement-version-detail',
        { id: detail.id, version_id: version.id }
      )
      if (versionData?.body) {
        return parseBody(versionData.body)
      }
    } catch {
      // 尝试下一个可用版本。
    }
  }

  if (detail?.body) return parseBody(detail.body)
  throw new Error('未找到可用的角色卡内容')
}

function normalizeGuide(guide: any): string[] {
  if (!Array.isArray(guide)) return []
  return guide
    .map((item: any) => (typeof item === 'string' ? item : item?.content))
    .filter((item: any): item is string => typeof item === 'string' && item.trim().length > 0)
}

function normalizeExportCard(raw: any): Record<string, any> {
  const data = raw?.data && typeof raw.data === 'object' ? raw.data : {}
  const anohana = raw?.anohana && typeof raw.anohana === 'object' ? raw.anohana : {}
  const name = data.name || raw?.name || ''

  const allGreetings = [
    data.first_mes || '',
    ...(Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [])
  ].filter((item: any): item is string => typeof item === 'string' && item.length > 0)

  const guide = normalizeGuide(anohana.guide)

  const regexEntries = Array.isArray(data.regex)
    ? data.regex.map((rule: any, index: number) => ({
        ...rule,
        id: rule.id != null ? String(rule.id) : String(index + 1),
        placement: Array.isArray(rule.placement) ? rule.placement : [],
        trimStrings: Array.isArray(rule.trimStrings) ? rule.trimStrings : []
      }))
    : []

  const characterBook = Array.isArray(data.character_book?.entries) && data.character_book.entries.length > 0
    ? {
        name: data.character_book.name || `${name}的世界书`,
        entries: data.character_book.entries
      }
    : undefined

  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    name,
    anohana: {
      image: anohana.image || '',
      avatar: anohana.avatar || anohana.image || '',
      images: Array.isArray(anohana.images) ? anohana.images : [],
      source: anohana.source === true,
      source_url: anohana.source_url || '',
      summary: anohana.summary || data.summary || '',
      anonymous: anohana.anonymous === true,
      nsfw: anohana.nsfw === true,
      guide
    },
    data: {
      name,
      description: data.description || '',
      personality: data.personality || '',
      scenario: data.scenario || '',
      mes_example: data.mes_example || '',
      first_mes: allGreetings[0] || '',
      alternate_greetings: allGreetings.slice(1),
      creator_notes: data.creator_notes || '',
      system_prompt: data.system_prompt || '',
      creator: data.creator || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      character_book: characterBook,
      regex: regexEntries.length > 0 ? regexEntries : undefined
    }
  }
}

function crc32(data: Uint8Array): number {
  const table: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }

  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ (data[i] ?? 0)) & 0xff]! ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function insertPngTextChunk(pngData: Uint8Array, keyword: string, text: string): Uint8Array {
  const keywordBytes = new TextEncoder().encode(keyword)
  const textBytes = new TextEncoder().encode(text)
  const chunkData = new Uint8Array(keywordBytes.length + 1 + textBytes.length)
  chunkData.set(keywordBytes, 0)
  chunkData[keywordBytes.length] = 0
  chunkData.set(textBytes, keywordBytes.length + 1)

  const chunkType = new TextEncoder().encode('tEXt')
  const chunkLength = chunkData.length
  const chunk = new Uint8Array(4 + 4 + chunkLength + 4)

  chunk[0] = (chunkLength >> 24) & 0xff
  chunk[1] = (chunkLength >> 16) & 0xff
  chunk[2] = (chunkLength >> 8) & 0xff
  chunk[3] = chunkLength & 0xff
  chunk.set(chunkType, 4)
  chunk.set(chunkData, 8)

  const crcData = new Uint8Array(4 + chunkLength)
  crcData.set(chunkType, 0)
  crcData.set(chunkData, 4)
  const crcValue = crc32(crcData)
  chunk[8 + chunkLength] = (crcValue >> 24) & 0xff
  chunk[8 + chunkLength + 1] = (crcValue >> 16) & 0xff
  chunk[8 + chunkLength + 2] = (crcValue >> 8) & 0xff
  chunk[8 + chunkLength + 3] = crcValue & 0xff

  let insertPos = 8
  while (insertPos < pngData.length - 12) {
    const len = ((pngData[insertPos] ?? 0) << 24)
      | ((pngData[insertPos + 1] ?? 0) << 16)
      | ((pngData[insertPos + 2] ?? 0) << 8)
      | (pngData[insertPos + 3] ?? 0)
    const type = String.fromCharCode(
      pngData[insertPos + 4] ?? 0,
      pngData[insertPos + 5] ?? 0,
      pngData[insertPos + 6] ?? 0,
      pngData[insertPos + 7] ?? 0
    )
    insertPos += 12 + len
    if (type === 'IHDR') break
  }

  const result = new Uint8Array(pngData.length + chunk.length)
  result.set(pngData.slice(0, insertPos), 0)
  result.set(chunk, insertPos)
  result.set(pngData.slice(insertPos), insertPos + chunk.length)
  return result
}

function safeFileName(id: string | number, name: string): string {
  const cleaned = (name || 'character')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'character'

  return `${id}-${cleaned}.png`
}

interface ExportCardResult {
  status: 'success' | 'skip-no-image' | 'skip-existing' | 'dry-run' | 'error'
  message?: string
}

async function exportOneCard(
  item: any,
  config: ExportConfig
): Promise<ExportCardResult> {
  const id = item?.id ?? 'unknown'
  const detail = await apiGet<any>(config.apiUrl, config.token, 'amusement-edit-info', { biz_id: id })
  const rawCard = await resolveCardBody(detail, config.apiUrl, config.token, config.versionStrategy)
  const card = normalizeExportCard(rawCard)
  const name = card.name || item?.name || `character-${id}`
  const imageUrl = resolveMediaUrl(card.anohana.image, config.apiUrl)

  if (!card.anohana.image || !imageUrl) {
    return { status: 'skip-no-image', message: '缺少背景图' }
  }

  const fileName = safeFileName(id, name)
  const filePath = path.join(config.outputDir, fileName)

  if (!config.dryRun && config.skipExisting && fs.existsSync(filePath)) {
    return { status: 'skip-existing', message: '文件已存在' }
  }

  if (config.dryRun) {
    return { status: 'dry-run', message: `将导出 ${fileName}` }
  }

  const imageBuffer = await downloadImage(imageUrl, config.token)
  const pngBuffer = await sharp(imageBuffer, { failOn: 'none' }).png().toBuffer()

  const json = JSON.stringify(card)
  const base64Data = Buffer.from(json, 'utf8').toString('base64')
  const outputBuffer = Buffer.from(
    insertPngTextChunk(new Uint8Array(pngBuffer), 'chara', base64Data)
  )

  await fsp.mkdir(config.outputDir, { recursive: true })
  await fsp.writeFile(filePath, outputBuffer)

  return { status: 'success', message: fileName }
}

async function run() {
  const config = buildConfig(process.argv.slice(2))
  const maskedToken = config.token
    ? `${config.token.slice(0, 8)}...${config.token.slice(-4)}`
    : '(empty)'

  log(`API: ${config.apiUrl}`)
  log(`Token: ${maskedToken}`)
  log(`输出目录: ${config.outputDir}`)
  log(`限制数量: ${config.limit === 0 ? '不限制' : config.limit}`)
  log(`版本策略: ${config.versionStrategy}`)
  if (config.dryRun) log('Dry run：只检查，不下载图片和写文件')

  const stats = {
    total: 0,
    success: 0,
    skippedNoImage: 0,
    skippedExisting: 0,
    dryRun: 0,
    failed: 0
  }
  const failures: FailureItem[] = []

  let page = 1
  let processed = 0
  let total = 0

  while (true) {
    const params: Record<string, any> = {
      page,
      pagesize: config.pageSize
    }
    if (config.seeking > 0) params.seeking = config.seeking

    const listData = await apiGet<any>(config.apiUrl, config.token, 'amusement-list', params)
    const list = Array.isArray(listData?.list) ? listData.list : []
    const pageTotal = Number(listData?.count ?? listData?.total ?? 0)

    if (page === 1) {
      total = Number.isFinite(pageTotal) ? pageTotal : list.length
      log(`列表总数: ${total}`)
    }

    if (list.length === 0) break

    for (const item of list) {
      if (config.limit > 0 && processed >= config.limit) break
      processed += 1

      const id = item?.id ?? 'unknown'
      const itemName = item?.name || `ID:${id}`

      try {
        const result = await exportOneCard(item, config)

        if (result.status === 'success') {
          stats.success += 1
          log(`[${processed}/${config.limit || total}] 成功 ${itemName} -> ${result.message}`)
        } else if (result.status === 'skip-no-image') {
          stats.skippedNoImage += 1
          warn(`[${processed}/${config.limit || total}] 跳过 ${itemName}: ${result.message}`)
        } else if (result.status === 'skip-existing') {
          stats.skippedExisting += 1
          log(`[${processed}/${config.limit || total}] 跳过 ${itemName}: ${result.message}`)
        } else if (result.status === 'dry-run') {
          stats.dryRun += 1
          log(`[${processed}/${config.limit || total}] 检查 ${itemName}: ${result.message}`)
        }
      } catch (error: any) {
        stats.failed += 1
        failures.push({
          id,
          name: itemName,
          reason: error?.message || String(error)
        })
        warn(`[${processed}/${config.limit || total}] 失败 ${itemName}: ${error?.message || error}`)
      }

      if (config.delayMs > 0) await sleep(config.delayMs)
    }

    if (config.limit > 0 && processed >= config.limit) break
    if (list.length === 0 || processed >= total) break
    page += 1
  }

  log('完成')
  log(`成功: ${stats.success}`)
  log(`缺少背景图: ${stats.skippedNoImage}`)
  log(`已存在跳过: ${stats.skippedExisting}`)
  if (stats.dryRun) log(`Dry run 检查: ${stats.dryRun}`)
  log(`失败: ${stats.failed}`)

  if (failures.length > 0) {
    warn('失败明细：')
    for (const failure of failures) {
      warn(`- [${failure.id}] ${failure.name}: ${failure.reason}`)
    }
  }
}

run().catch((error) => {
  console.error(`[batch-export] ${error?.stack || error}`)
  process.exitCode = 1
})
