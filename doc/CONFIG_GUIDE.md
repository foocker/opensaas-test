# 配置指南 - Nano Banana Magic

本项目采用配置化设计，通过修改配置文件即可快速定制网站功能和外观，无需修改多个组件文件。

## 核心配置文件

**位置**: `app/src/shared/config.ts`

这是整个项目的配置中心，包含以下几大配置模块：

---

## 1. 品牌配置 (SiteConfig)

控制网站的基本信息和品牌元素。

```typescript
export const SiteConfig = {
  name: "Nano Banana Magic",        // 网站名称（显示在导航栏、页脚等）
  shortName: "NBM",                  // 简称（用于移动端等空间受限的地方）
  description: "比 Google AI 便宜 70% 的 AI 服务平台",
  logo: "logo.webp",                 // Logo 文件名（相对于 src/client/static/）
  logoAlt: "Nano Banana Magic",      // Logo alt 文字
}
```

**修改示例**：
```typescript
// 改成你自己的品牌
name: "我的 AI 平台",
shortName: "AI",
description: "最好用的 AI 服务",
```

---

## 2. 导航菜单配置 (NavigationConfig)

控制顶部导航栏显示哪些菜单项。

```typescript
export const NavigationConfig = {
  // 营销页面导航（未登录用户看到的导航）
  marketing: {
    features: false,      // 功能介绍页面
    pricing: true,        // 定价页面
    documentation: false, // 文档（外部链接）
    blog: false,         // 博客（外部链接）
  },

  // Demo 功能导航（登录用户看到的导航）
  demo: {
    aiScheduler: true,   // AI 日程规划
    fileUpload: false,   // 文件上传
    documentation: false,
    blog: false,
  },
}
```

**修改示例**：
```typescript
// 启用所有导航项
marketing: {
  features: true,
  pricing: true,
  documentation: true,
  blog: true,
}
```

---

## 3. 外部链接配置 (ExternalLinks)

配置文档、博客等外部链接的 URL。

```typescript
export const ExternalLinks = {
  documentation: "https://docs.opensaas.sh",
  blog: "https://docs.opensaas.sh/blog",
  github: "https://github.com/wasp-lang/wasp",
}
```

---

## 4. 功能开关配置 (FeatureFlags)

这是最重要的配置，控制网站的所有功能模块。

### 4.1 首页区块配置

控制首页显示哪些区块，每个区块都可以独立开关：

```typescript
landingPage: {
  showHero: true,              // Hero 区域（主标题、副标题、CTA 按钮）
  showExamples: true,          // 示例轮播（展示使用案例）
  showClients: false,          // 客户/技术栈 Logo 展示（Used by）
  showHighlightedFeature: true, // 突出功能展示（大图 + 文字说明）
  showFeatures: false,         // 传统列表式功能展示（2列布局）
  showFeaturesGrid: true,      // Bento 风格功能网格（推荐使用）
  showTestimonials: true,      // 用户评价（What Our Users Say）
  showFAQ: true,               // 常见问题（手风琴式展开）
  showFooter: true,            // 页脚导航
}
```

**首页区块说明**：

| 区块 | 说明 | 推荐使用 |
|------|------|---------|
| `showHero` | 首页顶部的英雄区域，包含主标题和 CTA 按钮 | ✅ 必须 |
| `showExamples` | 自动轮播的使用案例展示 | ✅ 推荐 |
| `showClients` | 显示合作伙伴或技术栈 Logo（Salesforce、Prisma 等） | ⚠️ 可选 |
| `showHighlightedFeature` | 大图展示某个核心功能 | ✅ 推荐 |
| `showFeatures` | 传统的 2 列功能列表（icon + 文字） | ⚠️ 备选 |
| `showFeaturesGrid` | Bento 风格功能网格，更现代化 | ✅ 推荐 |
| `showTestimonials` | 用户评价/推荐 | ✅ 推荐 |
| `showFAQ` | 常见问题解答 | ✅ 推荐 |
| `showFooter` | 页脚导航和链接 | ✅ 必须 |

> 💡 提示：`showFeatures` 和 `showFeaturesGrid` 二选一即可，推荐使用 `showFeaturesGrid`

**组合示例**：

```typescript
// 场景 1: 极简首页（只保留核心内容）
landingPage: {
  showHero: true,
  showExamples: false,
  showClients: false,
  showHighlightedFeature: false,
  showFeatures: false,
  showFeaturesGrid: true,
  showTestimonials: false,
  showFAQ: true,
  showFooter: true,
}

// 场景 2: 完整展示型首页（适合营销）
landingPage: {
  showHero: true,
  showExamples: true,
  showClients: true,
  showHighlightedFeature: true,
  showFeatures: false,
  showFeaturesGrid: true,
  showTestimonials: true,
  showFAQ: true,
  showFooter: true,
}
```

### 4.2 认证功能配置

```typescript
auth: {
  emailPassword: true,   // 邮箱密码登录
  googleOAuth: false,    // Google OAuth（中国大陆建议关闭）
}
```

### 4.3 支付功能配置

```typescript
payment: {
  stripe: true,          // Stripe 支付
  alipay: false,         // 支付宝（待实现）
}
```

### 4.4 AI 功能配置

```typescript
ai: {
  scheduler: true,       // AI 日程规划
}
```

### 4.5 其他功能

```typescript
fileUpload: false,       // 文件上传功能
analytics: true,         // Google Analytics
```

---

## 5. 导航项标签配置 (NavigationLabels)

自定义导航项的显示文字（支持中文）。

```typescript
export const NavigationLabels = {
  features: "功能",
  pricing: "定价",
  documentation: "文档",
  blog: "博客",
  aiScheduler: "AI 日程规划",
  fileUpload: "文件上传",
}
```

---

## 如何使用配置

### 快速定制首页

1. 打开 `app/src/shared/config.ts`
2. 修改 `FeatureFlags.landingPage` 中的开关
3. 保存文件，网站自动刷新

**示例 - 打造一个简约的首页**：

```typescript
export const FeatureFlags = {
  landingPage: {
    showHero: true,              // ✅ 保留
    showExamples: false,         // ❌ 去掉轮播
    showClients: false,          // ❌ 去掉客户 Logo
    showHighlightedFeature: false, // ❌ 去掉大图展示
    showFeatures: false,
    showFeaturesGrid: true,      // ✅ 只保留功能网格
    showTestimonials: false,     // ❌ 去掉用户评价
    showFAQ: true,               // ✅ 保留 FAQ
    showFooter: true,            // ✅ 保留页脚
  },
  // ... 其他配置
}
```

### 修改网站名称

```typescript
export const SiteConfig = {
  name: "我的新网站",  // 修改这里
  // ...
}
```

所有导航栏、页脚、页面标题都会自动更新。

### 添加/移除导航项

```typescript
export const NavigationConfig = {
  marketing: {
    features: true,      // 改为 true 显示，false 隐藏
    pricing: true,
    documentation: true,
    blog: false,
  },
}
```

---

## 内容定制

### 修改首页内容数据

首页的具体内容（功能列表、用户评价、FAQ 等）在：

**位置**: `app/src/landing-page/contentSections.tsx`

```typescript
// 修改功能网格的内容
export const features: GridFeature[] = [
  {
    name: "按需付费",
    description: "Token 按 3折 实时扣费，用多少付多少",
    emoji: "💰",
    href: DocsUrl,
    size: "small",
  },
  // 添加更多功能...
]

// 修改用户评价
export const testimonials = [
  {
    name: "用户名",
    role: "职位",
    avatarSrc: 头像图片,
    socialUrl: "社交链接",
    quote: "评价内容",
  },
  // 添加更多评价...
]

// 修改 FAQ
export const faqs = [
  {
    id: "1",
    question: "问题",
    answer: "答案",
  },
  // 添加更多问题...
]
```

---

## 完整工作流程

### 场景：快速搭建一个新的 SaaS 网站

1. **修改品牌信息**
   - 打开 `app/src/shared/config.ts`
   - 修改 `SiteConfig` 的 `name` 和 `description`
   - 替换 `app/src/client/static/logo.webp` 为你的 Logo

2. **配置首页区块**
   - 根据需要开启/关闭 `FeatureFlags.landingPage` 中的区块
   - 建议保留：Hero、FeaturesGrid、FAQ、Footer
   - 可选添加：Examples、Testimonials、HighlightedFeature

3. **自定义内容**
   - 打开 `app/src/landing-page/contentSections.tsx`
   - 修改 `features` 数组的功能描述
   - 修改 `testimonials` 添加真实用户评价
   - 修改 `faqs` 更新常见问题

4. **配置导航**
   - 在 `NavigationConfig` 中启用需要的导航项
   - 在 `NavigationLabels` 中修改导航项文字

5. **功能开关**
   - 根据实际情况开启/关闭支付、认证、AI 等功能

6. **保存并测试**
   - 保存所有文件
   - 浏览器会自动刷新
   - 检查首页效果

---

## 优势

✅ **快速定制**：只需修改一个配置文件，无需改动多个组件
✅ **模块化**：每个功能都是独立的，可以随意组合
✅ **易维护**：所有配置集中管理，一目了然
✅ **可扩展**：后续添加新功能只需在配置中添加新的开关
✅ **类型安全**：使用 TypeScript，配置错误会立即提示

---

## 常见问题

**Q: 如何完全隐藏某个首页区块？**
A: 在 `FeatureFlags.landingPage` 中将对应的 `show*` 设为 `false`

**Q: 可以自定义首页区块的顺序吗？**
A: 可以，直接编辑 `app/src/landing-page/LandingPage.tsx`，调整组件的顺序

**Q: 如何添加新的首页区块？**
A:
1. 创建新的组件文件
2. 在 `config.ts` 的 `landingPage` 中添加新的开关
3. 在 `LandingPage.tsx` 中引入并使用配置开关

**Q: 配置文件支持动态修改吗？**
A: 目前是编译时配置，修改后需要重新编译。如需运行时配置，可以考虑使用数据库或环境变量。

---

## 下一步

- 查看 [main.wasp](app/main.wasp) 了解路由和权限配置
- 查看 [contentSections.tsx](app/src/landing-page/contentSections.tsx) 修改首页内容
- 查看各个组件文件自定义样式和交互效果


