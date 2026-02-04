import CryptoJS from 'crypto-js'

// 使用环境变量或生成一个默认的强密钥
const CryptoSecret = import.meta.env.NUXT_PUBLIC_CRYPTO_SECRET || 'VoiceAI_Admin_2024_Secret_Key_Change_This_In_Production'

/**
 * 加密数据
 * @param data - 数据
 */
export function encrypto(data: any) {
  const newData = JSON.stringify(data)
  return CryptoJS.AES.encrypt(newData, CryptoSecret).toString()
}

/**
 * 解密数据
 * @param cipherText - 密文
 */
export function decrypto(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecret)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  if (originalText) {
    return JSON.parse(originalText)
  }
  return null
}

/**
 * MD5加密数据
 * @param data - 数据
 */
export function md5(data: string) {
  return CryptoJS.MD5(data).toString().toLowerCase()
}
