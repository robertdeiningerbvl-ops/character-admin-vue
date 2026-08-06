# 代理提现功能 API 接口文档

## 概述

代理提现功能包含代理端和管理端两套接口，实现代理用户的余额提现及管理员审核流程。

**版本**: v1.0  
**更新时间**: 2026-08-06

---

## 一、代理端接口（需要代理JWT认证）

### 1.1 创建提现订单

**接口地址**: `POST /agent/withdrawal-create`

**请求头**:
```
Content-Type: application/x-www-form-urlencoded
token: {agent_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| amount | float64 | 是 | 提现金额（100-50000元） |
| withdraw_type | int8 | 是 | 提现方式：1=银行卡 2=支付宝 3=微信 |
| account_name | string | 是 | 账户名称 |
| account_number | string | 是 | 账号 |
| bank_name | string | 否 | 银行名称（银行卡提现时必填） |
| bank_branch | string | 否 | 开户行支行（银行卡提现时必填） |
| remark | string | 否 | 备注信息 |

**业务规则**:
- 最小提现金额：100元
- 最大提现金额：50000元
- 手续费率：1%
- 实际到账 = 提现金额 - 手续费

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "created_at": "2026-08-06T10:30:00Z",
    "updated_at": "2026-08-06T10:30:00Z",
    "agent_uid": 100,
    "agent_code": "AG001",
    "order_no": "WD202608061030001",
    "amount": 1000.00,
    "fee": 10.00,
    "actual_amount": 990.00,
    "balance_before": 5000.00,
    "balance_after": 4000.00,
    "withdraw_type": 1,
    "account_name": "张三",
    "account_number": "6222021234567890",
    "bank_name": "中国工商银行",
    "bank_branch": "北京分行",
    "state": 1,
    "remark": "月度结算"
  }
}
```

**错误响应**:
```json
{
  "code": 40001,
  "msg": "余额不足",
  "data": null
}
```

**错误码说明**:
- `40001`: 参数错误（余额不足、金额超限等）
- `40002`: 登录已过期

---

### 1.2 查询提现订单列表

**接口地址**: `GET /agent/withdrawal-list`

**请求头**:
```
token: {agent_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int64 | 否 | 页码（默认1） |
| page_size | int64 | 否 | 每页数量（默认20，最大100） |
| state | int8 | 否 | 状态筛选（0=全部，1=待审核，2=审核通过，-1=审核拒绝，-2=已取消） |

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "created_at": "2026-08-06T10:30:00Z",
        "agent_uid": 100,
        "order_no": "WD202608061030001",
        "amount": 1000.00,
        "fee": 10.00,
        "actual_amount": 990.00,
        "state": 1,
        "account_name": "张三",
        "account_number": "6222021234567890",
        "withdraw_type": 1
      }
    ],
    "total": 10
  }
}
```

**状态说明**:
- `1`: 待审核
- `2`: 审核通过
- `3`: 已打款
- `4`: 已完成
- `-1`: 审核拒绝
- `-2`: 已取消

---

### 1.3 取消提现订单

**接口地址**: `POST /agent/withdrawal-cancel`

**请求头**:
```
Content-Type: application/x-www-form-urlencoded
token: {agent_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int64 | 是 | 提现订单ID |

**业务规则**:
- 只能取消待审核状态（state=1）的订单
- 取消后余额自动解冻退回

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 40001,
  "msg": "只能取消待审核的提现订单",
  "data": null
}
```

---

## 二、管理端接口（需要管理员JWT认证）

### 2.1 查询提现订单列表

**接口地址**: `GET /admin/agent-withdrawal-list`

**请求头**:
```
token: {admin_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int64 | 否 | 页码（默认1） |
| page_size | int64 | 否 | 每页数量（默认20，最大100） |
| state | int8 | 否 | 状态筛选 |
| keywords | string | 否 | 关键字搜索（订单号） |

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "created_at": "2026-08-06T10:30:00Z",
        "updated_at": "2026-08-06T10:30:00Z",
        "agent_uid": 100,
        "agent_code": "AG001",
        "order_no": "WD202608061030001",
        "amount": 1000.00,
        "fee": 10.00,
        "actual_amount": 990.00,
        "balance_before": 5000.00,
        "balance_after": 4000.00,
        "withdraw_type": 1,
        "account_name": "张三",
        "account_number": "6222021234567890",
        "bank_name": "中国工商银行",
        "bank_branch": "北京分行",
        "state": 1,
        "audit_admin_id": 0,
        "audit_time": null,
        "audit_remark": "",
        "remark": "月度结算"
      }
    ],
    "total": 100
  }
}
```

---

### 2.2 获取提现订单详情

**接口地址**: `GET /admin/agent-withdrawal-get`

**请求头**:
```
token: {admin_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int64 | 是 | 提现订单ID |

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "created_at": "2026-08-06T10:30:00Z",
    "updated_at": "2026-08-06T10:30:00Z",
    "agent_uid": 100,
    "agent_code": "AG001",
    "order_no": "WD202608061030001",
    "amount": 1000.00,
    "fee": 10.00,
    "actual_amount": 990.00,
    "balance_before": 5000.00,
    "balance_after": 4000.00,
    "withdraw_type": 1,
    "account_name": "张三",
    "account_number": "6222021234567890",
    "bank_name": "中国工商银行",
    "bank_branch": "北京分行",
    "state": 1,
    "remark": "月度结算"
  }
}
```

---

### 2.3 审核通过

**接口地址**: `POST /admin/agent-withdrawal-approve`

**请求头**:
```
Content-Type: application/x-www-form-urlencoded
token: {admin_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int64 | 是 | 提现订单ID |
| remark | string | 否 | 审核备注 |

**业务规则**:
- 只能审核待审核状态（state=1）的订单
- 审核通过后从冻结余额扣除
- 累计提现金额增加

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 40001,
  "msg": "该订单已处理，无法重复审核",
  "data": null
}
```

---

### 2.4 审核拒绝

**接口地址**: `POST /admin/agent-withdrawal-reject`

**请求头**:
```
Content-Type: application/x-www-form-urlencoded
token: {admin_jwt_token}
```

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int64 | 是 | 提现订单ID |
| remark | string | **是** | 拒绝原因（必填） |

**业务规则**:
- 只能审核待审核状态（state=1）的订单
- 拒绝后余额自动解冻退回
- 必须填写拒绝原因

**成功响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 40001,
  "msg": "请填写拒绝原因",
  "data": null
}
```

---

## 三、数据字典

### 提现方式（withdraw_type）

| 值 | 说明 |
|----|------|
| 1 | 银行卡 |
| 2 | 支付宝 |
| 3 | 微信 |

### 订单状态（state）

| 值 | 说明 | 描述 |
|----|------|------|
| 1 | 待审核 | 代理提交后待管理员审核 |
| 2 | 审核通过 | 管理员审核通过 |
| 3 | 已打款 | 已完成打款（预留字段） |
| 4 | 已完成 | 提现完成（预留字段） |
| -1 | 审核拒绝 | 管理员拒绝，余额已退回 |
| -2 | 已取消 | 代理主动取消，余额已退回 |

---

## 四、业务流程

### 4.1 正常提现流程

```
1. 代理创建提现订单
   ↓
2. 系统冻结提现金额
   ↓
3. 管理员审核
   ├─ 审核通过 → 扣除冻结余额 → 累计提现增加
   └─ 审核拒绝 → 解冻余额退回
```

### 4.2 取消提现流程

```
1. 代理创建提现订单
   ↓
2. 系统冻结提现金额
   ↓
3. 代理取消订单
   ↓
4. 系统解冻余额退回
```

---

## 五、注意事项

1. **金额限制**
   - 最小提现：100元
   - 最大提现：50000元
   - 手续费率：1%

2. **状态限制**
   - 只能取消待审核的订单
   - 只能审核待审核的订单
   - 已审核的订单不可重复审核

3. **余额变动**
   - 创建订单：可用余额 → 冻结余额
   - 审核通过：冻结余额 → 扣除
   - 审核拒绝：冻结余额 → 可用余额
   - 取消订单：冻结余额 → 可用余额

4. **数据库字段**
   - agent_user 表需要添加：frozen_balance, total_income, total_withdraw
   - 需要创建 agent_withdrawal 表

---

## 六、错误码表

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 40001 | 参数错误 |
| 40002 | 登录已过期 |
| 40004 | 数据不存在 |

---

## 七、测试用例

### 7.1 创建提现订单

**测试场景**: 银行卡提现

```bash
curl -X POST 'http://localhost:8080/agent/withdrawal-create' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'token: YOUR_AGENT_TOKEN' \
  -d 'amount=1000.00' \
  -d 'withdraw_type=1' \
  -d 'account_name=张三' \
  -d 'account_number=6222021234567890' \
  -d 'bank_name=中国工商银行' \
  -d 'bank_branch=北京分行' \
  -d 'remark=月度结算'
```

### 7.2 审核通过

```bash
curl -X POST 'http://localhost:8080/admin/agent-withdrawal-approve' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'token: YOUR_ADMIN_TOKEN' \
  -d 'id=1' \
  -d 'remark=审核通过，已安排打款'
```

### 7.3 审核拒绝

```bash
curl -X POST 'http://localhost:8080/admin/agent-withdrawal-reject' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'token: YOUR_ADMIN_TOKEN' \
  -d 'id=1' \
  -d 'remark=账户信息有误，请核对后重新提交'
```

---

**文档版本**: v1.0  
**最后更新**: 2026-08-06
