# OpenSaaS 框架定制指南

本文档面向使用 OpenSaaS 作为项目模板的开发者，说明如何快速替换品牌并定制自己的项目。

---

## 🎯 设计理念

OpenSaaS 采用**集中配置 + 纯 URL 路径**的资源管理策略：

### 为什么不使用 Webpack Import？

| Webpack Import | URL + assets.ts | 为什么选择后者 |
|---------------|----------------|--------------|
| `import logo from './logo.webp'` | `BrandAssets.logo` | ✅ 新用户只需修改配置文件 |
| 路径分散在多个组件 | 路径集中在一个文件 | ✅ 文档清晰，易于理解 |
| 需要理解 Webpack | 只需修改字符串 | ✅ 降低技术门槛 |
| 自动内容哈希 | 手动版本号 | ⚠️ 牺牲一点自动化换取简单性 |

**结论**: 对于**模板/框架**场景，**易用性 > 自动化**

---

## 🚀 快速开始：5 分钟定制你的品牌

### Step 1: 修改品牌名称和 Logo 文字

```typescript
// app/src/shared/assets.ts

export const BrandAssets = {
  logo: withVersion("/logo.webp"),
  logoAlt: "你的品牌名称",  // ← 修改这里
  // ...
}
```

### Step 2: 替换品牌图片

```bash
# 将你的图片复制到对应位置
cp your-logo.webp app/src/client/static/logo.webp
cp your-banner-light.svg app/src/client/static/open-saas-banner-light.svg
cp your-banner-dark.svg app/src/client/static/open-saas-banner-dark.svg
cp your-og-banner.webp app/public/public-banner.webp
cp your-favicon.ico app/public/favicon.ico
```

### Step 3: 更新版本号（触发浏览器重新下载）

```typescript
// app/src/shared/assets.ts

const ASSETS_VERSION = "1.0.1";  // ← 修改版本号
```

### Step 4: 启动项目查看效果

```bash
cd app
wasp start
```

✅ 完成！你的品牌已经应用到整个网站。

---

## 📋 完整定制清单

### 必须修改（⚠️ 高优先级）

- [ ] **品牌名称** - `assets.ts` 中的 `logoAlt`
- [ ] **Logo** - `app/src/client/static/logo.webp`
- [ ] **Hero Banner** - `app/src/client/static/open-saas-banner-*.svg`
- [ ] **Favicon** - `app/public/favicon.ico`
- [ ] **SEO Banner** - `app/public/public-banner.webp` (1200x630px)
- [ ] **网站标题** - `app/main.wasp` 中的 `title`
- [ ] **网站描述** - `app/src/shared/config.ts` 中的描述文字

### 推荐修改（优先级中）

- [ ] **功能展示图** - `app/src/client/static/assets/*.webp`
- [ ] **导航链接** - `app/src/shared/config.ts` 的 `ExternalLinks`
- [ ] **社交媒体链接** - `app/src/shared/config.ts` 的 `social`
- [ ] **定价配置** - `app/src/shared/config.ts` 的 `PricingConfig`
- [ ] **首页内容** - `app/src/landing-page/contentSections.tsx`

### 可选修改（优先级低）

- [ ] **示例案例** - `app/src/client/static/examples/*.webp`
- [ ] **技术栈 Logo** - 通常不需要修改
- [ ] **配色方案** - Tailwind 配置
- [ ] **字体** - CSS 字体配置

---

## 🎨 资源管理系统说明

### 1. 版本控制机制

```typescript
// assets.ts
const ASSETS_VERSION = "1.0.0";  // 每次修改图片后递增

const withVersion = (path: string) => `${path}?v=${ASSETS_VERSION}`;

// 生成的 URL: /logo.webp?v=1.0.0
```

**工作原理**:
1. 图片 URL 带有版本号查询参数
2. 版本号变化 → URL 变化 → 浏览器认为是新文件 → 重新下载
3. 等效于 Webpack 的内容哈希，但更简单

**何时修改版本号**:
- ✅ 替换了品牌图片后
- ✅ 更新了功能展示图后
- ❌ 只修改了代码（不涉及图片）

### 2. CDN 支持（可选）

如果你有大量用户上传的图片（UGC 场景），可以配置 CDN：

```bash
# .env.production
VITE_CDN_ENABLED=true
VITE_CDN_BASE_URL=https://cdn.example.com
```

```typescript
// 使用 CDN
import { getUserUploadUrl } from "@src/shared/assets";

// 本地: /uploads/photo_123.jpg
// 生产: https://cdn.example.com/uploads/photo_123.jpg
const photoUrl = getUserUploadUrl("photo_123.jpg");
```

---

## 🔄 迁移现有组件到 assets.ts

如果你发现某个组件还在使用 Webpack import，可以迁移：

### 迁移前（Webpack Import）

```tsx
// Hero.tsx
import bannerLight from "../../client/static/open-saas-banner-light.svg";
import bannerDark from "../../client/static/open-saas-banner-dark.svg";

<img src={bannerLight} className="dark:hidden" />
<img src={bannerDark} className="hidden dark:block" />
```

### 迁移后（assets.ts）

```tsx
// Hero.tsx
import { BrandAssets } from "@src/shared/assets";

<img src={BrandAssets.bannerLight} alt={BrandAssets.logoAlt} className="dark:hidden" />
<img src={BrandAssets.bannerDark} alt={BrandAssets.logoAlt} className="hidden dark:block" />
```

**好处**:
1. ✅ 替换图片只需修改 `assets.ts`
2. ✅ 统一的 alt 文字管理
3. ✅ 自动版本控制
4. ✅ 支持 CDN 切换

---

## 🎯 UGC 场景：AI 生图作品展示

### 场景说明

如果你的项目有：
- AI 生图功能
- 用户作品画廊
- 大量动态图片内容

可以使用以下方案：

### 方案 1: 简单场景（< 1000 张图）

```typescript
// 直接使用路径字符串
const artworks = [
  { id: 1, url: "/uploads/artwork_001.jpg", author: "User A" },
  { id: 2, url: "/uploads/artwork_002.jpg", author: "User B" },
];

// 渲染
artworks.map(art => (
  <img src={art.url} alt={`Artwork by ${art.author}`} />
))
```

### 方案 2: 大量图片（> 1000 张）+ CDN

```typescript
// 使用 getUserUploadUrl() 函数
import { getUserUploadUrl } from "@src/shared/assets";

const artworks = [
  { id: 1, filename: "artwork_001.jpg", author: "User A" },
  { id: 2, filename: "artwork_002.jpg", author: "User B" },
];

// 渲染（自动支持 CDN）
artworks.map(art => (
  <img
    src={getUserUploadUrl(art.filename, "/artworks/")}
    alt={`Artwork by ${art.author}`}
    loading="lazy"  // 懒加载
  />
))
```

### 方案 3: 响应式图片（性能优化）

```typescript
// 使用 WebP + 多尺寸
const artwork = {
  filename: "artwork_001.jpg",
  sizes: {
    thumb: "artwork_001_thumb.webp",    // 200x200
    medium: "artwork_001_medium.webp",  // 800x800
    large: "artwork_001.webp",          // 1920x1920
  }
};

// 渲染
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet={getUserUploadUrl(artwork.sizes.large, "/artworks/")}
  />
  <source
    media="(min-width: 640px)"
    srcSet={getUserUploadUrl(artwork.sizes.medium, "/artworks/")}
  />
  <img
    src={getUserUploadUrl(artwork.sizes.thumb, "/artworks/")}
    alt="Artwork"
    loading="lazy"
  />
</picture>
```

---

## 📊 性能对比：assets.ts vs Webpack Import

### HTTP 请求数

| 方式 | 首次加载 | 缓存后 |
|------|---------|--------|
| Webpack Import | 1 次/图片 | 0 次（缓存命中） |
| assets.ts + 版本号 | 1 次/图片 | 0 次（缓存命中） |

**结论**: **完全相同**

### 缓存策略

| 方式 | 缓存失效机制 | 优点 | 缺点 |
|------|------------|------|------|
| Webpack | 内容哈希（自动） | ✅ 零配置 | ❌ 构建时复杂度高 |
| assets.ts | 版本号（手动） | ✅ 简单透明 | ⚠️ 需要手动修改版本号 |

**结论**: Webpack 更自动化，assets.ts 更简单

### 维护成本

| 任务 | Webpack Import | assets.ts |
|------|---------------|-----------|
| 替换 Logo | 修改 3-5 个文件 | 修改 1 个文件 + 版本号 |
| 新人上手 | 需要理解构建系统 | 只需修改配置文件 |
| 文档编写 | 需要解释 import 机制 | 只需说明配置位置 |

**结论**: assets.ts 维护成本更低

---

## 🛠️ 图片处理工具

OpenSaaS 提供了 Python 图片处理工具：

```bash
cd asset_make
bash setup.sh  # 安装

# 格式转换
python image_processor.py convert logo.png logo.webp

# 调整尺寸
python image_processor.py resize banner.jpg --width 1200 --height 630

# 批量处理
python image_processor.py convert-dir ./images png webp
```

详见: [asset_make/README.md](../asset_make/README.md)

---

## ❓ 常见问题

### Q1: 修改图片后页面没变化？

**A**: 需要同时修改版本号:

```typescript
// assets.ts
const ASSETS_VERSION = "1.0.1";  // ← 递增版本号
```

### Q2: 能否使用自己的 CDN？

**A**: 可以，设置环境变量:

```bash
# .env.production
VITE_CDN_ENABLED=true
VITE_CDN_BASE_URL=https://your-cdn.com
```

### Q3: Webpack import 和 assets.ts 哪个性能更好？

**A**: **性能完全相同**。差异在于：
- Webpack: 自动化程度高，适合单项目
- assets.ts: 简单易用，适合框架/模板

### Q4: 支持动态图片（用户上传）吗？

**A**: 支持，使用 `getUserUploadUrl()`:

```typescript
import { getUserUploadUrl } from "@src/shared/assets";
const photoUrl = getUserUploadUrl("user_photo_123.jpg");
```

### Q5: 如何优化大量图片的加载？

**A**: 使用以下技术:
1. ✅ WebP 格式（减小体积）
2. ✅ 懒加载 `loading="lazy"`
3. ✅ 响应式图片 `<picture>` + `srcset`
4. ✅ CDN 加速
5. ✅ 图片压缩（使用 `asset_make` 工具）

---

## 🎯 总结

### assets.ts 的核心优势

| 优势 | 说明 |
|------|------|
| ✅ **新手友好** | 只需修改配置文件，不需要理解构建系统 |
| ✅ **集中管理** | 所有品牌资源路径在一个文件 |
| ✅ **版本控制** | 手动版本号，简单透明 |
| ✅ **CDN 支持** | 环境变量配置，一键切换 |
| ✅ **UGC 场景** | 提供 `getUserUploadUrl()` 处理动态内容 |
| ✅ **类型安全** | TypeScript 检查，避免拼写错误 |
| ⚠️ **性能相同** | HTTP 请求和缓存效果与 Webpack 完全相同 |

### 适用场景

✅ **推荐使用 assets.ts**:
- 作为框架/模板提供给他人使用
- 品牌资源需要频繁替换
- 团队成员技术水平参差不齐
- 需要支持 CDN 和 UGC

❌ **不推荐**:
- 单人项目，熟悉构建工具（用 Webpack 更省事）
- 图片几乎不会变化
- 已有成熟的 Webpack 配置

### 最佳实践

```
静态品牌资源 → assets.ts（集中管理）
   ↓
用户上传内容 → getUserUploadUrl()（CDN 支持）
   ↓
图片优化 → asset_make 工具（格式转换、压缩）
   ↓
部署 → 环境变量切换 CDN
```

---

## 📚 相关文档

- [IMAGE_USAGE_GUIDE.md](./IMAGE_USAGE_GUIDE.md) - 图片使用详解
- [BRAND_ASSETS_GUIDE.md](./BRAND_ASSETS_GUIDE.md) - 品牌资源管理
- [MIGRATION_TO_ASSETS_TS.md](./MIGRATION_TO_ASSETS_TS.md) - 迁移指南
- [asset_make/README.md](../asset_make/README.md) - 图片处理工具

---

**祝你快速定制出独特的项目！** 🚀
