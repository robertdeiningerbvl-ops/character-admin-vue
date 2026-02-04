// base64转换
function base64ToUint8Array(base64) {
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}
// 读取文件信息
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error('读取文件失败'))
    r.readAsArrayBuffer(file)
  })
}

// 读取图片文件并返回已去除元数的 base64(DataURL)
export function readFileAsDataURL(file, {
  type = 'image/png',
  quality = 0.92
} = {}) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      return reject(new Error('readFileAsDataURL: 参数必须是 File'))
    }
    const objectURL = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const width = img.naturalWidth || img.width
        const height = img.naturalHeight || img.height
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        const dataURL = canvas.toDataURL(type, quality)
        URL.revokeObjectURL(objectURL)
        resolve(dataURL)
      } catch (err) {
        URL.revokeObjectURL(objectURL)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectURL)
      reject(new Error('图片解码失败'))
    }
    img.src = objectURL
  })
}

// 读取图片中的元数据
export const extractPNGChunk = async (file) => {
  const ab = await readFileAsArrayBuffer(file)
  const arr = new Uint8Array(ab)
  const PngMagic = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let m = 0; m < 8; m++) {
    if (arr[m] !== PngMagic[m]) throw new Error('不是有效的 PNG 文件')
  }
  const keyword = 'chara'
  const decoder = new TextDecoder('utf-8')
  let i = 8
  while (i + 12 <= arr.length) {
    const length = (
      (arr[i] << 24) | (arr[i + 1] << 16) | (arr[i + 2] << 8) | arr[i + 3]
    ) >>> 0
    const type = String.fromCharCode(
      arr[i + 4],
      arr[i + 5],
      arr[i + 6],
      arr[i + 7]
    )
    const dataStart = i + 8
    const dataEnd = dataStart + length
    const next = dataEnd + 4
    if (dataEnd > arr.length) break
    if (type === 'tEXt') {
      const chunkData = arr.slice(dataStart, dataEnd)
      let j = 0
      while (j < chunkData.length && chunkData[j] !== 0) j++
      const currentKeyword = decoder.decode(chunkData.slice(0, j))
      if (currentKeyword === keyword) {
        const contentBase64 = decoder.decode(chunkData.slice(j + 1))
        try {
          const bytes = base64ToUint8Array(contentBase64)
          const utf8String = new TextDecoder('utf-8').decode(bytes)
          const charData = JSON.parse(utf8String)
          return {
            charData
          }
        } catch (e) {
          throw new Error(`不支持该角色卡导入：${e.message}`)
        }
      }
    }
    i = next
  }
  throw new Error('该图片不是角色卡')
}

// 从导入的角色卡数据构建统一的角色对象
export function buildCharacterFromCard(charData, image) {
  if (!charData || typeof charData !== 'object') {
    throw new Error('角色卡数据错误')
  }
  const d = charData.data || {}
  const tags = (Array.isArray(charData.tags) && charData.tags.length)
    ? charData.tags
    : (Array.isArray(d.tags)
        ? d
          .tags
        : [])
  const alternate_greetings = (Array.isArray(charData.alternate_greetings) && charData.alternate_greetings.length)
    ? charData.alternate_greetings
    : (Array.isArray(d.alternate_greetings) ? d.alternate_greetings : [])
  const newChar = {
    id: `char_${Date.now()}`,
    fav: false,
    spec: charData.spec,
    spec_version: charData.spec_version,
    name: charData.name || d.name,
    anohana: {
      image: image,
      avatar: image
    },
    data: {
      name: charData.name || d.name,
      description: charData.description || d.description || '',
      personality: charData.personality || d.personality || '',
      scenario: charData.scenario || d.scenario || '',
      mes_example: charData.mes_example || d.mes_example || '',
      creator_notes: charData.creator_notes || d.creator_notes || '',
      system_prompt: charData.system_prompt || d.system_prompt || '',
      post_history_instructions: charData.post_history_instructions || d.post_history_instructions || '',
      creator: charData.creator || d.creator || '',
      character_version: charData.character_version || d.character_version || '',
      alternate_greetings: alternate_greetings,
      first_mes: charData.first_mes || d.first_mes || '',
      tags: tags,
      character_book: {},
      regex: [],
      regex_enabled: false
    }
  }
  if (charData.data && typeof charData.data === 'object') {
    newChar.data = {
      ...d,
      character_book: d.character_book || {},
      regex: Array.isArray(d.regex) ? d.regex : [],
      regex_enabled: !!d.regex_enabled,
      tags: Array.isArray(d.tags) ? d.tags : tags
    }
    newChar.tags = newChar.data.tags || tags
  }
  if (d?.extensions?.regex_scripts) {
    newChar.data.regex = d.extensions.regex_scripts
    newChar.data.regex_enabled = true
  }
  if (d?.character_book) {
    const book = {
      ...d.character_book
    }

    console.log(book)
    if (Array.isArray(book.entries)) {
      book.entries = book.entries.map((e) => {
        const pos = e?.position
        let position
        if (pos === 0 || pos === '0') {
          position = 'before_char'
        } else if (typeof pos === 'string') {
          position = pos
        } else {
          position = 'after_char'
        }
        return {
          ...e,
          position
        }
      })
    }
    newChar.data.character_book = book
  }
  return newChar
}
