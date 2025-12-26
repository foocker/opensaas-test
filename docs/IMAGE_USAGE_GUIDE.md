# 图片使用和引用指南

本文档说明项目中所有图片资源的存放位置、引用方式和使用场景。

---

## 📍 图片文件位置 vs 浏览器访问路径

### Wasp 的静态资源处理机制

Wasp 框架会将以下两个目录的文件都复制到构建输出的**根目录**：

```
文件系统位置                           →  浏览器访问路径

app/src/client/static/logo.webp       →  /logo.webp
app/src/client/static/assets/*.webp   →  /assets/*.webp
app/public/favicon.ico                →  /favicon.ico
app/public/public-banner.webp         →  /public-banner.webp
```

### 两个目录的区别

| 目录 | 用途 | 引用方式 | 何时使用 |
|------|------|---------|---------|
| `app/src/client/static/` | **前端可导入**的静态资源 | `import logo from './static/logo.webp'` | 需要在 React 组件中 import 的图片 |
| `app/public/` | **纯静态**文件 | 只能通过 URL: `/favicon.ico` | SEO 图片、favicon、robots.txt 等 |

---

## 🎯 当前项目中的图片使用

### 1. Hero 区域的 Banner 图片

**文件位置**:
- `app/src/client/static/open-saas-banner-light.svg` - 浅色模式
- `app/src/client/static/open-saas-banner-dark.svg` - 深色模式

**使用位置**: [Hero.tsx](../app/src/landing-page/components/Hero.tsx:3-4)

```tsx
import openSaasBannerDark from "../../client/static/open-saas-banner-dark.svg";
import openSaasBannerLight from "../../client/static/open-saas-banner-light.svg";

export default function Hero() {
  return (
    <div>
      {/* 浅色模式显示 */}
      <img
        src={openSaasBannerLight}
        alt="App screenshot"
        className="dark:hidden"
      />

      {/* 深色模式显示 */}
      <img
        src={openSaasBannerDark}
        alt="App screenshot"
        className="hidden dark:block"
      />
    </div>
  );
}
```

**引用方式**: **Webpack import**（Wasp 自动处理）
- 优点: 类型安全，Webpack 会处理路径和缓存
- 缺点: 每个文件都需要单独 import

---

### 2. Highlighted Feature 区域的功能展示图

**文件位置**:
- `app/src/client/static/assets/aiready.webp` - 浅色模式
- `app/src/client/static/assets/aiready-dark.webp` - 深色模式

**使用位置**: [ExampleHighlightedFeature.tsx](../app/src/landing-page/ExampleHighlightedFeature.tsx:1-2)

```tsx
import aiReadyDark from "../client/static/assets/aiready-dark.webp";
import aiReady from "../client/static/assets/aiready.webp";

const AIReadyExample = () => {
  return (
    <div className="w-full">
      <img src={aiReady} alt="AI Ready" className="dark:hidden" />
      <img src={aiReadyDark} alt="AI Ready" className="hidden dark:block" />
    </div>
  );
};
```

**引用方式**: **Webpack import**

---

### 3. assets.ts 中配置的图片

**文件位置**: [app/src/shared/assets.ts](../app/src/shared/assets.ts)

```typescript
export const BrandAssets = {
  logo: "/logo.webp",                              // ← app/src/client/static/logo.webp
  bannerLight: "/open-saas-banner-light.svg",      // ← app/src/client/static/
  bannerDark: "/open-saas-banner-dark.svg",        // ← app/src/client/static/
  publicBanner: "/public-banner.webp",             // ← app/public/public-banner.webp
  avatarPlaceholder: "/avatar-placeholder.webp",   // ← app/src/client/static/
}

export const FeatureAssets = {
  aiReady: "/assets/aiready.webp",                 // ← app/src/client/static/assets/
  payments: "/assets/payments.webp",
  fileUpload: "/assets/fileupload.webp",
  admin: "/assets/admin.webp",
  email: "/assets/email.webp",
  blog: "/assets/blog.webp",
  openApi: "/assets/openapi.webp",
}
```

**引用方式**: **URL 路径**（以 `/` 开头的绝对路径）

**当前使用情况**:
- ⚠️ **目前 assets.ts 中的图片路径尚未被使用**
- 这些路径配置是为了**集中管理**，方便替换
- 未来可以重构组件，改用 assets.ts 的配置

---

## 🔄 两种引用方式对比

### 方式 1: Webpack Import（当前使用）

```tsx
import logo from "../client/static/logo.webp";

<img src={logo} alt="Logo" />
```

**优点**:
- ✅ 类型安全
- ✅ Webpack 自动处理路径和缓存
- ✅ 构建时优化

**缺点**:
- ❌ 每个组件都需要 import
- ❌ 替换图片时需要修改多个文件
- ❌ 路径分散，不易管理

### 方式 2: URL 路径 + assets.ts（推荐迁移）

```tsx
import { BrandAssets } from "@src/shared/assets";

<img src={BrandAssets.logo} alt="Logo" />
```

**优点**:
- ✅ **集中管理** - 所有路径在一个文件中
- ✅ **易于替换** - 只需修改 assets.ts
- ✅ 类型安全（TypeScript）

**缺点**:
- ❌ 运行时路径（浏览器需要额外请求）
- ❌ 需要手动管理缓存

---

## 📊 当前所有图片资源清单

### 品牌资源（需要替换）

| 文件 | 位置 | 用途 | 当前引用方式 | 是否在 assets.ts |
|------|------|------|-------------|----------------|
| `logo.webp` | `client/static/` | 导航栏 Logo | 未使用 | ✅ |
| `open-saas-banner-light.svg` | `client/static/` | Hero 区域（浅色） | Webpack import | ✅ |
| `open-saas-banner-dark.svg` | `client/static/` | Hero 区域（深色） | Webpack import | ✅ |
| `public-banner.webp` | `public/` | SEO/社交分享 | URL | ✅ |
| `favicon.ico` | `public/` | 浏览器图标 | HTML `<link>` | ❌ |
| `avatar-placeholder.webp` | `client/static/` | 头像占位符 | 未使用 | ✅ |

### 功能展示资源

| 文件 | 位置 | 用途 | 当前引用方式 | 是否在 assets.ts |
|------|------|------|-------------|----------------|
| `assets/aiready.webp` | `client/static/assets/` | AI 功能展示（浅色） | Webpack import | ✅ |
| `assets/aiready-dark.webp` | `client/static/assets/` | AI 功能展示（深色） | Webpack import | ✅ |
| `assets/payments.webp` | `client/static/assets/` | 支付功能展示 | 未使用 | ✅ |
| `assets/fileupload.webp` | `client/static/assets/` | 文件上传展示 | 未使用 | ✅ |
| `assets/admin.webp` | `client/static/assets/` | 管理后台展示 | 未使用 | ✅ |
| `assets/email.webp` | `client/static/assets/` | 邮件功能展示 | 未使用 | ✅ |
| `assets/blog.webp` | `client/static/assets/` | 博客功能展示 | 未使用 | ✅ |
| `assets/openapi.webp` | `client/static/assets/` | API 文档展示 | 未使用 | ✅ |

### 技术栈 Logo

| 文件 | 位置 | 用途 | 是否在 assets.ts |
|------|------|------|----------------|
| `logos/nodejs-light.webp` | `client/static/logos/` | Node.js Logo（浅色） | ✅ |
| `logos/nodejs-dark.webp` | `client/static/logos/` | Node.js Logo（深色） | ✅ |
| `logos/tailwind-light.webp` | `client/static/logos/` | Tailwind Logo（浅色） | ✅ |
| `logos/tailwind-dark.webp` | `client/static/logos/` | Tailwind Logo（深色） | ✅ |
| `logos/stripe-light.webp` | `client/static/logos/` | Stripe Logo（浅色） | ✅ |
| `logos/stripe-dark.webp` | `client/static/logos/` | Stripe Logo（深色） | ✅ |

### 示例案例

| 文件 | 位置 | 用途 | 是否在 assets.ts |
|------|------|------|----------------|
| `examples/*.webp` (7个文件) | `client/static/examples/` | 案例展示 | ✅ |

---

## ❓ 关于 showFeatures vs showFeaturesGrid

### showFeatures（未实现）

```typescript
// config.ts
showFeatures: false,  // 传统列表式功能展示（2列布局） 似乎没效果 TODO
```

**状态**: ⚠️ **未实现**
- `LandingPage.tsx` 中有注释说明: "showFeatures 使用传统列表式功能展示，需要不同的数据格式，当前未启用"
- `Features.tsx` 组件存在，但没有被导入和使用
- 可能是遗留代码或预留功能

### showFeaturesGrid（已实现）

```typescript
// config.ts
showFeaturesGrid: true,  // Bento 风格功能网格（推荐使用）
```

**状态**: ✅ **已实现且正常工作**
- 使用 `FeaturesGrid.tsx` 组件
- 显示 Bento 风格的网格布局
- 数据来自 `contentSections.tsx` 的 `features` 数组

---

## 🛠️ 如何替换图片

### 方法 1: 直接替换文件（推荐）

```bash
# 替换 Hero Banner
cp your-banner-light.svg app/src/client/static/open-saas-banner-light.svg
cp your-banner-dark.svg app/src/client/static/open-saas-banner-dark.svg

# 替换 Logo
cp your-logo.webp app/src/client/static/logo.webp

# 替换 Favicon
cp your-favicon.ico app/public/favicon.ico

# 替换 SEO Banner
cp your-og-banner.webp app/public/public-banner.webp
```

### 方法 2: 使用 Python 工具处理后替换

```bash
cd asset_make
source venv/bin/activate

# 转换格式并调整尺寸
python image_processor.py convert your-logo.png ../app/src/client/static/logo.webp
python image_processor.py resize your-banner.jpg --width 1200 --height 630 \
  --output ../app/public/public-banner.webp
```

### 方法 3: 重构为使用 assets.ts（未来优化）

1. 修改组件，从 Webpack import 改为使用 assets.ts:

```tsx
// ❌ 旧方式
import logo from "../client/static/logo.webp";

// ✅ 新方式
import { BrandAssets } from "@src/shared/assets";

<img src={BrandAssets.logo} alt="Logo" />
```

2. 替换图片时，只需修改 `assets.ts` 中的路径

---

## 📝 最佳实践建议

### 1. 优先替换的图片（按优先级）

1. **Logo** - `client/static/logo.webp`
2. **Hero Banner** - `client/static/open-saas-banner-*.svg`
3. **Favicon** - `public/favicon.ico`
4. **SEO Banner** - `public/public-banner.webp`
5. **Feature 展示图** - `client/static/assets/*.webp`

### 2. 未来优化方向

1. **重构组件引用方式**
   - 将所有 Webpack import 改为使用 assets.ts
   - 实现集中管理

2. **实现 showFeatures**
   - 完成 `Features.tsx` 组件
   - 添加到 `LandingPage.tsx`
   - 提供两种功能展示风格选择

3. **图片优化**
   - 使用 WebP 格式减小体积
   - 添加响应式图片（srcset）
   - 实现懒加载

---

## 🎯 总结

- ✅ **Hero 图片**: 通过 Webpack import 引入 `open-saas-banner-*.svg`
- ✅ **assets.ts**: 已配置所有图片路径，但大部分未被使用
- ✅ **showFeaturesGrid**: 正常工作，显示 Bento 网格布局
- ⚠️ **showFeatures**: 未实现，组件存在但未使用
- 📝 **建议**: 先直接替换文件，后续可重构为使用 assets.ts 集中管理

---

相关文档:
- [BRAND_ASSETS_GUIDE.md](./BRAND_ASSETS_GUIDE.md) - 品牌资源管理指南
- [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - 配置系统指南
