/** 不弹出错误信息的code */
export const NO_ERROR_MSG_CODE: (string | number)[] = []

/** 错误消息栈，防止同一错误同时出现 */
const errorMsgStack = new Map<string | number, string>([])

function addErrorMsg(error: any) {
  errorMsgStack.set(error.code, error.msg)
}
function removeErrorMsg(error: any) {
  errorMsgStack.delete(error.code)
}
function hasErrorMsg(error: any) {
  return errorMsgStack.has(error.code)
}

/**
 * 显示错误信息
 * @param error
 */
export function showErrorMsg(error: any) {
  if (!error.msg || NO_ERROR_MSG_CODE.includes(error.code) || hasErrorMsg(error)) return
  addErrorMsg(error)
  window.console.warn(error.code, error.msg)
  const toast = useToast()
  toast.add({ title: error.msg, color: 'error' })
  setTimeout(() => {
    removeErrorMsg(error)
  }, 3 * 1000)
}
