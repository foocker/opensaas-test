# 动画设计指南

本文档介绍如何在 OpenSaaS 项目中设计和实现原子动画效果。

---

## 🎬 技术栈

本项目使用 **Framer Motion** 作为动画库：

```bash
# 已安装
"framer-motion": "^11.15.0"
```

**为什么选择 Framer Motion？**
- ✅ 声明式 API，简单易用
- ✅ 强大的物理动画引擎
- ✅ 优秀的性能（GPU 加速）
- ✅ TypeScript 支持完善
- ✅ React 生态首选

---

## 🎨 已实现的动画组件

### 1. AnimatedText - 文字动画组件 ⭐ 推荐

**文件位置**：[app/src/landing-page/components/AnimatedText.tsx](../app/src/landing-page/components/AnimatedText.tsx)

**功能特点**：
- 🎬 **9种动画效果**：淡入上升、淡入下降、左右滑入、缩放、模糊、字符逐个显示、渐变色移动、打字机效果
- 🎯 **易于使用**：声明式 API，一个组件搞定所有文字动画
- ⚡ **高性能**：使用 `whileInView` 实现滚动触发，自动优化性能
- 🎨 **高度可定制**：支持自定义延迟、持续时间、HTML 标签等
- 📱 **响应式**：自适应不同设备和屏幕尺寸

**9种动画效果展示**：

1. **fade-up** (淡入上升) - 默认，适合标题和段落
2. **fade-down** (淡入下降) - 适合从顶部进入的元素
3. **slide-left** (从右滑入) - 适合横向布局
4. **slide-right** (从左滑入) - 适合横向布局
5. **scale** (缩放淡入) - 适合强调重点内容
6. **blur** (模糊淡入) - 适合创造柔和效果
7. **char-reveal** (字符逐个显示) - 适合短标题，炫酷效果
8. **gradient-shift** (渐变色移动) - 适合主标题，吸引眼球
9. **typing** (打字机效果) - 适合代码、命令行风格

**使用方法**：

```tsx
import AnimatedText from "./components/AnimatedText";

// 1. 基础淡入上升（最常用）
<AnimatedText as="h1" animation="fade-up" className="text-4xl font-bold">
  欢迎来到 OpenSaaS
</AnimatedText>

// 2. 字符逐个显示（炫酷效果）
<AnimatedText animation="char-reveal" className="text-3xl">
  Hello World!
</AnimatedText>

// 3. 渐变色移动（主标题推荐）
<AnimatedText animation="gradient-shift" as="h1" className="text-6xl font-bold">
  AI-Powered Platform
</AnimatedText>

// 4. 打字机效果
<AnimatedText animation="typing" duration={2}>
  npm install opensaas
</AnimatedText>

// 5. 连续动画（使用递增延迟）
<>
  <AnimatedText animation="fade-up" delay={0}>
    <h1>第一行</h1>
  </AnimatedText>
  <AnimatedText animation="fade-up" delay={0.2}>
    <p>第二行（延迟 0.2s）</p>
  </AnimatedText>
  <AnimatedText animation="fade-up" delay={0.4}>
    <p>第三行（延迟 0.4s）</p>
  </AnimatedText>
</>

// 6. 从右滑入
<AnimatedText animation="slide-left" className="text-xl">
  从右边飞进来
</AnimatedText>

// 7. 缩放淡入（强调重点）
<AnimatedText animation="scale" className="text-5xl font-bold text-primary">
  70% OFF
</AnimatedText>

// 8. 模糊淡入（柔和效果）
<AnimatedText animation="blur" className="text-lg text-muted-foreground">
  柔和的副标题
</AnimatedText>
```

**在 Hero 组件中的实际应用**：

```tsx
// app/src/landing-page/components/Hero.tsx
import AnimatedText from "./AnimatedText";
import { FeatureFlags } from "../../shared/config";

export default function Hero() {
  // 通过配置控制是否启用文字动画
  const showAnimations = FeatureFlags.landingPage.showTextAnimations;

  return (
    <div>
      {/* 主标题 - 根据配置决定是否使用动画 */}
      {showAnimations ? (
        <AnimatedText
          as="h1"
          animation="fade-up"
          className="text-5xl font-bold"
        >
          比 Google AI 便宜 70% 的 AI 服务平台
        </AnimatedText>
      ) : (
        <h1 className="text-5xl font-bold">
          比 Google AI 便宜 70% 的 AI 服务平台
        </h1>
      )}

      {/* 副标题 - 延迟 0.2s 淡入上升 */}
      {showAnimations ? (
        <AnimatedText
          as="p"
          animation="fade-up"
          delay={0.2}
          className="mt-6 text-lg text-muted-foreground"
        >
          按需付费，Token 3折扣费
        </AnimatedText>
      ) : (
        <p className="mt-6 text-lg text-muted-foreground">
          按需付费，Token 3折扣费
        </p>
      )}

      {/* 按钮组 - 延迟 0.4s 淡入上升 */}
      {showAnimations ? (
        <AnimatedText animation="fade-up" delay={0.4} className="mt-10 flex gap-x-6">
          <Button>立即开始</Button>
          <Button variant="outline">查看定价</Button>
        </AnimatedText>
      ) : (
        <div className="mt-10 flex gap-x-6">
          <Button>立即开始</Button>
          <Button variant="outline">查看定价</Button>
        </div>
      )}
    </div>
  );
}
```

**配置控制**：

在 [app/src/shared/config.ts](../app/src/shared/config.ts) 中：

```typescript
export const FeatureFlags = {
  landingPage: {
    // ...
    showTextAnimations: true,  // 开启文字动画
    // showTextAnimations: false,  // 关闭文字动画（静态显示）
  }
}
```

- ✅ `true` - 启用动画效果（淡入、延迟等）
- ✅ `false` - 静态显示，无动画（更快加载，适合性能敏感场景）

**Framer Motion 核心代码**：

```tsx
// 通用动画变体
const animations = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "char-reveal": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  // ... 更多变体
};

// 滚动触发 + 只播放一次
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={animations[animation]}
  transition={{ duration, delay }}
>
  {children}
</motion.div>
```

**性能优化**：
- ✅ 使用 `whileInView` 只在元素进入视口时触发动画
- ✅ `viewport={{ once: true }}` 避免重复播放
- ✅ `margin: "-100px"` 提前触发动画，更自然
- ✅ Framer Motion 自动 GPU 加速

**最佳实践**：
- 💡 主标题使用 `fade-up` 或 `gradient-shift`
- 💡 副标题使用 `fade-up` + 延迟 0.2s
- 💡 按钮组使用 `fade-up` + 延迟 0.4s
- 💡 短标题可以尝试 `char-reveal`（炫酷但不要过度使用）
- 💡 代码或命令行使用 `typing` 效果

---

### 2. FloatingParticles / GradientOrbs（已移除）

这两个背景动画组件已经被移除，因为：
- ❌ 视觉效果不够明显
- ❌ 对实际内容的提升有限
- ❌ 增加了不必要的页面复杂度

**推荐替代方案**：
- ✅ 使用 **AnimatedText** 为文字内容添加动画
- ✅ 使用 CSS 渐变背景（已在 Hero 组件中实现）
- ✅ 聚焦于内容本身，而非装饰性动画

---

### 3. 其他推荐的动画效果

如果你需要其他动画效果，可以参考以下方案：

**卡片悬停动画**：
```tsx
<motion.div
  whileHover={{ scale: 1.05, rotateY: 5 }}
  transition={{ duration: 0.3 }}
>
  <Card>...</Card>
</motion.div>
```

**按钮点击动画**：
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
>
  点击我
</motion.button>
```

**进度条动画**：
```tsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5 }}
  className="h-2 bg-primary"
/>
```

---

## 🎯 原子动画设计原则

### 什么是"原子动画"？

原子动画是**最小的、可复用的动画单元**，具有以下特点：

1. **单一职责**：每个组件只做一件事
2. **可组合**：多个原子动画可以组合成复杂效果
3. **可配置**：提供 props 控制行为
4. **性能优化**：使用 Framer Motion + GPU 加速
5. **声明式**：使用 Framer Motion 的声明式 API

### 设计清单

创建新的原子动画时，确保满足以下条件：

- [ ] 使用 Framer Motion 的 `motion` 组件
- [ ] 使用 `transform` 和 `opacity`（GPU 加速）
- [ ] 避免使用 `width`、`height`、`top`、`left`（触发重排）
- [ ] 添加 `pointer-events: none`（不阻挡交互）
- [ ] 支持深色/浅色模式
- [ ] 提供 `enabled` prop 控制显示
- [ ] 添加 `aria-hidden="true"`（屏幕阅读器忽略）
- [ ] 性能测试：确保 60fps 流畅运行
- [ ] 移动端测试：在移动设备上验证效果

---

## 📚 经典动画效果库

### 1. 微交互动画

**适用场景**：按钮、卡片、图标等小元素

**经典效果**：
- **Hover 放大**：`transform: scale(1.05)`
- **弹跳效果**：使用 `cubic-bezier` 缓动函数
- **涟漪效果**：点击产生扩散的圆圈
- **磁吸效果**：鼠标靠近时元素跟随

**参考资源**：
- [Microinteractions - UI Movement](https://uimovement.com)
- [Button Hover Effects - CodePen](https://codepen.io/search/pens?q=button+hover)

---

### 2. 背景动画

**适用场景**：页面背景、Hero 区域

**经典效果**：
- **渐变流动**：`background-position` 动画
- **网格动画**：SVG 线条动画
- **波浪效果**：正弦曲线动画
- **星空效果**：随机闪烁的点

**参考资源**：
- [CSS Background Patterns](https://www.magicpattern.design/tools/css-backgrounds)
- [Animated Gradient Background](https://www.gradient-animator.com/)

---

### 3. 进入动画

**适用场景**：页面加载、内容出现

**经典效果**：
- **淡入上升**：`opacity: 0 → 1` + `translateY(20px → 0)`
- **放大淡入**：`opacity: 0 → 1` + `scale(0.9 → 1)`
- **滑入**：`translateX(-100% → 0)`
- **交错动画**：子元素依次出现（stagger）

**实现方式**：
- 纯 CSS：使用 `@keyframes` + `animation-delay`
- Intersection Observer：滚动到可见区域时触发
- Framer Motion：React 动画库（需要安装）

---

### 4. 滚动动画

**适用场景**：长页面、产品展示

**经典效果**：
- **视差滚动**：背景和前景不同速度滚动
- **进度条**：滚动进度指示器
- **吸顶效果**：导航栏固定在顶部
- **滚动触发动画**：元素进入视口时动画

**技术方案**：
- CSS：`position: sticky`、`scroll-snap`
- JavaScript：Intersection Observer API
- 库：GSAP ScrollTrigger、AOS（Animate On Scroll）

---

### 5. 加载动画

**适用场景**：数据加载、图片加载

**经典效果**：
- **旋转圆圈**：`transform: rotate(360deg)`
- **脉冲**：`opacity` 和 `scale` 循环
- **骨架屏**：灰色占位符 + 扫光动画
- **进度条**：`width: 0% → 100%`

**参考资源**：
- [SpinKit - Loading Spinners](https://tobiasahlin.com/spinkit/)
- [CSS Loaders](https://cssloaders.github.io/)

---

### 6. AI/数据可视化动画

**适用场景**：AI 产品、数据分析平台

**经典效果**：
- **打字机效果**：文字逐字出现
- **粒子连线**：粒子之间连线动画
- **数据流动**：线条沿路径移动
- **脉冲扩散**：从中心向外扩散的波纹

**技术方案**：
- Canvas：适合大量粒子
- SVG：适合路径动画
- WebGL/Three.js：3D 效果

**参考资源**：
- [Particles.js](https://particles.js.org/)
- [Three.js Examples](https://threejs.org/examples/)

---

### 7. 图像/视频动画

**适用场景**：产品展示、案例介绍

**经典效果**：
- **图片悬停缩放**：`transform: scale(1.1)` + `overflow: hidden`
- **遮罩动画**：遮罩层滑动显示图片
- **视频背景**：全屏视频 + 半透明遮罩
- **轮播动画**：图片平滑切换

**实现技巧**：
- 图片懒加载：Intersection Observer
- 响应式图片：`<picture>` + `srcset`
- 视频优化：WebM/MP4 格式、自动播放静音

---

## 🛠️ 如何添加新的原子动画

### Step 1: 创建组件文件

```tsx
// app/src/landing-page/components/MyAnimation.tsx

interface MyAnimationProps {
  enabled?: boolean;
  className?: string;
  // 其他配置 props
}

export default function MyAnimation({
  enabled = true,
  className = "",
}: MyAnimationProps) {
  if (!enabled) return null;

  return (
    <div
      className={`pointer-events-none ... ${className}`}
      aria-hidden="true"
    >
      {/* 动画内容 */}

      {/* 内联 CSS 动画 */}
      <style>{`
        @keyframes myAnimation {
          /* 关键帧 */
        }
      `}</style>
    </div>
  );
}
```

### Step 2: 添加配置开关

在 [app/src/shared/config.ts](../app/src/shared/config.ts) 中：

```typescript
export const FeatureFlags = {
  landingPage: {
    // ... 其他配置

    // 动画效果配置
    showMyAnimation: true,  // 新增
  },
}
```

### Step 3: 在页面中使用

在 [app/src/landing-page/LandingPage.tsx](../app/src/landing-page/LandingPage.tsx) 中：

```tsx
import MyAnimation from "./components/MyAnimation";

export default function LandingPage() {
  const landingPageConfig = FeatureFlags.landingPage;

  return (
    <div className="relative">
      {/* 背景动画 */}
      {landingPageConfig.showMyAnimation && <MyAnimation />}

      {/* 其他内容 */}
    </div>
  );
}
```

### Step 4: 测试和优化

```bash
# 启动开发服务器
cd app && wasp start

# 访问 http://localhost:3000
# 打开浏览器开发者工具 → Performance 面板
# 录制性能，检查帧率是否稳定在 60fps
```

**性能优化检查**：
1. Chrome DevTools → Performance → 录制 5 秒
2. 查看 FPS 图表，绿线应在 60fps
3. 查看 Main Thread，避免长任务（黄色/红色块）
4. 查看 Compositor，确保使用 GPU 合成

---

## 🎬 推荐资源

### 动画库（可选）

**轻量级库（推荐）**：
- [Auto Animate](https://auto-animate.formkit.com/) - 零配置的自动动画
- [Motion One](https://motion.dev/) - 轻量级动画库（~5KB）

**功能全面的库**：
- [Framer Motion](https://www.framer.com/motion/) - React 动画库（~30KB）
- [GSAP](https://greensock.com/gsap/) - 专业级动画库

**特效库**：
- [Particles.js](https://particles.js.org/) - 粒子效果
- [Three.js](https://threejs.org/) - 3D 图形库
- [Lottie](https://airbnb.io/lottie/) - After Effects 动画播放器

### 学习资源

**教程**：
- [CSS Animations - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Animation Performance - web.dev](https://web.dev/animations/)
- [The Ultimate Guide to Animations in React - LogRocket](https://blog.logrocket.com/guide-to-animations-in-react/)

**灵感网站**：
- [Awwwards](https://www.awwwards.com/) - 获奖网站设计
- [Dribbble](https://dribbble.com/) - 设计灵感
- [CodePen](https://codepen.io/search/pens?q=animation) - 代码示例

**性能优化**：
- [Web Performance - web.dev](https://web.dev/learn/performance/)
- [CSS Triggers](https://csstriggers.com/) - 查询 CSS 属性性能影响

---

## 🚀 最佳实践

### 1. 性能优先

```css
/* ✅ 好 - 使用 GPU 加速的属性 */
transform: translate3d(0, 0, 0);
opacity: 0.5;
filter: blur(10px);

/* ❌ 差 - 触发重排/重绘 */
top: 10px;
left: 20px;
width: 100px;
height: 100px;
```

### 2. 渐进增强

```tsx
// 检测用户偏好设置
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// 尊重用户选择
<FloatingParticles enabled={!prefersReducedMotion} />
```

### 3. 移动端优化

```tsx
// 在移动设备上减少粒子数量
const isMobile = window.innerWidth < 768;
<FloatingParticles count={isMobile ? 10 : 20} />
```

### 4. 延迟加载

```tsx
// 只在首屏加载动画
import { lazy, Suspense } from 'react';

const FloatingParticles = lazy(() =>
  import('./components/FloatingParticles')
);

// 使用
<Suspense fallback={null}>
  <FloatingParticles />
</Suspense>
```

---

## 📝 总结

本项目已实现 **AnimatedText** 文字动画组件：

### ✨ 核心优势

1. **AnimatedText** - 功能强大的文字动画组件
   - 9种动画效果（淡入、滑入、缩放、模糊、字符显示、渐变、打字机等）
   - 声明式 API，易于使用
   - 滚动触发，性能优化
   - 适用于标题、副标题、按钮等所有文字元素

### 🎯 使用建议

**推荐的动画组合（按优先级）**：
1. ⭐ **文字动画（AnimatedText）** - 适用于所有文字内容
2. 💡 **微交互动画** - 按钮、卡片悬停效果（`whileHover`、`whileTap`）
3. 🎨 **CSS 渐变背景** - 简单有效的视觉增强（已在 Hero 中实现）

**不推荐**：
- ❌ 装饰性背景动画（如粒子、光球）- 性能消耗大，效果不明显
- ❌ 过度使用动画 - 影响用户体验和页面性能

### 📂 后续扩展方向

如需添加更多动画效果，可以考虑：
- **微交互动画** - 按钮、卡片 hover/tap 效果
- **滚动进度条** - 显示页面滚动进度
- **加载动画** - 骨架屏、进度条、加载指示器
- **表单动画** - 输入框聚焦、验证反馈动画

### 🔑 关键原则

- ✅ **性能优先**（60fps）- 使用 GPU 加速属性（transform、opacity）
- ✅ **内容为王** - 动画服务于内容，而非干扰内容
- ✅ **可配置化** - 通过 config.ts 控制开关
- ✅ **响应式设计** - 移动端友好
- ✅ **尊重用户偏好** - 检测 `prefers-reduced-motion`

