declare namespace StorageInterface {
  /** localStorage的存储数据的类型 */
  interface Session {
    demoKey: string
  }

  /** localStorage的存储数据的类型 */
  interface Local {
    /** 用户token */
    token: string
    /** 用户信息 */
    userInfo: ApiAccount.Info
    /** 谷歌登录state */
    state: string
  }
}
