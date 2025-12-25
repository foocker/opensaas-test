# 🔐 用户认证配置指南

本文档介绍 Nano Banana Magic 的用户认证系统配置和使用方法。

---

## 📦 认证系统概览

Nano Banana Magic 使用 **Wasp 框架**内置的认证系统，支持：

- ✅ **邮箱密码登录**（已启用）
- ⚠️ **Google OAuth**（已集成，中国大陆建议禁用）
- 🔧 可扩展 GitHub、Discord 等第三方登录

### 架构设计

```
┌────────────────────────────────────────────────────┐
│  Wasp Auth 系统 (main.wasp)                         │
│  - 邮箱验证                                         │
│  - 密码重置                                         │
│  - Session 管理                                     │
└────────────────┬───────────────────────────────────┘
                 │
         ┌───────┴───────┐
         ↓               ↓
┌──────────────┐  ┌──────────────┐
│ Email + Pass │  │ Google OAuth │
│ (主要方式)    │  │ (可选)        │
└──────────────┘  └──────────────┘
```

---

## 🔧 配置文件

### 1. Wasp 配置

**文件位置:** [`app/main.wasp`](app/main.wasp#L37-L76)

```wasp
auth: {
  userEntity: User,
  methods: {
    // 邮箱密码登录
    email: {
      fromField: {
        name: "Nano Banana Magic",
        email: "onboarding@resend.dev"  // ← 修改为你的邮箱
      },
      emailVerification: {
        clientRoute: EmailVerificationRoute,
        getEmailContentFn: import { getVerificationEmailContent } from "@src/auth/email-and-pass/emails",
      },
      passwordReset: {
        clientRoute: PasswordResetRoute,
        getEmailContentFn: import { getPasswordResetEmailContent } from "@src/auth/email-and-pass/emails",
      },
      userSignupFields: import { getEmailUserFields } from "@src/auth/userSignupFields",
    },

    // Google OAuth (可选)
    google: {
      userSignupFields: import { getGoogleUserFields } from "@src/auth/userSignupFields",
      configFn: import { getGoogleAuthConfig } from "@src/auth/userSignupFields",
    },
  },
  onAuthFailedRedirectTo: "/login",
  onAuthSucceededRedirectTo: "/demo-app",
},
```

### 2. 功能开关配置

**文件位置:** [`app/src/shared/config.ts`](app/src/shared/config.ts#L69-L72)

```typescript
export const FeatureFlags = {
  auth: {
    emailPassword: true,   // ✅ 邮箱密码登录（启用）
    googleOAuth: false,    // ❌ Google OAuth（中国大陆建议禁用）
  },
  // ...
};
```

**在中国大陆运营的建议:**
- 保持 `googleOAuth: false`
- Google 服务在中国大陆不稳定
- 用户主要使用邮箱密码登录

---

## 📧 邮箱认证配置

### 1. SMTP 邮件服务

Nano Banana Magic 使用 **Resend SMTP** 发送邮件。

**Wasp 配置:** [`app/main.wasp`](app/main.wasp#L90-L99)

```wasp
emailSender: {
  provider: SMTP,
  defaultFrom: {
    name: "Nano Banana Magic",
    email: "onboarding@resend.dev"  // ← 测试邮箱，生产环境需修改
  },
}
```

### 2. 配置 Resend SMTP

#### 步骤 1: 注册 Resend

1. 访问 [https://resend.com](https://resend.com)
2. 注册账号（免费额度：3000 封/月）

#### 步骤 2: 验证域名（生产环境）

```
Resend Dashboard → Domains → Add Domain
→ 输入你的域名: nbartai.com
→ 添加以下 DNS 记录:

TXT 记录:
resend._domainkey.nbartai.com → v=DKIM1; k=rsa; p=MIGfMA...

MX 记录:
nbartai.com → 10 feedback-smtp.resend.com
```

#### 步骤 3: 获取 API Key

```
Resend Dashboard → API Keys → Create API Key
→ Name: Nano Banana Magic SMTP
→ Permission: Sending access
→ 复制 API Key
```

#### 步骤 4: 配置环境变量

编辑 `app/.env.server`：

```bash
# Resend SMTP 配置
# 如果使用 Resend，需要配置以下环境变量
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USERNAME=resend
SMTP_PASSWORD=re_your_api_key_here  # ← 粘贴 API Key

# 发件人邮箱（必须是已验证的域名）
SMTP_FROM_EMAIL=noreply@nbartai.com
SMTP_FROM_NAME=Nano Banana Magic
```

### 3. 测试邮件发送

#### 开发环境测试

```bash
# 启动 Wasp 服务器
wasp start

# 注册一个新用户
# 访问: http://localhost:3000/signup
# 填写邮箱和密码，点击注册

# 检查邮箱（包括垃圾邮件箱）
# 应该收到验证邮件
```

#### 查看邮件日志

```bash
# Wasp 开发环境会在终端输出邮件发送日志
[Server] Sending email to: test@example.com
[Server] Email sent successfully
```

---

## 🔑 邮箱验证流程

### 用户注册流程

```
1. 用户访问 /signup
   ↓
2. 填写邮箱、密码
   ↓
3. 提交表单 → 创建 User 记录（isEmailVerified: false）
   ↓
4. 系统发送验证邮件
   ↓
5. 用户点击邮件中的验证链接
   ↓
6. 访问 /email-verification?token=xxx
   ↓
7. 验证成功 → isEmailVerified: true
   ↓
8. 重定向到应用首页
```

### 自定义验证邮件内容

**文件位置:** [`app/src/auth/email-and-pass/emails.ts`](app/src/auth/email-and-pass/emails.ts)

```typescript
export function getVerificationEmailContent({ verificationLink }: { verificationLink: string }) {
  return {
    subject: '验证你的 Nano Banana Magic 账号',
    text: `点击以下链接验证你的邮箱: ${verificationLink}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .button {
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <h1>欢迎加入 Nano Banana Magic！</h1>
        <p>点击下方按钮验证你的邮箱地址：</p>
        <a href="${verificationLink}" class="button">验证邮箱</a>
        <p>如果按钮无法点击，请复制以下链接到浏览器：</p>
        <p>${verificationLink}</p>
      </body>
      </html>
    `,
  };
}
```

---

## 🔒 密码重置流程

### 用户操作流程

```
1. 用户访问 /login
   ↓
2. 点击 "忘记密码？"
   ↓
3. 进入 /request-password-reset
   ↓
4. 输入邮箱 → 发送重置邮件
   ↓
5. 用户点击邮件中的重置链接
   ↓
6. 访问 /password-reset?token=xxx
   ↓
7. 输入新密码
   ↓
8. 提交 → 密码更新成功
```

### 自定义密码重置邮件

**文件位置:** [`app/src/auth/email-and-pass/emails.ts`](app/src/auth/email-and-pass/emails.ts)

```typescript
export function getPasswordResetEmailContent({ passwordResetLink }: { passwordResetLink: string }) {
  return {
    subject: '重置你的 Nano Banana Magic 密码',
    text: `点击以下链接重置密码: ${passwordResetLink}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>密码重置请求</h1>
        <p>我们收到了你的密码重置请求。</p>
        <a href="${passwordResetLink}" class="button">重置密码</a>
        <p>如果你没有请求重置密码，请忽略此邮件。</p>
        <p>此链接将在 24 小时后过期。</p>
      </body>
      </html>
    `,
  };
}
```

---

## 🌐 Google OAuth 配置

### 何时启用 Google OAuth？

**建议启用:**
- ✅ 目标用户在海外
- ✅ 用户习惯使用 Google 账号
- ✅ 希望简化注册流程

**建议禁用:**
- ❌ 主要面向中国大陆用户
- ❌ Google 服务不稳定
- ❌ 需要更简单的认证方式

### 配置步骤（如果需要启用）

#### 步骤 1: 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据

```
凭据类型: Web 应用
授权 JavaScript 来源:
  - http://localhost:3000 (开发)
  - https://nbartai.com (生产)

授权重定向 URI:
  - http://localhost:3000/auth/google/callback (开发)
  - https://nbartai.com/auth/google/callback (生产)
```

#### 步骤 2: 配置环境变量

编辑 `app/.env.server`：

```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

#### 步骤 3: 启用功能开关

编辑 [`app/src/shared/config.ts`](app/src/shared/config.ts)：

```typescript
export const FeatureFlags = {
  auth: {
    emailPassword: true,
    googleOAuth: true,  // ← 改为 true
  },
};
```

#### 步骤 4: 自定义 Google 登录字段

**文件位置:** [`app/src/auth/userSignupFields.ts`](app/src/auth/userSignupFields.ts)

```typescript
export const getGoogleUserFields = defineUserSignupFields({
  email: (data: any) => data.profile.emails[0].value,
  username: (data: any) => data.profile.displayName,
  isEmailVerified: () => true, // Google 邮箱已验证
  credits: () => 3, // 新用户赠送 3 积分
});

export function getGoogleAuthConfig() {
  return {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    scope: ['profile', 'email'],
  };
}
```

---

## 👤 用户数据模型

### User Entity 定义

**文件位置:** [`app/schema.prisma`](app/schema.prisma)

```prisma
model User {
  id                        String         @id @default(uuid())
  email                     String?        @unique
  username                  String?
  isEmailVerified           Boolean        @default(false)
  emailVerificationSentAt   DateTime?
  passwordResetSentAt       DateTime?

  // 积分系统
  credits                   Decimal        @default(3) @db.Decimal(10, 2)

  // 管理员权限
  isAdmin                   Boolean        @default(false)

  // OAuth 相关
  externalAuthAssociations  SocialLogin[]

  // 订阅状态
  subscriptionStatus        String?
  subscriptionPlan          String?
  checkoutSessionId         String?
  stripeId                  String?        @unique

  createdAt                 DateTime       @default(now())
  updatedAt                 DateTime       @updatedAt

  // 关联数据
  generatedSchedules        GeneratedSchedule[]
  contactFormMessages       ContactFormMessage[]
  tasks                     Task[]
  files                     File[]
  imageGenerations          ImageGeneration[]
}
```

### 新用户默认字段

在注册时自动设置：

```typescript
export const getEmailUserFields = defineUserSignupFields({
  email: (data: any) => data.email,
  username: (data: any) => data.email.split('@')[0],
  isEmailVerified: () => false,  // 邮箱注册需要验证
  credits: () => 3,               // 赠送 3 积分
  isAdmin: () => false,
});
```

---

## 🔐 Session 管理

### Session 配置

Wasp 使用 **Cookie-based Session**：

- Session ID 存储在 HTTP-only Cookie 中
- 默认过期时间：14 天
- 自动刷新机制

### 获取当前用户

#### 在服务端（Wasp Action/Query）

```typescript
import { HttpError } from 'wasp/server';
import type { YourAction } from 'wasp/server/operations';

export const yourAction: YourAction = async (args, context) => {
  // context.user 自动注入当前登录用户
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  console.log('User ID:', context.user.id);
  console.log('Email:', context.user.email);
  console.log('Credits:', context.user.credits);

  // 查询完整用户信息
  const fullUser = await context.entities.User.findUnique({
    where: { id: context.user.id },
    include: {
      generatedSchedules: true,
    },
  });

  return fullUser;
};
```

#### 在客户端（React 组件）

```typescript
import { useAuth } from 'wasp/client/auth';

export default function MyComponent() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Credits: {Number(user.credits).toFixed(2)}</p>
    </div>
  );
}
```

### 登出用户

```typescript
import { logout } from 'wasp/client/auth';

function LogoutButton() {
  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
```

---

## 🛡️ 权限控制

### 页面级权限

在 `main.wasp` 中配置：

```wasp
page AccountPage {
  authRequired: true,  // ← 必须登录才能访问
  component: import Account from "@src/user/AccountPage"
}
```

### 组件级权限

```typescript
import { useAuth } from 'wasp/client/auth';

export default function PremiumFeature() {
  const { data: user } = useAuth();

  // 必须登录
  if (!user) {
    return <div>Please login to use this feature</div>;
  }

  // 必须有足够积分
  if (Number(user.credits) < 1) {
    return <div>Insufficient credits. Please purchase more.</div>;
  }

  return <div>Premium content here</div>;
}
```

### API 级权限

```typescript
export const adminOnlyAction: AdminOnlyAction = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Forbidden - Admin only');
  }

  // 执行管理员操作
};
```

---

## 🧪 测试认证功能

### 1. 测试邮箱注册

```bash
# 启动开发服务器
wasp start

# 访问注册页面
# http://localhost:3000/signup

# 填写表单:
# Email: test@example.com
# Password: Test123456!

# 提交后检查:
# 1. 数据库中是否创建了 User 记录
# 2. 邮箱是否收到验证邮件
# 3. isEmailVerified 是否为 false
```

### 2. 测试邮箱验证

```bash
# 打开验证邮件，点击验证链接
# 应该重定向到应用首页

# 检查数据库:
# isEmailVerified 应该变为 true
```

### 3. 测试登录

```bash
# 访问登录页面
# http://localhost:3000/login

# 使用刚注册的账号登录
# 应该重定向到 /demo-app
```

### 4. 测试密码重置

```bash
# 1. 访问 /login
# 2. 点击 "Forgot password?"
# 3. 输入邮箱
# 4. 检查邮箱收到重置邮件
# 5. 点击重置链接
# 6. 输入新密码
# 7. 尝试用新密码登录
```

---

## 🐛 常见问题

### 1. 收不到验证邮件

**检查清单:**

```bash
# 1. 检查 SMTP 配置
cat app/.env.server | grep SMTP

# 2. 查看服务器日志
# 应该有类似输出:
# [Server] Sending email to: test@example.com

# 3. 检查垃圾邮件箱

# 4. 使用 Resend Dashboard 查看发送日志
# https://resend.com/emails
```

### 2. Google OAuth 重定向错误

**解决方案:**

```bash
# 检查 Google Cloud Console 中的重定向 URI 配置
# 必须完全匹配，包括协议 (http/https) 和端口

# 开发环境:
http://localhost:3000/auth/google/callback

# 生产环境:
https://nbartai.com/auth/google/callback
```

### 3. Session 过期

**原因:** Cookie 被浏览器清除或过期

**解决方案:**
- 用户重新登录
- 实现 "Remember Me" 功能（延长 Session）

### 4. 邮箱重复注册

**错误信息:** "User with this email already exists"

**解决方案:**
```typescript
// 在注册前检查邮箱是否已存在
const existingUser = await context.entities.User.findUnique({
  where: { email: args.email }
});

if (existingUser) {
  throw new HttpError(400, 'Email already registered');
}
```

---

## 📚 相关文档

- [Wasp Auth 官方文档](https://wasp.sh/docs/auth/overview)
- [Resend 文档](https://resend.com/docs)
- [Google OAuth 文档](https://developers.google.com/identity/protocols/oauth2)
- [功能配置系统](FEATURES_CONFIG.md)
- [架构设计](ARCHITECTURE.md)

---

## ✅ 认证配置检查清单

- [x] 配置 SMTP 邮件服务（Resend）
- [x] 在 `.env.server` 中设置 SMTP 凭据
- [x] 自定义验证邮件内容
- [x] 自定义密码重置邮件内容
- [x] 配置新用户默认字段（赠送积分）
- [ ] 测试邮箱注册流程
- [ ] 测试邮件验证流程
- [ ] 测试密码重置流程
- [ ] （可选）配置 Google OAuth
- [ ] （可选）测试 Google 登录流程
- [ ] 在生产环境验证域名邮箱

---

**🔐 现在你已经掌握了完整的用户认证配置！**
