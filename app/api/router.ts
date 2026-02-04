export const apiRoute = {
  commonUpload: 'common-upload',
  commonConfig: 'common-config',

  // 用户管理
  memberList: 'member-list',
  memberEdit: 'member-edit',
  memberBatteryEdit: 'member-battery-edit',
  memberSelectList: 'member-select-list',

  // 用户等级
  memberLvList: 'member-lv-list',
  memberLvEdit: 'member-lv-edit',
  memberLvAdd: 'member-lv-add',

  // 客户收藏
  memberCollectList: 'conduct-collect-list',

  // 用户流水
  memberWalletLogList: 'member-wallet-log',

  // 用户兑换
  memberInvitationCodeList: 'member-invitation-code',
  memberInvitationCodeGenerate: 'member-invitation-code-generate',
  memberMarketingInviteList: 'member-marketing-invite-list', // 邀请列表

  // 评论
  conductCommentList: 'conduct-comment-list',
  conductCommentReplyList: 'conduct-comment-reply-list',
  conductCommentRemove: 'conduct-comment-remove',

  /** common */
  // 套餐(能量)
  commonCoinsList: 'common-coins',
  commonCoinsAdd: 'common-coins-add',
  commonCoinsEdit: 'common-coins-edit',
  commonCcoinsRemove: 'common-coins-remove',

  // 标签
  commonTagList: 'common-tag-list',
  commonTagRemove: 'common-tag-remove',
  commonTagAdd: 'common-tag-add',
  commonTagEdit: 'common-tag-edit',

  // 模型
  commonModelList: 'common-model-list',
  commonModelEdit: 'common-model-edit',
  commonModelAdd: 'common-model-add',

  // 模型预设
  commonModelPresetList: 'common-model-preset-list',
  commonModelPresetEdit: 'common-model-preset-edit',
  commonModelPresetAdd: 'common-model-preset-add',
  commonModelPresetRemove: 'common-model-preset-remove',

  // 模型token
  commonModelTokenList: 'common-model-token-list',
  commonModelTokenEdit: 'common-model-token-edit',
  commonModelTokenAdd: 'common-model-token-add',
  commonModelTokenRemove: 'common-model-token-remove',

  // 语言管理
  commonLangList: 'common-language-list',
  commonLangAdd: 'common-language-add',
  commonLangEdit: 'common-language-edit',
  commonLangRemove: 'common-language-remove',

  // 配置项
  configList: 'system',
  configEdit: 'system-edit',
  // 统计
  commonStatistics: 'common-statistics',
  commonStatisticsRefresh: 'common-statistics-refresh',
  commonInviteStatistics: 'common-invite-statistics',

  /** common  end */

  /** payment */
  // 支付类型
  paymentList: 'payment-list',
  paymentEdit: 'payment-edit',

  // 支付通道
  paymentTypeList: 'payment-type-list',
  paymentTypeAdd: 'payment-type-add',
  paymentTypeEdit: 'payment-type-edit',
  paymentTyperemove: 'payment-type-remove',

  // 支付订单
  paymentOrderList: 'payment-order-list',
  paymentOrderEdit: 'payment-order-edit',

  /** payment end */

  /** amusement */
  // 角色卡
  amusementList: 'amusement-list',
  amusementDetail: 'amusement-detail',
  amusementAdd: 'amusement-add',
  amusementEdit: 'amusement-edit',
  amusementRemove: 'amusement-remove',

  // 角色卡分类
  AmusementCategoryList: 'amusement-category-list',
  AmusementCategoryAdd: 'amusement-category-add',
  AmusementCategoryEdit: 'amusement-category-edit',
  AmusementCategoryRemove: 'amusement-category-remove',

  // 游戏参数
  amusementParameterList: 'amusement-parameter-list',
  amusementParameterAdd: 'amusement-parameter-add',
  amusementParameterEdit: 'amusement-parameter-edit',
  amusementParameterRemove: 'amusement-parameter-remove',

  /** amusement end */

  // 营销管理
  marketingList: 'marketing-list',
  marketingEdit: 'marketing-edit',

  // 消息更管理
  commonMessageList: 'common-message-list',
  commonMessageAdd: 'common-message-add',
  commonMessageEdit: 'common-message-edit',
  commonMessageRemove: 'common-message-remove',

  // 敏感词过滤
  commonSensitiveList: 'common-sensitive-list',
  commonSensitiveAdd: 'common-sensitive-add',
  commonSensitiveEdit: 'common-sensitive-edit',
  commonSensitiveRemove: 'common-sensitive-remove',

  // 反馈日志
  CommonFeedList: 'common-feed-list',
  CommonFeedEdit: 'common-feed-edit', // 回复反馈
  CommonFeedRemove: 'common-feed-remove',

  // 账号
  adminLogin: 'login',
  adminUserEdit: 'admin-user-edit',
  adminAdd: 'admin-add',
  adminEdit: 'admin-edit',
  adminRemove: 'admin-remove',
  adminU: 'admin-u',
  adminLog: 'admin-log',
  commonReportLog: 'common-report-log',

  // 菜单
  rbacMenuList: 'rbac-menu-list',
  rbacMenuAdd: 'rbac-menu-add',
  rbacMenuEdit: 'rbac-menu-edit',
  rbacMenuRemove: 'rbac-menu-remove',
  rbacGroupAdd: 'rbac-group-add',
  rbacGroupMenu: 'rbac-group-menu',
  rbacAdminGroup: 'rbac-admin-group'

} as const
export const values = Object.values(apiRoute)

export type apiRoutePermsType = typeof values[number]

export default apiRoute
