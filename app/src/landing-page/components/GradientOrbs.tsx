/**
 * 渐变光球动画组件 - Framer Motion 版本
 *
 * 现代化的模糊渐变光球效果，常见于 Apple、Stripe 等网站
 * 使用 Framer Motion 实现流畅的动画效果
 *
 * 特点：
 * - 现代化视觉效果，提升页面品质感
 * - Framer Motion 物理动画，自然流畅
 * - 自适应深色/浅色模式
 * - 可配置位置、颜色、大小等
 */

import { motion } from "framer-motion";

interface GradientOrbsProps {
  /** 是否启用 (默认: true) */
  enabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 光球位置 (默认: 'top-right') */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export default function GradientOrbs({
  enabled = true,
  className = "",
  position = "top-right",
}: GradientOrbsProps) {
  if (!enabled) return null;

  // 根据位置确定样式
  const positionClasses = {
    "top-left": "-top-24 -left-24",
    "top-right": "-top-24 -right-24",
    "bottom-left": "-bottom-24 -left-24",
    "bottom-right": "-bottom-24 -right-24",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  // 漂浮动画配置
  const floatVariants = {
    animate: {
      x: [0, 10, -20, 20, 0],
      y: [0, -20, 10, -20, 0],
      scale: [1, 1.05, 0.95, 1.05, 1],
    },
  };

  // 脉冲动画配置
  const pulseVariants = {
    animate: {
      opacity: [1, 0.8, 1],
    },
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${className}`}
      aria-hidden="true"
    >
      {/* 第一个光球 - 紫色 */}
      <motion.div
        className="relative h-96 w-96"
        variants={floatVariants}
        animate="animate"
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-3xl dark:from-purple-600 dark:to-pink-600 dark:opacity-30"
          variants={pulseVariants}
          animate="animate"
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* 第二个光球 - 蓝色 */}
      <motion.div
        className="absolute left-20 top-20 h-80 w-80"
        variants={floatVariants}
        animate="animate"
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl dark:from-blue-600 dark:to-cyan-600 dark:opacity-30"
          variants={pulseVariants}
          animate="animate"
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>

      {/* 第三个光球 - 橙色 */}
      <motion.div
        className="absolute -left-10 top-40 h-72 w-72"
        variants={floatVariants}
        animate="animate"
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 opacity-15 blur-3xl dark:from-orange-600 dark:to-yellow-600 dark:opacity-25"
          variants={pulseVariants}
          animate="animate"
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2,
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * 使用示例：
 *
 * 1. 基础使用（右上角）：
 * <div className="relative">
 *   <GradientOrbs />
 *   <YourContent />
 * </div>
 *
 * 2. 指定位置：
 * <GradientOrbs position="bottom-left" />
 *
 * 3. 通过 config.ts 控制：
 * <GradientOrbs enabled={FeatureFlags.landingPage.showGradientOrbs} />
 *
 * 4. 多个位置组合：
 * <>
 *   <GradientOrbs position="top-right" />
 *   <GradientOrbs position="bottom-left" />
 * </>
 */
