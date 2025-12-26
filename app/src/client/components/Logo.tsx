/**
 * Logo 组件 - SVG 版本
 *
 * 🎯 为什么使用 SVG？
 * 1. ✅ 无需图片文件 - 直接用代码生成
 * 2. ✅ 任意缩放 - 矢量图形，永远清晰
 * 3. ✅ 可定制颜色 - CSS 控制，支持深色模式
 * 4. ✅ 体积小 - 比 PNG/WebP 小很多
 * 5. ✅ 可添加动画 - CSS/JS 动画效果
 *
 * 📝 使用方法：
 * import { Logo } from "@src/client/components/Logo";
 * <Logo className="h-8" />
 */

import React from "react";

interface LogoProps {
  className?: string;
  variant?: "default" | "icon-only";
}

/**
 * 主 Logo 组件
 *
 * 使用说明：
 * 1. 将你的 Logo SVG 代码替换到下面的 <svg> 标签中
 * 2. 如果你的 Logo 有多个颜色，可以使用 CSS 变量或 currentColor
 * 3. viewBox 需要根据你的 Logo 实际尺寸调整
 */
export function Logo({ className = "", variant = "default" }: LogoProps) {
  // 示例 Logo - 简单的圆形 + 文字
  // 请替换为你自己的 Logo SVG 代码
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 图标部分 - 圆形 + 首字母 */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="currentColor"
        className="text-primary"
      />
      <text
        x="20"
        y="28"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        N
      </text>

      {/* 文字部分 - 仅在 default 模式显示 */}
      {variant === "default" && (
        <g>
          <text
            x="45"
            y="28"
            fontSize="18"
            fontWeight="600"
            fill="currentColor"
            className="text-foreground"
          >
            Nano Banana Magic
          </text>
        </g>
      )}
    </svg>
  );
}

/**
 * Logo 图标版本 - 只显示图标，不显示文字
 * 用于小空间，如移动端导航、Favicon 等
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return <Logo className={className} variant="icon-only" />;
}

/**
 * 如何获取你自己的 Logo SVG 代码？
 *
 * 方法 1: 从设计软件导出
 * - Figma: 选中 Logo → 右键 → Copy as SVG
 * - Illustrator: File → Export → SVG
 * - Sketch: 选中 → Export → SVG
 *
 * 方法 2: 使用在线工具转换
 * - https://convertio.co/png-svg/ (PNG 转 SVG)
 * - https://www.adobe.com/express/feature/image/convert/svg (Adobe)
 * - https://www.aconvert.com/image/png-to-svg/ (免费)
 *
 * 方法 3: 手写 SVG（简单 Logo）
 * - 圆形: <circle cx="20" cy="20" r="18" />
 * - 矩形: <rect x="10" y="10" width="30" height="30" />
 * - 路径: <path d="M10 10 L30 30" />
 * - 文字: <text x="10" y="20">Text</text>
 *
 * 方法 4: AI 生成
 * - v0.dev: "Create an SVG logo for..."
 * - ChatGPT: "Generate SVG code for a logo..."
 */

/**
 * SVG Logo 优化技巧
 *
 * 1. 移除不必要的属性
 *    删除设计软件导出的冗余属性（id, class 等）
 *
 * 2. 使用 currentColor
 *    fill="currentColor" 可以继承父元素的文字颜色
 *    这样可以通过 CSS 控制颜色
 *
 * 3. 支持深色模式
 *    <svg className="text-gray-900 dark:text-white">
 *
 * 4. 优化 viewBox
 *    viewBox="0 0 100 100" 定义 SVG 的坐标系统
 *    调整到最小尺寸以减小代码量
 *
 * 5. 使用 SVGO 压缩
 *    https://jakearchibald.github.io/svgomg/
 */

/**
 * 示例：不同风格的 Logo
 */

// 示例 1: 极简风格 - 字母组合
export function MinimalLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="8" fill="currentColor" />
      <text
        x="20"
        y="28"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        NB
      </text>
    </svg>
  );
}

// 示例 2: 渐变风格
export function GradientLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
      <text
        x="45"
        y="28"
        fontSize="18"
        fontWeight="600"
        fill="currentColor"
      >
        NB Magic
      </text>
    </svg>
  );
}

// 示例 3: 图形 + 文字
export function GraphicLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 香蕉图形示例 */}
      <path
        d="M25 10 Q30 5 35 10 Q40 15 35 25 Q30 35 20 30 Q15 25 20 15 Q22 10 25 10"
        fill="#FCD34D"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* 文字 */}
      <text
        x="50"
        y="28"
        fontSize="16"
        fontWeight="600"
        fill="currentColor"
      >
        Nano Banana
      </text>
    </svg>
  );
}

/**
 * 在导航栏中使用
 *
 * 示例：
 * import { Logo } from "@src/client/components/Logo";
 *
 * export function NavBar() {
 *   return (
 *     <nav>
 *       <Logo className="h-8 w-auto" />
 *     </nav>
 *   );
 * }
 */

/**
 * 响应式 Logo
 *
 * 桌面端显示完整 Logo，移动端只显示图标
 */
export function ResponsiveLogo() {
  return (
    <>
      {/* 移动端 - 只显示图标 */}
      <div className="sm:hidden">
        <LogoIcon className="h-8 w-8" />
      </div>

      {/* 桌面端 - 显示完整 Logo */}
      <div className="hidden sm:block">
        <Logo className="h-8 w-auto" />
      </div>
    </>
  );
}

/**
 * 深色模式适配
 *
 * 方法 1: 使用 Tailwind 的 dark: 前缀
 */
export function DarkModeLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-gray-900 dark:text-white`}
      viewBox="0 0 200 40"
      fill="none"
    >
      <circle cx="20" cy="20" r="18" fill="currentColor" />
      <text x="45" y="28" fontSize="18" fontWeight="600" fill="currentColor">
        Your Logo
      </text>
    </svg>
  );
}

/**
 * 方法 2: 使用不同的 SVG
 */
export function ThemedLogo({ className = "" }: { className?: string }) {
  return (
    <>
      {/* 浅色模式 */}
      <svg className={`${className} dark:hidden`} viewBox="0 0 200 40">
        {/* 浅色版本的 Logo */}
      </svg>

      {/* 深色模式 */}
      <svg className={`${className} hidden dark:block`} viewBox="0 0 200 40">
        {/* 深色版本的 Logo */}
      </svg>
    </>
  );
}
