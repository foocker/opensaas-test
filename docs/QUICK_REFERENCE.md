# 快速参考 - 配置项对应文件

## 一张表看清所有配置项对应的文件

| 配置项 | 组件文件 | 数据文件 | 修改内容 | 修改样式 |
|--------|---------|---------|---------|---------|
| `showHero` | `components/Hero.tsx` | 组件内 | 编辑 `Hero.tsx` | 编辑 `Hero.tsx` |
| `showExamples` | `components/ExamplesCarousel.tsx` | `contentSections.tsx` → `examples` | 编辑 `contentSections.tsx` | 编辑 `ExamplesCarousel.tsx` |
| `showClients` | `components/Clients.tsx` | 组件内 + `logos/` 文件夹 | 编辑 `Clients.tsx` | 编辑 `Clients.tsx` |
| `showHighlightedFeature` | `ExampleHighlightedFeature.tsx` | 组件内 | 编辑 `ExampleHighlightedFeature.tsx` | 编辑 `ExampleHighlightedFeature.tsx` |
| `showFeatures` | `components/Features.tsx` | 需要自己创建 | 创建数据 | 编辑 `Features.tsx` |
| `showFeaturesGrid` | `components/FeaturesGrid.tsx` | `contentSections.tsx` → `features` | 编辑 `contentSections.tsx` | 编辑 `FeaturesGrid.tsx` |
| `showTestimonials` | `components/Testimonials.tsx` | `contentSections.tsx` → `testimonials` | 编辑 `contentSections.tsx` | 编辑 `Testimonials.tsx` |
| `showFAQ` | `components/FAQ.tsx` | `contentSections.tsx` → `faqs` | 编辑 `contentSections.tsx` | 编辑 `FAQ.tsx` |
| `showFooter` | `components/Footer.tsx` | `contentSections.tsx` → `footerNavigation` | 编辑 `contentSections.tsx` | 编辑 `Footer.tsx` |

> 所有组件文件在: `app/src/landing-page/`
>
> 数据文件: `app/src/landing-page/contentSections.tsx`
>
> 配置文件: `app/src/shared/config.ts`

---

## 三步快速修改区块

### 1️⃣ 修改内容（文字、图片、数据）

```typescript
// 编辑: app/src/landing-page/contentSections.tsx

// 示例：修改功能网格
export const features: GridFeature[] = [
  {
    name: "你的功能名称",      // ← 改这里
    description: "功能描述",   // ← 改这里
    emoji: "💰",              // ← 改这里
    size: "small",
  },
  // 添加更多...
];
```

### 2️⃣ 修改样式（布局、颜色、动画）

```typescript
// 直接编辑对应的组件文件
// 例如: app/src/landing-page/components/FeaturesGrid.tsx

<div className="你的自定义 CSS 类">
  {/* 修改布局、样式 */}
</div>
```

### 3️⃣ 控制显示/隐藏

```typescript
// 编辑: app/src/shared/config.ts

export const FeatureFlags = {
  landingPage: {
    showFeaturesGrid: true,  // ← true 显示，false 隐藏
  },
}
```

---

## 常用文件路径速查

| 文件用途 | 完整路径 |
|---------|---------|
| **总配置** | `app/src/shared/config.ts` |
| **首页主文件** | `app/src/landing-page/LandingPage.tsx` |
| **所有数据** | `app/src/landing-page/contentSections.tsx` |
| **Hero** | `app/src/landing-page/components/Hero.tsx` |
| **轮播** | `app/src/landing-page/components/ExamplesCarousel.tsx` |
| **Logo** | `app/src/landing-page/components/Clients.tsx` |
| **突出展示** | `app/src/landing-page/ExampleHighlightedFeature.tsx` |
| **功能网格** | `app/src/landing-page/components/FeaturesGrid.tsx` |
| **用户评价** | `app/src/landing-page/components/Testimonials.tsx` |
| **FAQ** | `app/src/landing-page/components/FAQ.tsx` |
| **页脚** | `app/src/landing-page/components/Footer.tsx` |

---

## 添加新区块的模板

```typescript
// 1. 创建组件: app/src/landing-page/components/MySection.tsx
export default function MySection() {
  return <div>我的新区块</div>;
}

// 2. 添加配置: app/src/shared/config.ts
export const FeatureFlags = {
  landingPage: {
    showMySection: true,  // ← 新增
  },
}

// 3. 使用组件: app/src/landing-page/LandingPage.tsx
import MySection from "./components/MySection";

{landingPageConfig.showMySection && <MySection />}

// 4. (可选) 添加数据: app/src/landing-page/contentSections.tsx
export const mySectionData = [
  // 你的数据...
];
```

---

## 数据格式速查

### Features Grid
```typescript
{
  name: string,
  description: string,
  emoji: string,
  size: "small" | "medium" | "large"
}
```

### Testimonials
```typescript
{
  name: string,
  role: string,
  avatarSrc: string,
  socialUrl: string,
  quote: string
}
```

### FAQ
```typescript
{
  id: string,
  question: string,
  answer: string
}
```

### Examples
```typescript
{
  title: string,
  description: string,
  image: string,
  href: string
}
```

---

## 文件修改频率

| 文件 | 修改频率 | 用途 |
|------|---------|------|
| `config.ts` | 🔥 很高 | 开关功能 |
| `contentSections.tsx` | 🔥 很高 | 修改内容 |
| `LandingPage.tsx` | 🔶 中等 | 添加新区块 |
| 各组件 `.tsx` | 🔵 较低 | 自定义样式 |
