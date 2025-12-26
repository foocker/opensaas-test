# 项目结构与开发策略指南

本文档详细说明了项目的目录结构、组件分层设计以及基于 Wasp 框架的开发策略。

---

## 📁 项目目录结构

```
app/src/
├── client/                    # 🎨 客户端通用组件和基础设施
│   ├── components/            # 全局共享的 UI 组件
│   │   ├── NavBar/           # 导航栏组件（所有页面共享）
│   │   ├── cookie-consent/   # Cookie 同意横幅
│   │   ├── ui/               # shadcn/ui 基础组件库（button, input, dialog 等）
│   │   ├── NotFoundPage.tsx  # 404 页面
│   │   └── DarkModeSwitcher.tsx  # 深色模式切换器
│   ├── App.tsx               # 根组件（全局布局）
│   └── static/               # 静态资源（favicon, robots.txt, sitemap.xml）
│
├── landing-page/              # 🏠 首页（Landing Page）专属内容
│   ├── LandingPage.tsx       # 首页主组件
│   ├── contentSections.tsx   # 首页的内容配置（包括 Footer 导航数据）
│   ├── components/           # 首页专用组件
│   │   ├── Hero.tsx          # 首页 Hero 区域
│   │   ├── Features.tsx      # 功能展示区域
│   │   ├── Pricing.tsx       # 价格展示
│   │   └── Footer.tsx        # 页脚组件
│   └── aiTemplatesData.ts    # AI 模板数据
│
├── legal/                     # 📄 法律/公司信息页面
│   ├── legalContent.ts       # 数据配置
│   ├── components/
│   │   └── LegalPageTemplate.tsx  # 通用模板
│   ├── AboutPage.tsx         # /about 关于我们
│   ├── PrivacyPage.tsx       # /privacy 隐私政策
│   └── TermsPage.tsx         # /terms 服务条款
│
├── auth/                      # 🔐 认证相关页面
├── user/                      # 👤 用户账户页面
├── demo-ai-app/               # 🤖 AI 应用页面
├── payment/                   # 💳 支付相关页面
├── file-upload/               # 📁 文件上传页面
├── admin/                     # 👨‍💼 管理员面板
├── analytics/                 # 📊 数据分析
├── server/                    # 🔧 服务器端逻辑
└── shared/                    # 🔧 共享配置和工具
    ├── config.ts             # 全局配置（链接、功能开关等）
    └── common.ts             # 导出配置供其他模块使用
```

---

## 🔍 目录功能详解

### 1. `client/components/` - 全局基础设施

**作用**: 整个应用的通用组件

**特点**:
- 在多个页面中复用（NavBar、DarkMode、UI 组件库）
- 不包含具体业务内容
- 基础设施级别的组件

**例子**:
- `NotFoundPage.tsx` - 404 页面（任何路由失败都会用到）
- `NavBar/` - 导航栏（几乎所有页面都有）
- `ui/` - 基础 UI 组件（button、input、dialog 等）

**何时添加新组件**:
- 组件需要在 3+ 个页面中使用
- 组件是纯 UI，不包含特定业务逻辑
- 组件是全局功能（导航、通知、主题切换等）

### 2. `landing-page/` - 首页专属内容

**作用**: 首页（`/` 路由）的内容和配置

**特点**:
- 只在首页使用
- 包含首页的所有内容配置
- `contentSections.tsx` 包含 Footer 的导航数据

**例子**:
- `LandingPage.tsx` - 首页主组件
- `contentSections.tsx` - 首页内容配置（Hero、Features、Footer 链接等）
- `components/Footer.tsx` - 页脚组件（读取 `contentSections.tsx` 的数据）

**何时修改**:
- 修改首页的内容、布局、样式
- 修改 Footer 的链接配置
- 添加首页专用的功能区域

### 3. `legal/` - 法律页面

**作用**: 法律相关的独立页面

**特点**:
- 独立的路由（`/about`, `/privacy`, `/terms`）
- 有自己的数据和模板
- 从 Footer 链接跳转过来

**例子**:
- `AboutPage.tsx` - 关于我们页面
- `PrivacyPage.tsx` - 隐私政策页面
- `TermsPage.tsx` - 服务条款页面
- `legalContent.ts` - 所有法律页面的内容配置

**何时修改**:
- 更新法律声明内容
- 添加新的法律页面（如退款政策）

### 4. `shared/` - 共享配置

**作用**: 全局配置和工具函数

**特点**:
- 纯配置，无 UI 组件
- 被多个模块引用
- 类型安全的配置定义

**例子**:
- `config.ts` - 功能开关、外部链接、定价配置等
- `common.ts` - 导出配置供其他模块使用

**何时修改**:
- 添加新的功能开关
- 修改外部链接配置
- 添加全局常量

---

## 🔗 组件之间的关系

```
首页 (/)
  ↓
使用 landing-page/LandingPage.tsx
  ↓
渲染 landing-page/components/Footer.tsx
  ↓
读取 landing-page/contentSections.tsx 的 footerNavigation
  ↓
footerNavigation 从 shared/common.ts 获取链接
  ↓
点击 "About" / "Privacy" / "Terms" 链接
  ↓
路由跳转到 legal/AboutPage.tsx 等页面
```

---

## 🎯 组件分层架构

### 层级结构

```
┌─────────────────────────────────────────┐
│  配置层 (config.ts, contentSections.ts)  │  ← 纯数据
└─────────────────────────────────────────┘
                  ↓ 数据传递
┌─────────────────────────────────────────┐
│    页面层 (AboutPage, PricingPage)       │  ← 业务逻辑
└─────────────────────────────────────────┘
                  ↓ 组合
┌─────────────────────────────────────────┐
│  通用组件层 (NavBar, Footer, Template)   │  ← 可复用
└─────────────────────────────────────────┘
                  ↓ 组合
┌─────────────────────────────────────────┐
│  原子组件层 (Button, Card, Input)        │  ← 最基础
└─────────────────────────────────────────┘
```

### 1️⃣ 原子组件层 (`client/components/ui/`)

**作用**: 最基础的 UI 组件，无业务逻辑

**来源**:
- shadcn/ui（推荐）
- 开源组件库（Radix UI, Headless UI）
- v0.dev / AI 生成
- 优秀网站分析和改造

**示例**:
```typescript
// ✅ 正确 - 纯 UI，无业务逻辑
export function Button({
  variant,
  size,
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```typescript
// ❌ 错误 - 包含业务逻辑
export function LoginButton() {
  const { user } = useAuth();
  return <button onClick={login}>登录到 Nano Banana Magic</button>;
}
```

**特点**:
- 高度可复用
- 样式可定制（通过 props）
- 无状态或仅有 UI 状态
- 不依赖外部数据或 API

### 2️⃣ 通用组件层 (`client/components/`)

**作用**: 可在多个页面复用的业务组件

**示例**:
```typescript
// client/components/NavBar/NavBar.tsx
export function NavBar({ links }: { links: NavLink[] }) {
  const { user } = useAuth();

  return (
    <nav>
      {links.map(link => (
        <Button variant="ghost" key={link.href}>
          <Link to={link.href}>{link.name}</Link>
        </Button>
      ))}

      {user ? <UserMenu user={user} /> : <LoginButton />}
    </nav>
  );
}
```

**特点**:
- 组合原子组件
- 包含通用业务逻辑
- 接受配置数据作为 props
- 可在多个页面使用

### 3️⃣ 页面层 (`landing-page/`, `legal/`, `payment/` 等)

**作用**: 实现具体页面的业务逻辑

**示例**:
```typescript
// legal/AboutPage.tsx
import LegalPageTemplate from "./components/LegalPageTemplate";
import { aboutContent } from "./legalContent";

export default function AboutPage() {
  return <LegalPageTemplate data={aboutContent} />;
}
```

**特点**:
- 使用通用组件
- 传入配置数据
- 实现具体业务逻辑
- 处理页面级状态和交互

### 4️⃣ 配置层 (`shared/config.ts`, `*Data.ts`)

**作用**: 纯数据配置，驱动组件渲染

**示例**:
```typescript
// shared/config.ts
export const ExternalLinks = {
  footer: {
    about: "/about",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;

// landing-page/contentSections.tsx
export const footerNavigation = {
  company: [
    { name: "About", href: FooterLinks.about },
    { name: "Privacy", href: FooterLinks.privacy },
  ],
};
```

**特点**:
- 纯数据，无逻辑
- 类型安全（TypeScript + `as const`）
- 易于修改和维护
- 集中管理配置

---

## 🚀 基于 Wasp 的开发策略

### 核心理念

**复用 Wasp 的高质量基础设施，专注于业务逻辑和前端 UI**

```
┌─────────────────────────────────────────────────────┐
│             Wasp 提供的基础设施 (后端)                │
│  ✅ Auth, Database, Email, Jobs, API, Type Safety   │
└─────────────────────────────────────────────────────┘
                         ↑
                         │ RPC (自动生成的类型安全接口)
                         │
┌─────────────────────────────────────────────────────┐
│           你需要开发的部分 (前端 + 业务逻辑)           │
│                                                     │
│  1️⃣ 前端 UI 组件                                    │
│     - 从 shadcn/ui 获取原子组件                      │
│     - 组合成业务组件                                 │
│     - 用 Tailwind CSS 美化                          │
│                                                     │
│  2️⃣ 业务逻辑 (后端)                                 │
│     - Query/Action 函数实现                         │
│     - 调用外部 API (AI, Payment, Storage)           │
│     - 数据处理和计算                                 │
│                                                     │
│  3️⃣ 数据配置                                        │
│     - config.ts 配置                                │
│     - 内容数据 (contentSections, legalContent)      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Wasp 提供的能力（开箱即用）

| 功能模块 | Wasp 提供的能力 | 项目中的使用 | 是否需要修改 |
|---------|---------------|------------|------------|
| **🔐 Full-stack Auth** | - 邮箱/密码认证<br>- Google/GitHub OAuth<br>- Session 管理<br>- 权限控制 | ✅ 已配置在 `main.wasp`<br>前端使用 `useAuth()` | ❌ 无需修改 |
| **🔄 RPC** | - 类型安全的 API 调用<br>- 自动生成 TypeScript 类型<br>- Query & Action | ✅ 所有 Query/Action<br>自动类型推导 | ❌ 无需修改 |
| **📧 Email Sending** | - SMTP 集成<br>- 邮件模板<br>- 发送队列 | ✅ 配置 Resend<br>自定义邮件模板 | ✅ 修改模板内容 |
| **⚙️ Jobs** | - 后台任务调度<br>- Cron 定时任务<br>- 重试机制 | ✅ `dailyStatsJob`<br>每小时统计 | ✅ 添加新任务 |
| **🗄️ Database** | - Prisma ORM<br>- 自动迁移<br>- 类型安全查询 | ✅ 所有数据模型<br>在 `schema.prisma` | ✅ 添加新模型 |
| **🚀 Deployment** | - CLI 部署命令<br>- 支持多平台 | 🔜 待使用<br>`wasp deploy` | ❌ 按需使用 |
| **🔒 Type Safety** | - 全栈类型安全<br>- 自动生成类型 | ✅ 自动工作<br>无需配置 | ❌ 无需修改 |

### 你需要开发的部分

#### 1️⃣ 前端 UI 开发

**使用 Wasp 提供的 Hooks**:
```typescript
import { useAuth } from "wasp/client/auth";
import { useQuery, useAction } from "wasp/client/operations";
import { generateGptResponse } from "wasp/client/operations";
```

**使用 shadcn/ui 组件**:
```typescript
import { Button } from "@/client/components/ui/button";
import { Card } from "@/client/components/ui/card";
```

**编写业务逻辑**:
```typescript
export function MyFeature() {
  const { data: user } = useAuth();  // Wasp 提供
  const generateGpt = useAction(generateGptResponse);  // Wasp 提供

  // 你的业务逻辑
  const handleGenerate = async () => {
    const result = await generateGpt({ prompt: "..." });
    // 处理结果
  };

  // 你的 UI
  return (
    <Card>
      <h1>AI 生成</h1>
      <Button onClick={handleGenerate}>生成</Button>
    </Card>
  );
}
```

#### 2️⃣ 后端业务逻辑

**定义在 `main.wasp`**:
```wasp
action generateGptResponse {
  fn: import { generateGptResponse } from "@src/demo-ai-app/operations",
  entities: [User, GptResponse]
}
```

**实现业务逻辑**:
```typescript
// src/demo-ai-app/operations.ts
export const generateGptResponse = async (
  { prompt },
  context
) => {
  // ✅ Wasp 自动处理认证
  const user = context.user;

  // 🎯 你的业务逻辑
  // 1. 调用外部 AI API
  const response = await callAiApi(prompt);

  // 2. 扣除积分
  await deductCredits(user.id, cost);

  // 3. 保存记录
  await context.entities.GptResponse.create({
    data: { userId: user.id, response }
  });

  return response;
};
```

#### 3️⃣ 数据配置

**全局配置**:
```typescript
// src/shared/config.ts
export const FeatureFlags = {
  ai: { imageGenerator: true },
  fileUpload: true,
};

export const ExternalLinks = {
  footer: { about: "/about" },
};
```

**内容配置**:
```typescript
// src/legal/legalContent.ts
export const aboutContent = {
  title: "关于我们",
  sections: [
    { heading: "使命", content: "..." },
  ],
};
```

### 🔒 安全性保障

#### Wasp 已经处理的安全问题

- ✅ **SQL 注入防护** - Prisma ORM 参数化查询
- ✅ **XSS 防护** - React 自动转义
- ✅ **CSRF 防护** - Session 管理内置 CSRF 保护
- ✅ **认证安全** - bcrypt 密码哈希
- ✅ **类型安全** - TypeScript 全栈类型检查
- ✅ **API 权限** - `context.user` 自动验证登录状态

#### 你需要注意的安全点

- ⚠️ **外部 API 调用** - 验证响应数据，处理错误
- ⚠️ **用户输入验证** - 前后端都要验证（使用 Zod 等库）
- ⚠️ **敏感数据** - 不要在前端暴露 API Keys，使用环境变量
- ⚠️ **权限检查** - 在 Action/Query 中验证用户权限
  ```typescript
  export const deleteUser = async ({ userId }, context) => {
    // ✅ 权限检查
    if (!context.user.isAdmin) {
      throw new HttpError(403, "无权限");
    }
    // 业务逻辑
  };
  ```

---

## 📊 完整开发流程示例

### 场景：添加一个新的 "定价页面"

#### Step 1: 确认 UI 组件是否齐全

```bash
# 检查需要的组件
client/components/ui/
├── button.tsx      ✅ 已有
├── card.tsx        ✅ 已有
├── badge.tsx       ❌ 缺少
└── switch.tsx      ✅ 已有
```

#### Step 2: 添加缺少的 UI 组件

```bash
# 从 shadcn/ui 添加
npx shadcn-ui@latest add badge

# 或者从 v0.dev 生成
# 或者从优秀网站复制并改造
```

#### Step 3: 创建页面专用组件（如果需要）

```typescript
// payment/components/PricingCard.tsx
import { Card } from "@/client/components/ui/card";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <Card>
      <h3>{plan.name}</h3>
      <Badge>{plan.badge}</Badge>
      <p>{plan.price}</p>
      <Button>{plan.cta}</Button>
    </Card>
  );
}
```

#### Step 4: 创建数据配置

```typescript
// payment/pricingData.ts
export const pricingPlans = [
  {
    name: "基础版",
    badge: "最受欢迎",
    price: "¥9.99",
    cta: "立即购买",
    features: ["特性1", "特性2"],
  },
  // ...
];
```

#### Step 5: 创建页面组件

```typescript
// payment/PricingPage.tsx
import { PricingCard } from "./components/PricingCard";
import { pricingPlans } from "./pricingData";

export default function PricingPage() {
  return (
    <div>
      <h1>定价方案</h1>
      <div className="grid grid-cols-3 gap-6">
        {pricingPlans.map(plan => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
```

#### Step 6: 注册路由

```wasp
// main.wasp
route PricingPageRoute { path: "/pricing", to: PricingPage }
page PricingPage {
  component: import PricingPage from "@src/payment/PricingPage"
}
```

---

## 🎨 推荐的组件来源

### 1. shadcn/ui（最推荐）

```bash
# 安装命令
npx shadcn-ui@latest add button card dialog
```

**优点**:
- ✅ 高质量、可定制
- ✅ 直接复制到项目中，完全可控
- ✅ TypeScript + Tailwind CSS
- ✅ 无运行时依赖
- ✅ 活跃的社区支持

**官网**: https://ui.shadcn.com

### 2. v0.dev（AI 生成）

**使用方式**:
1. 访问 https://v0.dev
2. 描述你要的组件（支持中文）
3. AI 生成代码，可直接复制
4. 支持迭代优化

**优点**:
- ✅ 快速生成自定义组件
- ✅ 基于 shadcn/ui 和 Tailwind
- ✅ 可以生成复杂的交互逻辑

### 3. 优秀开源项目

- **[Taxonomy](https://github.com/shadcn-ui/taxonomy)** - Next.js 应用模板
- **[Bullet Train](https://bullettrain.co/)** - SaaS 模板
- **[Tailwind UI](https://tailwindui.com/)** - 官方组件（部分付费）
- **[Radix UI](https://www.radix-ui.com/)** - 无样式的可访问组件

### 4. 分析优秀网站

**推荐网站**:
- **Linear.app** - 极简现代风格
- **Vercel.com** - 科技感设计
- **Stripe.com** - 专业商务风格
- **Resend.com** - 简洁清晰的 UI

**分析方法**:
1. 使用浏览器开发者工具查看样式
2. 使用 React DevTools 查看组件结构
3. 参考设计，用 Tailwind CSS 重新实现

---

## 💡 最佳实践总结

### ✅ DO（推荐做法）

1. **原子组件层** (`client/components/ui/`)
   - ✅ 从 shadcn/ui 或其他来源获取
   - ✅ 保持纯 UI，无业务逻辑
   - ✅ 高度可定制化

2. **通用组件层** (`client/components/`)
   - ✅ 组合原子组件
   - ✅ 包含通用业务逻辑
   - ✅ 在多个页面复用

3. **页面组件层** (`landing-page/`, `legal/` 等)
   - ✅ 使用通用组件
   - ✅ 实现具体业务
   - ✅ 数据驱动

4. **配置数据层** (`shared/config.ts`, `*Data.ts`)
   - ✅ 纯数据配置
   - ✅ 类型安全
   - ✅ 易于修改

5. **Wasp 基础设施**
   - ✅ 完全复用 Wasp 提供的能力
   - ✅ 不要重写认证、数据库、邮件等基础功能
   - ✅ 专注于业务逻辑

### ❌ DON'T（避免做法）

1. **不要在原子组件中混入业务逻辑**
   ```typescript
   // ❌ 错误
   export function SubmitButton() {
     const { user } = useAuth();
     const submit = useAction(submitForm);
     return <button onClick={() => submit(user.id)}>提交</button>;
   }

   // ✅ 正确
   export function Button({ onClick, children }: ButtonProps) {
     return <button onClick={onClick}>{children}</button>;
   }
   ```

2. **不要重写 Wasp 已提供的功能**
   ```typescript
   // ❌ 错误 - 自己实现认证
   async function login(email, password) {
     const user = await db.user.findUnique({ where: { email } });
     const valid = await bcrypt.compare(password, user.password);
     // ...
   }

   // ✅ 正确 - 使用 Wasp 的认证
   // Wasp 已经在 main.wasp 中配置好了
   ```

3. **不要在多个地方硬编码相同的数据**
   ```typescript
   // ❌ 错误 - 硬编码
   <a href="/about">About</a>
   <a href="/privacy">Privacy</a>

   // ✅ 正确 - 使用配置
   import { FooterLinks } from "@/shared/common";
   <a href={FooterLinks.about}>About</a>
   <a href={FooterLinks.privacy}>Privacy</a>
   ```

4. **不要在前端暴露敏感信息**
   ```typescript
   // ❌ 错误
   const API_KEY = "sk-xxxxxxxxxxxxx";
   fetch("https://api.openai.com", {
     headers: { "Authorization": `Bearer ${API_KEY}` }
   });

   // ✅ 正确 - 通过后端调用
   const result = await generateGpt({ prompt });
   ```

---

## 📚 相关文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 完整架构设计
- [FEATURES_CONFIG.md](./FEATURES_CONFIG.md) - 功能模块配置
- [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - 配置系统指南
- [CONFIG_GUIDE.md](./CONFIG_GUIDE.md) - Landing Page 配置

---

## 🎯 开发检查清单

当你要添加新功能时，请按以下清单检查：

### ✅ 前端开发

- [ ] 需要的原子组件是否都存在？（`client/components/ui/`）
- [ ] 是否可以复用现有的通用组件？（`client/components/`）
- [ ] 是否需要创建新的通用组件？（如果在 3+ 页面使用）
- [ ] 页面组件是否正确使用了配置数据？
- [ ] 是否正确使用了 Wasp 的 hooks？（`useAuth`, `useQuery`, `useAction`）

### ✅ 后端开发

- [ ] 是否在 `main.wasp` 中定义了 Query/Action？
- [ ] 是否正确使用了 `context.user` 进行认证？
- [ ] 是否进行了权限检查？
- [ ] 是否正确使用了 `context.entities` 进行数据库操作？
- [ ] 是否处理了错误情况？

### ✅ 配置数据

- [ ] 是否在 `config.ts` 中添加了新的配置？
- [ ] 是否更新了类型定义？
- [ ] 是否添加了详细的注释？

### ✅ 安全性

- [ ] 是否验证了用户输入？
- [ ] 是否处理了边界情况？
- [ ] 敏感信息是否通过环境变量管理？
- [ ] 外部 API 调用是否处理了错误？

---

**记住核心原则**：
1. **分层架构** - 配置 → 页面 → 通用组件 → 原子组件
2. **数据驱动** - 配置数据与 UI 组件解耦
3. **复用优先** - 使用 Wasp 基础设施 + shadcn/ui 组件
4. **类型安全** - 充分利用 TypeScript
5. **专注业务** - 不重复造轮子

通过遵循这些原则，你可以快速构建高质量、易维护的应用！
