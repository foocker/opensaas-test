# 📧 邮件系统配置指南

本文档介绍 Nano Banana Magic 的邮件系统配置，包括 SMTP 配置、邮件模板定制和发送测试。

---

## 📦 邮件系统概览

Nano Banana Magic 使用 **Wasp 内置邮件系统**，支持通过 SMTP 发送邮件。

### 使用场景

当前系统发送的邮件类型：

- ✅ **邮箱验证邮件** - 用户注册后发送
- ✅ **密码重置邮件** - 用户忘记密码时发送
- 🔧 **其他通知邮件** - 可自定义添加

---

## 🔧 SMTP 配置

### 1. 选择邮件服务提供商

推荐的 SMTP 服务：

#### **Resend**（推荐 ⭐⭐⭐⭐⭐）
- ✅ 免费额度：3000 封/月
- ✅ 简单易用
- ✅ 现代化 API
- ✅ 优秀的送达率
- ✅ 支持自定义域名
- 🌐 [https://resend.com](https://resend.com)

#### **SendGrid**
- ✅ 免费额度：100 封/天
- ✅ 成熟稳定
- ⚠️ 配置相对复杂
- 🌐 [https://sendgrid.com](https://sendgrid.com)

#### **Mailgun**
- ✅ 免费额度：5000 封/月（前 3 个月）
- ✅ 功能强大
- ⚠️ 需要信用卡验证
- 🌐 [https://www.mailgun.com](https://www.mailgun.com)

#### **AWS SES**
- ✅ 价格便宜：$0.10/1000 封
- ⚠️ 配置复杂
- ⚠️ 需要申请提高发送限制
- 🌐 [https://aws.amazon.com/ses](https://aws.amazon.com/ses)

---

## 📝 配置步骤（以 Resend 为例）

### 步骤 1: 注册 Resend 账号

1. 访问 [https://resend.com](https://resend.com)
2. 点击 "Start Building" 注册账号
3. 验证你的邮箱

### 步骤 2: 添加和验证域名

#### 使用默认域名（快速测试）

Resend 提供测试域名 `onboarding@resend.dev`，可以直接使用（有限制）：
- ✅ 立即可用
- ⚠️ 只能发送到你自己的邮箱
- ⚠️ 不适合生产环境

#### 添加自定义域名（生产环境）

```
1. Resend Dashboard → Domains → Add Domain
2. 输入你的域名: nbartai.com
3. 添加以下 DNS 记录:
```

**SPF 记录 (TXT):**
```
类型: TXT
主机: @
值: v=spf1 include:_spf.resend.com ~all
```

**DKIM 记录 (TXT):**
```
类型: TXT
主机: resend._domainkey
值: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA... (Resend 提供)
```

**DMARC 记录 (TXT - 可选但推荐):**
```
类型: TXT
主机: _dmarc
值: v=DMARC1; p=none; rua=mailto:postmaster@nbartai.com
```

**等待 DNS 生效（15分钟 - 24小时）**

### 步骤 3: 创建 API Key

```
Resend Dashboard → API Keys → Create API Key
→ Name: Nano Banana Magic SMTP
→ Permission: Full Access 或 Sending access
→ 点击 "Create"
→ 复制 API Key（re_xxxxxxxxxxxx）
```

**⚠️ 重要:** API Key 只显示一次，请妥善保存！

### 步骤 4: 配置 Wasp

#### 编辑 main.wasp

**文件位置:** [`app/main.wasp`](app/main.wasp#L90-L99)

```wasp
emailSender: {
  provider: SMTP,
  defaultFrom: {
    name: "Nano Banana Magic",
    email: "noreply@nbartai.com"  // ← 改为你验证的域名邮箱
  },
}
```

#### 配置环境变量

编辑 `app/.env.server`：

```bash
# ==================== SMTP 配置 ====================

# Resend SMTP 服务器
SMTP_HOST=smtp.resend.com
SMTP_PORT=587

# Resend SMTP 凭据
SMTP_USERNAME=resend
SMTP_PASSWORD=re_your_api_key_here  # ← 粘贴你的 Resend API Key

# 发件人信息（必须是已验证的域名）
SMTP_FROM_EMAIL=noreply@nbartai.com
SMTP_FROM_NAME=Nano Banana Magic

# TLS 配置（Resend 需要）
SMTP_TLS=true
```

---

## 🎨 自定义邮件模板

### 1. 邮箱验证邮件

**文件位置:** [`app/src/auth/email-and-pass/emails.ts`](app/src/auth/email-and-pass/emails.ts)

#### 基础模板

```typescript
export function getVerificationEmailContent({
  verificationLink
}: {
  verificationLink: string
}) {
  return {
    subject: '验证你的 Nano Banana Magic 账号',
    text: `
欢迎加入 Nano Banana Magic！

点击以下链接验证你的邮箱地址：
${verificationLink}

如果你没有注册此账号，请忽略此邮件。

此链接将在 24 小时后过期。

---
Nano Banana Magic 团队
https://nbartai.com
    `,
    html: `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #4F46E5;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
          }
          .content {
            padding: 30px 0;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
          }
          .button:hover {
            background-color: #4338CA;
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
          }
          .link {
            color: #4F46E5;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🍌 Nano Banana Magic</div>
        </div>

        <div class="content">
          <h1>欢迎加入 Nano Banana Magic！</h1>
          <p>感谢你注册我们的 AI 服务平台。</p>
          <p>点击下方按钮验证你的邮箱地址，即可开始使用：</p>

          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">验证邮箱</a>
          </div>

          <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
          <p class="link">${verificationLink}</p>

          <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
            如果你没有注册此账号，请忽略此邮件。<br>
            此链接将在 24 小时后过期。
          </p>
        </div>

        <div class="footer">
          <p>© 2025 Nano Banana Magic. All rights reserved.</p>
          <p>
            <a href="https://nbartai.com" class="link">访问网站</a> |
            <a href="https://nbartai.com/pricing" class="link">查看定价</a>
          </p>
        </div>
      </body>
      </html>
    `,
  };
}
```

### 2. 密码重置邮件

```typescript
export function getPasswordResetEmailContent({
  passwordResetLink
}: {
  passwordResetLink: string
}) {
  return {
    subject: '重置你的 Nano Banana Magic 密码',
    text: `
你好，

我们收到了你的密码重置请求。

点击以下链接重置密码：
${passwordResetLink}

如果你没有请求重置密码，请忽略此邮件，你的密码不会被更改。

此链接将在 1 小时后过期。

---
Nano Banana Magic 团队
https://nbartai.com
    `,
    html: `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <style>
          /* 使用与验证邮件相同的样式 */
          body { ... }
          .button { ... }
          /* ... */
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🍌 Nano Banana Magic</div>
        </div>

        <div class="content">
          <h1>密码重置请求</h1>
          <p>你好，</p>
          <p>我们收到了你的密码重置请求。</p>

          <div style="text-align: center;">
            <a href="${passwordResetLink}" class="button">重置密码</a>
          </div>

          <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
          <p class="link">${passwordResetLink}</p>

          <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
            如果你没有请求重置密码，请忽略此邮件，你的密码不会被更改。<br>
            此链接将在 1 小时后过期。
          </p>
        </div>

        <div class="footer">
          <p>© 2025 Nano Banana Magic. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };
}
```

---

## 🧪 测试邮件发送

### 方法 1: 通过用户注册测试

```bash
# 1. 启动开发服务器
wasp start

# 2. 访问注册页面
# http://localhost:3000/signup

# 3. 填写表单注册新用户
# Email: your-email@example.com
# Password: Test123456!

# 4. 提交后检查邮箱（包括垃圾邮件箱）
# 应该收到验证邮件
```

### 方法 2: 使用 Wasp CLI 测试

创建测试脚本 `app/src/server/scripts/testEmail.ts`：

```typescript
import { EmailSender } from 'wasp/server/email';

async function testEmail() {
  const emailSender = new EmailSender();

  try {
    await emailSender.send({
      to: 'your-email@example.com',  // ← 改为你的邮箱
      subject: '测试邮件',
      text: '这是一封测试邮件',
      html: '<h1>测试邮件</h1><p>这是一封测试邮件</p>',
    });

    console.log('✅ 邮件发送成功！');
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
  }
}

testEmail();
```

运行测试：

```bash
cd app
npx tsx src/server/scripts/testEmail.ts
```

### 方法 3: 查看 Resend 发送日志

```
1. 登录 Resend Dashboard
2. 左侧菜单 → Emails
3. 查看最近发送的邮件列表
4. 点击邮件查看详情（状态、打开率等）
```

---

## 📊 监控邮件发送

### Resend Dashboard 指标

可以在 Resend Dashboard 查看：

- ✅ **发送总数** - 已发送邮件数量
- ✅ **送达率** - 成功送达比例
- ✅ **打开率** - 邮件被打开的比例
- ✅ **退信率** - 邮件被退回的比例
- ⚠️ **垃圾邮件投诉** - 用户标记为垃圾邮件

### Wasp 服务器日志

```bash
# 开发环境
wasp start  # 查看终端输出

# 生产环境
docker logs wasp-server -f | grep "Email"
```

日志示例：

```
[Server] Sending email to: test@example.com
[Server] Email sent successfully
[Server] Email ID: 550e8400-e29b-41d4-a716-446655440000
```

---

## 🎨 高级定制

### 1. 添加自定义邮件类型

#### 示例：欢迎邮件

创建 `app/src/server/emails/welcomeEmail.ts`：

```typescript
import { EmailSender } from 'wasp/server/email';

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const emailSender = new EmailSender();

  await emailSender.send({
    to: userEmail,
    subject: '欢迎加入 Nano Banana Magic！🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>欢迎，${userName}！</h1>
        <p>感谢你加入 Nano Banana Magic。</p>
        <p>作为新用户，你已获得 <strong>3 积分</strong> 的免费额度。</p>

        <h2>快速开始</h2>
        <ul>
          <li>🎨 <a href="https://nbartai.com">体验 AI 图像生成</a></li>
          <li>💳 <a href="https://nbartai.com/pricing">查看定价套餐</a></li>
          <li>📚 <a href="https://nbartai.com/docs">阅读使用文档</a></li>
        </ul>

        <p>祝你使用愉快！</p>
      </body>
      </html>
    `,
  });
}
```

#### 在注册后调用

编辑 `app/src/auth/userSignupFields.ts`：

```typescript
import { sendWelcomeEmail } from '../server/emails/welcomeEmail';

export const getEmailUserFields = defineUserSignupFields({
  email: (data: any) => data.email,
  username: (data: any) => data.email.split('@')[0],
  isEmailVerified: () => false,
  credits: () => 3,

  // 注册后发送欢迎邮件
  async afterSignup(user: User) {
    await sendWelcomeEmail(user.email!, user.username!);
  },
});
```

### 2. 使用邮件模板引擎

#### 安装 Handlebars

```bash
cd app
npm install handlebars
npm install -D @types/handlebars
```

#### 创建模板文件

`app/src/server/emails/templates/welcome.hbs`：

```handlebars
<!DOCTYPE html>
<html>
<body>
  <h1>欢迎，{{userName}}！</h1>
  <p>你的账号 <strong>{{userEmail}}</strong> 已成功创建。</p>
  <p>免费积分: {{credits}}</p>

  <a href="{{ctaLink}}" style="...">立即开始</a>
</body>
</html>
```

#### 渲染模板

```typescript
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export async function sendTemplatedEmail(userEmail: string, data: any) {
  const templatePath = path.join(__dirname, 'templates/welcome.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);

  const html = template({
    userName: data.userName,
    userEmail: userEmail,
    credits: data.credits,
    ctaLink: 'https://nbartai.com',
  });

  const emailSender = new EmailSender();
  await emailSender.send({
    to: userEmail,
    subject: '欢迎加入！',
    html,
  });
}
```

---

## 🐛 常见问题

### 1. 邮件发送失败：Authentication failed

**原因:** SMTP 凭据错误

**解决方案:**
```bash
# 检查 .env.server 配置
cat app/.env.server | grep SMTP_PASSWORD

# 确认 API Key 正确（应该以 re_ 开头）
# 确认 SMTP_USERNAME 为 "resend"
```

### 2. 邮件进入垃圾邮件箱

**原因:** 域名 DNS 配置不完整

**解决方案:**
```
1. 确保 SPF、DKIM、DMARC 记录都已添加
2. 在 Resend Dashboard 检查域名验证状态
3. 使用邮件测试工具检查: https://www.mail-tester.com
4. 避免使用垃圾邮件敏感词（免费、中奖等）
```

### 3. 无法发送到 Gmail

**原因:** Gmail 阻止了部分未验证域名

**解决方案:**
- 完成域名验证（SPF、DKIM、DMARC）
- 建立发送信誉（逐步增加发送量）
- 联系 Resend 支持申请白名单

### 4. Resend API 限流

**错误信息:** "Rate limit exceeded"

**解决方案:**
```typescript
// 实现重试机制
async function sendEmailWithRetry(emailData: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await emailSender.send(emailData);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## 💰 成本估算

### Resend 定价

**免费计划:**
- ✅ 3000 封/月
- ✅ 100 封/天
- ✅ 适合小型项目

**Pro 计划（$20/月）:**
- ✅ 50,000 封/月
- ✅ 无每日限制
- ✅ 优先支持

**使用建议:**

| 用户规模 | 月邮件量估算 | 建议方案 |
|---------|------------|---------|
| < 100 用户 | ~500 封 | 免费计划 |
| 100-1000 用户 | ~3000 封 | 免费计划 |
| 1000-5000 用户 | ~15000 封 | Pro 计划 |
| > 5000 用户 | > 50000 封 | Enterprise |

**计算公式:**
```
月邮件量 = 用户数 × (注册邮件 + 密码重置邮件 + 通知邮件)
```

---

## 🔒 安全建议

### 1. 保护 API Key

```bash
# ❌ 不要提交到 Git
git rm --cached app/.env.server
echo "app/.env.server" >> .gitignore

# ✅ 使用环境变量
export SMTP_PASSWORD=re_xxxxx

# ✅ 生产环境使用密钥管理服务
# - AWS Secrets Manager
# - Google Secret Manager
# - HashiCorp Vault
```

### 2. 防止邮件滥用

```typescript
// 限制邮件发送频率（防止暴力请求）
const RESEND_COOLDOWN = 60 * 1000; // 60 秒

export async function sendVerificationEmail(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // 检查上次发送时间
  if (user.emailVerificationSentAt) {
    const timeSinceLastSend = Date.now() - user.emailVerificationSentAt.getTime();
    if (timeSinceLastSend < RESEND_COOLDOWN) {
      throw new HttpError(429, '请稍后再试');
    }
  }

  // 发送邮件
  await emailSender.send({ ... });

  // 更新发送时间
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerificationSentAt: new Date() },
  });
}
```

### 3. 验证邮箱格式

```typescript
import validator from 'validator';

function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

// 在注册前验证
if (!isValidEmail(args.email)) {
  throw new HttpError(400, 'Invalid email format');
}
```

---

## 📚 相关文档

- [Resend 官方文档](https://resend.com/docs)
- [Wasp Email 文档](https://wasp.sh/docs/guides/sending-emails)
- [用户认证配置](AUTH_GUIDE.md)
- [架构设计](ARCHITECTURE.md)

---

## ✅ 邮件系统检查清单

- [x] 注册 SMTP 服务商（Resend）
- [x] 验证域名 DNS 记录（SPF、DKIM、DMARC）
- [x] 配置 Wasp 邮件发送器
- [x] 在 `.env.server` 中设置 SMTP 凭据
- [x] 自定义邮箱验证邮件模板
- [x] 自定义密码重置邮件模板
- [ ] 测试邮件发送（注册流程）
- [ ] 测试密码重置邮件
- [ ] 检查邮件是否进入垃圾邮件箱
- [ ] 使用 mail-tester.com 测试邮件质量
- [ ] 在生产环境验证所有邮件流程
- [ ] 监控 Resend Dashboard 发送统计

---

**📧 现在你已经掌握了完整的邮件系统配置！**
