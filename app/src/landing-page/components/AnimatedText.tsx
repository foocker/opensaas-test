/**
 * 文字动画组件 - Framer Motion 版本
 *
 * 提供多种文字动画效果，适用于标题、副标题、描述文字等
 *
 * 特点：
 * - 多种动画模式：淡入、滑入、打字机、渐变色、字符逐个显示等
 * - 性能优化，使用 Framer Motion 的声明式 API
 * - 支持自定义延迟、速度、缓动函数
 * - 响应式设计，自适应深色/浅色模式
 */

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// 动画类型定义
export type AnimationType =
  | "fade-up"        // 淡入上升
  | "fade-down"      // 淡入下降
  | "slide-left"     // 从右滑入
  | "slide-right"    // 从左滑入
  | "scale"          // 缩放淡入
  | "blur"           // 模糊淡入
  | "char-reveal"    // 字符逐个显示
  | "gradient-shift" // 渐变色移动
  | "typing";        // 打字机效果

interface AnimatedTextProps {
  /** 显示的文本内容 */
  children: ReactNode;
  /** 动画类型 (默认: 'fade-up') */
  animation?: AnimationType;
  /** 动画延迟时间（秒）(默认: 0) */
  delay?: number;
  /** 动画持续时间（秒）(默认: 0.6) */
  duration?: number;
  /** 是否只播放一次 (默认: true) */
  once?: boolean;
  /** 自定义类名 */
  className?: string;
  /** HTML 标签类型 (默认: 'div') */
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "section" | "article";
}

// 预定义动画变体
const animations: Record<AnimationType, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  "char-reveal": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "gradient-shift": {
    hidden: { backgroundPosition: "0% 50%" },
    visible: { backgroundPosition: "100% 50%" },
  },
  typing: {
    hidden: { width: 0 },
    visible: { width: "100%" },
  },
};

export default function AnimatedText({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.6,
  once = true,
  className = "",
  as = "div",
}: AnimatedTextProps) {
  const MotionComponent = motion[as] as typeof motion.div;
  const variants = animations[animation];

  // 特殊处理：字符逐个显示
  if (animation === "char-reveal" && typeof children === "string") {
    const chars = children.split("");
    return (
      <MotionComponent
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        transition={{ staggerChildren: 0.03, delayChildren: delay }}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            variants={variants}
            transition={{ duration: 0.3 }}
            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char}
          </motion.span>
        ))}
      </MotionComponent>
    );
  }

  // 特殊处理：渐变色移动
  if (animation === "gradient-shift") {
    return (
      <MotionComponent
        className={`bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={variants}
        transition={{
          duration: 2,
          delay,
          ease: "linear",
          repeat: once ? 0 : Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </MotionComponent>
    );
  }

  // 特殊处理：打字机效果
  if (animation === "typing") {
    return (
      <MotionComponent
        className={`overflow-hidden whitespace-nowrap ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={variants}
        transition={{
          duration,
          delay,
          ease: "steps(20)",
        }}
      >
        {children}
      </MotionComponent>
    );
  }

  // 通用动画
  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1], // 自定义缓动曲线
      }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * 使用示例：
 *
 * 1. 基础淡入上升（默认）：
 * <AnimatedText>
 *   <h1>欢迎来到 OpenSaaS</h1>
 * </AnimatedText>
 *
 * 2. 从右滑入：
 * <AnimatedText animation="slide-left">
 *   <p>构建你的 SaaS 应用</p>
 * </AnimatedText>
 *
 * 3. 字符逐个显示：
 * <AnimatedText animation="char-reveal">
 *   Hello World!
 * </AnimatedText>
 *
 * 4. 渐变色移动效果：
 * <AnimatedText animation="gradient-shift" as="h1" className="text-6xl font-bold">
 *   AI-Powered Platform
 * </AnimatedText>
 *
 * 5. 打字机效果：
 * <AnimatedText animation="typing" duration={2}>
 *   <h2>正在加载中...</h2>
 * </AnimatedText>
 *
 * 6. 自定义延迟和持续时间：
 * <AnimatedText animation="scale" delay={0.3} duration={0.8}>
 *   <div>延迟 0.3 秒，持续 0.8 秒</div>
 * </AnimatedText>
 *
 * 7. 使用自定义 HTML 标签：
 * <AnimatedText as="h1" animation="fade-up" className="text-4xl font-bold">
 *   标题文字
 * </AnimatedText>
 *
 * 8. 连续动画（使用不同延迟）：
 * <>
 *   <AnimatedText animation="fade-up" delay={0}>
 *     <h1>第一行</h1>
 *   </AnimatedText>
 *   <AnimatedText animation="fade-up" delay={0.2}>
 *     <h2>第二行</h2>
 *   </AnimatedText>
 *   <AnimatedText animation="fade-up" delay={0.4}>
 *     <p>第三行</p>
 *   </AnimatedText>
 * </>
 */
