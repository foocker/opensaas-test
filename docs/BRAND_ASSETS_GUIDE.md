# 品牌资源管理指南

本文档说明如何管理和替换项目中的品牌图片、Logo 和其他视觉资源。

---

## 🎯 核心理念

**集中管理，一处修改，全局生效**

所有图片资源路径都集中在 `app/src/shared/assets.ts` 文件中，修改这个文件即可更新整个项目的图片。

---

## 📁 文件结构

```
app/
├── src/
│   ├── client/
│   │   └── static/               # 静态资源目录
│   │       ├── logo.webp         # 主 Logo ⚠️ 需要替换
│   │       ├── avatar-placeholder.webp
│   │       ├── open-saas-banner-light.svg  ⚠️ 需要替换
│   │       ├── open-saas-banner-dark.svg   ⚠️ 需要替换
│   │       ├── logos/            # 技术栈 Logo
│   │       ├── examples/         # 示例案例
│   │       └── assets/           # 功能展示图片
│   └── shared/
│       └── assets.ts             # 🔑 资源配置文件（核心）
└── public/
    ├── favicon.ico               # 网站图标 ⚠️ 需要替换
    ├── public-banner.webp        # SEO/社交媒体分享图 ⚠️ 需要替换
    └── templates/                # AI 模板图片（可选）
```

---

## 🔧 如何替换品牌图片

### 步骤 1: 准备你的图片

#### 推荐格式和尺寸

| 资源类型 | 推荐格式 | 推荐尺寸 | 用途 |
|---------|---------|---------|------|
| **Logo** | SVG 或 WebP | 自适应 | 导航栏、页脚 |
| **Favicon** | ICO 或 PNG | 16x16, 32x32, 48x48 | 浏览器标签图标 |
| **Open Graph Banner** | WebP 或 PNG | 1200x630px | 社交媒体分享预览 |
| **功能截图** | WebP | 宽度 800-1200px | 功能展示 |
| **头像占位符** | WebP | 200x200px | 用户头像默认图 |

#### 图片优化工具

- **在线压缩**: [Squoosh](https://squoosh.app) - Google 官方工具
- **批量转换**: [CloudConvert](https://cloudconvert.com)
- **SVG 优化**: [SVGO](https://github.com/svg/svgo)

### 步骤 2: 放置图片文件

```bash
# 主品牌资源放在 static 目录
app/src/client/static/
├── logo.webp              # 你的 Logo
├── logo-dark.webp         # 深色模式 Logo（可选）
├── banner.webp            # 主 Banner
└── favicon.ico            # 移动到 public/

# 公共资源放在 public 目录
app/public/
├── favicon.ico            # 浏览器图标
├── public-banner.webp     # Open Graph 分享图
└── apple-touch-icon.png   # iOS 主屏幕图标（可选）
```

### 步骤 3: 修改 assets.ts

编辑 `app/src/shared/assets.ts`：

```typescript
export const BrandAssets = {
  // 🏢 Logo
  logo: "/logo.webp",                    // ← 改为你的 Logo 路径
  logoAlt: "你的公司名称",                // ← 改为你的公司名称

  // 📱 Banner
  bannerLight: "/banner-light.webp",    // ← 改为你的浅色 Banner
  bannerDark: "/banner-dark.webp",      // ← 改为你的深色 Banner
  publicBanner: "/public-banner.webp",  // ← 改为你的分享图

  // 👤 头像占位符
  avatarPlaceholder: "/avatar.webp",    // ← 改为你的头像占位符
} as const;
```

### 步骤 4: 更新配置文件中的引用

除了 `assets.ts`，还需要检查这些文件：

#### 1. `app/src/shared/config.ts`

```typescript
export const SiteConfig = {
  name: "你的产品名称",           // ← 修改
  shortName: "缩写",             // ← 修改
  description: "产品描述",        // ← 修改
  logo: "logo.webp",             // ← 确保与 assets.ts 一致
  logoAlt: "你的产品名称",        // ← 修改
} as const;
```

#### 2. `app/main.wasp` (SEO Meta 标签)

```wasp
app YourAppName {
  title: "你的产品名称",  // ← 修改

  head: [
    "<link rel='icon' href='/favicon.ico' />",  // ← 确保文件存在
    "<meta property='og:image' content='https://yourdomain.com/public-banner.webp' />",  // ← 修改为你的域名和图片
    // ... 其他 Meta 标签
  ],
}
```

### 步骤 5: 验证修改

```bash
# 启动开发服务器
cd app
wasp start

# 访问 http://localhost:3000
# 检查以下位置：
# 1. 导航栏 Logo
# 2. 浏览器标签图标
# 3. 页脚
# 4. 分享链接预览（使用 Facebook Debugger 或 Twitter Card Validator）
```

---

## 📝 使用资源配置

### 在 React 组件中使用

#### 方法 1: 直接导入需要的资源

```tsx
import { BrandAssets } from "@src/shared/assets";

export function Header() {
  return (
    <header>
      <img
        src={BrandAssets.logo}
        alt={BrandAssets.logoAlt}
        className="h-8"
      />
    </header>
  );
}
```

#### 方法 2: 导入整个 Assets 对象

```tsx
import { Assets } from "@src/shared/assets";

export function Footer() {
  return (
    <footer>
      <img src={Assets.brand.logo} alt={Assets.brand.logoAlt} />
      <img src={Assets.techStack.stripeLight} alt="Stripe" />
    </footer>
  );
}
```

#### 方法 3: 在配置文件中使用

```typescript
// contentSections.tsx
import { FeatureAssets } from "@src/shared/assets";

export const features = [
  {
    name: "AI 功能",
    imageSrc: FeatureAssets.aiReady,  // ← 使用资源配置
  },
];
```

---

## 🎨 社交媒体图标（SVG）

社交媒体图标使用 **SVG 代码**，不需要准备图片文件。

### 当前支持的平台

- X (Twitter)
- GitHub
- Discord
- YouTube

### 如何添加新的社交媒体图标

#### 1. 获取 SVG 代码

访问 [Simple Icons](https://simpleicons.org/)，搜索平台名称，复制 SVG path。

例如 LinkedIn：

```svg
<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
```

#### 2. 添加到 config.ts

```typescript
// app/src/shared/config.ts
export const ExternalLinks = {
  social: {
    twitter: "#",
    github: "https://github.com/yourusername",
    discord: "#",
    youtube: "#",
    linkedin: "https://linkedin.com/company/yourcompany",  // ← 新增
  },
} as const;
```

#### 3. 导出链接

```typescript
// app/src/shared/common.ts
export const SocialLinks = {
  twitter: ExternalLinks.social.twitter,
  github: ExternalLinks.social.github,
  discord: ExternalLinks.social.discord,
  youtube: ExternalLinks.social.youtube,
  linkedin: ExternalLinks.social.linkedin,  // ← 新增
};
```

#### 4. 添加图标到 Footer

```tsx
// app/src/landing-page/contentSections.tsx
export const footerNavigation = {
  // ...
  social: [
    // ... 现有的社交媒体
    {
      name: "LinkedIn",
      href: SocialLinks.linkedin,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ],
};
```

---

## 🔍 检查图片引用位置

### 使用命令查找所有图片引用

```bash
# 在项目根目录执行
cd /home/gg/opensaas-test

# 查找所有 .webp 图片引用
grep -r "\.webp" app/src --include="*.tsx" --include="*.ts"

# 查找所有 logo 引用
grep -r "logo" app/src --include="*.tsx" --include="*.ts" -i

# 查找所有 banner 引用
grep -r "banner" app/src --include="*.tsx" --include="*.ts" -i
```

### 主要引用位置

| 文件 | 引用类型 | 说明 |
|------|---------|------|
| `src/client/components/NavBar/NavBar.tsx` | Logo | 导航栏 Logo |
| `src/landing-page/components/Footer.tsx` | Logo | 页脚 Logo |
| `src/landing-page/components/Hero.tsx` | Banner | Hero 区域背景 |
| `src/landing-page/contentSections.tsx` | 各类图片 | 功能展示、示例等 |
| `main.wasp` | Favicon, OG Image | SEO Meta 标签 |

---

## ✅ 检查清单

替换品牌图片后，使用这个清单确保没有遗漏：

### 必须替换（⚠️ 优先级高）

- [ ] **Logo** - `app/src/client/static/logo.webp`
- [ ] **Favicon** - `app/public/favicon.ico`
- [ ] **Open Graph Banner** - `app/public/public-banner.webp`
- [ ] **导航栏引用** - 检查 `NavBar.tsx` 是否使用了 `BrandAssets.logo`
- [ ] **页脚引用** - 检查 `Footer.tsx`
- [ ] **SEO Meta 标签** - 检查 `main.wasp` 中的 `og:image`

### 推荐替换（优先级中）

- [ ] **功能截图** - `app/src/client/static/assets/*.webp`
- [ ] **示例案例** - `app/src/client/static/examples/*.webp`
- [ ] **深色模式 Logo** - 如果有深色模式
- [ ] **头像占位符** - `avatar-placeholder.webp`

### 可选替换（优先级低）

- [ ] **AI 模板图片** - `app/public/templates/*.{png,jpg}`
- [ ] **技术栈 Logo** - 通常不需要替换
- [ ] **其他装饰性图片**

---

## 🚀 进阶：使用 SVG Logo（推荐）

### 为什么强烈推荐 SVG？

- ✅ **无需图片文件** - 直接用代码生成，不需要单独的图片文件
- ✅ **矢量图形** - 任意缩放不失真，在高清屏幕完美显示
- ✅ **体积小** - 通常比 PNG 小 50-80%
- ✅ **可定制** - CSS 可以改变颜色、大小、添加动画
- ✅ **深色模式友好** - 通过 `currentColor` 自动适配主题
- ✅ **动画支持** - 可以添加交互动画效果
- ✅ **SEO 友好** - 文字可以被搜索引擎索引

### 如何获取 SVG Logo？

#### 方法 1: 从设计软件导出 SVG

**Figma**:
1. 选中你的 Logo 设计
2. 右键 → Copy as SVG
3. 粘贴到代码编辑器

**Illustrator**:
1. File → Export → Export As
2. 格式选择 SVG
3. 点击 Export

**Sketch**:
1. 选中 Logo
2. Make Exportable → SVG
3. Export

#### 方法 2: 在线工具转换（PNG/JPG → SVG）

- [Convertio](https://convertio.co/png-svg/) - 支持批量转换
- [Adobe Express](https://www.adobe.com/express/feature/image/convert/svg) - Adobe 官方
- [Vectorizer.AI](https://vectorizer.ai/) - AI 驱动，质量高

**注意**: 转换后的 SVG 可能需要手动优化和清理代码。

#### 方法 3: 手写简单的 SVG（推荐用于极简 Logo）

```svg
<!-- 圆形 + 文字 Logo -->
<svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#3b82f6" />
  <text x="20" y="28" font-size="20" font-weight="bold"
        text-anchor="middle" fill="white">N</text>
  <text x="50" y="28" font-size="16" fill="#1f2937">Your Brand</text>
</svg>
```

#### 方法 4: AI 生成 SVG Logo

**v0.dev**:
```
Prompt: "Create an SVG logo for a tech startup called 'Nano Banana Magic'.
Modern, minimalist design with a circular icon and text."
```

**ChatGPT / Claude**:
```
Prompt: "Generate SVG code for a minimalist logo combining
the letters 'NB' in a circular design."
```

### 如何在项目中使用 SVG Logo

我们已经为你创建了一个 Logo 组件模板：`app/src/client/components/Logo.tsx`

#### Step 1: 替换 SVG 代码

编辑 `Logo.tsx` 文件，将示例 SVG 替换为你的 Logo：

```tsx
// app/src/client/components/Logo.tsx
export function Logo({ className = "" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"  // ← 调整为你的 Logo 尺寸
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 粘贴你的 Logo SVG path/shape 代码 */}
      <path d="M..." fill="currentColor" />
      <text x="..." y="...">Your Brand</text>
    </svg>
  );
}
```

#### Step 2: 在组件中使用

```tsx
import { Logo } from "@src/client/components/Logo";

// 导航栏
export function NavBar() {
  return (
    <nav>
      <Logo className="h-8 w-auto" />
    </nav>
  );
}

// 页脚
export function Footer() {
  return (
    <footer>
      <Logo className="h-6 w-auto text-gray-600 dark:text-gray-400" />
    </footer>
  );
}
```

#### Step 3: 支持深色模式

**方法 A: 使用 `currentColor`（推荐）**

```tsx
<svg className="text-gray-900 dark:text-white">
  <path d="..." fill="currentColor" />  {/* 自动继承颜色 */}
</svg>
```

**方法 B: 两个不同的 SVG**

```tsx
export function ThemedLogo() {
  return (
    <>
      {/* 浅色模式 */}
      <svg className="dark:hidden">
        <path fill="#000000" />
      </svg>

      {/* 深色模式 */}
      <svg className="hidden dark:block">
        <path fill="#ffffff" />
      </svg>
    </>
  );
}
```

### SVG Logo 组件的高级功能

#### 1. 响应式 Logo

桌面端显示完整 Logo，移动端只显示图标：

```tsx
export function ResponsiveLogo() {
  return (
    <>
      {/* 移动端 - 只显示图标 */}
      <div className="sm:hidden">
        <LogoIcon className="h-8 w-8" />
      </div>

      {/* 桌面端 - 完整 Logo */}
      <div className="hidden sm:block">
        <Logo className="h-8 w-auto" />
      </div>
    </>
  );
}
```

#### 2. 渐变色 Logo

```tsx
export function GradientLogo() {
  return (
    <svg viewBox="0 0 100 40">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#grad)" />
    </svg>
  );
}
```

#### 3. 动画 Logo

```tsx
export function AnimatedLogo() {
  return (
    <svg className="animate-pulse hover:animate-none">
      {/* Logo 内容 */}
    </svg>
  );
}
```

### SVG 优化工具

#### SVGO (在线工具)

访问 [SVGOMG](https://jakearchibald.github.io/svgomg/)，上传你的 SVG 文件：

- ✅ 移除不必要的属性
- ✅ 压缩路径数据
- ✅ 减小文件体积 50-80%

#### 手动优化清单

```svg
<!-- ❌ 优化前 -->
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
     width="200px" height="40px" viewBox="0 0 200 40">
  <g id="group-1">
    <path id="path-1" style="fill:#000000;" d="M..." />
  </g>
</svg>

<!-- ✅ 优化后 -->
<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M..." fill="currentColor" />
</svg>
```

移除内容：
- `id` 属性（除非需要引用）
- `data-*` 属性
- 多余的 `<g>` 分组
- `style` 属性（改为直接属性）
- `width` 和 `height`（使用 `className` 控制）

### 示例：真实项目中的 SVG Logo

#### GitHub Logo

```tsx
export function GitHubLogo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
```

#### Vercel Logo

```tsx
export function VercelLogo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 76 65" fill="currentColor">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}
```

### SVG vs 图片文件对比

| 特性 | SVG (代码) | PNG/WebP (图片) |
|------|-----------|----------------|
| **文件大小** | 1-5 KB | 10-50 KB |
| **缩放质量** | ✅ 完美 | ❌ 会模糊 |
| **颜色定制** | ✅ CSS 控制 | ❌ 需要多个文件 |
| **深色模式** | ✅ 自动适配 | ❌ 需要两个文件 |
| **动画效果** | ✅ 支持 | ❌ 需要 GIF |
| **SEO** | ✅ 可索引 | ❌ 不可索引 |
| **HTTP 请求** | ✅ 0 次（内联） | ❌ 1 次 |
| **缓存** | ✅ JS Bundle | ⚠️ 浏览器缓存 |

### 何时使用图片而非 SVG？

只有以下情况才推荐使用图片：

- ❌ Logo 包含复杂的渐变、阴影、照片元素
- ❌ 从第三方获取，无法获得 SVG 源文件
- ❌ Logo 设计非常复杂，SVG 代码过大（>50KB）

对于大多数 Logo，SVG 都是更好的选择！

---

## 🎯 最佳实践：混合使用

### 推荐方案

```typescript
// app/src/client/components/Logo.tsx
import { Logo as SvgLogo } from "./Logo";  // SVG 组件
import { BrandAssets } from "@src/shared/assets";  // 图片路径

export function Logo({ variant = "svg" }) {
  // 优先使用 SVG
  if (variant === "svg") {
    return <SvgLogo className="h-8 w-auto" />;
  }

  // 降级方案：使用图片
  return (
    <img
      src={BrandAssets.logo}
      alt={BrandAssets.logoAlt}
      className="h-8 w-auto"
    />
  );
}
```

### 实际应用场景

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 导航栏 Logo | SVG 组件 | 需要响应式、深色模式 |
| 页脚 Logo | SVG 组件 | 颜色需要适配主题 |
| Favicon | PNG 多尺寸 | 浏览器兼容性 |
| Open Graph | PNG/WebP | 社交平台要求 |
| 邮件中的 Logo | PNG | 邮件客户端兼容性 |
| 加载动画 | SVG 组件 | 需要动画效果 |

---

## 🎯 最佳实践

### 1. 文件命名规范

```
✅ 推荐:
logo.webp
logo-dark.webp
banner-og.webp          (Open Graph 专用)
icon-16.png, icon-32.png
feature-ai.webp
example-dashboard.webp

❌ 避免:
图片1.webp
new logo final v2.webp
截图20231201.png
```

### 2. 图片优化

- **压缩**: 使用 Squoosh 压缩到 80-90% 质量
- **格式**: 优先使用 WebP > PNG > JPG
- **尺寸**: 不要上传原始大图，调整到实际使用尺寸
- **懒加载**: 大图使用 `loading="lazy"`

### 3. 版本管理

```
// 当品牌升级时，可以保留旧版本
logo-v1.webp
logo-v2.webp
logo.webp  → 指向最新版本
```

### 4. 备份

- 将原始高清素材保存在项目外的设计文件夹
- Git 中只保留优化后的 Web 版本
- 大文件使用 Git LFS

---

## 🐛 常见问题

### Q1: 图片路径正确但显示不出来？

**可能原因**:
1. 文件实际不存在 - 检查文件名大小写
2. 路径错误 - 确认是否以 `/` 开头
3. 开发服务器缓存 - 重启 `wasp start`

**解决方法**:
```bash
# 检查文件是否存在
ls -la app/src/client/static/logo.webp

# 清除缓存重新启动
wasp clean
wasp start
```

### Q2: 如何支持深色模式的不同 Logo？

```tsx
import { BrandAssets } from "@src/shared/assets";
import { useTheme } from "./theme-provider";

export function Logo() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark"
    ? BrandAssets.logoDark
    : BrandAssets.logo;

  return <img src={logoSrc} alt={BrandAssets.logoAlt} />;
}
```

### Q3: Open Graph 图片不更新？

社交媒体平台会缓存 OG 图片，需要清除缓存：

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

---

## 📚 相关文档

- [PROJECT_STRUCTURE_AND_STRATEGY.md](./PROJECT_STRUCTURE_AND_STRATEGY.md) - 项目结构
- [SEO_GUIDE.md](./SEO_GUIDE.md) - SEO 优化（包含 OG 图片配置）
- [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) - 配置系统

---

## 🎉 总结

通过集中管理资源配置，你可以：

1. ✅ **快速替换** - 只需修改一个文件
2. ✅ **避免遗漏** - 所有引用自动更新
3. ✅ **类型安全** - TypeScript 检查路径拼写
4. ✅ **易于维护** - 清晰的文件组织

**记住**: 修改品牌图片只需三步
1. 放置新图片到 `static/` 目录
2. 更新 `assets.ts` 路径
3. 验证各个页面显示正常

祝你打造出独特的品牌形象！ 🚀
