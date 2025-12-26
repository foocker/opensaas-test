# 迁移到 assets.ts 的指南

本文档说明如何将项目从分散的 Vite import 迁移到使用 assets.ts 集中管理。

---

## ⚠️ 重要：Vite 项目必须使用 import 方式

Wasp 使用 Vite 作为构建工具，**必须使用 `import` 语句导入图片**，不能使用 URL 字符串路径！

```typescript
// ❌ 错误 - Vite 不会处理字符串路径
export const BrandAssets = {
  logo: "/logo.webp",  // 图片无法加载！
}

// ✅ 正确 - Vite 会处理 import 语句
import logo from "../client/static/logo.webp";
export const BrandAssets = {
  logo: logo,  // 图片正常加载
}
```

**为什么？**
- Vite 只处理 `import` 语句，会自动：
  - 复制文件到输出目录
  - 生成内容哈希（如 `logo.abc123.webp`）
  - 返回最终的 URL 路径
- 字符串路径 Vite 不处理，浏览器会找不到文件

---

## 🎯 迁移策略

**已完成的迁移**：所有公共图片资源都已迁移到 assets.ts

- ✅ 品牌图片（Logo, Banner, Favicon）→ `BrandAssets`
- ✅ 示例图片（7 张案例截图）→ `ExampleAssets`
- ✅ 功能展示图（AI Ready）→ `FeatureAssets`
- ✅ 其他资源（头像、图标）→ `MiscAssets`

**原因**：
1. 集中管理 - 替换图片只需修改一处
2. 类型安全 - TypeScript 自动补全和检查
3. 易于维护 - 清晰的资源分类
4. AI 友好 - 降低 AI 编程的理解成本

---

## 📋 迁移步骤

### Step 1: 在 assets.ts 中添加 import

```typescript
// app/src/shared/assets.ts

// ==================== 品牌资源 ====================
import logo from "../client/static/logo.webp";
import openSaasBannerLight from "../client/static/open-saas-banner-light.svg";
import openSaasBannerDark from "../client/static/open-saas-banner-dark.svg";

export const BrandAssets = {
  logo: logo,
  logoAlt: "Nano Banana Magic",
  bannerLight: openSaasBannerLight,
  bannerDark: openSaasBannerDark,
} as const;
```

### Step 2: 迁移组件

**旧代码**:
```tsx
// ❌ 旧方式 - 在组件中直接 import
import openSaasBannerDark from "../../client/static/open-saas-banner-dark.svg";
import openSaasBannerLight from "../../client/static/open-saas-banner-light.svg";

<img src={openSaasBannerLight} className="dark:hidden" />
<img src={openSaasBannerDark} className="hidden dark:block" />
```

**新代码**:
```tsx
// ✅ 新方式 - 从 assets.ts 导入
import { BrandAssets } from "../../shared/assets";  // 使用相对路径

<img src={BrandAssets.bannerLight} alt={BrandAssets.logoAlt} className="dark:hidden" />
<img src={BrandAssets.bannerDark} alt={BrandAssets.logoAlt} className="hidden dark:block" />
```

⚠️ 注意：Wasp 不支持 `@src/` 路径别名，必须使用相对路径！

### Step 3: 验证迁移

运行开发服务器，检查图片是否正常显示：

```bash
wasp start
```

打开浏览器开发者工具：
1. Network 选项卡 - 检查图片是否加载成功
2. Console 选项卡 - 检查是否有 404 错误
3. 测试深色模式切换 - 检查 dark 图片是否正常

**Vite 自动处理的优化：**
- ✅ 自动生成内容哈希（如 `logo.abc123.webp`）
- ✅ 浏览器缓存优化（immutable Cache-Control）
- ✅ 自动复制到输出目录
- ✅ 开发环境热更新

---

## 🔄 完整迁移示例

### 迁移前

```tsx
// Hero.tsx
import openSaasBannerDark from "../../client/static/open-saas-banner-dark.svg";
import openSaasBannerLight from "../../client/static/open-saas-banner-light.svg";

export default function Hero() {
  return (
    <div>
      <img src={openSaasBannerLight} alt="App screenshot" className="dark:hidden" />
      <img src={openSaasBannerDark} alt="App screenshot" className="hidden dark:block" />
    </div>
  );
}
```

### 迁移后

```tsx
// Hero.tsx
import { BrandAssets } from "../../shared/assets";

export default function Hero() {
  return (
    <div>
      <img
        src={BrandAssets.bannerLight}
        alt={BrandAssets.logoAlt}
        className="dark:hidden"
      />
      <img
        src={BrandAssets.bannerDark}
        alt={BrandAssets.logoAlt}
        className="hidden dark:block"
      />
    </div>
  );
}
```

**好处**:
1. ✅ 替换图片只需修改 `assets.ts` 中的 import 路径
2. ✅ 统一的 alt 文字管理
3. ✅ Vite 自动生成内容哈希（如 `logo.abc123.webp`）
4. ✅ 类型安全 - TypeScript 自动补全

---

## 📊 性能对比

### 场景 1: 初次加载

| 方式 | 请求数 | 缓存策略 | 结果 |
|------|--------|---------|------|
| 分散 import | 1 次/图片 | 内容哈希 | ✅ 优秀 |
| assets.ts 集中 import | 1 次/图片 | 内容哈希 | ✅ 优秀 |

**结论**: 性能完全相同（都使用 Vite import，都生成内容哈希）

### 场景 2: 图片更新后

| 方式 | 操作 | 浏览器行为 |
|------|------|-----------|
| 分散 import | 重新构建 → 新哈希 | ✅ 自动重新下载 |
| assets.ts 集中 import | 重新构建 → 新哈希 | ✅ 自动重新下载 |

**结论**: 缓存失效机制完全相同

### 场景 3: 替换品牌图片

| 方式 | 需要修改的文件数 |
|------|---------------|
| 分散 import | 3-5 个组件文件 |
| assets.ts 集中 import | 1 个配置文件 |

**结论**: assets.ts 维护成本更低 ⭐

---

## 🎯 已迁移的组件列表

本项目已完成以下组件的迁移：

### 1. Landing Page 组件
- ✅ [Hero.tsx](../app/src/landing-page/components/Hero.tsx) - 使用 `BrandAssets.bannerLight/bannerDark`
- ✅ [ExampleHighlightedFeature.tsx](../app/src/landing-page/ExampleHighlightedFeature.tsx) - 使用 `FeatureAssets.aiReady/aiReadyDark`
- ✅ [contentSections.tsx](../app/src/landing-page/contentSections.tsx) - 使用 `MiscAssets.daBoi` 和 `ExampleAssets.example1-7`

### 2. Navigation 组件
- ✅ [NavBar.tsx](../app/src/client/components/NavBar/NavBar.tsx) - 使用 `BrandAssets.logo`

### 3. Admin 组件
- ✅ [Sidebar.tsx](../app/src/admin/layout/Sidebar.tsx) - 使用 `BrandAssets.logo`

### 如何添加新的功能展示图片

如果你想展示自己的功能（如支付、文件上传、管理后台等），按照以下步骤：

**Step 1: 准备图片**
```bash
# 将截图放到指定目录
app/src/client/static/assets/
  ├── my-feature.webp        # 浅色主题截图
  └── my-feature-dark.webp   # 深色主题截图
```

**Step 2: 在 assets.ts 中添加**
```typescript
// app/src/shared/assets.ts

// 添加 import
import myFeature from "../client/static/assets/my-feature.webp";
import myFeatureDark from "../client/static/assets/my-feature-dark.webp";

// 添加到 FeatureAssets
export const FeatureAssets = {
  aiReady: aiReady,
  aiReadyDark: aiReadyDark,
  myFeature: myFeature,           // 新增
  myFeatureDark: myFeatureDark,   // 新增
} as const;
```

**Step 3: 创建展示组件**
参考 [ExampleHighlightedFeature.tsx](../app/src/landing-page/ExampleHighlightedFeature.tsx)

**Step 4: 在 LandingPage.tsx 中使用**
```tsx
import MyFeature from "./MyFeatureComponent";

{landingPageConfig.showMyFeature && <MyFeature />}
```

---

## 📝 使用 assets.ts 的最佳实践

### 1. 替换品牌图片

修改 [app/src/shared/assets.ts](../app/src/shared/assets.ts)：

```typescript
// 1. 将你的图片放到 app/src/client/static/
// 2. 修改 import 路径
import logo from "../client/static/your-logo.webp";  // 改这里

// 3. 修改品牌名称
export const BrandAssets = {
  logo: logo,
  logoAlt: "Your Brand Name",  // 改这里
  // ...
}
```

所有使用 `BrandAssets` 的组件会自动更新！

### 2. 控制组件显示

在 [app/src/shared/config.ts](../app/src/shared/config.ts) 中：

```typescript
export const FeatureFlags = {
  landingPage: {
    showHero: true,              // Hero 区域（使用 BrandAssets）
    showHighlightedFeature: true, // AI Ready 展示（使用 FeatureAssets）
    showExamples: true,          // 示例轮播（使用 ExampleAssets）
    // ...
  }
}
```

修改 config.ts 即可控制哪些区块显示，无需修改代码！

### 3. 查看效果

```bash
# 启动开发服务器
wasp start

# 访问 http://localhost:3000
# 修改 config.ts 后自动刷新
```

---

## 🎯 总结

### 核心优势

1. ✅ **集中管理** - 所有公共图片在一处定义
2. ✅ **类型安全** - TypeScript 自动补全和检查
3. ✅ **易于维护** - 替换品牌图片只需修改一处
4. ✅ **AI 友好** - 清晰的资源映射降低理解成本
5. ✅ **Vite 优化** - 自动内容哈希、缓存优化

### 适用场景

- ✅ 品牌升级时需要批量替换图片
- ✅ 多人协作，需要统一管理资源
- ✅ 使用 AI 辅助编程（如 Claude Code）
- ✅ 基于 OpenSaaS 模板创建新项目

### 性能说明

**完全相同的性能表现**：
- 请求数：与分散 import 相同
- 缓存策略：使用 Vite 内容哈希
- 优化方式：Vite 自动处理

**唯一的区别**：维护成本更低 ⭐

---

## 📚 相关文档

- [config.ts 配置指南](./CONFIG_GUIDE.md) - 网站配置说明
- [自定义品牌指南](./CUSTOMIZATION_GUIDE.md) - 如何替换品牌资源
