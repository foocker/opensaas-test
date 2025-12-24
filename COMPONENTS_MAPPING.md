# 首页区块组件映射表

本文档清晰地列出每个配置项对应的组件文件，方便你独立实现和修改每个区块。

---

## 📋 配置项 → 组件文件映射

| 配置项 | 组件文件路径 | 数据源 | 说明 |
|--------|------------|--------|------|
| `showHero` | [`app/src/landing-page/components/Hero.tsx`](app/src/landing-page/components/Hero.tsx) | 组件内硬编码 | 首页顶部英雄区域 |
| `showExamples` | [`app/src/landing-page/components/ExamplesCarousel.tsx`](app/src/landing-page/components/ExamplesCarousel.tsx) | `contentSections.tsx` → `examples` | 自动轮播的使用案例 |
| `showClients` | [`app/src/landing-page/components/Clients.tsx`](app/src/landing-page/components/Clients.tsx) | 组件内硬编码 | 客户/技术栈 Logo 展示 |
| `showHighlightedFeature` | [`app/src/landing-page/ExampleHighlightedFeature.tsx`](app/src/landing-page/ExampleHighlightedFeature.tsx) | 组件内硬编码 | 突出展示某个核心功能 |
| `showFeatures` | [`app/src/landing-page/components/Features.tsx`](app/src/landing-page/components/Features.tsx) | `contentSections.tsx` → 需要单独数据 | 传统 2 列功能列表 |
| `showFeaturesGrid` | [`app/src/landing-page/components/FeaturesGrid.tsx`](app/src/landing-page/components/FeaturesGrid.tsx) | `contentSections.tsx` → `features` | Bento 风格功能网格 |
| `showTestimonials` | [`app/src/landing-page/components/Testimonials.tsx`](app/src/landing-page/components/Testimonials.tsx) | `contentSections.tsx` → `testimonials` | 用户评价区块 |
| `showFAQ` | [`app/src/landing-page/components/FAQ.tsx`](app/src/landing-page/components/FAQ.tsx) | `contentSections.tsx` → `faqs` | 常见问题手风琴 |
| `showFooter` | [`app/src/landing-page/components/Footer.tsx`](app/src/landing-page/components/Footer.tsx) | `contentSections.tsx` → `footerNavigation` | 页脚导航 |

---

## 🎨 每个区块的详细说明

### 1. Hero 区域 (`showHero`)

**组件文件**: `app/src/landing-page/components/Hero.tsx`

**功能**: 首页顶部的主要视觉区域
- 主标题和副标题
- CTA 按钮（"查看定价"、"立即开始"）
- 应用截图展示
- 渐变背景装饰

**如何修改**:
```typescript
// 直接编辑 Hero.tsx 文件
// 修改标题
<h1>你的新标题</h1>

// 修改 CTA 按钮
<Link to="/pricing">查看定价</Link>
```

**文件结构**:
```
app/src/landing-page/components/
├── Hero.tsx              # 主组件
├── TopGradient.tsx       # 顶部渐变背景
└── BottomGradient.tsx    # 底部渐变背景
```

---

### 2. 示例轮播 (`showExamples`)

**组件文件**: `app/src/landing-page/components/ExamplesCarousel.tsx`

**数据源**: `app/src/landing-page/contentSections.tsx` → `examples` 数组

**功能**: 自动轮播展示使用案例/项目示例

**如何修改内容**:
```typescript
// 编辑 contentSections.tsx
export const examples = [
  {
    title: "项目名称",
    description: "项目描述",
    image: 图片路径,
    href: "项目链接",
  },
  // 添加更多示例...
];
```

**如何修改样式/交互**:
- 直接编辑 `ExamplesCarousel.tsx`
- 修改轮播速度、动画效果等

---

### 3. 客户 Logo 展示 (`showClients`)

**组件文件**: `app/src/landing-page/components/Clients.tsx`

**功能**: 展示合作伙伴或使用的技术栈 Logo

**如何修改**:
```typescript
// 编辑 Clients.tsx
// 当前显示: Salesforce, Prisma, Astro, OpenAI

// 添加新 Logo:
// 1. 创建 Logo 组件（如 app/src/landing-page/logos/YourLogo.tsx）
// 2. 在 Clients.tsx 中导入并使用
```

**相关文件**:
```
app/src/landing-page/
├── components/Clients.tsx
└── logos/
    ├── SalesforceLogo.tsx
    ├── PrismaLogo.tsx
    ├── AstroLogo.tsx
    └── OpenAILogo.tsx
```

---

### 4. 突出功能展示 (`showHighlightedFeature`)

**组件文件**: `app/src/landing-page/ExampleHighlightedFeature.tsx`

**功能**: 大图 + 文字说明，突出展示某个核心功能

**如何修改**:
```typescript
// 编辑 ExampleHighlightedFeature.tsx
// 修改标题、描述文字
// 替换展示图片
// 调整布局方向（row / row-reverse）
```

**使用的通用组件**:
- `app/src/landing-page/components/HighlightedFeature.tsx` - 可复用的布局组件

---

### 5. 传统功能列表 (`showFeatures`)

**组件文件**: `app/src/landing-page/components/Features.tsx`

**数据源**: 需要单独创建数据（不同于 FeaturesGrid）

**功能**: 传统的 2 列功能列表（icon + 标题 + 描述）

**数据格式**:
```typescript
interface Feature {
  name: string;
  description: string;
  icon: string;      // emoji 字符串
  href: string;
}
```

**如何使用**:
```typescript
// 1. 在 contentSections.tsx 中创建数据
export const traditionalFeatures: Feature[] = [
  {
    name: "功能名称",
    description: "功能描述",
    icon: "🚀",
    href: "#",
  },
];

// 2. 在 LandingPage.tsx 中使用
{landingPageConfig.showFeatures && <Features features={traditionalFeatures} />}
```

---

### 6. Bento 风格功能网格 (`showFeaturesGrid`) ⭐ 推荐

**组件文件**: `app/src/landing-page/components/FeaturesGrid.tsx`

**数据源**: `app/src/landing-page/contentSections.tsx` → `features` 数组

**功能**: 现代化的 Bento 网格布局，支持不同大小的卡片

**数据格式**:
```typescript
interface GridFeature {
  name: string;
  description: string;
  emoji?: string;
  icon?: ReactNode;
  href: string;
  size: "small" | "medium" | "large";
}
```

**如何修改内容**:
```typescript
// 编辑 contentSections.tsx
export const features: GridFeature[] = [
  {
    name: "按需付费",
    description: "Token 按 3折 实时扣费",
    emoji: "💰",
    href: DocsUrl,
    size: "small",  // 控制卡片大小
  },
  // 添加更多功能...
];
```

**卡片大小说明**:
- `small`: 1列宽度
- `medium`: 2列宽度
- `large`: 3列宽度

---

### 7. 用户评价 (`showTestimonials`)

**组件文件**: `app/src/landing-page/components/Testimonials.tsx`

**数据源**: `app/src/landing-page/contentSections.tsx` → `testimonials` 数组

**功能**: 展示用户评价和推荐

**数据格式**:
```typescript
interface Testimonial {
  name: string;
  role: string;
  avatarSrc: string;
  socialUrl: string;
  quote: string;
}
```

**如何修改内容**:
```typescript
// 编辑 contentSections.tsx
export const testimonials = [
  {
    name: "用户名",
    role: "职位/身份",
    avatarSrc: 头像图片路径,
    socialUrl: "Twitter/社交链接",
    quote: "评价内容",
  },
  // 添加更多评价...
];
```

**注意**: 头像图片需要放在 `app/src/client/static/` 目录

---

### 8. 常见问题 (`showFAQ`)

**组件文件**: `app/src/landing-page/components/FAQ.tsx`

**数据源**: `app/src/landing-page/contentSections.tsx` → `faqs` 数组

**功能**: 手风琴式常见问题解答

**数据格式**:
```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string | ReactNode;  // 支持纯文本或 JSX
}
```

**如何修改内容**:
```typescript
// 编辑 contentSections.tsx
export const faqs = [
  {
    id: "1",
    question: "问题",
    answer: "答案（可以包含 HTML 标签）",
  },
  // 添加更多问题...
];
```

---

### 9. 页脚 (`showFooter`)

**组件文件**: `app/src/landing-page/components/Footer.tsx`

**数据源**: `app/src/landing-page/contentSections.tsx` → `footerNavigation` 对象

**功能**: 页脚导航和链接

**数据格式**:
```typescript
interface FooterNavigation {
  app: Array<{ name: string; href: string }>;
  company: Array<{ name: string; href: string }>;
}
```

**如何修改内容**:
```typescript
// 编辑 contentSections.tsx
export const footerNavigation = {
  app: [
    { name: "文档", href: DocsUrl },
    { name: "博客", href: BlogUrl },
  ],
  company: [
    { name: "关于我们", href: "#" },
    { name: "隐私政策", href: "#" },
  ],
};
```

---

## 🆕 如何添加新的区块

### 步骤 1: 创建组件文件

```typescript
// app/src/landing-page/components/MyNewSection.tsx
export default function MyNewSection() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-4xl font-bold">我的新区块</h2>
      <p>这是一个自定义的新区块</p>
    </div>
  );
}
```

### 步骤 2: 在配置中添加开关

```typescript
// app/src/shared/config.ts
export const FeatureFlags = {
  landingPage: {
    showHero: true,
    // ... 其他配置
    showMyNewSection: true,  // ✅ 新增配置
  },
}
```

### 步骤 3: 在首页中使用

```typescript
// app/src/landing-page/LandingPage.tsx
import MyNewSection from "./components/MyNewSection";

export default function LandingPage() {
  const landingPageConfig = FeatureFlags.landingPage;

  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        {landingPageConfig.showHero && <Hero />}
        {/* ... 其他区块 */}
        {landingPageConfig.showMyNewSection && <MyNewSection />}  {/* ✅ 新增 */}
      </main>
    </div>
  );
}
```

### 步骤 4: （可选）添加数据源

如果新区块需要外部数据：

```typescript
// app/src/landing-page/contentSections.tsx
export const myNewSectionData = [
  { title: "标题1", content: "内容1" },
  { title: "标题2", content: "内容2" },
];

// 在 LandingPage.tsx 中使用
import { myNewSectionData } from "./contentSections";
{landingPageConfig.showMyNewSection && <MyNewSection data={myNewSectionData} />}
```

---

## 📂 完整目录结构

```
app/src/landing-page/
├── LandingPage.tsx                      # 首页主文件（组装所有区块）
├── contentSections.tsx                  # 所有数据源（集中管理内容）
│
├── components/                          # 区块组件
│   ├── Hero.tsx                        # showHero
│   ├── ExamplesCarousel.tsx            # showExamples
│   ├── Clients.tsx                     # showClients
│   ├── Features.tsx                    # showFeatures（备选）
│   ├── FeaturesGrid.tsx                # showFeaturesGrid
│   ├── Testimonials.tsx                # showTestimonials
│   ├── FAQ.tsx                         # showFAQ
│   ├── Footer.tsx                      # showFooter
│   │
│   ├── SectionTitle.tsx                # 可复用的区块标题组件
│   ├── HighlightedFeature.tsx          # 可复用的功能突出展示组件
│   ├── TopGradient.tsx                 # Hero 渐变背景
│   └── BottomGradient.tsx              # Hero 渐变背景
│
├── ExampleHighlightedFeature.tsx       # showHighlightedFeature
│
└── logos/                              # Logo 组件
    ├── SalesforceLogo.tsx
    ├── PrismaLogo.tsx
    ├── AstroLogo.tsx
    └── OpenAILogo.tsx
```

---

## 🎯 配置 → 组件 → 数据流程图

```
config.ts (配置)
    ↓
LandingPage.tsx (主页面)
    ↓
根据配置条件渲染组件
    ↓
各个组件从 contentSections.tsx 获取数据
    ↓
渲染到页面
```

**示例流程**:
```
FeatureFlags.landingPage.showTestimonials = true
    ↓
LandingPage.tsx: {landingPageConfig.showTestimonials && <Testimonials />}
    ↓
Testimonials.tsx 接收 testimonials 数据
    ↓
从 contentSections.tsx 导入: import { testimonials } from "./contentSections"
    ↓
渲染用户评价卡片
```

---

## ✅ 快速检查清单

要修改/添加一个区块，你需要：

- [ ] **找到对应的组件文件**（参考上面的映射表）
- [ ] **了解数据来源**（组件内硬编码 or contentSections.tsx）
- [ ] **修改组件样式/逻辑**（编辑 `.tsx` 文件）
- [ ] **修改内容数据**（编辑 `contentSections.tsx`）
- [ ] **通过配置控制显示**（编辑 `config.ts` 中的开关）

---

## 💡 最佳实践

### 1. **内容与样式分离**
- 将内容数据放在 `contentSections.tsx`
- 将样式和交互逻辑放在组件文件

### 2. **可复用组件**
- 查看 `components/SectionTitle.tsx`、`components/HighlightedFeature.tsx`
- 新区块可以使用这些通用组件

### 3. **图片资源**
- 所有图片放在 `app/src/client/static/`
- 使用 `import` 导入图片
```typescript
import myImage from "../client/static/my-image.webp";
```

### 4. **命名规范**
- 配置项: `showXxx`（驼峰命名）
- 组件文件: `XxxSection.tsx`（大驼峰）
- 数据变量: `xxxData`（小驼峰）

---

## 🔧 常见修改场景

### 场景 1: 只改内容，不改样式
→ 只需编辑 `contentSections.tsx`

### 场景 2: 只改样式，不改内容
→ 只需编辑对应的组件 `.tsx` 文件

### 场景 3: 完全替换一个区块
→ 创建新组件文件，在 `LandingPage.tsx` 中替换

### 场景 4: 添加全新区块
→ 参考上面的"如何添加新的区块"流程

---

## 📞 需要帮助？

如果要修改某个区块但不确定从哪里开始：
1. 查看上面的映射表找到组件文件
2. 查看组件文件了解它使用什么数据
3. 根据需求修改组件或数据源
4. 通过 `config.ts` 控制显示/隐藏
