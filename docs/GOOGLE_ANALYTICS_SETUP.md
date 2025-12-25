# 📊 Google Analytics 配置指南

本项目已集成 **Google Analytics 4 (GA4)**，包含：
- ✅ 前端页面访问跟踪（通过 gtag.js）
- ✅ 后端数据分析（通过 Google Analytics Data API）
- ✅ 管理员 Dashboard 流量统计
- ✅ Cookie 同意管理（GDPR 合规）

---

## 🎯 集成架构

```
┌─────────────────────────────────────────────────────────────┐
│  前端跟踪 (Client-side Tracking)                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 用户访问页面 → Cookie 同意 → gtag.js 加载 → GA4 收集  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Google Analytics 4 云端                                      │
│  - 数据收集和存储                                             │
│  - 实时分析                                                   │
│  - 受众报告                                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  后端数据读取 (Server-side API)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Cron Job → Google Analytics Data API → DailyStats    │   │
│  │                                                       │   │
│  │ Admin Dashboard ← 数据库查询 ← DailyStats             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 配置步骤

### 第 1 步: 创建 Google Analytics 4 属性

1. **访问 Google Analytics**
   - 打开 [https://analytics.google.com](https://analytics.google.com)
   - 登录你的 Google 账号

2. **创建新属性**
   ```
   点击 "管理" (左下角齿轮图标)
   → 点击 "创建属性"
   → 属性名称: "Nano Banana Magic"
   → 时区: 选择你的时区（如 "Asia/Shanghai"）
   → 货币: CNY (人民币)
   → 点击 "下一步"
   ```

3. **配置数据流**
   ```
   选择平台: "网站"
   → 网站 URL: https://nbartai.com (或你的域名)
   → 数据流名称: "Nano Banana Magic - Production"
   → 点击 "创建数据流"
   ```

4. **获取衡量 ID (Measurement ID)**
   ```
   创建数据流后，会看到一个 "衡量 ID"
   格式: G-XXXXXXXXXX

   📋 复制这个 ID，后面会用到
   ```

---

### 第 2 步: 创建服务账号（用于后端 API）

1. **打开 Google Cloud Console**
   - 访问 [https://console.cloud.google.com](https://console.cloud.google.com)

2. **创建或选择项目**
   ```
   点击顶部项目选择器
   → 点击 "新建项目"
   → 项目名称: "nano-banana-analytics"
   → 点击 "创建"
   ```

3. **启用 Google Analytics Data API**
   ```
   搜索 "Google Analytics Data API"
   → 点击搜索结果中的 "Google Analytics Data API"
   → 点击 "启用"
   ```

4. **创建服务账号**
   ```
   左侧菜单 → "IAM 和管理" → "服务账号"
   → 点击 "创建服务账号"
   → 服务账号名称: "analytics-reader"
   → 服务账号描述: "Read Google Analytics data for admin dashboard"
   → 点击 "创建并继续"
   → 角色: 不需要选择（跳过）
   → 点击 "完成"
   ```

5. **创建密钥**
   ```
   点击刚创建的服务账号
   → 切换到 "密钥" 标签页
   → 点击 "添加密钥" → "创建新密钥"
   → 密钥类型: JSON
   → 点击 "创建"

   📥 会自动下载一个 JSON 文件，保存好这个文件
   ```

6. **JSON 文件示例**
   ```json
   {
     "type": "service_account",
     "project_id": "nano-banana-analytics",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
     "client_email": "analytics-reader@nano-banana-analytics.iam.gserviceaccount.com",
     "client_id": "123456789...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     ...
   }
   ```

---

### 第 3 步: 授权服务账号访问 GA4

1. **回到 Google Analytics**
   - 打开 [https://analytics.google.com](https://analytics.google.com)

2. **添加服务账号为查看者**
   ```
   点击 "管理"
   → 选择你的属性
   → 点击 "属性访问权限管理"
   → 点击右上角 "+"
   → 点击 "添加用户"

   电子邮件地址: analytics-reader@nano-banana-analytics.iam.gserviceaccount.com
   （从 JSON 文件的 client_email 字段复制）

   角色: "查看者"
   → 点击 "添加"
   ```

3. **获取 Property ID**
   ```
   点击 "管理" → 选择你的属性
   → 点击 "属性设置"
   → 在页面顶部可以看到 "属性 ID"（纯数字，如: 123456789）

   📋 复制这个 Property ID
   ```

---

### 第 4 步: 配置环境变量

#### 4.1 配置客户端环境变量（前端跟踪）

编辑 `app/.env.client`：

```bash
# Google Analytics 衡量 ID (从第 1 步获取)
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### 4.2 配置服务端环境变量（后端 API）

编辑 `app/.env.server`：

```bash
# 从 JSON 文件的 client_email 字段复制
GOOGLE_ANALYTICS_CLIENT_EMAIL=analytics-reader@nano-banana-analytics.iam.gserviceaccount.com

# 从 JSON 文件的 private_key 字段复制，然后进行 Base64 编码
# 使用以下命令编码:
# echo -n "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n" | base64
GOOGLE_ANALYTICS_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUVW...

# 从第 3 步获取的 Property ID（纯数字）
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
```

**如何获取 Base64 编码的 Private Key：**

```bash
# 方法 1: 使用命令行（推荐）
# 打开下载的 JSON 文件，复制 private_key 字段的内容（包含换行符 \n）
echo -n "你的private_key内容" | base64 -w 0

# 方法 2: 使用 Node.js
node -e "console.log(Buffer.from('你的private_key内容').toString('base64'))"

# 方法 3: 在线工具
# 访问 https://www.base64encode.org/
# 粘贴 private_key 内容并点击 "ENCODE"
```

---

### 第 5 步: 验证配置

#### 5.1 测试前端跟踪

1. **启动开发服务器**
   ```bash
   wasp start
   ```

2. **访问网站**
   - 打开浏览器，访问 `http://localhost:3000`

3. **接受 Cookie**
   - 点击右下角弹出的 "Accept all" 按钮

4. **查看控制台**
   ```
   打开浏览器开发者工具 (F12)
   → 切换到 "Network" 标签
   → 筛选: "gtm" 或 "collect"
   → 应该能看到发送到 Google Analytics 的请求
   ```

5. **实时验证（GA4 控制台）**
   ```
   打开 Google Analytics
   → 左侧菜单 "报告" → "实时"
   → 应该能看到 1 个活跃用户（就是你）
   ```

#### 5.2 测试后端 API

1. **手动触发统计任务**

   创建测试脚本 `app/src/analytics/test-ga.ts`：

   ```typescript
   import { getDailyPageViews, getSources } from './providers/googleAnalyticsUtils';

   async function testGoogleAnalytics() {
     try {
       console.log('Testing Google Analytics API...\n');

       // 测试页面浏览量
       console.log('Fetching daily page views...');
       const pageViews = await getDailyPageViews();
       console.log('✅ Page Views:', pageViews);

       // 测试流量来源
       console.log('\nFetching traffic sources...');
       const sources = await getSources();
       console.log('✅ Traffic Sources:', sources);

       console.log('\n✅ All tests passed!');
     } catch (error) {
       console.error('❌ Error:', error);
     }
   }

   testGoogleAnalytics();
   ```

2. **运行测试**
   ```bash
   cd app
   npx tsx src/analytics/test-ga.ts
   ```

3. **预期输出**
   ```
   Testing Google Analytics API...

   Fetching daily page views...
   ✅ Page Views: {
     totalViews: 156,
     prevDayViewsChangePercent: '12'
   }

   Fetching traffic sources...
   ✅ Traffic Sources: [
     { source: 'direct', visitors: '89' },
     { source: 'google', visitors: '45' },
     { source: 'twitter', visitors: '22' }
   ]

   ✅ All tests passed!
   ```

#### 5.3 测试管理员 Dashboard

1. **等待 Cron Job 执行**

   Cron Job 配置在 `app/main.wasp`：
   ```wasp
   job dailyStatsJob {
     executor: PgBoss,
     perform: {
       fn: import { calculateDailyStats } from "@src/analytics/stats"
     },
     schedule: {
       cron: "0 * * * *" // 每小时执行一次
     }
   }
   ```

2. **手动触发（开发环境）**
   ```bash
   # 方法 1: 通过 Wasp CLI
   wasp db studio  # 打开数据库管理界面
   # 然后在 SQL 控制台执行：
   # SELECT * FROM "DailyStats" ORDER BY date DESC LIMIT 1;

   # 方法 2: 手动创建记录（参考 ARCHITECTURE.md 的方法）
   ```

3. **访问管理员 Dashboard**
   ```
   1. 确保你的用户是管理员（isAdmin = true）
   2. 访问 http://localhost:3000/admin
   3. 应该能看到流量统计数据
   ```

---

## 🔧 功能说明

### 前端跟踪功能

**文件位置:** `app/src/client/components/cookie-consent/Config.ts`

**功能:**
- 用户访问页面时显示 Cookie 同意弹窗
- 用户点击 "Accept all" 后动态加载 gtag.js
- 自动跟踪页面浏览、用户行为、转化事件

**跟踪的数据:**
- 页面浏览量 (Page Views)
- 活跃用户 (Active Users)
- 用户会话 (Sessions)
- 跳出率 (Bounce Rate)
- 用户地理位置
- 设备类型（桌面/移动）
- 浏览器和操作系统

### 后端数据分析

**文件位置:**
- `app/src/analytics/providers/googleAnalyticsUtils.ts` - API 封装
- `app/src/analytics/stats.ts` - 统计任务

**功能:**
- 每小时从 GA4 拉取最新数据
- 计算关键指标（总浏览量、日增长率、流量来源）
- 存储到数据库的 `DailyStats` 表
- 供管理员 Dashboard 查询显示

**拉取的数据:**
- 总页面浏览量（自 2020-01-01 起）
- 前一天浏览量变化百分比
- 流量来源分布（直接访问/搜索引擎/社交媒体等）
- 活跃用户数

---

## 🎨 自定义配置

### 修改 Cookie 同意弹窗文案

编辑 `app/src/client/components/cookie-consent/Config.ts`：

```typescript
language: {
  default: "zh", // 改为中文
  translations: {
    zh: {
      consentModal: {
        title: "我们使用 Cookie",
        description: "我们主要使用 Cookie 进行分析以提升您的体验...",
        acceptAllBtn: "接受全部",
        acceptNecessaryBtn: "拒绝全部",
        footer: `
          <a href="/privacy-policy" target="_blank">隐私政策</a>
          <a href="/terms" target="_blank">服务条款</a>
        `,
      },
    },
  },
},
```

### 修改统计时间范围

编辑 `app/src/analytics/providers/googleAnalyticsUtils.ts`：

```typescript
dateRanges: [
  {
    startDate: "2024-01-01", // 修改起始日期
    endDate: "today",
  },
],
```

### 修改 Cron 执行频率

编辑 `app/main.wasp`：

```wasp
job dailyStatsJob {
  schedule: {
    cron: "0 0 * * *" // 改为每天午夜执行
  }
}
```

---

## 🐛 常见问题

### 1. 前端没有发送跟踪数据

**症状:** 浏览器 Network 中看不到发送到 `google-analytics.com` 的请求

**排查步骤:**
1. 检查 `app/.env.client` 中的 `REACT_APP_GOOGLE_ANALYTICS_ID` 是否配置
2. 确认用户点击了 "Accept all" Cookie 同意按钮
3. 打开浏览器控制台，查看是否有 JavaScript 错误
4. 确认 `import.meta.env.REACT_APP_GOOGLE_ANALYTICS_ID` 不为空

**解决方案:**
```typescript
// 在 Config.ts 的 onAccept 中添加日志
onAccept: () => {
  const GA_ANALYTICS_ID = import.meta.env.REACT_APP_GOOGLE_ANALYTICS_ID;
  console.log('GA_ANALYTICS_ID:', GA_ANALYTICS_ID); // 应该输出 G-XXXXXXXXXX
  // ...
},
```

### 2. 后端 API 报错 "No response from Google Analytics"

**症状:** Cron Job 执行失败，日志显示 API 错误

**排查步骤:**
1. 检查 `app/.env.server` 中的三个环境变量是否都配置
2. 验证 `GOOGLE_ANALYTICS_PRIVATE_KEY` 是否正确 Base64 编码
3. 确认服务账号已被添加到 GA4 属性的访问权限

**解决方案:**
```bash
# 测试 Private Key 解码
node -e "console.log(Buffer.from('你的Base64字符串', 'base64').toString('utf-8'))"
# 应该输出完整的 PEM 格式私钥，包含 -----BEGIN PRIVATE KEY-----
```

### 3. GA4 实时报告中看不到数据

**原因:** GA4 可能需要 24-48 小时才能显示完整数据

**验证实时数据:**
```
Google Analytics → 报告 → 实时
→ 应该能立即看到当前活跃用户
```

### 4. Property ID 错误

**症状:** API 返回 404 或 "Property not found"

**解决方案:**
- Property ID 应该是纯数字（如 `123456789`）
- 不是 Measurement ID（不要用 `G-XXXXXXXXXX`）
- 在 GA4 → 管理 → 属性设置 中查找

---

## 📊 查看数据报告

### Google Analytics 控制台

1. **实时报告**
   ```
   Google Analytics → 报告 → 实时
   → 查看当前活跃用户、页面浏览、事件
   ```

2. **流量获取报告**
   ```
   报告 → 生命周期 → 流量获取
   → 查看不同流量来源的用户数
   ```

3. **受众特征**
   ```
   报告 → 用户 → 用户属性
   → 查看用户的地理位置、设备、浏览器分布
   ```

### 管理员 Dashboard

访问 `http://localhost:3000/admin`，可以看到：

- 📈 总页面浏览量
- 📊 日增长率
- 👥 总用户数 / 付费用户数
- 💰 总收入
- 🌍 流量来源分布

**数据更新频率:** 每小时（由 Cron Job 控制）

---

## 🔒 隐私与合规

### GDPR 合规

本项目已实现：
- ✅ Cookie 同意管理（用户必须同意才加载 GA）
- ✅ 隐私政策链接（需要你自己补充内容）
- ✅ 自动清理 Cookie（用户拒绝后自动删除 GA Cookie）

**待完成:**
- [ ] 补充隐私政策页面内容
- [ ] 补充服务条款页面内容
- [ ] 实现用户数据导出功能（GDPR 要求）
- [ ] 实现用户数据删除功能（GDPR 要求）

### 中国大陆注意事项

⚠️ **重要提示:** Google Analytics 在中国大陆可能无法正常访问。

**替代方案:**
1. 使用百度统计（Baidu Analytics）
2. 使用 Plausible Analytics（自托管）
3. 使用友盟统计

**配置 Plausible（已在 main.wasp 中预留）:**
```html
<!-- 编辑 app/main.wasp -->
<script defer data-domain='nbartai.com' src='https://plausible.io/js/script.js'></script>
```

---

## 📚 相关文档

- [Google Analytics 4 官方文档](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Analytics Data API 文档](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [vanilla-cookieconsent 文档](https://cookieconsent.orestbida.com/)
- [OpenSaaS Analytics 指南](https://docs.opensaas.sh/guides/analytics/)

---

## ✅ 配置检查清单

完成以下步骤后，Google Analytics 应该能正常工作：

- [ ] 创建 GA4 属性，获取 Measurement ID (G-XXXXXXXXXX)
- [ ] 创建 Google Cloud 项目
- [ ] 启用 Google Analytics Data API
- [ ] 创建服务账号并下载 JSON 密钥
- [ ] 将服务账号添加到 GA4 属性访问权限
- [ ] 配置 `app/.env.client` 中的 `REACT_APP_GOOGLE_ANALYTICS_ID`
- [ ] 配置 `app/.env.server` 中的三个环境变量
- [ ] 测试前端跟踪（访问网站，点击 Accept Cookies）
- [ ] 测试后端 API（运行测试脚本或等待 Cron Job）
- [ ] 访问管理员 Dashboard 验证数据显示

---

**🎉 配置完成后，你将拥有一个完整的数据分析系统！**
