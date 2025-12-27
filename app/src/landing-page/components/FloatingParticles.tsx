/**
 * 浮动粒子动画组件 - Framer Motion 版本
 *
 * 使用 Framer Motion 实现流畅的粒子动画效果
 * 适用于背景装饰、视觉增强等场景
 *
 * 特点：
 * - Framer Motion 驱动，流畅的物理动画
 * - 性能优化，使用 transform 和 opacity
 * - 响应式设计，自适应深色/浅色模式
 * - 可配置粒子数量、颜色、速度等
 */

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingParticlesProps {
  /** 粒子数量 (默认: 20) */
  count?: number;
  /** 是否启用 (默认: true) */
  enabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

export default function FloatingParticles({
  count = 20,
  enabled = true,
  className = "",
}: FloatingParticlesProps) {
  if (!enabled) return null;

  // 生成粒子配置（使用 useMemo 避免重复计算）
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        // 随机位置 (0-100%)
        left: Math.random() * 100,
        // 随机动画延迟 (0-20s)
        delay: Math.random() * 20,
        // 随机动画持续时间 (15-30s)
        duration: 15 + Math.random() * 15,
        // 随机大小 (增大至 6-16px，更明显)
        size: 6 + Math.random() * 10,
        // 随机水平移动距离
        xOffset: (Math.random() - 0.5) * 60,
      })),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-purple-400/50 to-pink-400/50 blur-sm dark:from-purple-500/60 dark:to-pink-500/60"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{
            y: "100vh",
            x: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: [null, "-100vh"],
            x: [null, particle.xOffset],
            scale: [null, 1.5],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: particle.duration,
            },
          }}
        />
      ))}
    </div>
  );
}

/**
 * 使用示例：
 *
 * 1. 基础使用：
 * <FloatingParticles />
 *
 * 2. 自定义粒子数量：
 * <FloatingParticles count={30} />
 *
 * 3. 通过 config.ts 控制：
 * <FloatingParticles enabled={FeatureFlags.landingPage.showFloatingParticles} />
 *
 * 4. 添加自定义样式：
 * <FloatingParticles className="z-0" />
 */
