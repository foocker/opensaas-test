# 🔧 统一配置指南

本项目实现了**统一的配置系统**，通过修改配置文件即可控制所有功能模块的显示和行为。

---

## 📁 配置文件位置

### 主配置文件：[app/src/shared/config.ts](app/src/shared/config.ts)

这是**唯一需要修改的配置文件**，包含：
- ✅ 品牌配置（网站名称、Logo）
- ✅ 导航菜单配置
- ✅ Landing Page 区块配置
- ✅ 功能开关（AI 模块、支付、认证等）
- ✅ 外部链接配置

### 功能模块定义：[app/src/shared/features.ts](app/src/shared/features.ts)

定义功能模块的详细信息（名称、描述、路由、图标等），**但启用状态从 config.ts 读取**。

---

## 🎯 核心设计原则

### 1. 单一配置源 (Single Source of Truth)

所有功能开关都在 [config.ts](app/src/shared/config.ts) 的 `FeatureFlags` 对象中定义：

```typescript
export const FeatureFlags = {
  ai: {
    scheduler: true,       // 🔧 在这里控制 AI Day Scheduler
    imageGenerator: true,  // 🔧 在这里控制 AI Image Generator
    textGenerator: false,  // 🔧 未实现的功能，关闭
  },
  // ...
};
```

### 2. 配置联动 (Configuration Linking)

[features.ts](app/src/shared/features.ts) 中的功能配置会自动读取 [config.ts](app/src/shared/config.ts) 的值：

```typescript
// features.ts
aiScheduler: {
  enabled: FeatureFlags.ai.scheduler,  // ← 从 config.ts 读取
}
```

### 3. 零代码修改 (Zero Code Changes)

关闭功能只需修改一行配置，**无需修改任何业务代码**。

---

## 🚀 快速开始

### 场景 1: 关闭 AI Day Scheduler 功能

**只需修改一行：**

打开 [app/src/shared/config.ts](app/src/shared/config.ts)

```typescript
export const FeatureFlags = {
  ai: {
    scheduler: false,  // ← 改这里，从 true 改为 false
    imageGenerator: true,
    // ...
  },
};
```

**效果：**
- ✅ 用户菜单中的 "AI Day Scheduler" 消失
- ✅ 访问 `/demo-app` 会被拦截（如果实现了权限检查）
- ✅ 无需删除任何代码

### 场景 2: 隐藏 Landing Page 的 Banana Playground

打开 [app/src/shared/config.ts](app/src/shared/config.ts)

```typescript
export const FeatureFlags = {
  landingPage: {
    showHero: true,
    showAITemplates: true,
    showBananaPlayground: false,  // ← 改这里
    // ...
  },
};
```

**效果：**
- ✅ Landing Page 不再显示 Banana Playground 区块
- ✅ 其他区块不受影响

---

## 📋 完整配置项说明

### 1. Landing Page 区块配置

控制首页各个区块的显示/隐藏：

```typescript
landingPage: {
  showHero: true,              // Hero 区域（主标题、CTA）
  showAITemplates: true,       // AI 精选模板
  showBananaPlayground: true,  // Banana 游乐场（AI 图像生成）
  showExamples: false,          // 示例轮播
  showClients: false,          // 客户 Logo 展示
  showHighlightedFeature: false, // 突出功能展示
  showFeaturesGrid: false,      // Bento 风格功能网格
  showTestimonials: false,      // 用户评价
  showFAQ: false,               // 常见问题
  showFooter: true,            // 页脚导航
}
```

**使用方法：**
- `true` = 显示该区块
- `false` = 隐藏该区块

### 2. AI 功能模块配置

控制 AI 相关功能的启用状态：

```typescript
ai: {
  scheduler: true,       // AI Day Scheduler（任务规划）
  imageGenerator: true,  // AI Image Generator（图像生成）
  textGenerator: false,  // AI Text Generator（未实现）
}
```

**影响范围：**
- 用户菜单显示
- 功能页面访问权限
- 相关 UI 组件的渲染

### 3. 认证功能配置

```typescript
auth: {
  emailPassword: true,   // 邮箱密码登录
  googleOAuth: false,    // Google OAuth（中国大陆建议关闭）
}
```

### 4. 支付功能配置

```typescript
payment: {
  stripe: true,          // Stripe 支付
  alipay: false,         // 支付宝（待实现）
}
```

### 5. 其他功能配置

```typescript
fileUpload: false,       // 文件上传功能
analytics: true,         // Google Analytics
```

---

## 🎨 自定义配置

### 修改网站名称和品牌

```typescript
export const SiteConfig = {
  name: "Nano Banana Magic",        // ← 改这里
  shortName: "NBM",                 // ← 改这里
  description: "比 Google AI 便宜 70% 的 AI 服务平台",  // ← 改这里
  logo: "logo.webp",
  logoAlt: "Nano Banana Magic",
};
```

### 修改导航菜单

```typescript
export const NavigationConfig = {
  marketing: {
    features: false,     // 功能介绍
    pricing: true,       // 定价页面 ← 改为 false 可隐藏
    documentation: false,
    blog: false,
  },
};
```

### 修改外部链接

```typescript
export const ExternalLinks = {
  documentation: "https://docs.opensaas.sh",  // ← 改这里
  blog: "https://docs.opensaas.sh/blog",      // ← 改这里
  github: "https://github.com/wasp-lang/wasp",
};
```

---

## ➕ 添加新功能模块

### 步骤 1: 在 config.ts 添加功能开关

```typescript
export const FeatureFlags = {
  ai: {
    scheduler: true,
    imageGenerator: true,
    textGenerator: true,  // ← 新增：AI 文本生成功能
  },
};
```

### 步骤 2: 在 features.ts 添加功能定义

```typescript
export const FEATURES: Record<string, FeatureConfig> = {
  // ... 现有功能

  // 新增：AI 文本生成
  textGenerator: {
    id: "textGenerator",
    name: "AI Text Generator",
    description: "使用 AI 生成文本内容",
    route: "/text-generator",
    icon: FileText,
    enabled: FeatureFlags.ai.textGenerator,  // ← 从 config.ts 读取
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 2,
  },
};
```

### 步骤 3: 实现功能页面

1. 在 `main.wasp` 添加路由
2. 创建页面组件
3. 实现功能逻辑

完成！新功能会自动出现在用户菜单中。

---

## 🔐 权限控制

### 功能权限配置

在 [features.ts](app/src/shared/features.ts) 中配置：

```typescript
{
  requireAuth: true,   // 是否需要登录
  adminOnly: false,    // 是否仅管理员可见
  showInMenu: true,    // 是否显示在菜单
}
```

### 权限组合示例

**公开功能**（所有人可见）：
```typescript
{
  requireAuth: false,
  adminOnly: false,
}
```

**登录用户功能**：
```typescript
{
  requireAuth: true,
  adminOnly: false,
}
```

**管理员专属功能**：
```typescript
{
  requireAuth: true,
  adminOnly: true,
}
```

---

## 🧪 测试配置变更

### 测试流程

1. **修改配置**
   ```typescript
   FeatureFlags.ai.scheduler = false
   ```

2. **保存文件**（热重载会自动生效）

3. **刷新浏览器**

4. **验证结果**
   - 打开用户菜单
   - 确认 "AI Day Scheduler" 已消失

5. **恢复配置**（如果需要）
   ```typescript
   FeatureFlags.ai.scheduler = true
   ```

---

## 📊 配置示例

### 示例 1: 精简版 Landing Page

只保留核心区块：

```typescript
landingPage: {
  showHero: true,              // ✅ 保留
  showAITemplates: true,       // ✅ 保留
  showBananaPlayground: true,  // ✅ 保留
  showExamples: false,          // ❌ 移除
  showClients: false,          // ❌ 移除
  showHighlightedFeature: false, // ❌ 移除
  showFeaturesGrid: false,      // ❌ 移除
  showTestimonials: false,      // ❌ 移除
  showFAQ: false,               // ❌ 移除
  showFooter: true,            // ✅ 保留
}
```

### 示例 2: 完整版 Landing Page

启用所有区块：

```typescript
landingPage: {
  showHero: true,
  showAITemplates: true,
  showBananaPlayground: true,
  showExamples: true,
  showClients: true,
  showHighlightedFeature: true,
  showFeaturesGrid: true,
  showTestimonials: true,
  showFAQ: true,
  showFooter: true,
}
```

### 示例 3: 国内版配置

针对中国大陆用户优化：

```typescript
export const FeatureFlags = {
  auth: {
    emailPassword: true,
    googleOAuth: false,    // 🇨🇳 关闭 Google OAuth
  },
  payment: {
    stripe: true,
    alipay: true,          // 🇨🇳 启用支付宝（待实现）
  },
};
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) | 本文档 - 统一配置指南 |
| [FEATURES_CONFIG.md](FEATURES_CONFIG.md) | 功能模块详细说明 |
| [CREDIT_SYSTEM.md](CREDIT_SYSTEM.md) | 积分系统配置 |
| [STRIPE_SETUP.md](STRIPE_SETUP.md) | Stripe 支付配置 |

---

## 🎓 最佳实践

### 1. 修改前备份

在修改配置前，复制一份配置文件作为备份：

```bash
cp app/src/shared/config.ts app/src/shared/config.ts.backup
```

### 2. 逐个测试

修改配置后，逐个功能测试：
- ✅ 检查菜单显示
- ✅ 检查页面访问
- ✅ 检查权限控制

### 3. 注释清晰

为每个配置项添加清晰的注释：

```typescript
ai: {
  scheduler: true,       // AI 日程规划（AI Day Scheduler）
  imageGenerator: true,  // AI 图像生成（Banana Playground）
  textGenerator: false,  // AI 文本生成（待实现）- 预计 2025 Q2 上线
}
```

### 4. 版本控制

使用 Git 追踪配置变更：

```bash
git add app/src/shared/config.ts
git commit -m "feat: 关闭 Google OAuth，启用支付宝"
```

---

## ⚠️ 注意事项

### 1. 关闭功能 ≠ 删除代码

关闭功能只是隐藏 UI，代码仍然存在。如果确定永久移除功能，建议：
- 删除相关代码文件
- 从 `main.wasp` 移除路由
- 从配置文件移除配置项

### 2. Landing Page 区块依赖

某些区块可能依赖特定数据格式，关闭前确认：
- `showFeaturesGrid` 需要 `features` 数据
- `showTestimonials` 需要 `testimonials` 数据

### 3. 配置同步

如果多人协作，确保配置文件同步：
```bash
git pull origin main
```

---

## 🚀 总结

**本项目的配置系统特点：**

✅ **统一配置中心** - 所有配置在 [config.ts](app/src/shared/config.ts) 中管理
✅ **零代码修改** - 修改配置即可控制功能
✅ **完全解耦** - 功能实现和开关分离
✅ **易于扩展** - 添加新功能只需添加配置
✅ **权限控制** - 支持登录和管理员权限

**下次想修改功能？**
1. 打开 [app/src/shared/config.ts](app/src/shared/config.ts)
2. 找到对应的功能开关
3. 改为 `true` 或 `false`
4. 保存并刷新浏览器
5. 完成！

---

## 📞 需要帮助？

如果配置过程中遇到问题：
1. 查看 [FEATURES_CONFIG.md](FEATURES_CONFIG.md) 了解功能模块详情
2. 检查浏览器控制台是否有错误信息
3. 确认配置文件语法正确（注意逗号、引号）
4. 尝试恢复默认配置并重新测试
