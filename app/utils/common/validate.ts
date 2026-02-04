export const dataTypeLabels = {
  string: '[object String]',
  number: '[object Number]',
  boolean: '[object Boolean]',
  null: '[object Null]',
  undefined: '[object Undefined]',
  symbol: '[object Symbol]',
  bigInt: '[object BigInt]',
  object: '[object Object]',
  function: '[object Function]',
  array: '[object Array]',
  date: '[object Date]',
  regExp: '[object RegExp]',
  promise: '[object Promise]',
  set: '[object Set]',
  map: '[object Map]',
  file: '[object File]'
}

function getDataTypeString(value: unknown) {
  return Object.prototype.toString.call(value)
}

export function isString<T extends string>(value: T | unknown): value is T {
  return getDataTypeString(value) === dataTypeLabels.string
}

export function isArray<T extends any[]>(value: T | unknown): value is T {
  return getDataTypeString(value) === dataTypeLabels.array
}

export function isFile<T extends File>(value: T | unknown): value is T {
  return getDataTypeString(value) === dataTypeLabels.file
}

// 图片验证
export function imageFormat(file: any, wh: any = [], size = 1024) {
  const toast = useToast()

  const isIMG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt = file.size / 1024 <= size
  if (!isIMG) {
    toast.add({ title: '上传图片只支持jpg、jpeg、png格式!', color: 'error' })
  }
  if (!isLt) {
    toast.add({ title: `上传图片大小不能超过${size / 1024}MB!`, color: 'error' })
  }
  if (wh.length > 0 && wh.length > 1) {
    const isSize = new Promise<void>((resolve, reject) => {
      const width = wh[0]
      const height = wh[1]
      const _URL = window.URL || window.webkitURL
      const img = new Image()
      img.onload = function () {
        const valid = img.width === width && img.height === height
        if (valid) {
          resolve()
        } else {
          reject()
        }
      }
      img.src = _URL.createObjectURL(file)
    }).then(
      () => {
        return file
      },
      () => {
        toast.add({ title: `上传图片尺寸率建议${wh[0]}*${wh[1]}`, color: 'error' })
        return Promise.reject()
      }
    )
    return isIMG && isLt && isSize
  }
  return isIMG && isLt
}
